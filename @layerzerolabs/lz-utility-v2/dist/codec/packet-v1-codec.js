"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keccak256 = exports.calculateGuid = exports.PacketV1Codec = void 0;
// header (version + path + guid)
// version
const ethers_1 = require("ethers");
const utils_1 = require("../utils");
const PACKET_VERSION_OFFSET = 0;
//    nonce
const NONCE_OFFSET = 1;
//    path
const SRC_CHAIN_OFFSET = 9;
const SRC_ADDRESS_OFFSET = 13;
const DST_CHAIN_OFFSET = 45;
const DST_ADDRESS_OFFSET = 49;
// payload (guid + message)
const GUID_OFFSET = 81; // keccak256(nonce + path)
const MESSAGE_OFFSET = 113;
class PacketV1Codec {
    static from(payloadEncoded) {
        return new PacketV1Codec(payloadEncoded);
    }
    static fromBytes(payload) {
        return new PacketV1Codec('0x' + Buffer.from(payload).toString('hex'));
    }
    constructor(payloadEncoded) {
        this.buffer = Buffer.from((0, utils_1.trim0x)(payloadEncoded), 'hex');
    }
    /**
     * encode packet to hex string
     */
    static encode(packet) {
        const message = (0, utils_1.trim0x)(packet.message);
        const buffer = Buffer.alloc(MESSAGE_OFFSET + message.length / 2);
        buffer.writeUInt8(packet.version, PACKET_VERSION_OFFSET);
        buffer.writeBigUInt64BE(BigInt(packet.nonce), NONCE_OFFSET);
        buffer.writeUInt32BE(packet.srcEid, SRC_CHAIN_OFFSET);
        buffer.write((0, utils_1.trim0x)(packet.sender), SRC_ADDRESS_OFFSET, 32, 'hex');
        buffer.writeUInt32BE(packet.dstEid, DST_CHAIN_OFFSET);
        buffer.write((0, utils_1.trim0x)(packet.receiver), DST_ADDRESS_OFFSET, 32, 'hex');
        buffer.write((0, utils_1.trim0x)(packet.guid), GUID_OFFSET, 32, 'hex');
        buffer.write(message, MESSAGE_OFFSET, message.length / 2, 'hex');
        return '0x' + buffer.toString('hex');
    }
    version() {
        return this.buffer.readUInt8(PACKET_VERSION_OFFSET);
    }
    nonce() {
        return this.buffer.readBigUint64BE(NONCE_OFFSET).toString();
    }
    srcEid() {
        return this.buffer.readUint32BE(SRC_CHAIN_OFFSET);
    }
    sender() {
        return '0x' + this.buffer.slice(SRC_ADDRESS_OFFSET, DST_CHAIN_OFFSET).toString('hex');
    }
    senderAddressB20() {
        return (0, utils_1.bytes32ToEthAddress)(this.sender());
    }
    dstEid() {
        return this.buffer.readUint32BE(DST_CHAIN_OFFSET);
    }
    receiver() {
        return '0x' + this.buffer.slice(DST_ADDRESS_OFFSET, GUID_OFFSET).toString('hex');
    }
    receiverAddressB20() {
        return (0, utils_1.bytes32ToEthAddress)(this.receiver());
    }
    guid() {
        return '0x' + this.buffer.slice(GUID_OFFSET, MESSAGE_OFFSET).toString('hex');
    }
    message() {
        return '0x' + this.buffer.slice(MESSAGE_OFFSET).toString('hex');
    }
    payloadHash() {
        return keccak256(this.payload());
    }
    payload() {
        return '0x' + this.buffer.slice(GUID_OFFSET).toString('hex');
    }
    header() {
        return '0x' + this.buffer.slice(0, GUID_OFFSET).toString('hex');
    }
    headerHash() {
        return keccak256(this.header());
    }
    /**
     * deserialize packet from hex string
     * @deprecated use toPacket instead
     */
    decode() {
        return this.toPacket();
    }
    toPacket() {
        return {
            version: this.version(),
            nonce: this.nonce(),
            srcEid: this.srcEid(),
            sender: this.sender(),
            dstEid: this.dstEid(),
            receiver: this.receiver(),
            guid: this.guid(),
            message: this.message(),
            // derived
            payload: this.payload(),
        };
    }
}
exports.PacketV1Codec = PacketV1Codec;
function calculateGuid(packetHead) {
    return keccak256(ethers_1.ethers.utils.solidityPack(['uint64', 'uint32', 'bytes32', 'uint32', 'bytes32'], [
        ethers_1.ethers.BigNumber.from(packetHead.nonce),
        packetHead.srcEid,
        (0, utils_1.addressToBytes32)(packetHead.sender),
        packetHead.dstEid,
        (0, utils_1.addressToBytes32)(packetHead.receiver),
    ]));
}
exports.calculateGuid = calculateGuid;
function keccak256(message) {
    return ethers_1.ethers.utils.keccak256(message);
}
exports.keccak256 = keccak256;
//# sourceMappingURL=packet-v1-codec.js.map