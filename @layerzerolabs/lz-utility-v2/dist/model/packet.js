"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packetToMessageOrigin = exports.PacketSerializer = void 0;
const codec_1 = require("../codec");
class PacketSerializer {
    static serialize(packet) {
        return codec_1.PacketV1Codec.encode(packet);
    }
    static deserialize(bytesLike) {
        let codec;
        if (bytesLike instanceof Uint8Array) {
            codec = codec_1.PacketV1Codec.fromBytes(bytesLike);
        }
        else {
            codec = codec_1.PacketV1Codec.from(bytesLike);
        }
        return codec.toPacket();
    }
}
exports.PacketSerializer = PacketSerializer;
function packetToMessageOrigin(packet) {
    return {
        srcEid: packet.srcEid,
        sender: packet.sender,
        nonce: packet.nonce,
    };
}
exports.packetToMessageOrigin = packetToMessageOrigin;
//# sourceMappingURL=packet.js.map