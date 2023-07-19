// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.7.0;

interface IPacket {
    struct PacketForQuote {
        address sender;
        uint32 dstEid;
        bytes message;
    }

    struct Packet {
        uint64 nonce;
        uint32 srcEid;
        address sender;
        uint32 dstEid;
        bytes32 receiver;
        bytes32 guid;
        bytes message;
    }
}
