// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../interfaces/IOApp.sol";
import "../PreCrime.sol";
import "./OmniCounter.sol";

contract OmniCounterPreCrime is PreCrime {
    OmniCounter counter;

    constructor(address _endpoint, address payable _counter) PreCrime(_endpoint) {
        counter = OmniCounter(_counter);
    }

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
        return address(counter);
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
                return (CODE_PRECRIME_FAILURE, "OmniCounterPreCrime: inboundCount > outboundCount");
            }
        }
        return (CODE_SUCCESS, "");
    }

    function simulationCallback() external view override returns (bytes memory) {
        Count[] memory counts = new Count[](precrimeEids.length);
        for (uint i = 0; i < precrimeEids.length; i++) {
            uint32 remoteEid = precrimeEids[i];
            counts[i] = Count(remoteEid, counter.inboundCount(remoteEid), counter.outboundCount(remoteEid));
        }
        return abi.encode(SimulationResult(localEid, counts));
    }

    function _simulate(Packet[] calldata _packets) internal override returns (uint16, bytes memory) {
        (bool success, bytes memory result) = address(counter).call{value: msg.value}(
            abi.encodeWithSelector(IOApp.lzReceiveAndRevert.selector, _packets)
        );
        require(!success, "OmniCounterPreCrime: simulationCallback should be called via revert");

        (, result) = _parseRevertResult(result, LzReceiveRevert.selector);
        return (CODE_SUCCESS, result);
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
            // TODO we have access to origin.srcAddress, why not check this against the stored 'precrimeEidToPeer'?
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
