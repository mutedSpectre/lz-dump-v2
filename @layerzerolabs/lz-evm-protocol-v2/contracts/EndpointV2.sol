// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/ILayerZeroEndpointV2.sol";
import "./interfaces/ILayerZeroReceiver.sol";
import "./libs/SafeCall.sol";
import "./libs/Errors.sol";

import "./MessagingChannel.sol";
import "./MessagingComposer.sol";
import "./MessageLibManager.sol";
import "./MessagingContext.sol";
import "./MessagingStructs.sol";

contract EndpointV2 is ILayerZeroEndpointV2, MessagingChannel, MessageLibManager, MessagingComposer, MessagingContext {
    using SafeERC20 for IERC20;
    using SafeCall for address;

    /// @dev the altFeeToken is used for fees when the native token has no value
    /// @dev immutable for gas saving. only 1 endpoint for such chains
    address public immutable altFeeToken;

    address public layerZeroToken;

    constructor(
        uint32 _eid,
        address _blockedLib,
        address _altToken
    ) MessageLibManager(_blockedLib) MessagingChannel(_eid) {
        altFeeToken = _altToken;
    }

    /// @dev MESSAGING STEP 0
    /// @dev quotes the messaging fee given the parameters
    /// @return native fee and lz token fee. if altFeeToken is enalbed, the native fee is in the form of the altFeeToken
    /// @param _sender the sender of the message
    /// @param _dstEid the destination endpoint id
    /// @param _message the message to be sent
    /// @param _payInLzToken whether the protocol fee should be paid in lz token or not
    /// @param _options the messaging options to be used (e.g. lzReceive gas limit, etc)
    function quote(
        address _sender,
        uint32 _dstEid,
        bytes calldata _message,
        bool _payInLzToken,
        bytes calldata _options
    ) external view returns (MessagingFee memory) {
        if (_payInLzToken) {
            // layerZeroToken must be set to support _payInLzToken
            require(layerZeroToken != address(0x0), Errors.TOKEN_UNAVAILABLE);
        }

        address sendLibrary = getSendLibrary(_sender, _dstEid);
        PacketForQuote memory packet = PacketForQuote({sender: _sender, dstEid: _dstEid, message: _message});
        return IMessageLib(sendLibrary).quote(packet, _payInLzToken, _options);
    }

    /// @dev MESSAGING STEP 1 - on chains with altFeeToken enabled
    /// @dev sends a message with the given parameters
    /// @dev protected by send non-enentrancy guard
    /// @dev the endpoint will settle the payment from the sender to the sendLibrary, which then settles the payment to the eventual receiver
    /// @dev this design provides a saparation of concern and users only need to approve endpoint instead of messaging libraries
    /// @return the messaging receipt, which includes the message guid, nonce and fee
    /// @param _params the messaging parameters
    /// @param _lzTokenFeeCap the maximum lz token fee that the sender is willing to pay
    /// @param _altTokenFeeCap the maximum alt token fee that the sender is willing to pay
    function sendWithAlt(
        MessagingParams calldata _params,
        uint _lzTokenFeeCap,
        uint _altTokenFeeCap
    ) external sendContext(_params.dstEid, msg.sender) returns (MessagingReceipt memory) {
        // send message
        address sender = msg.sender;
        (MessagingReceipt memory receipt, address sendLibrary) = _send(sender, _params, _lzTokenFeeCap);

        // handle fees
        _payToken(altFeeToken, sender, receipt.fee.nativeFee, _altTokenFeeCap, sendLibrary);
        _payToken(layerZeroToken, sender, receipt.fee.lzTokenFee, _lzTokenFeeCap, sendLibrary);
        emit FeePaid(receipt.fee);

        return receipt;
    }

    /// @dev MESSAGING STEP 1 - on chains with altFeeToken disabled
    /// @dev same as sendWithAlt but only accepts native tokens
    /// @param _params the messaging parameters
    /// @param _lzTokenFeeCap the maximum lz token fee that the sender is willing to pay
    /// @param _refundAddress the address to refund the native fee to
    function send(
        MessagingParams calldata _params,
        uint _lzTokenFeeCap,
        address payable _refundAddress
    ) external payable sendContext(_params.dstEid, msg.sender) returns (MessagingReceipt memory) {
        // send message
        address sender = msg.sender;
        (MessagingReceipt memory receipt, address sendLibrary) = _send(sender, _params, _lzTokenFeeCap);

        // handle fees
        _payNative(receipt.fee.nativeFee, msg.value, sendLibrary, _refundAddress);
        _payToken(layerZeroToken, sender, receipt.fee.lzTokenFee, _lzTokenFeeCap, sendLibrary);
        emit FeePaid(receipt.fee);

        return receipt;
    }

    /// @dev internal function for sending the messages
    function _send(
        address _sender,
        MessagingParams calldata _params,
        uint _lzTokenFeeCap
    ) internal returns (MessagingReceipt memory, address) {
        // get the correct outbound nonce
        uint64 nonce = _outbound(_sender, _params.dstEid, _params.receiver);

        // get the send library by sender and dst eid
        address sendLibrary = getSendLibrary(_sender, _params.dstEid);

        // construct the packet with a GUID
        Packet memory packet = Packet({
            nonce: nonce,
            srcEid: eid,
            sender: _sender,
            dstEid: _params.dstEid,
            receiver: _params.receiver,
            guid: _getGuid(nonce, _sender, _params.dstEid, _params.receiver),
            message: _params.message
        });

        // pay in lz token if lz token fee is > 0
        bool payInLzToken = _lzTokenFeeCap > 0;

        // messagelib always returns encodedPacket with guid
        (MessagingReceipt memory receipt, bytes memory encodedPacket, bytes memory options) = IMessageLib(sendLibrary)
            .send(packet, _params.options, payInLzToken);

        // emit the sent event with the necesssary informations
        emit PacketSent(encodedPacket, options, sendLibrary);
        return (receipt, sendLibrary);
    }

    /// @dev MESSAGING STEP 2 - on the destination chain
    /// @dev receives a message from the configured receive library
    /// @param _origin the origin of the message
    /// @param _receiver the receiver of the message
    /// @param _payloadHash the payload hash of the message
    function deliver(Origin calldata _origin, address _receiver, bytes32 _payloadHash) external {
        require(isValidReceiveLibrary(_receiver, _origin.srcEid, msg.sender), Errors.PERMISSION_DENIED);
        // check if it is deliverable
        require(_inboundDeliverable(_origin, _receiver), Errors.INVALID_NONCE);
        // insert the message into the message channel
        _inbound(_origin, _receiver, _payloadHash);
        emit PacketDelivered(_origin, _receiver, _payloadHash);
    }

    /// @dev check if a message is deliverable.
    /// @dev reverts if the receiveLibrary is not valid
    /// @return reverts if the msglib check fails. returns true if the message is deliverable. false if it has been delivered
    function deliverable(Origin calldata _origin, address _receiveLib, address _receiver) external view returns (bool) {
        require(isValidReceiveLibrary(_receiver, _origin.srcEid, _receiveLib), Errors.PERMISSION_DENIED);
        return _inboundDeliverable(_origin, _receiver);
    }

    /// @dev MESSAGING STEP 3 - the last step
    /// @dev execute a delivered message to the designated receiver
    /// @dev the execution provides the execution context (caller, extraData) to the receiver. the receiver can optionally assert the caller and validate the untrusted extraData
    /// @dev cant reentrant because the payload is cleared before execution
    /// @param _origin the origin of the message
    /// @param _receiver the receiver of the message
    /// @param _guid the guid of the message
    /// @param _message the message
    /// @param _extraData the extra data provided by the executor. this data is untrusted and should be validated.
    function lzReceive(
        Origin calldata _origin,
        address _receiver,
        bytes32 _guid,
        bytes calldata _message,
        bytes calldata _extraData
    ) external payable returns (bool success, bytes memory reason) {
        // clear the payload first to prevent reentrancy, and then execute the message
        bytes32 payloadHash = _clearPayload(_origin, _receiver, abi.encodePacked(_guid, _message));
        (success, reason) = _safeCallLzReceive(_origin, _receiver, _guid, _message, _extraData);

        if (success) {
            emit PacketReceived(_origin, _receiver);
        } else {
            // if the message fails, revert the clearing of the payload
            _inbound(_origin, _receiver, payloadHash);

            // refund the native fee if the message fails to prevent the loss of fund
            if (msg.value > 0) {
                (bool sent, ) = msg.sender.call{value: msg.value}("");
                require(sent, Errors.INVALID_STATE);
            }
            emit LzReceiveFailed(_origin, _receiver, reason);
        }
    }

    /// @dev internal function for executing lzReceive() on the receiver
    function _safeCallLzReceive(
        Origin calldata _origin,
        address _receiver,
        bytes32 _guid,
        bytes calldata _message,
        bytes calldata _extraData
    ) internal returns (bool success, bytes memory reason) {
        bytes memory callData = abi.encodeWithSelector(
            ILayerZeroReceiver.lzReceive.selector,
            _origin,
            _guid,
            _message,
            msg.sender,
            _extraData
        );
        (success, reason) = _receiver.safeCall(gasleft(), msg.value, callData);
    }

    /// @dev Oapp uses this interface to clear a message.
    /// @dev this is a PULL mode versus the PUSH mode of lzReceive
    /// @dev the cleared message can be ignored by the app (effectively burnt)
    /// @dev cant reentrant because the payload is cleared before execution
    /// @dev authenticated by Oapp (msg.sender)
    /// @param _origin the origin of the message
    /// @param _guid the guid of the message
    /// @param _message the message
    function clear(Origin calldata _origin, bytes32 _guid, bytes calldata _message) external {
        bytes memory payload = abi.encodePacked(_guid, _message);
        _clearPayload(_origin, msg.sender, payload);
        emit PacketReceived(_origin, msg.sender);
    }

    /// @dev allows reconfiguration to recover from wrong configurations
    /// @dev users should never approve the EndpointV2 contract to spend their non-layerzero tokens
    /// @dev only owner
    /// @param _layerZeroToken the new layer zero token address
    function setLayerZeroToken(address _layerZeroToken) external onlyOwner {
        layerZeroToken = _layerZeroToken;
        emit LayerZeroTokenSet(_layerZeroToken);
    }

    /// @dev recover the token sent to this contract by mistake
    /// @dev only owner
    /// @param _token the token to recover. if 0x0 then it is native token
    /// @param _to the address to send the token to
    /// @param _amount the amount to send
    function recoverToken(address _token, address _to, uint _amount) external onlyOwner {
        if (_token == address(0)) {
            payable(_to).transfer(_amount);
        } else {
            IERC20(_token).safeTransfer(_to, _amount);
        }
    }

    /// @dev handling token payments on endpoint. the sender must approve the endpoint to spend the token
    /// @dev internal function
    /// @param _token the token to pay
    /// @param _sender the sender of the token
    /// @param _required the amount required
    /// @param _supplied the amount supplied
    /// @param _receiver the receiver of the token
    function _payToken(address _token, address _sender, uint _required, uint _supplied, address _receiver) internal {
        if (_required == 0) return;
        require(_token != address(0x0), Errors.TOKEN_UNAVAILABLE);
        require(_required <= _supplied, Errors.INVALID_AMOUNT);
        IERC20(_token).safeTransferFrom(_sender, _receiver, _required);
    }

    /// @dev handling native token payments on endpoint
    /// @dev internal function
    /// @param _required the amount required
    /// @param _supplied the amount supplied
    /// @param _receiver the receiver of the native token
    /// @param _refundAddress the address to refund the excess to
    function _payNative(uint _required, uint _supplied, address _receiver, address _refundAddress) internal {
        // if altFeeToken is set, then native token is not available
        require(altFeeToken == address(0x0), Errors.NATIVE_COIN_UNAVAILABLE);

        require(_required <= _supplied, Errors.INVALID_AMOUNT);
        if (_required > 0) {
            (bool success, ) = _receiver.call{value: _required}("");
            require(success, Errors.INVALID_STATE);
        }
        if (_required < _supplied) {
            unchecked {
                // refund the excess
                (bool success, ) = _refundAddress.call{value: _supplied - _required}("");
                require(success, Errors.INVALID_STATE);
            }
        }
    }
}
