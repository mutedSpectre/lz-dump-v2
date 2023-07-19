// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpoint.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLib.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/Options.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/PacketV1Codec.sol";

import "./interfaces/ILayerZeroExecutor.sol";
import "./interfaces/ILayerZeroTreasury.sol";

abstract contract MessageLibBase is IMessageLib, Ownable {
    using SafeERC20 for IERC20;
    using PacketV1Codec for bytes;

    // Derived MessageLibs should never use this as config type
    uint32 private constant CONFIG_TYPE_MAX_MESSAGE_SIZE = 1;
    uint32 private constant CONFIG_TYPE_OUTBOUND_CONFIRMATIONS = 2;
    uint32 private constant CONFIG_TYPE_EXECUTOR = 3;

    address internal immutable endpoint;
    uint32 internal immutable localEid;
    uint8 internal immutable packetVersion;
    uint internal immutable treasuryGasCap;

    // config
    address public treasury;
    mapping(uint32 dstEid => OutboundConfig) public defaultOutboundConfig;
    mapping(address oapp => mapping(uint32 dstEid => OutboundConfig)) public outboundConfig;
    mapping(uint32 dstEid => bytes option) public defaultOptions;

    // accumulated fees for workers and treasury
    mapping(address recipient => uint) public fees;

    struct OutboundConfig {
        uint32 maxMessageSize;
        uint64 outboundConfirmations;
        address executor;
    }

    event ExecutorFee(address executor, uint fee);
    event WithdrawFee(address indexed user, address receiver, uint amount);
    event WithdrawLzTokenFee(address indexed user, address lzToken, address receiver, uint amount);

    // only the endpoint can call SEND() and setConfig()
    modifier onlyEndpoint() {
        require(endpoint == msg.sender, "LZ50000");
        _;
    }

    constructor(address _endpoint, uint8 _packetVersion, uint _treasuryGasCap) {
        require(_endpoint != address(0x0), "LZ10000");
        endpoint = _endpoint;
        localEid = ILayerZeroEndpoint(_endpoint).eid();
        packetVersion = _packetVersion;
        treasuryGasCap = _treasuryGasCap;
    }

    /// ---------------------- ONLY ENDPOINT ----------------------
    function send(
        Packet calldata _packet,
        bytes memory _options,
        bool _payInLzToken
    ) external onlyEndpoint returns (ILayerZeroEndpoint.MessagingReceipt memory, bytes memory, bytes memory) {
        uint32 dstEid = _packet.dstEid;
        address sender = _packet.sender;

        uint totalNativeFee = 0;
        {
            if (_options.length == 0) {
                _options = defaultOptions[dstEid];
            }

            Options.WorkerOptions[] memory workerOptions;
            bytes memory executorOptions;
            if (_options.length > 0) {
                workerOptions = Options.decodeOptions(_options);
                if (workerOptions[0].workerId == ExecutorOptions.WORKER_ID) {
                    executorOptions = workerOptions[0].options;
                }
            }

            // assert msg size
            OutboundConfig memory config = getOutboundConfig(sender, dstEid);
            uint msgSize = _packet.message.length;
            _assertMessageSize(msgSize, config.maxMessageSize);

            totalNativeFee = ILayerZeroExecutor(config.executor).assignJob(dstEid, sender, msgSize, executorOptions);
            if (totalNativeFee > 0) {
                fees[config.executor] += totalNativeFee;
            }
            emit ExecutorFee(config.executor, totalNativeFee);

            totalNativeFee += _send(_packet, workerOptions, config.outboundConfirmations);
        }

        bytes memory encodedPacket = PacketV1Codec.encode(packetVersion, _packet);

        _handleMessagingParamsHook(encodedPacket, _options);

        ILayerZeroEndpoint.MessagingReceipt memory receipt;
        {
            bool payInLzToken = _payInLzToken;
            (uint treasuryNativeFee, uint lzTokenFee) = _quoteTreasuryFee(sender, dstEid, totalNativeFee, payInLzToken);
            // if payInLzToken, payment handled in endpoint
            if (treasuryNativeFee > 0) {
                fees[treasury] += treasuryNativeFee;
                totalNativeFee += treasuryNativeFee;
            }
            receipt = ILayerZeroEndpoint.MessagingReceipt(
                _packet.guid,
                _packet.nonce,
                ILayerZeroEndpoint.MessagingFee(totalNativeFee, lzTokenFee)
            );
        }

        return (receipt, encodedPacket, _options);
    }

    function setConfig(
        address _oapp,
        uint32 _eid,
        ILayerZeroEndpoint.ConfigParam[] calldata _params
    ) external onlyEndpoint {
        OutboundConfig storage config = outboundConfig[_oapp][_eid];
        for (uint i = 0; i < _params.length; i++) {
            ILayerZeroEndpoint.ConfigParam calldata param = _params[i];
            uint32 configType = param.configType;
            if (configType == CONFIG_TYPE_MAX_MESSAGE_SIZE) {
                uint32 maxMessageSize = abi.decode(param.config, (uint32));
                config.maxMessageSize = maxMessageSize;
            } else if (configType == CONFIG_TYPE_OUTBOUND_CONFIRMATIONS) {
                uint64 outboundConfirmations = abi.decode(param.config, (uint64));
                config.outboundConfirmations = outboundConfirmations;
            } else if (configType == CONFIG_TYPE_EXECUTOR) {
                address executor = abi.decode(param.config, (address));
                config.executor = executor;
            } else {
                _setConfig(_eid, _oapp, configType, param.config);
            }
        }
    }

    function snapshotConfig(uint32[] calldata _eids, address _oapp) external onlyEndpoint {
        _snapshotOutboundConfig(_eids, _oapp);
        _snapshotConfig(_eids, _oapp);
    }

    function resetConfig(uint32[] calldata _eids, address _oapp) external onlyEndpoint {
        _resetOutboundConfig(_eids, _oapp);
        _resetConfig(_eids, _oapp);
    }

    /// ---------------------- ONLY OWNER ----------------------
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

    function setDefaultOptions(uint32 _dstEid, bytes calldata _options) external onlyOwner {
        defaultOptions[_dstEid] = _options;
    }

    /// ---------------------- PUBLIC FUNCTIONS ----------------------
    function withdrawFee(address _to, uint _amount) external {
        require(_to != address(0x0), "LZ10000");
        require(_amount <= fees[msg.sender], "LZ10003");

        address altTokenAddr = ILayerZeroEndpoint(endpoint).altFeeToken();
        bool isAltToken = altTokenAddr != address(0x0);

        fees[msg.sender] -= _amount;
        if (isAltToken) {
            IERC20(altTokenAddr).safeTransfer(_to, _amount);
        } else {
            (bool success, ) = _to.call{value: _amount}("");
            require(success, "LZ30000");
        }
        emit WithdrawFee(msg.sender, _to, _amount);
    }

    /// @param _lzToken instead of getting lz token from endpoint, allow caller to specify lz token, because
    ///                 the lz token may be changed and the original lz token may be locked in this contract
    function withdrawLzTokenFee(address _lzToken, address _to, uint _amount) external {
        require(msg.sender == treasury, "LZ50000");
        // lz token cannot be alt token
        require(ILayerZeroEndpoint(endpoint).altFeeToken() != _lzToken && _to != address(0x0), "LZ10000");

        IERC20(_lzToken).safeTransfer(_to, _amount);
        emit WithdrawLzTokenFee(msg.sender, _lzToken, _to, _amount);
    }

    /// ---------------------- VIEW FUNCTIONS ----------------------
    function quote(
        PacketForQuote calldata _packet,
        bool _payInLzToken,
        bytes memory _options
    ) external view returns (ILayerZeroEndpoint.MessagingFee memory) {
        address sender = _packet.sender;
        OutboundConfig memory config = getOutboundConfig(sender, _packet.dstEid);

        uint msgSize = _packet.message.length;
        _assertMessageSize(msgSize, config.maxMessageSize);

        if (_options.length == 0) {
            _options = defaultOptions[_packet.dstEid];
        }

        Options.WorkerOptions[] memory workerOptions;
        bytes memory executorOptions;
        if (_options.length > 0) {
            workerOptions = Options.decodeOptions(_options);
            if (workerOptions[0].workerId == ExecutorOptions.WORKER_ID) {
                executorOptions = workerOptions[0].options;
            }
        }

        uint totalNativeFee = ILayerZeroExecutor(config.executor).getFee(
            _packet.dstEid,
            sender,
            msgSize,
            executorOptions
        );
        totalNativeFee += _quoteWorkers(sender, _packet.dstEid, workerOptions, config.outboundConfirmations);

        bool payInLzToken = _payInLzToken;
        (uint treasuryNativeFee, uint lzTokenFee) = _quoteTreasuryFee(
            sender,
            _packet.dstEid,
            totalNativeFee,
            payInLzToken
        );
        if (treasuryNativeFee > 0) {
            totalNativeFee += treasuryNativeFee;
        }

        return ILayerZeroEndpoint.MessagingFee(totalNativeFee, lzTokenFee);
    }

    //todo: make this public?
    function _quoteTreasuryFee(
        address _sender,
        uint32 _eid,
        uint _totalFee,
        bool _payInLzToken
    ) internal view returns (uint nativeFee, uint lzTokenFee) {
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

    function getOutboundConfig(address _oapp, uint32 _dstEid) public view returns (OutboundConfig memory) {
        OutboundConfig memory config = outboundConfig[_oapp][_dstEid];
        OutboundConfig memory defaultConfig = defaultOutboundConfig[_dstEid];
        require(defaultConfig.maxMessageSize > 0, "LZ10008"); // available remote eid

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

    function getConfig(uint32 _eid, address _oapp, uint32 _configType) external view returns (bytes memory, bool) {
        if (_configType == CONFIG_TYPE_MAX_MESSAGE_SIZE) {
            OutboundConfig storage config = outboundConfig[_oapp][_eid];
            if (config.maxMessageSize == 0) {
                OutboundConfig storage defaultConfig = defaultOutboundConfig[_eid];
                return (abi.encode(defaultConfig.maxMessageSize), true);
            }
            return (abi.encode(config.maxMessageSize), false);
        } else if (_configType == CONFIG_TYPE_OUTBOUND_CONFIRMATIONS) {
            OutboundConfig storage config = outboundConfig[_oapp][_eid];
            if (config.outboundConfirmations == 0) {
                OutboundConfig storage defaultConfig = defaultOutboundConfig[_eid];
                return (abi.encode(defaultConfig.outboundConfirmations), true);
            }
            return (abi.encode(config.outboundConfirmations), false);
        } else if (_configType == CONFIG_TYPE_EXECUTOR) {
            OutboundConfig storage config = outboundConfig[_oapp][_eid];
            if (config.executor == address(0x0)) {
                OutboundConfig storage defaultConfig = defaultOutboundConfig[_eid];
                return (abi.encode(defaultConfig.executor), true);
            }
            return (abi.encode(config.executor), false);
        } else {
            return _getConfig(_eid, _oapp, _configType);
        }
    }

    function getDefaultConfig(uint32 _eid, uint32 _configType) external view returns (bytes memory) {
        if (_configType == CONFIG_TYPE_MAX_MESSAGE_SIZE) {
            OutboundConfig storage config = defaultOutboundConfig[_eid];
            return abi.encode(config.maxMessageSize);
        } else if (_configType == CONFIG_TYPE_OUTBOUND_CONFIRMATIONS) {
            OutboundConfig storage config = defaultOutboundConfig[_eid];
            return abi.encode(config.outboundConfirmations);
        } else if (_configType == CONFIG_TYPE_EXECUTOR) {
            OutboundConfig storage config = defaultOutboundConfig[_eid];
            return abi.encode(config.executor);
        } else {
            return _defaultConfig(_eid, _configType);
        }
    }

    function isSupportedEid(uint32 _eid) external view returns (bool) {
        return defaultOutboundConfig[_eid].maxMessageSize > 0 && _isSupportedEid(_eid);
    }

    function version() external pure virtual returns (uint64 major, uint8 minor, uint8 endpointVersion);

    /// ---------------------- INTERNAL OR VIRTUAL FUNCTIONS ----------------------
    function _snapshotOutboundConfig(uint32[] calldata _eids, address _oapp) internal {
        for (uint i = 0; i < _eids.length; i++) {
            uint32 eid = _eids[i];
            OutboundConfig memory config = getOutboundConfig(_oapp, eid);
            outboundConfig[_oapp][eid] = config;
        }
    }

    function _resetOutboundConfig(uint32[] calldata _eids, address _oapp) internal {
        for (uint i = 0; i < _eids.length; i++) {
            uint32 eid = _eids[i];
            delete outboundConfig[_oapp][eid];
        }
    }

    function _assertMessageSize(uint actual, uint max) internal pure {
        require(actual <= max, "LZ10009");
    }

    function _quoteWorkers(
        address _oapp,
        uint32 _eid,
        Options.WorkerOptions[] memory _options,
        uint64 _outboundConfirmations
    ) internal view virtual returns (uint);

    function _send(
        Packet calldata _packet,
        Options.WorkerOptions[] memory _options,
        uint64 _outboundConfirmations
    ) internal virtual returns (uint);

    function _setConfig(uint32 _eid, address _oapp, uint32 _configType, bytes calldata _config) internal virtual;

    function _getConfig(
        uint32 _eid,
        address _oapp,
        uint32 _configType
    ) internal view virtual returns (bytes memory, bool);

    function _snapshotConfig(uint32[] calldata _eids, address _oapp) internal virtual;

    function _resetConfig(uint32[] calldata _eids, address _oapp) internal virtual;

    function _defaultConfig(uint32 _eid, uint32 _configType) internal view virtual returns (bytes memory);

    function _isSupportedEid(uint32 _eid) internal view virtual returns (bool);

    function _handleMessagingParamsHook(bytes memory _encodedPacket, bytes memory _options) internal virtual {}

    // receive native token from endpoint
    receive() external payable virtual {}
}
