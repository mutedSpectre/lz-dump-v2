// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface IUltraLightNode {
    enum DeliveryState {
        Signing,
        Deliverable,
        Delivered,
        Waiting
    }

    function oracleSign(bytes calldata _packetHeader, bytes32 _payloadHash, uint64 _confirmations) external;

    function deliver(bytes calldata _packetHeader, bytes32 _payloadHash) external;

    function deliver(bytes calldata _packet, uint _gasLimit) external;

    function deliverable(bytes calldata _packetHeader, bytes32 _payloadHash) external view returns (DeliveryState);

    function deliverable(bytes calldata _packet) external view returns (DeliveryState);
}
