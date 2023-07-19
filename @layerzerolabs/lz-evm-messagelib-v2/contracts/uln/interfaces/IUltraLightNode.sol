// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "../../interfaces/IMessageLibBase.sol";

interface IUltraLightNode is IMessageLibBase {
    function verify(bytes calldata _packetHeader, bytes32 _payloadHash, uint64 _confirmations) external;

    function deliver(bytes calldata _packetHeader, bytes32 _payloadHash) external;

    function deliverable(bytes calldata _packetHeader, bytes32 _payloadHash) external view returns (DeliveryState);
}
