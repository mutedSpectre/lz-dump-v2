// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/PacketV1Codec.sol";

import "../interfaces/ILayerZeroOracle.sol";
import "../interfaces/IUltraLightNode.sol";
import "../interfaces/IUlnConfig.sol";
import "../libs/OracleOptions.sol";

import "../../MessageLibBase.sol";

contract UltraLightNode302 is ERC165, IUltraLightNode, IMessageOrigin, MessageLibBase {
    using PacketV1Codec for bytes;

    IUlnConfig internal immutable ulnConfig;
    mapping(bytes32 headerHash => mapping(bytes32 payloadHash => mapping(address oracle => uint64 confirmations)))
        public hashLookup;

    event PayloadSigned(address oracle, bytes header, uint confirmations, bytes32 proofHash);
    event OracleFee(address[] oracles, uint[] fees);

    constructor(
        address _endpoint,
        uint _treasuryGasCap,
        address _ulnConfig
    ) MessageLibBase(_endpoint, 1, _treasuryGasCap) {
        ulnConfig = IUlnConfig(_ulnConfig);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IMessageLib).interfaceId || super.supportsInterface(interfaceId);
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
        Packet calldata _packet,
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

    function _snapshotConfig(uint32[] calldata _eids, address _oapp) internal override {
        ulnConfig.snapshotConfig(_eids, _oapp);
    }

    function _setConfig(uint32 _eid, address _oapp, uint32 _configType, bytes calldata _config) internal override {
        ulnConfig.setConfig(_eid, _oapp, _configType, _config);
    }

    function _resetConfig(uint32[] calldata _eids, address _oapp) internal override {
        ulnConfig.resetConfig(_eids, _oapp);
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

    function _isSupportedEid(uint32 _eid) internal view override returns (bool) {
        return ulnConfig.isSupportedEid(_eid);
    }

    function deliver(bytes calldata _packetHeader, bytes32 _payloadHash) external {
        IUlnConfig.Config memory config = ulnConfig.getUlnConfig(_packetHeader.receiverB20(), _packetHeader.srcEid());
        require(_deliverable(config, _packetHeader, _payloadHash) == DeliveryState.Deliverable, "LZ10000");

        MessageOrigin memory origin = MessageOrigin(
            _packetHeader.srcEid(),
            _packetHeader.sender(),
            _packetHeader.nonce()
        );
        ILayerZeroEndpoint(endpoint).deliver(origin, _packetHeader.receiverB20(), _payloadHash);
    }

    function deliver(bytes calldata, uint) external pure {
        revert("LZC0000");
    }

    function oracleSign(bytes calldata _packetHeader, bytes32 _payloadHash, uint64 _confirmations) external {
        hashLookup[keccak256(_packetHeader)][_payloadHash][msg.sender] = _confirmations;
        emit PayloadSigned(msg.sender, _packetHeader, _confirmations, _payloadHash);
    }

    function version() external pure override returns (uint64 major, uint8 minor, uint8 endpointVersion) {
        return (3, 0, 2);
    }

    function deliverable(bytes calldata _packetHeader, bytes32 _payloadHash) external view returns (DeliveryState) {
        address receiver = _packetHeader.receiverB20();
        uint32 srcEid = _packetHeader.srcEid();

        // 1. check endpoint deliverable
        // not checking in the internal function as it would be checked by the endpoint
        MessageOrigin memory origin = MessageOrigin(srcEid, _packetHeader.sender(), _packetHeader.nonce());
        bool endpointDeliverable = ILayerZeroEndpoint(endpoint).deliverable(origin, address(this), receiver);
        if (!endpointDeliverable) return DeliveryState.Delivered;

        // 2. check if has payload
        // endpoint allows redelivery, check if it has already been delivered
        bool hasPayload = ILayerZeroEndpoint(endpoint).hasPayloadHash(origin, receiver);
        if (hasPayload) return DeliveryState.Delivered;

        // check oracle deliverable
        IUlnConfig.Config memory config = ulnConfig.getUlnConfig(receiver, srcEid);
        return _deliverable(config, _packetHeader, _payloadHash);
    }

    function _deliverable(
        IUlnConfig.Config memory _config,
        bytes calldata _packetHeader,
        bytes32 _payloadHash
    ) internal view returns (DeliveryState) {
        require(_packetHeader.length == 81, "LZ10009");
        require(_packetHeader.version() == packetVersion, "LZ10007");
        require(_packetHeader.dstEid() == localEid, "LZ10008");

        bytes32 _headerHash = keccak256(_packetHeader);
        uint64 requiredConfirmations = _config.inboundConfirmations;
        // iterate the must-have oracles
        for (uint i = 0; i < _config.oraclesCount; i++) {
            address oracle = _config.oracles[i];
            uint64 confirmations = hashLookup[_headerHash][_payloadHash][oracle];
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
                uint64 confirmations = hashLookup[_headerHash][_payloadHash][oracle];

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

    function deliverable(bytes calldata) external pure returns (DeliveryState) {
        revert("LZC0000");
    }
}
