// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/AddressCast.sol";
import "@layerzerolabs/lz-evm-v1-0.7/contracts/interfaces/ILayerZeroEndpoint.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/PacketV1Codec.sol";

import "./interfaces/IUltraLightNode301.sol";
import {UlnConfigStruct} from "../interfaces/IUlnConfig.sol";
import "../libs/UlnOptions.sol";

import "./MessageLibBaseE1.sol";
import "../UlnBase.sol";

/// @dev ULN301 will be deployed on EndpointV1 and is for backward compatability with ULN302 on EndpointV2. 301 can talk to both 301 and 302
contract UltraLightNode301 is IUltraLightNode301, UlnBase, MessageLibBaseE1 {
    using PacketV1Codec for bytes;
    using SafeCast for uint32; // for chain ID uint16 to uint32 conversion
    using AddressCast for bytes32; // for address type bytes to bytes32/address conversion

    constructor(
        address _endpoint,
        uint _treasuryGasCap,
        address _nonceContract,
        uint32 _localEid,
        address _treasuryFeeHandler,
        address _ulnConfig
    )
        MessageLibBaseE1(_endpoint, 1, _treasuryGasCap, _nonceContract, _localEid, _treasuryFeeHandler)
        UlnBase(_ulnConfig)
    {}

    // ============================ OnlyEndpoint ===================================

    function setConfig(
        uint16 _eid,
        address _oapp,
        uint _configType,
        bytes calldata _config
    ) external override onlyEndpoint {
        ulnConfig.setConfigByType(_eid, _oapp, uint32(_configType), _config);
    }

    // ============================ External ===================================

    /// @dev in 301, this is equivalent to execution as in Endpoint V2
    /// @dev dont need to check endpoint deliverable here to save gas, as it will reverts if not deliverable.
    function deliver(bytes calldata _packet, uint _gasLimit) external {
        address receiver = _packet.receiverB20();
        uint16 srcEid = _packet.srcEid().toUint16();

        UlnConfigStruct memory config = ulnConfig.getUlnConfig(receiver, srcEid);
        require(
            // the packet is considered delivered in 301 if all signatures are submitted
            _deliverable(config, _packet.header(), _packet.payloadHash()) == DeliveryState.Delivered,
            Errors.INVALID_ARGUMENT
        );

        _execute(srcEid, _packet.sender(), receiver, _packet.nonce(), _packet.message(), _gasLimit);
    }

    function verify(bytes calldata _packetHeader, bytes32 _payloadHash, uint64 _confirmations) external {
        _verify(_packetHeader, _payloadHash, _confirmations);
    }

    // ============================ View ===================================

    function getConfig(
        uint16 _eid,
        address _oapp,
        uint _configType
    ) external view override returns (bytes memory config) {
        (config, ) = ulnConfig.getConfigByType(_eid, _oapp, uint32(_configType));
    }

    function getDefaultConfig(uint32 _eid, uint32 _configType) external view override returns (bytes memory) {
        return ulnConfig.getDefaultConfigByType(_eid, _configType);
    }

    function version() external pure override returns (uint64 major, uint8 minor, uint8 endpointVersion) {
        return (3, 0, 1);
    }

    /// @dev keeping the same interface as 302
    /// @dev a deliverable message requires it to be endpoint deliverable and ULN deliverable
    function deliverable(bytes calldata _packetHeader, bytes32 _payloadHash) external view returns (DeliveryState) {
        address receiver = _packetHeader.receiverB20();
        uint16 srcEid = _packetHeader.srcEid().toUint16();

        DeliveryState endpointStatus = _endpointDeliverable(srcEid, receiver, _packetHeader);
        if (endpointStatus != DeliveryState.Deliverable) {
            return endpointStatus;
        }

        // check verifier executable
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
        Packet memory _packet,
        WorkerOptions[] memory _options
    ) internal virtual override returns (uint, address, uint) {
        return _ulnSend(fees, _options, _packet.sender, _packet.dstEid);
    }

    /// @dev include only the validation logic of ulnv3
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
            // in 301, once all signature are gathered, it is ready to be executed
            // marked as Delivered to unify the behavior with 302
            return DeliveryState.Delivered;
        } else {
            return DeliveryState.Signing;
        }
    }

    function _getExecutorOptions(
        bytes memory _options
    ) internal pure override returns (bytes memory, WorkerOptions[] memory) {
        return _getExecutorOptionsInternal(_options);
    }
}
