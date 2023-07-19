// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface IMessagingComposer {
    event ComposedMessageDelivered(address receiver, address composer, bytes32 guid, bytes message);
    event ComposedMessageReceived(
        address receiver,
        address composer,
        bytes32 guid,
        bytes32 messageHash,
        address caller
    );
    event LzComposeFailed(
        address sender,
        address receiver,
        bytes32 guid,
        bytes32 messageHash,
        address caller,
        bytes reason
    );

    function deliverComposedMessage(address _composer, bytes32 _guid, bytes calldata _message) external;

    function lzCompose(
        address _receiver,
        address _composer,
        bytes32 _guid,
        bytes calldata _message,
        bytes calldata _callerParams
    ) external payable returns (bool, bytes memory);

    function isComposingMessage() external view returns (bool);

    function getComposeContext() external view returns (address);
}
