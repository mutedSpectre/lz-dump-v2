"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePrecrimeConfig = void 0;
const hex_1 = require("./hex");
function parsePrecrimeConfig(precrimeConfig) {
    const data = (0, hex_1.trim0x)(precrimeConfig);
    const version = parseInt(data.slice(0, 4), 16);
    const maxBatchSize = parseInt(data.slice(4, 20), 16);
    const remoteChainsLength = parseInt(data.slice(20, 84), 16);
    const remoteChainsBytes = data.slice(84, 84 + remoteChainsLength * 64);
    const remoteAddressesBytes = data.slice(84 + remoteChainsLength * 64, 84 + remoteChainsLength * 64 + remoteChainsLength * 64);
    const remoteChainsBytesArray = [];
    const remoteAddressesBytesArray = [];
    let start = 0;
    let end = 64;
    for (let i = 0; i < remoteChainsLength; i++) {
        remoteChainsBytesArray.push(parseInt(remoteChainsBytes.slice(start, end), 16));
        remoteAddressesBytesArray.push(`0x${remoteAddressesBytes.slice(start, end)}`);
        start += 64;
        end += 64;
    }
    return { version, maxBatchSize, remoteEids: remoteChainsBytesArray, remoteAddresses: remoteAddressesBytesArray };
}
exports.parsePrecrimeConfig = parsePrecrimeConfig;
//# sourceMappingURL=precrime.js.map