// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLibManager.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroReceiver.sol";
import "./IPreCrime.sol";

interface IOApp is ILayerZeroReceiver {
    function setEndpointConfig(bytes calldata _config) external;

    function nextNonce(uint32 _srcEid, bytes32 _sender) external view returns (uint64);

    function version() external view returns (uint);

    function lzReceiveAndRevert(IPreCrime.Packet[] calldata _packets) external payable;

    error EndpointOnly(address addr);
    error PreCrimeOnly(address addr);
    error InvalidPeer(bytes32 addr);
    error InvalidPeerState();
    error NoPeerSet(uint32 eid);

    event SetPeer(uint32 remoteEid, bytes32 peer, bool active);
    event SetPrecrime(address precrime);
}
