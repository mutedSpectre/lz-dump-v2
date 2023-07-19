// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../PreCrimeView.sol";
import "./OmniCounterViewer.sol";

contract OmniCounterPreCrimeView is PreCrimeView, Ownable {
    OmniCounterViewer public viewer;

    struct SimulationResult {
        uint32 eid;
        OmniCounterViewer.Count[] counts;
    }

    constructor(address _endpoint, address _viewer) PreCrimeView(_endpoint) {
        viewer = OmniCounterViewer(_viewer);
    }

    function _simulate(Packet[] calldata _packets) internal view override returns (uint16 code, bytes memory result) {
        OmniCounterViewer.Count[] memory counts = viewer.getCounts(precrimeEids);

        for (uint i = 0; i < _packets.length; i++) {
            Packet memory packet = _packets[i];
            counts = viewer.lzReceive(packet, counts);
        }

        return (CODE_SUCCESS, abi.encode(SimulationResult(localEid, counts)));
    }

    function _receiver() internal view override returns (address) {
        return address(viewer.counter());
    }

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

    function _findCounts(SimulationResult memory _result, uint32 _eid) internal pure returns (uint, uint) {
        for (uint i = 0; i < _result.counts.length; i++) {
            if (_result.counts[i].eid == _eid) {
                return (_result.counts[i].inboundCount, _result.counts[i].outboundCount);
            }
        }
        return (0, 0);
    }

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
}
