// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "./interfaces/IMessagingComposer.sol";
import "./interfaces/ILayerZeroComposer.sol";
import "./libs/SafeCall.sol";
import "./libs/Errors.sol";

contract MessagingComposer is IMessagingComposer {
    using SafeCall for address;

    bytes32 private constant _NO_MESSAGE_HASH = bytes32(0);
    bytes32 private constant _RECEIVED_MESSAGE_HASH = bytes32(uint(1));

    mapping(address receiver => mapping(address composer => mapping(bytes32 guid => bytes32 messageHash)))
        public composedMessages;

    /// @dev the Oapp delivers the lzCompose message to the endpoint
    /// @dev the composer MUST assert the sender because anyone can delivery msg with this function
    /// @dev with the same GUID, the Oapp can deliver to multiple _composer at the same time
    /// @dev authenticated by the msg.sender
    /// @param _composer the composer address
    /// @param _guid the message guid
    /// @param _message the message
    function deliverComposedMessage(address _composer, bytes32 _guid, bytes calldata _message) external {
        // must have not be delivered before
        require(composedMessages[msg.sender][_composer][_guid] == _NO_MESSAGE_HASH, Errors.ALREADY_EXISTS);
        composedMessages[msg.sender][_composer][_guid] = keccak256(_message);
        emit ComposedMessageDelivered(msg.sender, _composer, _guid, _message);
    }

    /// @dev execute a composed messages from the sender to the composer (receiver)
    /// @dev the execution provides the execution context (caller, extraData) to the receiver. the receiver can optionally assert the caller and validate the untrusted extraData
    /// @dev can not re-entrant
    /// @param _sender the sender address. in most cases, it is the Oapp's address.
    /// @param _composer the composer address
    /// @param _guid the message guid
    /// @param _message the message
    /// @param _extraData the extra data provided by the executor. this data is untrusted and should be validated.
    function lzCompose(
        address _sender,
        address _composer,
        bytes32 _guid,
        bytes calldata _message,
        bytes calldata _extraData
    ) external payable returns (bool success, bytes memory reason) {
        // assert the validity
        bytes32 expectedHash = composedMessages[_sender][_composer][_guid];
        require(expectedHash == keccak256(_message), Errors.NOT_FOUND);

        // mark the message as received. prevent reentrancy
        // can not just delete the value. otherwise, the message can be redelivered and could result in some undefined behaviour
        // even though the sender is implicitly fully trusted by the composer. for example, the sender may not even realize it has such a bug
        composedMessages[_sender][_composer][_guid] = _RECEIVED_MESSAGE_HASH;

        {
            bytes memory callData = abi.encodeWithSelector(
                ILayerZeroComposer.lzCompose.selector,
                _sender,
                _guid,
                _message,
                msg.sender,
                _extraData
            );
            (success, reason) = _composer.safeCall(gasleft(), msg.value, callData);
        }

        if (success) {
            emit ComposedMessageReceived(_sender, _composer, _guid, expectedHash, msg.sender);
        } else {
            // if the message fails, revert the state
            composedMessages[_sender][_composer][_guid] = expectedHash;

            // refund the native fee if the message fails to prevent the loss of fund
            if (msg.value > 0) {
                (bool sent, ) = msg.sender.call{value: msg.value}("");
                require(sent, Errors.INVALID_STATE);
            }
            emit LzComposeFailed(_sender, _composer, _guid, expectedHash, msg.sender, reason);
        }
    }
}
