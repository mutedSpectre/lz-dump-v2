// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/PacketV1Codec.sol";

import "../interfaces/IUltraLightNode.sol";
import {UlnConfigStruct} from "../interfaces/IUlnConfig.sol";
import {OutboundConfigStruct} from "../../OutboundConfig.sol";

import "../../MessageLibBaseE2.sol";
import "../UlnBase.sol";

contract UltraLightNode302 is IUltraLightNode, UlnBase, MessageLibBaseE2 {
    using PacketV1Codec for bytes;

    constructor(
        address _endpoint,
        uint _treasuryGasCap,
        address _ulnConfig
    ) MessageLibBaseE2(_endpoint, 1, _treasuryGasCap) UlnBase(_ulnConfig) {}

    // ============================ OnlyEndpoint ===================================

    function setConfig(
        address _oapp,
        uint32 _eid,
        ILayerZeroEndpointV2.SetConfigParam[] calldata _params
    ) external override onlyEndpoint {
        for (uint i = 0; i < _params.length; i++) {
            ILayerZeroEndpointV2.SetConfigParam calldata param = _params[i];
            ulnConfig.setConfigByType(_eid, _oapp, param.configType, param.config);
        }
    }

    function snapshotConfig(uint32[] calldata _eids, address _oapp) external override onlyEndpoint {
        ulnConfig.snapshotConfig(_eids, _oapp);
    }

    function resetConfig(uint32[] calldata _eids, address _oapp) external override onlyEndpoint {
        ulnConfig.resetConfig(_eids, _oapp);
    }

    // ============================ External ===================================

    /// @dev dont need to check endpoint deliverable here to save gas, as it will reverts if not deliverable.
    function deliver(bytes calldata _packetHeader, bytes32 _payloadHash) external {
        UlnConfigStruct memory config = ulnConfig.getUlnConfig(_packetHeader.receiverB20(), _packetHeader.srcEid());
        require(
            _deliverable(config, _packetHeader, _payloadHash) == DeliveryState.Deliverable,
            Errors.INVALID_ARGUMENT
        );

        IMessageOrigin.MessageOrigin memory origin = IMessageOrigin.MessageOrigin(
            _packetHeader.srcEid(),
            _packetHeader.sender(),
            _packetHeader.nonce()
        );
        ILayerZeroEndpointV2(endpoint).deliver(origin, _packetHeader.receiverB20(), _payloadHash);
    }

    // ============================ View ===================================

    function getConfig(
        uint32 _eid,
        address _oapp,
        uint32 _configType
    ) external view override returns (bytes memory, bool) {
        return ulnConfig.getConfigByType(_eid, _oapp, _configType);
    }

    function getDefaultConfig(uint32 _eid, uint32 _configType) external view override returns (bytes memory) {
        return ulnConfig.getDefaultConfigByType(_eid, _configType);
    }

    function isSupportedEid(uint32 _eid) external view override returns (bool) {
        return ulnConfig.isSupportedEid(_eid);
    }

    function version() external pure override returns (uint64 major, uint8 minor, uint8 endpointVersion) {
        return (3, 0, 2);
    }

    /// @dev a deliverable message requires it to be endpoint deliverable and ULN deliverable
    function deliverable(bytes calldata _packetHeader, bytes32 _payloadHash) external view returns (DeliveryState) {
        address receiver = _packetHeader.receiverB20();
        uint32 srcEid = _packetHeader.srcEid();

        DeliveryState endpointStatus = _endpointDeliverable(srcEid, receiver, _packetHeader);
        if (endpointStatus != DeliveryState.Deliverable) {
            return endpointStatus;
        }

        // check verifier deliverable
        UlnConfigStruct memory config = ulnConfig.getUlnConfig(receiver, srcEid);
        return _deliverable(config, _packetHeader, _payloadHash);
    }

    // ============================ Internal ===================================

    function _quoteWorkers(
        address _sender,
        uint32 _dstEid,
        WorkerOptions[] memory _options
    ) internal view override returns (uint, address, uint) {
        return _quoteUlnWorkers(_sender, _dstEid, _options);
    }

    function _send(
        Packet calldata _packet,
        WorkerOptions[] memory _options
    ) internal override returns (uint, address, uint) {
        return _ulnSend(fees, _options, _packet.sender, _packet.dstEid);
    }

    function _deliverable(
        UlnConfigStruct memory _config,
        bytes calldata _packetHeader,
        bytes32 _payloadHash
    ) internal view returns (DeliveryState) {
        // assert packet header is of right size 81
        require(_packetHeader.length == 81, Errors.INVALID_SIZE);
        // assert packet header version is the same as ULN
        require(_packetHeader.version() == packetVersion, Errors.INVALID_VERSION);
        // assert the packet is for this endpoint
        require(_packetHeader.dstEid() == localEid, Errors.INVALID_EID);

        bool signed = verifyConditionMet(_config, keccak256(_packetHeader), _payloadHash);
        if (signed) {
            return DeliveryState.Deliverable;
        } else {
            return DeliveryState.Signing;
        }
    }

    function verify(bytes calldata _packetHeader, bytes32 _payloadHash, uint64 _confirmations) external {
        _verify(_packetHeader, _payloadHash, _confirmations);
    }

    function _getExecutorOptions(
        bytes memory _options
    ) internal pure override returns (bytes memory, WorkerOptions[] memory) {
        return _getExecutorOptionsInternal(_options);
    }
}
