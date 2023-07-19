// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "../../interfaces/IPacket.sol";

library PacketV1Codec {
    // header (version + nonce + path)
    // version
    uint private constant PACKET_VERSION_OFFSET = 0;
    //    nonce
    uint private constant NONCE_OFFSET = 1;
    //    path
    uint private constant SRC_EID_OFFSET = 9;
    uint private constant SENDER_OFFSET = 13;
    uint private constant DST_EID_OFFSET = 45;
    uint private constant RECEIVER_OFFSET = 49;
    // payload (guid + message)
    uint private constant GUID_OFFSET = 81; // keccak256(nonce + path)
    uint private constant MESSAGE_OFFSET = 113;

    function encode(
        uint8 _version,
        IPacket.Packet calldata _packet
    ) internal pure returns (bytes memory encodedPacket) {
        encodedPacket = abi.encodePacked(
            _version,
            _packet.nonce,
            _packet.srcEid,
            addressToBytes32(_packet.sender),
            _packet.dstEid,
            _packet.receiver,
            _packet.guid,
            _packet.message
        );
    }

    function encode2(uint8 _version, IPacket.Packet memory _packet) internal pure returns (bytes memory encodedPacket) {
        encodedPacket = abi.encodePacked(
            _version,
            _packet.nonce,
            _packet.srcEid,
            addressToBytes32(_packet.sender),
            _packet.dstEid,
            _packet.receiver,
            _packet.guid,
            _packet.message
        );
    }

    function header(bytes calldata _packet) internal pure returns (bytes memory) {
        return _packet[0:GUID_OFFSET];
    }

    function version(bytes calldata _packet) internal pure returns (uint8) {
        return uint8(bytes1(_packet[PACKET_VERSION_OFFSET:NONCE_OFFSET]));
    }

    function nonce(bytes calldata _packet) internal pure returns (uint64) {
        return uint64(bytes8(_packet[NONCE_OFFSET:SRC_EID_OFFSET]));
    }

    function srcEid(bytes calldata _packet) internal pure returns (uint32) {
        return uint32(bytes4(_packet[SRC_EID_OFFSET:SENDER_OFFSET]));
    }

    function sender(bytes calldata _packet) internal pure returns (bytes32) {
        return bytes32(_packet[SENDER_OFFSET:DST_EID_OFFSET]);
    }

    function senderAddressB20(bytes calldata _packet) internal pure returns (address) {
        return bytes32ToAddress(sender(_packet));
    }

    function dstEid(bytes calldata _packet) internal pure returns (uint32) {
        return uint32(bytes4(_packet[DST_EID_OFFSET:RECEIVER_OFFSET]));
    }

    function receiver(bytes calldata _packet) internal pure returns (bytes32) {
        return bytes32(_packet[RECEIVER_OFFSET:GUID_OFFSET]);
    }

    function receiverB20(bytes calldata _packet) internal pure returns (address) {
        return bytes32ToAddress(receiver(_packet));
    }

    function guid(bytes calldata _packet) internal pure returns (bytes32) {
        return bytes32(_packet[GUID_OFFSET:MESSAGE_OFFSET]);
    }

    function message(bytes calldata _packet) internal pure returns (bytes calldata) {
        return bytes(_packet[MESSAGE_OFFSET:]);
    }

    function payload(bytes calldata _packet) internal pure returns (bytes calldata) {
        return bytes(_packet[GUID_OFFSET:]);
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _b) internal pure returns (address) {
        return address(uint160(uint(_b)));
    }
}
