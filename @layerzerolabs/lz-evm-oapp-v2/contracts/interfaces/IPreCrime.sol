// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0;
pragma abicoder v2;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroReceiver.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageOrigin.sol";

interface IPreCrime is IMessageOrigin {
    struct Packet {
        MessageOrigin origin;
        bytes32 guid;
        bytes message;
        bytes callParams;
    }

    function getPrecrimeConfig(Packet[] calldata _packets) external view returns (bytes memory);

    function precrime(
        Packet[] calldata _packets,
        bytes[] calldata _simulation
    ) external view returns (uint16 code, bytes memory reason);

    function precrimeVersion() external view returns (uint16);

    function simulate(Packet[] calldata _packets) external payable returns (uint16 code, bytes memory result);

    function simulateView(Packet[] calldata _packets) external view returns (uint16 code, bytes memory result);
}