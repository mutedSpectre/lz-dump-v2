// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "@layerzerolabs/lz-evm-v1-0.7/contracts/interfaces/ILayerZeroEndpoint.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/PacketV1Codec.sol";

import "../interfaces/ILayerZeroOracle.sol";
import "../interfaces/IUltraLightNode.sol";
import "../interfaces/IUlnConfig.sol";
import "../libs/OracleOptions.sol";

import "./MessageLibBaseE1.sol";

contract UltraLightNode301 is IUltraLightNode, MessageLibBaseE1 {
    using PacketV1Codec for bytes;

    IUlnConfig internal immutable ulnConfig;

    mapping(bytes32 headerHash => mapping(bytes32 payloadHash => mapping(address oracle => uint64 confirmations)))
        public hashLookup;

    event PayloadSigned(address oracle, bytes header, uint confirmations, bytes32 proofHash);
    event OracleFee(address[] oracles, uint[] fees);
    event PacketDelivered(uint32 srcEid, bytes32 sender, address receiver, uint64 nonce, bytes32 payloadHash);

    constructor(
        address _endpoint,
        uint _treasuryGasCap,
        address _nonceContract,
        uint32 _localEid,
        address _ulnConfig
    ) MessageLibBaseE1(_endpoint, 1, _treasuryGasCap, _nonceContract, _localEid) {
        ulnConfig = IUlnConfig(_ulnConfig);
    }

    function _quoteWorkers(
        address _sender,
        uint32 _dstEid,
        Options.WorkerOptions[] memory _options,
        uint64 _outboundConfirmations
    ) internal view override returns (uint totalFee) {
        IUlnConfig.Config memory config = ulnConfig.getUlnConfig(_sender, _dstEid);

        (, , bytes memory oracleOptions) = Options.getWorkerOptionsByWorkerId(_options, OracleOptions.WORKER_ID);
        // quote the oracles
        totalFee += _quoteOracles(
            config.oracles,
            config.oraclesCount,
            _sender,
            _dstEid,
            oracleOptions,
            _outboundConfirmations
        );
        // quote the optional oracles
        totalFee += _quoteOracles(
            config.optionalOracles,
            config.optionalOraclesCount,
            _sender,
            _dstEid,
            oracleOptions,
            _outboundConfirmations
        );
    }

    function _quoteOracles(
        address[] memory _oracles,
        uint16 _oracleCount,
        address _sender,
        uint32 _dstEid,
        bytes memory _options,
        uint64 _outboundConfirmations
    ) internal view returns (uint256 totalFee) {
        for (uint i = 0; i < _oracleCount; i++) {
            totalFee += ILayerZeroOracle(_oracles[i]).getFee(_dstEid, _outboundConfirmations, _sender, _options);
        }
    }

    function _send(
        Packet memory _packet,
        Options.WorkerOptions[] memory _options,
        uint64 _outboundConfirmations
    ) internal virtual override returns (uint totalFee) {
        // assert payload size restriction
        address sender = _packet.sender;
        IUlnConfig.Config memory config = ulnConfig.getUlnConfig(sender, _packet.dstEid);

        // oracle fees
        (, , bytes memory oracleOptions) = Options.getWorkerOptionsByWorkerId(_options, OracleOptions.WORKER_ID);
        totalFee += _payOracles(
            config.oracles,
            config.oraclesCount,
            sender,
            _packet.dstEid,
            oracleOptions,
            _outboundConfirmations
        );
        totalFee += _payOracles(
            config.optionalOracles,
            config.optionalOraclesCount,
            sender,
            _packet.dstEid,
            oracleOptions,
            _outboundConfirmations
        );
    }

    function _payOracles(
        address[] memory _oracles,
        uint16 _oracleCount,
        address _sender,
        uint32 _dstEid,
        bytes memory _options,
        uint64 _outboundConfirmations
    ) internal returns (uint totalFee) {
        uint[] memory oracleFees = new uint[](_oracleCount);
        for (uint i = 0; i < _oracleCount; i++) {
            uint oracleFee = ILayerZeroOracle(_oracles[i]).assignJob(
                _dstEid,
                _outboundConfirmations,
                _sender,
                _options
            );
            oracleFees[i] = oracleFee;

            if (oracleFee > 0) {
                fees[_oracles[i]] += oracleFee;
                totalFee += oracleFee;
            }
        }

        emit OracleFee(_oracles, oracleFees);
    }

    function _setConfig(uint32 _eid, address _oapp, uint32 _configType, bytes calldata _config) internal override {
        ulnConfig.setConfig(_eid, _oapp, _configType, _config);
    }

    function _getConfig(
        uint32 _eid,
        address _oapp,
        uint32 _configType
    ) internal view override returns (bytes memory, bool) {
        return ulnConfig.getConfig(_eid, _oapp, _configType);
    }

    function _defaultConfig(uint32 _eid, uint32 _configType) internal view override returns (bytes memory) {
        return ulnConfig.getDefaultConfig(_eid, _configType);
    }

    // execute in the case of 301
    function deliver(bytes calldata _packet, uint _gasLimit) external {
        address receiver = _packet.receiverB20();
        uint16 srcEid = _convertUint32ToUint16(_packet.srcEid());
        uint64 nonce = _packet.nonce();
        bytes memory message = _packet.message();

        require(
            _deliverable(ulnConfig.getUlnConfig(receiver, srcEid), _packet) == DeliveryState.Deliverable,
            "LZ10000"
        );

        // todo: check if the receiver is a contract or not?

        ILayerZeroEndpoint(endpoint).receivePayload(
            srcEid,
            abi.encodePacked(_convertBytes32ToBytes(_packet.sender(), addressSizes[srcEid]), receiver),
            receiver,
            nonce,
            _gasLimit,
            message
        );

        // todo: emit an event with guid?
        emit PacketDelivered(srcEid, _packet.sender(), receiver, nonce, keccak256(message));
    }

    function oracleSign(bytes calldata _packetHeader, bytes32 _payloadHash, uint64 _confirmations) external {
        hashLookup[keccak256(_packetHeader)][_payloadHash][msg.sender] = _confirmations;
        emit PayloadSigned(msg.sender, _packetHeader, _confirmations, _payloadHash);
    }

    function version() external pure override returns (uint64 major, uint8 minor, uint8 endpointVersion) {
        return (3, 0, 1);
    }

    // executable in the case of 301
    function deliverable(bytes calldata _packet) external view returns (DeliveryState) {
        // check endpoint executable
        ILayerZeroEndpoint lzEndpoint = ILayerZeroEndpoint(endpoint);
        uint16 srcEid = _convertUint32ToUint16(_packet.srcEid());
        bytes memory sender = _convertBytes32ToBytes(_packet.sender(), addressSizes[srcEid]);
        address receiver = _packet.receiverB20();
        bytes memory path = abi.encodePacked(sender, receiver);
        uint64 nonce = _packet.nonce();

        // assert message library
        require(lzEndpoint.getReceiveLibraryAddress(receiver) == address(this), "LZ50000");

        // 1. check if nonce is already delivered
        uint64 inboundNonce = lzEndpoint.getInboundNonce(srcEid, path);
        if (nonce <= inboundNonce) return DeliveryState.Delivered;

        // 2. check nonce is next nonce
        // 3. check there are no stored payload
        if (nonce > inboundNonce + 1 || lzEndpoint.hasStoredPayload(srcEid, path)) return DeliveryState.Waiting;

        // check oracle executable
        IUlnConfig.Config memory config = ulnConfig.getUlnConfig(receiver, srcEid);
        return _deliverable(config, _packet);
    }

    function _deliverable(
        IUlnConfig.Config memory _config,
        bytes calldata _packet
    ) internal view returns (DeliveryState) {
        require(_packet.length >= 113, "LZ10009");
        require(_packet.version() == packetVersion, "LZ10007");
        require(_packet.dstEid() == localEid, "LZ10008");

        bytes32 headerHash = keccak256(_packet.header());
        bytes32 payloadHash = keccak256(_packet.payload());

        uint64 requiredConfirmations = _config.inboundConfirmations;
        // iterate the must-have oracles
        for (uint i = 0; i < _config.oraclesCount; i++) {
            address oracle = _config.oracles[i];
            uint64 confirmations = hashLookup[headerHash][payloadHash][oracle];
            if (confirmations < requiredConfirmations) {
                // return Signing if any of the must-have oracles haven't signed
                return DeliveryState.Signing;
            }
        }

        if (_config.oraclesCount > 0 && _config.optionalOraclesCount == 0) {
            return DeliveryState.Deliverable;
        } else {
            // then the optional ones
            uint optionalCount = 0;
            for (uint i = 0; i < _config.optionalOraclesCount; i++) {
                address oracle = _config.optionalOracles[i];
                uint64 confirmations = hashLookup[headerHash][payloadHash][oracle];

                if (confirmations >= requiredConfirmations) {
                    optionalCount++;
                    if (optionalCount >= _config.optionalOraclesThreshold) {
                        return DeliveryState.Deliverable;
                    }
                }
            }
        }

        // return Signing by default as a catch-all
        return DeliveryState.Signing;
    }

    function deliver(bytes calldata, bytes32) external pure {
        // only available in uln302
        revert("LZC0000");
    }

    function deliverable(bytes calldata, bytes32) external pure returns (DeliveryState) {
        // only available in uln302
        revert("LZC0000");
    }
}
