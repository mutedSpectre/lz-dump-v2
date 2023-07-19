// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/Options.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/PacketV1Codec.sol";

import "./interfaces/IMessageLibE1.sol";
import "./NonceContract.sol";

import "../libs/TreasuryOptions.sol";
import "../../interfaces/ILayerZeroExecutor.sol";
import "../../interfaces/ILayerZeroTreasury.sol";

abstract contract MessageLibBaseE1 is IMessageLibE1, Ownable {
    using PacketV1Codec for bytes;

    // Derived MessageLibs should never use this as config type
    uint32 private constant CONFIG_TYPE_MAX_MESSAGE_SIZE = 1;
    uint32 private constant CONFIG_TYPE_OUTBOUND_CONFIRMATIONS = 2;
    uint32 private constant CONFIG_TYPE_EXECUTOR = 3;

    address internal immutable endpoint;
    uint32 internal immutable localEid;
    uint8 internal immutable packetVersion;
    uint internal immutable treasuryGasCap;
    NonceContract internal immutable nonceContract;

    // config
    address internal layerZeroToken;
    address public treasury;
    mapping(uint32 dstEid => OutboundConfig) public defaultOutboundConfig;
    mapping(address oapp => mapping(uint32 => OutboundConfig)) public outboundConfig;
    mapping(uint32 dstEid => bytes option) public defaultOptions;
    mapping(uint32 dstEid => uint size) public addressSizes;

    // accumulated fees for workers and treasury
    mapping(address => uint) public fees;

    struct OutboundConfig {
        uint32 maxMessageSize;
        uint64 outboundConfirmations;
        address executor;
    }

    event PacketSent(bytes encodedPayload, bytes options, uint nativeFee, uint lzTokenFee);
    event ExecutorFee(address executor, uint fee);
    event WithdrawFee(address indexed user, address receiver, uint amount);

    // only the endpoint can call SEND() and setConfig()
    modifier onlyEndpoint() {
        require(endpoint == msg.sender, "LZ50000");
        _;
    }

    constructor(
        address _endpoint,
        uint8 _packetVersion,
        uint _treasuryGasCap,
        address _nonceContract,
        uint32 _localEid
    ) {
        require(_endpoint != address(0x0), "LZ10000");
        endpoint = _endpoint;
        localEid = _localEid;
        packetVersion = _packetVersion;
        treasuryGasCap = _treasuryGasCap;
        nonceContract = NonceContract(_nonceContract);
    }

    /// ---------------------- ONLY ENDPOINT ----------------------
    function send(
        address _sender,
        uint64, // _nonce
        uint16 _dstEid,
        bytes calldata _path, // remoteAddress + localAddress
        bytes calldata _message,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes memory _options
    ) external payable onlyEndpoint {
        address sender = _sender; // stack too deep
        (uint64 nonce, bytes32 receiver) = _incrementNonce(sender, _dstEid, _path);

        Packet memory packet;
        {
            bytes32 guid = keccak256(
                abi.encodePacked(nonce, localEid, bytes32(uint(uint160(sender))), uint32(_dstEid), receiver)
            );
            packet = Packet(nonce, localEid, sender, _dstEid, receiver, guid, _message);
        }

        Options.WorkerOptions[] memory workerOptions;
        uint32 dstEid = _dstEid; // stack too deep
        uint totalNativeFee = 0;
        {
            if (_options.length == 0) {
                _options = defaultOptions[dstEid];
            }

            bytes memory executorOptions;
            if (_options.length > 0) {
                workerOptions = Options.decodeOptions(_options);
                if (workerOptions[0].workerId == ExecutorOptions.WORKER_ID) {
                    executorOptions = workerOptions[0].options;
                }
            }
            // assert msg size
            OutboundConfig memory config = getOutboundConfig(sender, dstEid);
            uint msgSize = _message.length;
            _assertMessageSize(msgSize, config.maxMessageSize);

            totalNativeFee = ILayerZeroExecutor(config.executor).assignJob(dstEid, sender, msgSize, executorOptions);
            if (totalNativeFee > 0) {
                fees[config.executor] += totalNativeFee;
            }
            emit ExecutorFee(config.executor, totalNativeFee);
            totalNativeFee += _send(packet, workerOptions, config.outboundConfirmations);
        }

        bytes memory encodedPacket = PacketV1Codec.encode2(packetVersion, packet);

        // quote treasury fee
        address zroPaymentAddress = _zroPaymentAddress;
        bool payInNative = zroPaymentAddress == address(0x0) || address(layerZeroToken) == address(0x0);
        (uint treasuryNativeFee, uint lzTokenFee) = quoteTreasuryFee(sender, dstEid, totalNativeFee, !payInNative);
        if (treasuryNativeFee > 0) {
            fees[treasury] += treasuryNativeFee;
            totalNativeFee += treasuryNativeFee;
        }

        // pay native fee
        // assert the user has attached enough native token for this address
        address payable refundAddress = _refundAddress;
        require(totalNativeFee <= msg.value, "LZ10003");
        // refund if they send too much
        uint refundAmt = msg.value - totalNativeFee;
        if (refundAmt > 0) {
            (bool success, ) = refundAddress.call{value: refundAmt}("");
            require(success, "LZ30000");
        }

        // pay lz token fee if needed
        if (!payInNative && lzTokenFee > 0) {
            _payLzTokenFee(sender, zroPaymentAddress, lzTokenFee, workerOptions);
        }

        bytes memory options = _options;
        emit PacketSent(encodedPacket, options, totalNativeFee, lzTokenFee);
    }

    function setConfig(uint16 _eid, address _oapp, uint _configType, bytes calldata _config) external onlyEndpoint {
        if (_configType == CONFIG_TYPE_MAX_MESSAGE_SIZE) {
            uint32 maxMessageSize = abi.decode(_config, (uint32));
            OutboundConfig storage config = outboundConfig[_oapp][_eid];
            config.maxMessageSize = maxMessageSize;
        } else if (_configType == CONFIG_TYPE_OUTBOUND_CONFIRMATIONS) {
            uint64 outboundConfirmations = abi.decode(_config, (uint64));
            OutboundConfig storage config = outboundConfig[_oapp][_eid];
            config.outboundConfirmations = outboundConfirmations;
        } else if (_configType == CONFIG_TYPE_EXECUTOR) {
            address executor = abi.decode(_config, (address));
            OutboundConfig storage config = outboundConfig[_oapp][_eid];
            config.executor = executor;
        } else {
            _setConfig(_eid, _oapp, uint32(_configType), _config);
        }
    }

    /// ---------------------- ONLY OWNER ----------------------
    function setLayerZeroToken(address _layerZeroToken) external onlyOwner {
        require(_layerZeroToken != address(0x0), "LZ80000");
        layerZeroToken = _layerZeroToken;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(IERC165(_treasury).supportsInterface(type(ILayerZeroTreasury).interfaceId), "LZC0001");
        treasury = _treasury;
    }

    function setDefaultOutboundConfig(
        uint32 _eid,
        uint32 _maxMessageSize,
        uint64 _outboundConfirmations,
        address _executor
    ) public onlyOwner {
        require(_outboundConfirmations > 0 && _executor != address(0x0), "LZ10000");
        require(_maxMessageSize > 0, "LZ10009");

        OutboundConfig storage config = defaultOutboundConfig[_eid];
        config.executor = _executor;
        config.maxMessageSize = _maxMessageSize;
        config.outboundConfirmations = _outboundConfirmations;
    }

    function setDefaultOptions(uint32 _eid, bytes calldata _options) external onlyOwner {
        defaultOptions[_eid] = _options;
    }

    function setAddressSize(uint16 _eid, uint _size) external onlyOwner {
        require(_size <= 32, "LZ10009");
        require(addressSizes[_eid] == 0, "LZ80000");
        addressSizes[_eid] = _size;
    }

    /// ---------------------- PUBLIC FUNCTIONS ----------------------
    function withdrawFee(address _to, uint _amount) external {
        require(_to != address(0x0), "LZ10000");
        require(_amount <= fees[msg.sender], "LZ10003");

        fees[msg.sender] -= _amount;
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "LZ30000");
        emit WithdrawFee(msg.sender, _to, _amount);
    }

    /// ---------------------- VIEW FUNCTIONS ----------------------
    function estimateFees(
        uint16 _dstEid,
        address _sender,
        bytes calldata _message,
        bool _payInLzToken,
        bytes memory _options
    ) external view returns (uint nativeFee, uint zroFee) {
        address sender = _sender;
        OutboundConfig memory config = getOutboundConfig(sender, _dstEid);

        uint msgSize = _message.length;
        _assertMessageSize(msgSize, config.maxMessageSize);

        if (_options.length == 0) {
            _options = defaultOptions[_dstEid];
        }

        Options.WorkerOptions[] memory workerOptions;
        bytes memory executorOptions;
        if (_options.length > 0) {
            workerOptions = Options.decodeOptions(_options);
            if (workerOptions[0].workerId == ExecutorOptions.WORKER_ID) {
                executorOptions = workerOptions[0].options;
            }
        }

        uint32 dstEid = _dstEid;
        bool payInLzToken = _payInLzToken;

        uint totalNativeFee = ILayerZeroExecutor(config.executor).getFee(dstEid, sender, msgSize, executorOptions);
        totalNativeFee += _quoteWorkers(sender, dstEid, workerOptions, config.outboundConfirmations);

        (uint treasuryNativeFee, uint lzTokenFee) = quoteTreasuryFee(sender, dstEid, totalNativeFee, payInLzToken);
        if (treasuryNativeFee > 0) {
            totalNativeFee += treasuryNativeFee;
        }

        return (totalNativeFee, lzTokenFee);
    }

    function quoteTreasuryFee(
        address _sender,
        uint32 _eid,
        uint _totalFee,
        bool _payInLzToken
    ) public view returns (uint nativeFee, uint lzTokenFee) {
        if (treasury != address(0x0)) {
            try ILayerZeroTreasury(treasury).getFees(_sender, _eid, _totalFee, _payInLzToken) returns (
                uint treasuryFee
            ) {
                // success
                if (_payInLzToken) {
                    lzTokenFee = treasuryFee;
                } else {
                    // pay in native, make sure that the treasury fee is not higher than the cap
                    uint gasFeeEstimate = tx.gasprice * treasuryGasCap;
                    // cap is the max of total fee and gasFeeEstimate. this is to prevent apps from forcing the cap to 0.
                    uint nativeFeeCap = _totalFee > gasFeeEstimate ? _totalFee : gasFeeEstimate;
                    // to prevent the treasury from returning an overly high value to break the path
                    nativeFee = treasuryFee > nativeFeeCap ? nativeFeeCap : treasuryFee;
                }
            } catch {
                // failure, something wrong with treasury contract, charge nothing and continue
            }
        }
    }

    function getOutboundConfig(address _oapp, uint32 _eid) public view returns (OutboundConfig memory) {
        OutboundConfig memory config = outboundConfig[_oapp][_eid];
        OutboundConfig memory defaultConfig = defaultOutboundConfig[_eid];

        if (config.maxMessageSize == 0) {
            config.maxMessageSize = defaultConfig.maxMessageSize;
        }
        if (config.outboundConfirmations == 0) {
            config.outboundConfirmations = defaultConfig.outboundConfirmations;
        }
        if (config.executor == address(0x0)) {
            config.executor = defaultConfig.executor;
        }
        return config;
    }

    function getConfig(uint16 _eid, address _oapp, uint _configType) external view returns (bytes memory) {
        OutboundConfig storage config = outboundConfig[_oapp][_eid];
        OutboundConfig storage defaultConfig = defaultOutboundConfig[_eid];

        if (_configType == CONFIG_TYPE_MAX_MESSAGE_SIZE) {
            if (config.maxMessageSize == 0) {
                return abi.encode(defaultConfig.maxMessageSize);
            }
            return abi.encode(config.maxMessageSize);
        } else if (_configType == CONFIG_TYPE_OUTBOUND_CONFIRMATIONS) {
            if (config.outboundConfirmations == 0) {
                return abi.encode(defaultConfig.outboundConfirmations);
            }
            return abi.encode(config.outboundConfirmations);
        } else if (_configType == CONFIG_TYPE_EXECUTOR) {
            if (config.executor == address(0x0)) {
                return abi.encode(defaultConfig.executor);
            }
            return abi.encode(config.executor);
        } else {
            (bytes memory libConfig, ) = _getConfig(_eid, _oapp, uint32(_configType));
            return libConfig;
        }
    }

    function getDefaultConfig(uint32 _eid, uint32 _configType) external view returns (bytes memory) {
        OutboundConfig storage config = defaultOutboundConfig[_eid];

        if (_configType == CONFIG_TYPE_MAX_MESSAGE_SIZE) {
            return abi.encode(config.maxMessageSize);
        } else if (_configType == CONFIG_TYPE_OUTBOUND_CONFIRMATIONS) {
            return abi.encode(config.outboundConfirmations);
        } else if (_configType == CONFIG_TYPE_EXECUTOR) {
            return abi.encode(config.executor);
        } else {
            return _defaultConfig(_eid, _configType);
        }
    }

    function getOutboundNonce(uint16 _eid, bytes calldata _path) external view returns (uint64) {
        return nonceContract.outboundNonce(_eid, _path);
    }

    function _assertMessageSize(uint actual, uint max) internal pure {
        require(actual <= max, "LZ10009");
    }

    function _convertBytesToBytes32(bytes memory _data) internal pure returns (bytes32 result) {
        require(_data.length <= 32, "LZ10009");
        assembly {
            result := mload(add(_data, 32))
        }
        uint256 offset = 32 - _data.length;
        result = result >> (offset * 8);
    }

    function _convertBytes32ToBytes(bytes32 _data, uint _size) internal pure returns (bytes memory) {
        require(_size > 0 && _size <= 32, "LZ10009");
        bytes memory data = abi.encodePacked(_data); // copy to memory
        bytes memory result = new bytes(_size);
        uint offset = 64 - _size; // 32 + 32
        assembly {
            mstore(add(result, 32), mload(add(data, offset)))
        }
        return result;
    }

    function _convertUint32ToUint16(uint32 _data) internal pure returns (uint16) {
        require(_data <= type(uint16).max, "LZ10009");
        return uint16(_data);
    }

    function _incrementNonce(
        address _sender,
        uint16 _dstEid,
        bytes calldata _path
    ) internal returns (uint64 nonce, bytes32 receiver) {
        uint addressSize = addressSizes[_dstEid];
        // path = remoteAddress + localAddress
        require(addressSize != 0 && _path.length == 20 + addressSize, "LZ10009");

        address expectedSender;
        bytes memory path = _path; // copy to memory
        assembly {
            expectedSender := mload(add(add(path, 20), addressSize))
        }
        require(_sender == expectedSender, "LZ10000");
        receiver = _convertBytesToBytes32(_path[0:addressSize]);
        nonce = nonceContract.increment(_dstEid, _sender, path);
    }

    function _payLzTokenFee(
        address _sender,
        address _zroPaymentAddress, //todo: who should the app approve to do transferFrom?
        uint _lzTokenFee,
        Options.WorkerOptions[] memory _workerOptions
    ) internal {
        // zro payment address must equal the sender or the tx.origin otherwise the transaction reverts
        require(_zroPaymentAddress == _sender || _zroPaymentAddress == tx.origin, "LZ10000");

        // the last worker type should be treasury
        (bool found, bytes memory treasuryFeeOptions) = Options.getOptionByWorkerIdAndOptionType(
            _workerOptions,
            TreasuryOptions.WORKER_ID,
            TreasuryOptions.OPTION_TYPE_TREASURY_FEE
        );
        require(found, "LZ10000");

        require(_lzTokenFee <= TreasuryOptions.decodeTreasuryFeeParams(treasuryFeeOptions), "LZ10003");

        // send lz token fee to the treasury directly
        IERC20(layerZeroToken).transferFrom(_zroPaymentAddress, treasury, _lzTokenFee);
    }

    function _quoteWorkers(
        address _oapp,
        uint32 _eid,
        Options.WorkerOptions[] memory _options,
        uint64 _outboundConfirmations
    ) internal view virtual returns (uint);

    function _send(
        Packet memory _packet,
        Options.WorkerOptions[] memory _options,
        uint64 _outboundConfirmations
    ) internal virtual returns (uint);

    function _setConfig(uint32 _eid, address _oapp, uint32 _configType, bytes calldata _config) internal virtual;

    function _getConfig(
        uint32 _eid,
        address _oapp,
        uint32 _configType
    ) internal view virtual returns (bytes memory, bool);

    function _defaultConfig(uint32 _eid, uint32 _configType) internal view virtual returns (bytes memory);

    // receive native token from endpoint
    receive() external payable virtual {}
}
