/// <reference types="node" />
import { Packet, PacketHeader } from '../model';
export declare class PacketV1Codec {
    buffer: Buffer;
    static from(payloadEncoded: string): PacketV1Codec;
    static fromBytes(payload: Uint8Array): PacketV1Codec;
    protected constructor(payloadEncoded: string);
    /**
     * encode packet to hex string
     */
    static encode(packet: Packet): string;
    version(): number;
    nonce(): string;
    srcEid(): number;
    sender(): string;
    senderAddressB20(): string;
    dstEid(): number;
    receiver(): string;
    receiverAddressB20(): string;
    guid(): string;
    message(): string;
    payloadHash(): string;
    payload(): string;
    header(): string;
    headerHash(): string;
    /**
     * deserialize packet from hex string
     * @deprecated use toPacket instead
     */
    decode(): Packet;
    toPacket(): Packet;
}
export declare function calculateGuid(packetHead: PacketHeader): string;
export declare function keccak256(message: string): string;
//# sourceMappingURL=packet-v1-codec.d.ts.map