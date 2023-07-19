export declare function hexZeroPadTo32(addr: string): string;
export declare function bytes32ToEthAddress(bytes32: string | Uint8Array): string;
export declare function trim0x(str: string): string;
/**
 * Convert address to bytes32
 * @param address 0x prefixed address(20bytes or 32bytes) or solana address
 */
export declare function addressToBytes32(address: string): Uint8Array;
export declare function isSolanaAddress(address: string): boolean;
//# sourceMappingURL=hex.d.ts.map