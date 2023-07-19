"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSolanaAddress = exports.addressToBytes32 = exports.trim0x = exports.bytes32ToEthAddress = exports.hexZeroPadTo32 = void 0;
const web3_js_1 = require("@solana/web3.js");
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
function hexZeroPadTo32(addr) {
    return ethers_1.ethers.utils.hexZeroPad(addr, 32);
}
exports.hexZeroPadTo32 = hexZeroPadTo32;
function bytes32ToEthAddress(bytes32) {
    if (bytes32 instanceof Uint8Array) {
        bytes32 = ethers_1.ethers.utils.hexlify(bytes32);
    }
    return ethers_1.ethers.utils.getAddress(bytes32.slice(-40));
}
exports.bytes32ToEthAddress = bytes32ToEthAddress;
function trim0x(str) {
    return str.replace(/^0x/, '');
}
exports.trim0x = trim0x;
/**
 * Convert address to bytes32
 * @param address 0x prefixed address(20bytes or 32bytes) or solana address
 */
function addressToBytes32(address) {
    if (isSolanaAddress(address)) {
        return new web3_js_1.PublicKey(address).toBytes();
    }
    else if (address.startsWith('0x') && address.length <= 66) {
        return (0, utils_1.arrayify)(hexZeroPadTo32(address));
    }
    throw new Error('Invalid address');
}
exports.addressToBytes32 = addressToBytes32;
const solanaAddressRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
function isSolanaAddress(address) {
    return solanaAddressRegex.test(address);
}
exports.isSolanaAddress = isSolanaAddress;
//# sourceMappingURL=hex.js.map