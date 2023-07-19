// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Remote manages the remote UAs on other chains. There is a single remote UA per chain.
/// If several remote contracts need to be called, they can be called from a single remote UA,
abstract contract Peer is Ownable {
    mapping(uint32 eid => bytes32 peer) public peers;

    event SetPeer(uint32 eid, bytes32 peer, bool active);

    function setPeer(uint32 _eid, bytes32 _peer, bool _active) public virtual onlyOwner {
        bool currentlyActive = peers[_eid] != bytes32(0);
        require(currentlyActive != _active, "Peer: invalid state");
        peers[_eid] = _peer;
        emit SetPeer(_eid, _peer, _active);
    }

    // override this function for lzReceive/burn if app has multiple peers
    function assertPeer(uint32 _eid, bytes32 _peer) public view virtual {
        require(isPeer(_eid, _peer), "Peer: invalid peer");
    }

    function isPeer(uint32 _eid, bytes32 _peer) public view virtual returns (bool) {
        return peers[_eid] == _peer;
    }

    function safeGetPeer(uint32 _eid) public view virtual returns (bytes32 peer) {
        peer = peers[_eid];
        require(peer != bytes32(0), "Peer: peer not found");
    }
}
