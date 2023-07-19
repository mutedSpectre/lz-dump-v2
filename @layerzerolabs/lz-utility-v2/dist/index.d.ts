import { ethers, Contract, PopulatedTransaction, BigNumberish, BytesLike } from 'ethers';
import { IMessageLibManager } from '@layerzerolabs/lz-evm-sdk-v2';
import { IMessageOrigin } from '@layerzerolabs/lz-evm-sdk-v2/chaintypes/EndpointV2';
import { PromiseOrValue } from '@layerzerolabs/lz-evm-sdk-v2/chaintypes/common';

declare function sleep(timeout: number): Promise<void>;
declare const parseError: (errorData: string, intf?: ethers.utils.Interface) => ReturnType<ethers.utils.Interface['parseError']> | string | undefined;

declare function hexZeroPadTo32(addr: string): string;
declare function bytes32ToEthAddress(bytes32: string | Uint8Array): string;
declare function trim0x(str: string): string;
/**
 * Convert address to bytes32
 * @param address 0x prefixed address(20bytes or 32bytes) or solana address
 */
declare function addressToBytes32(address: string): Uint8Array;
declare function isSolanaAddress(address: string): boolean;

type PacketPath = {
    srcEid: number;
    sender: string;
    dstEid: number;
    receiver: string;
};
type PacketHeader = {
    version: number;
    nonce: string;
} & PacketPath;
type Packet = PacketHeader & {
    guid: string;
    message: string;
    payload: string;
};
type MessageOrigin = {
    srcEid: number;
    sender: string;
    nonce: string;
};
declare class PacketSerializer {
    static serialize(packet: Packet): string;
    static deserialize(bytesLike: Uint8Array | string): Packet;
}
declare function packetToMessageOrigin(packet: Packet): MessageOrigin;

type PrecrimeConfigV1 = {
    version: number;
    maxBatchSize: number;
    remoteEids: number[];
    remoteAddresses: string[];
};
type PrecrimeConfig = PrecrimeConfigV1;
type PrecrimePacket = {
    origin: MessageOrigin;
    guid: string;
    message: string;
    callParams: string;
};

declare function parsePrecrimeConfig(precrimeConfig: string): PrecrimeConfig;

declare function optionsType1(_extraGas: number | string): string;
declare function optionsType2(_extraGas: number | string, _dstNativeAmt: number | string, _dstNativeAddress: string): string;
declare enum WorkerId {
    Executor = 1,
    Verifier = 2,
    Treasury = 255
}
type WorkerOptions = {
    workerId: number;
    options: Option[];
};
type Option = {
    type: number;
    params: string;
};
type VerifierOption = Option & {
    index: number;
};
declare enum ExecutorOptionType {
    lzReceive = 1,
    airdrop = 2,
    compose = 3,
    ordered = 4
}
declare enum VerifierOptionType {
    precrime = 1
}
/**
 * only available for V2
 * options builder
 */
declare class Options {
    workerOptions: WorkerOptions[];
    static newOptions(): Options;
    static fromOptions(optionsHex: string): Options;
    addExecutorLzReceiveOption(gas: string | number, value?: string | number): Options;
    addExecutorAirdropOption(amount: string | number, receiver: string): Options;
    addExecutorComposeOption(gas: string | number, value?: string | number): Options;
    addExecutorOrderedExecutionOption(): Options;
    addVerifierPrecrimeOption(verifierIdx: number): Options;
    toHex(): string;
    toBytes(): Uint8Array;
    private addOption;
    decodeExecutorLzReceiveOption(): {
        gas: ethers.BigNumber;
        value: ethers.BigNumber;
    } | undefined;
    decodeExecutorAirdropOption(): {
        amount: ethers.BigNumber;
        receiver: string;
    } | undefined;
    decodeExecutorComposeOption(): {
        gas: ethers.BigNumber;
        value: ethers.BigNumber;
    } | undefined;
    decodeExecutorOrderedExecutionOption(): boolean;
    private findOption;
    findVerifierOption(verifierIdx: number, optionType: number): VerifierOption | undefined;
}

declare class PacketV1Codec {
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
declare function calculateGuid(packetHead: PacketHeader): string;
declare function keccak256(message: string): string;

declare function populateSetEndpointConfig(oapp: Contract, configPayload: string): Promise<PopulatedTransaction>;
declare function populateSnapshotConfig(oapp: Contract, messageLib: PromiseOrValue<string>, eids: PromiseOrValue<BigNumberish>[]): Promise<PopulatedTransaction>;
declare function populateSetConfig(oapp: Contract, lib: PromiseOrValue<string>, eid: PromiseOrValue<BigNumberish>, params: IMessageLibManager.SetConfigParamStruct[]): Promise<PopulatedTransaction>;
declare function populateSetSendMessageLib(oapp: Contract, eid: PromiseOrValue<BigNumberish>, newLib: PromiseOrValue<string>): Promise<PopulatedTransaction>;
declare function populateResetConfig(oapp: Contract, lib: PromiseOrValue<string>, eids: PromiseOrValue<BigNumberish>[]): Promise<PopulatedTransaction>;
declare function populateSetReceiveLibrary(oapp: Contract, eid: PromiseOrValue<BigNumberish>, newLib: PromiseOrValue<string>, gracePeriod: PromiseOrValue<BigNumberish>): Promise<PopulatedTransaction>;
declare function populateSetReceiveLibraryTimeout(oapp: Contract, eid: PromiseOrValue<BigNumberish>, lib: PromiseOrValue<string>, expiry: PromiseOrValue<BigNumberish>): Promise<PopulatedTransaction>;
declare function populateClear(oapp: Contract, origin: IMessageOrigin.MessageOriginStruct, guid: PromiseOrValue<BytesLike>, message: PromiseOrValue<BytesLike>): Promise<PopulatedTransaction>;
declare function populateSkip(oapp: Contract, srcEid: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>): Promise<PopulatedTransaction>;

export { ExecutorOptionType, MessageOrigin, Option, Options, Packet, PacketHeader, PacketPath, PacketSerializer, PacketV1Codec, PrecrimeConfig, PrecrimeConfigV1, PrecrimePacket, VerifierOption, VerifierOptionType, WorkerId, WorkerOptions, addressToBytes32, bytes32ToEthAddress, calculateGuid, hexZeroPadTo32, isSolanaAddress, keccak256, optionsType1, optionsType2, packetToMessageOrigin, parseError, parsePrecrimeConfig, populateClear, populateResetConfig, populateSetConfig, populateSetEndpointConfig, populateSetReceiveLibrary, populateSetReceiveLibraryTimeout, populateSetSendMessageLib, populateSkip, populateSnapshotConfig, sleep, trim0x };
