export type PacketPath = {
    srcEid: number;
    sender: string;
    dstEid: number;
    receiver: string;
};
export type PacketHeader = {
    version: number;
    nonce: string;
} & PacketPath;
export type Packet = PacketHeader & {
    guid: string;
    message: string;
    payload: string;
};
export type MessageOrigin = {
    srcEid: number;
    sender: string;
    nonce: string;
};
export declare class PacketSerializer {
    static serialize(packet: Packet): string;
    static deserialize(bytesLike: Uint8Array | string): Packet;
}
export declare function packetToMessageOrigin(packet: Packet): MessageOrigin;
//# sourceMappingURL=packet.d.ts.map