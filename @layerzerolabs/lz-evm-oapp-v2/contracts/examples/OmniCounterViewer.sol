// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./OmniCounter.sol";
import "../interfaces/IPreCrime.sol";

contract OmniCounterViewer {
    using MsgCodec for bytes;

    struct Count {
        uint32 eid;
        uint inboundCount;
        uint outboundCount;
    }

    OmniCounter public counter;

    constructor(address payable _omniCounter) {
        counter = OmniCounter(_omniCounter);
    }

    function getCounts(uint32[] calldata peerEids) public view returns (Count[] memory counts) {
        counts = new Count[](peerEids.length);
        for (uint i = 0; i < peerEids.length; i++) {
            uint32 eid = peerEids[i];
            counts[i] = Count(eid, counter.inboundCount(eid), counter.outboundCount(eid));
        }
    }

    function lzReceive(IPreCrime.Packet calldata packet, Count[] memory counts) public view returns (Count[] memory) {
        bool isTrustedRemote = counter.peers(packet.origin.srcEid) == packet.origin.sender;
        require(isTrustedRemote, "OmniCounterViewer: not trusted remote");

        // do receive logic
        uint index = _getCountStateIndex(counts, packet.origin.srcEid);
        uint8 messageType = packet.message.msgType();

        if (messageType == MsgCodec.VANILLA_TYPE) {
            counts[index].inboundCount++;
        } else if (messageType == MsgCodec.COMPOSED_TYPE || messageType == MsgCodec.COMPOSED_ABA_TYPE) {
            counts[index].inboundCount++;
        } else if (messageType == MsgCodec.ABA_TYPE) {
            counts[index].inboundCount++;
            counts[index].outboundCount++;
        } else {
            revert("invalid message type");
        }
        return counts;
    }

    function _getCountStateIndex(Count[] memory counts, uint32 eid) internal pure returns (uint) {
        for (uint i = 0; i < counts.length; i++) {
            if (counts[i].eid == eid) {
                return i;
            }
        }
        revert("not found");
    }
}
