// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../PreCrime.sol";
import "./OmniCounter.sol";

abstract contract OmniCounterPrecrime is PreCrime {
    constructor(address _endpoint) PreCrime(_endpoint) {}

    struct Count {
        uint32 eid;
        uint inboundCount;
        uint outboundCount;
    }

    struct SimulationResult {
        uint32 eid;
        Count[] counts;
    }

    // -------------------------------
    // Internal
    function _findCounts(SimulationResult memory _result, uint32 _eid) internal pure returns (uint, uint) {
        for (uint i = 0; i < _result.counts.length; i++) {
            if (_result.counts[i].eid == _eid) {
                return (_result.counts[i].inboundCount, _result.counts[i].outboundCount);
            }
        }
        return (0, 0);
    }

    // -------------------------------
    // Precrime
    function _receiver() internal view override returns (address) {
        return address(this);
    }

    // outboundCount >= inboundCount
    function _precrime(bytes[] memory _simulation) internal view override returns (uint16 code, bytes memory reason) {
        SimulationResult memory localResult;
        // decode results
        SimulationResult[] memory results = new SimulationResult[](_simulation.length);
        for (uint i = 0; i < _simulation.length; i++) {
            results[i] = abi.decode(_simulation[i], (SimulationResult));

            if (results[i].eid == localEid) {
                localResult = results[i];
            }
        }

        // check results
        for (uint i = 0; i < results.length; i++) {
            (uint _inboundCount, ) = _findCounts(localResult, results[i].eid);
            (, uint _outboundCount) = _findCounts(results[i], localEid);

            if (_inboundCount > _outboundCount) {
                return (CODE_PRECRIME_FAILURE, "OmniCounterPrecrime: inboundCount > outboundCount");
            }
        }
        return (CODE_SUCCESS, "");
    }

    function _simulate(Packet[] calldata _packets) internal override returns (uint16, bytes memory) {
        for (uint i = 0; i < _packets.length; i++) {
            _lzReceiveByPacket(_packets[i]);
        }

        Count[] memory counts = new Count[](precrimeEids.length);
        for (uint i = 0; i < precrimeEids.length; i++) {
            uint32 remoteEid = precrimeEids[i];
            counts[i] = Count(remoteEid, _getInboundCount(remoteEid), _getOutboundCount(remoteEid));
        }
        return (CODE_SUCCESS, abi.encode(SimulationResult(localEid, counts)));
    }

    //    // temporary function to get simulation
    //    function simulateNow(Packet[] calldata _packets) public returns (bytes memory) {
    //        (uint16 code, bytes memory data) = _simulate(_packets);
    //        return abi.encode(localEid, data);
    //    }

    function _getPrecrimePeers(
        Packet[] calldata _packets
    ) internal view override returns (uint32[] memory, bytes32[] memory) {
        if (_packets.length == 0) {
            return (precrimeEids, precrimePeers);
        }

        // only return related peers
        return _filterByPackets(_packets);
    }

    function _filterByPackets(
        Packet[] calldata _packets
    ) internal view returns (uint32[] memory eids, bytes32[] memory peers) {
        uint16 size;
        for (uint i = 0; i < _packets.length; i++) {
            if (precrimeEidToPeer[_packets[i].origin.srcEid] != bytes32(0x0)) {
                size++;
            }
        }

        eids = new uint32[](size);
        peers = new bytes32[](size);
        for (uint i = 0; i < _packets.length; i++) {
            bytes32 peer = precrimeEidToPeer[_packets[i].origin.srcEid];
            if (peer != bytes32(0x0)) {
                eids[i] = _packets[i].origin.srcEid;
                peers[i] = peer;
            }
        }
        return (eids, peers);
    }

    function _lzReceiveByPacket(Packet calldata _packet) internal virtual;

    function _getInboundCount(uint32 _eid) internal view virtual returns (uint);

    function _getOutboundCount(uint32 _eid) internal view virtual returns (uint);
}

contract OmniCounterWithPrecrime is OmniCounter, OmniCounterPrecrime {
    constructor(address _endpoint) OmniCounter(_endpoint) OmniCounterPrecrime(_endpoint) {}

    // -------------------------------
    // Precrime

    function _lzReceiveByPacket(Packet calldata _packet) internal override {
        bool isTrustedRemote = peers[_packet.origin.srcEid] == _packet.origin.sender;
        if (isTrustedRemote) {
            _lzReceive(_packet.origin, _packet.guid, _packet.message, msg.sender, _packet.callParams);
        }
    }

    function _getInboundCount(uint32 _eid) internal view override returns (uint) {
        return inboundCount[_eid];
    }

    function _getOutboundCount(uint32 _eid) internal view override returns (uint) {
        return outboundCount[_eid];
    }
}
