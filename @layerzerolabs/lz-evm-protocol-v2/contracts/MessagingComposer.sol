// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "./interfaces/IMessagingComposer.sol";
import "./interfaces/ILayerZeroComposer.sol";
import "./libs/SafeCall.sol";

contract MessagingComposer is IMessagingComposer {
    using SafeCall for address;

    // receiver -> composer -> guid -> message hash
    bytes32 private constant _NO_MESSAGE_HASH = bytes32(0);
    bytes32 private constant _RECEIVED_MESSAGE_HASH = bytes32(uint(1));
    address private constant _NOT_ENTERED_ADDR = address(1);

    mapping(address receiver => mapping(address composer => mapping(bytes32 guid => bytes32 messageHash)))
        public composedMessages;
    address private _composeContext = _NOT_ENTERED_ADDR;

    modifier composeContext(address _receiver) {
        require(_composeContext == _NOT_ENTERED_ADDR, "LZ30003");
        _composeContext = _receiver;
        _;
        _composeContext = _NOT_ENTERED_ADDR;
    }

    function deliverComposedMessage(address _composer, bytes32 _guid, bytes calldata _message) external {
        require(composedMessages[msg.sender][_composer][_guid] == _NO_MESSAGE_HASH, "LZ80000");
        composedMessages[msg.sender][_composer][_guid] = keccak256(_message);
        emit ComposedMessageDelivered(msg.sender, _composer, _guid, _message);
    }

    function lzCompose(
        address _receiver,
        address _composer,
        bytes32 _guid,
        bytes calldata _message,
        bytes calldata _callerParams
    ) external payable composeContext(_receiver) returns (bool success, bytes memory reason) {
        bytes32 expectedHash = composedMessages[_receiver][_composer][_guid];
        require(expectedHash == keccak256(_message), "LZ60000");
        {
            bytes memory callData = abi.encodeWithSelector(
                ILayerZeroComposer.lzCompose.selector,
                _receiver,
                _guid,
                _message,
                msg.sender,
                _callerParams
            );
            (success, reason) = _composer.safeCall(gasleft(), msg.value, 150, callData);
        }

        if (success) {
            composedMessages[_receiver][_composer][_guid] = _RECEIVED_MESSAGE_HASH;
            emit ComposedMessageReceived(_receiver, _composer, _guid, expectedHash, msg.sender);
        } else {
            if (msg.value > 0) {
                (bool sent, ) = msg.sender.call{value: msg.value}("");
                require(sent, "LZ30000");
            }
            emit LzComposeFailed(_receiver, _composer, _guid, expectedHash, msg.sender, reason);
        }
    }

    function isComposingMessage() public view override returns (bool) {
        return _composeContext != _NOT_ENTERED_ADDR;
    }

    function getComposeContext() external view override returns (address) {
        return isComposingMessage() ? _composeContext : address(0);
    }
}
