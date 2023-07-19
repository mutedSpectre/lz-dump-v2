// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "./interfaces/ILayerZeroEndpoint.sol";
import "./interfaces/ILayerZeroReceiver.sol";
import "./libs/SafeCall.sol";

import "./MessagingChannel.sol";
import "./MessagingFeeHandler.sol";
import "./MessagingComposer.sol";
import "./MessageLibManager.sol";

contract Endpoint is ILayerZeroEndpoint, MessagingChannel, MessageLibManager, MessagingFeeHandler, MessagingComposer {
    using SafeERC20 for IERC20;
    using SafeCall for address;

    uint32 public immutable eid;
    uint private constant _NOT_ENTERED = 1;

    // uint32 + address
    uint private _sendContext = _NOT_ENTERED;
    // uint32 + address
    uint private _receiveContext = _NOT_ENTERED;

    constructor(
        uint32 _eid,
        address _blockedLib,
        address _altToken
    ) MessageLibManager(_blockedLib) MessagingFeeHandler(_altToken) {
        eid = _eid;
    }

    modifier sendContext(uint32 _dstEid, address _sender) {
        require(_sendContext == _NOT_ENTERED, "LZ30001");
        _sendContext = (uint(_dstEid) << 160) | uint160(_sender);
        _;
        _sendContext = _NOT_ENTERED;
    }

    modifier receiveContext(uint32 _srcEid, address _receiver) {
        require(_receiveContext == _NOT_ENTERED, "LZ30002");
        _receiveContext = (uint(_srcEid) << 160) | uint160(_receiver);
        _;
        _receiveContext = _NOT_ENTERED;
    }

    function layerZeroToken() public view returns (address) {
        return lzToken;
    }

    function setLayerZeroToken(address _layerZeroToken) external onlyOwner {
        _setLayerZeroToken(_layerZeroToken);
        emit LayerZeroTokenSet(_layerZeroToken);
    }

    /// recover the token sent to this contract by mistake
    function recoverToken(address _token, address _to, uint _amount) external onlyOwner {
        if (_token == address(0)) {
            payable(_to).transfer(_amount);
        } else {
            IERC20(_token).safeTransfer(_to, _amount);
        }
    }

    function altFeeToken() public view returns (address) {
        return altToken;
    }

    function quote(
        address _sender,
        uint32 _dstEid,
        bytes calldata _message,
        bool _payInLzToken,
        bytes calldata _options
    ) external view returns (MessagingFee memory) {
        require(!_payInLzToken || lzToken != address(0x0), "LZD0003");

        (address sendLibrary, ) = getSendLibrary(_sender, _dstEid);
        IPacket.PacketForQuote memory packet = IPacket.PacketForQuote({
            sender: _sender,
            dstEid: _dstEid,
            message: _message
        });
        return IMessageLib(sendLibrary).quote(packet, _payInLzToken, _options);
    }

    function sendWithAlt(
        MessagingParams calldata _params,
        uint _lzTokenFee,
        uint _altTokenFee
    ) external sendContext(_params.dstEid, msg.sender) returns (MessagingReceipt memory) {
        // send message
        address sender = msg.sender;
        (MessagingReceipt memory receipt, address sendLibrary) = _send(sender, _params, _lzTokenFee);

        // handle fees
        _payAltToken(sender, receipt.fee.nativeFee, _altTokenFee, payable(sendLibrary));
        _payLayerZeroToken(sender, receipt.fee.lzTokenFee, _lzTokenFee, sendLibrary);
        emit FeePaid(sender, receipt.fee.nativeFee, receipt.fee.lzTokenFee);

        return receipt;
    }

    function send(
        MessagingParams calldata _params,
        uint _lzTokenFee,
        address payable _refundAddress
    ) external payable sendContext(_params.dstEid, msg.sender) returns (MessagingReceipt memory) {
        // send message
        address sender = msg.sender;
        (MessagingReceipt memory receipt, address sendLibrary) = _send(sender, _params, _lzTokenFee);

        // handle fees
        _payNative(receipt.fee.nativeFee, msg.value, payable(sendLibrary), _refundAddress);
        _payLayerZeroToken(sender, receipt.fee.lzTokenFee, _lzTokenFee, sendLibrary);
        emit FeePaid(sender, receipt.fee.nativeFee, receipt.fee.lzTokenFee);

        return receipt;
    }

    function _send(
        address _sender,
        MessagingParams calldata _params,
        uint _lzTokenFee
    ) internal returns (MessagingReceipt memory, address) {
        uint64 nonce = _outbound(_sender, _params.dstEid, _params.receiver);
        (address sendLibrary, ) = getSendLibrary(_sender, _params.dstEid);

        IPacket.Packet memory packet = IPacket.Packet({
            nonce: nonce,
            srcEid: eid,
            sender: _sender,
            dstEid: _params.dstEid,
            receiver: _params.receiver,
            guid: _getGuid(nonce, _sender, _params.dstEid, _params.receiver),
            message: _params.message
        });

        bool payInLzToken = _lzTokenFee > 0;

        (MessagingReceipt memory receipt, bytes memory encodedPacket, bytes memory options) = IMessageLib(sendLibrary)
            .send(packet, _params.options, payInLzToken);
        emit PacketSent(encodedPacket, options, sendLibrary);
        return (receipt, sendLibrary);
    }

    function getNextGuid(address _sender, uint32 _dstEid, bytes32 _receiver) external view returns (bytes32) {
        uint64 nextNonce = outboundNonce[_sender][_dstEid][_receiver] + 1;
        return _getGuid(nextNonce, _sender, _dstEid, _receiver);
    }

    function _getGuid(
        uint64 _nonce,
        address _sender,
        uint32 _dstEid,
        bytes32 _receiver
    ) internal view returns (bytes32 guid) {
        bytes memory path = abi.encodePacked(eid, bytes32(uint(uint160(_sender))), _dstEid, _receiver);
        guid = keccak256(abi.encodePacked(_nonce, path));
    }

    function deliver(MessageOrigin calldata _origin, address _receiver, bytes32 _payloadHash) external {
        if (!isValidReceiveLibrary(_receiver, _origin.srcEid, msg.sender)) {
            revert("LZ50000");
        }
        _inbound(_origin, _receiver, _payloadHash);
        emit PacketDelivered(_origin, _receiver, _payloadHash, msg.sender);
    }

    /// @notice check if a message is deliverable. if false, the message is delivered. otherwise, it is deliverable.
    function deliverable(
        MessageOrigin calldata _origin,
        address _receiveLib,
        address _receiver
    ) external view returns (bool) {
        if (!isValidReceiveLibrary(_receiver, _origin.srcEid, _receiveLib)) {
            revert("LZ50000");
        }
        return _inboundDeliverable(_origin, _receiver);
    }

    function lzReceive(
        MessageOrigin calldata _origin,
        address _receiver,
        bytes32 _guid,
        bytes calldata _message,
        bytes calldata _callerParams
    ) external payable receiveContext(_origin.srcEid, _receiver) returns (bool success, bytes memory reason) {
        {
            bytes memory callData = abi.encodeWithSelector(
                ILayerZeroReceiver.lzReceive.selector,
                _origin,
                _guid,
                _message,
                msg.sender,
                _callerParams
            );
            (success, reason) = _receiver.safeCall(gasleft(), msg.value, 150, callData);
        }

        if (success) {
            bytes memory payload = abi.encodePacked(_guid, _message);
            _clearPayload(_origin, _receiver, payload);
            emit PacketReceived(_origin, _receiver, msg.sender);
        } else {
            if (msg.value > 0) {
                (bool sent, ) = msg.sender.call{value: msg.value}("");
                require(sent, "LZ30000"); // todo: new error code?
            }
            emit LzReceiveFailed(_origin, _receiver, msg.sender, reason);
        }
    }

    function clear(
        MessageOrigin calldata _origin,
        bytes32 _guid,
        bytes calldata _message
    ) external returns (bytes32 payloadHash) {
        bytes memory payload = abi.encodePacked(_guid, _message);
        payloadHash = _clearPayload(_origin, msg.sender, payload);
        emit PacketReceived(_origin, msg.sender, msg.sender);
    }

    function skip(uint32 _srcEid, bytes32 _sender, uint64 _nonce) external {
        _skipInboundNonce(msg.sender, _srcEid, _sender, _nonce);
        emit InboundNonceSkipped(_srcEid, _sender, msg.sender, _nonce);
    }

    function getInboundNonce(address _receiver, uint32 _srcEid, bytes32 _sender) external view returns (uint64) {
        return _getInboundNonce(_receiver, _srcEid, _sender);
    }

    function getOutboundNonce(address _sender, uint32 _dstEid, bytes32 _receiver) external view returns (uint64) {
        return outboundNonce[_sender][_dstEid][_receiver];
    }

    function getInboundPayloadHash(MessageOrigin calldata _origin, address _receiver) external view returns (bytes32) {
        return inboundPayloadHash[_receiver][_origin.srcEid][_origin.sender][_origin.nonce];
    }

    function hasPayloadHash(MessageOrigin calldata _origin, address _receiver) external view returns (bool) {
        return _hasPayload(_receiver, _origin.srcEid, _origin.sender, _origin.nonce);
    }

    function isSendingMessage() public view returns (bool) {
        return _sendContext != _NOT_ENTERED;
    }

    function getSendContext() external view returns (uint32, address) {
        return isSendingMessage() ? (uint32(_sendContext >> 160), address(uint160(_sendContext))) : (0, address(0));
    }

    function isReceivingMessage() public view returns (bool) {
        return _receiveContext != _NOT_ENTERED;
    }

    function getReceiveContext() external view returns (uint32, address) {
        return
            isReceivingMessage()
                ? (uint32(_receiveContext >> 160), address(uint160(_receiveContext)))
                : (0, address(0));
    }
}
