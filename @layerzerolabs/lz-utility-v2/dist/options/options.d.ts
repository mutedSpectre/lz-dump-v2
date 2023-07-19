import { ethers } from 'ethers';
export declare function optionsType1(_extraGas: number | string): string;
export declare function optionsType2(_extraGas: number | string, _dstNativeAmt: number | string, _dstNativeAddress: string): string;
export declare enum WorkerId {
    Relayer = 1,
    Oracle = 2
}
export type WorkerOptions = {
    workerId: number;
    options: Option[];
};
export type Option = {
    type: number;
    params: string;
};
export declare enum RelayerOptionType {
    lzReceive = 1,
    airdrop = 2,
    compose = 3,
    ordered = 4
}
/**
 * only available for V2
 * options builder
 */
export declare class Options {
    workerOptions: WorkerOptions[];
    static newOptions(): Options;
    static fromOptions(optionsHex: string): Options;
    addRelayerLzReceiveOption(gas: string | number, value?: string | number): Options;
    addRelayerAirdropOption(amount: string | number, receiver: string): Options;
    addRelayerComposeOption(gas: string | number, value?: string | number): Options;
    addRelayerOrderedExecutionOption(): Options;
    toHex(): string;
    toBytes(): Uint8Array;
    private encodeOptionList;
    private addOption;
    decodeRelayerLzReceiveOption(): {
        gas: ethers.BigNumber;
        value: ethers.BigNumber;
    } | undefined;
    decodeRelayerAirdropOption(): {
        amount: ethers.BigNumber;
        receiver: string;
    } | undefined;
    decodeRelayerComposeOption(): {
        gas: ethers.BigNumber;
        value: ethers.BigNumber;
    } | undefined;
    relayerOptionExists(): boolean;
    private findOption;
}
//# sourceMappingURL=options.d.ts.map