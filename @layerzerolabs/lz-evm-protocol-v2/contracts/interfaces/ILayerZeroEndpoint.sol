// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "./IMessageLibManager.sol";
import "./IMessagingComposer.sol";
import "./IMessageOrigin.sol";

interface ILayerZeroEndpoint is IMessageLibManager, IMessagingComposer, IMessageOrigin {
    struct MessagingParams {
        uint32 dstEid;
        bytes32 receiver;
        bytes message;
        bytes options;
    }

    struct MessagingReceipt {
        bytes32 guid;
        uint64 nonce;
        MessagingFee fee;
    }

    struct MessagingFee {
        uint nativeFee;
        uint lzTokenFee;
    }

    event PacketSent(bytes encodedPayload, bytes options, address sendLibrary);

    event PacketDelivered(MessageOrigin origin, address receiver, bytes32 payloadHash, address receiveLibrary);

    event PacketReceived(MessageOrigin origin, address receiver, address caller);

    event LzReceiveFailed(MessageOrigin origin, address receiver, address caller, bytes reason);

    event InboundNonceSkipped(uint32 srcEid, bytes32 sender, address receiver, uint64 nonce);

    event FeePaid(address sender, uint nativeOrAltTokenFee, uint lzTokenFee);

    event LayerZeroTokenSet(address token);

    function quote(
        address _sender,
        uint32 _dstEid,
        bytes calldata _message,
        bool _payInLzToken,
        bytes calldata _options
    ) external view returns (MessagingFee memory);

    function send(
        MessagingParams calldata _params,
        uint _lzTokenFee,
        address payable _refundAddress
    ) external payable returns (MessagingReceipt memory);

    function sendWithAlt(
        MessagingParams calldata _params,
        uint _lzTokenFee,
        uint _altTokenFee
    ) external returns (MessagingReceipt memory);

    function deliver(MessageOrigin calldata _origin, address _receiver, bytes32 _payloadHash) external;

    function deliverable(
        MessageOrigin calldata _origin,
        address _receiveLib,
        address _receiver
    ) external view returns (bool);

    function lzReceive(
        MessageOrigin calldata _origin,
        address _receiver,
        bytes32 _guid,
        bytes calldata _message,
        bytes calldata _callerParams
    ) external payable returns (bool, bytes memory);

    function clear(
        MessageOrigin calldata _origin,
        bytes32 _guid,
        bytes calldata _message
    ) external returns (bytes32 payloadHash);

    function skip(uint32 _srcEid, bytes32 _sender, uint64 _nonce) external;

    function eid() external view returns (uint32);

    function setLayerZeroToken(address _layerZeroToken) external;

    function layerZeroToken() external view returns (address);

    function altFeeToken() external view returns (address);

    function getNextGuid(address _sender, uint32 _dstEid, bytes32 _receiver) external view returns (bytes32);

    function getInboundNonce(address _receiver, uint32 _srcEid, bytes32 _sender) external view returns (uint64);

    function getOutboundNonce(address _sender, uint32 _dstEid, bytes32 _receiver) external view returns (uint64);

    function getInboundPayloadHash(MessageOrigin calldata _origin, address _receiver) external view returns (bytes32);

    function hasPayloadHash(MessageOrigin calldata _origin, address _receiver) external view returns (bool);

    function isSendingMessage() external view returns (bool);

    function getSendContext() external view returns (uint32, address);

    function isReceivingMessage() external view returns (bool);

    function getReceiveContext() external view returns (uint32, address);
}
