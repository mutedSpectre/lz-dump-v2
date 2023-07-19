"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseError = exports.sleep = void 0;
const ethers_1 = require("ethers");
async function sleep(timeout) {
    await new Promise((resolve) => setTimeout(resolve, timeout));
}
exports.sleep = sleep;
const parseError = (errorData, intf) => {
    const buildInError = parseBuildInError(errorData);
    if (buildInError !== undefined) {
        return buildInError;
    }
    if (intf) {
        try {
            return intf.parseError(errorData);
        }
        catch (e) {
            console.error(e);
        }
    }
};
exports.parseError = parseError;
function parseBuildInError(errorData) {
    if (errorData.startsWith('0x08c379a0')) {
        // decode Error(string)
        const content = `0x${errorData.substring(10)}`;
        const reason = ethers_1.ethers.utils.defaultAbiCoder.decode(['string'], content);
        return reason[0]; // reason: string; for standard revert error string
    }
    if (errorData.startsWith('0x4e487b71')) {
        // decode Panic(uint)
        const content = `0x${errorData.substring(10)}`;
        const code = ethers_1.ethers.utils.defaultAbiCoder.decode(['uint'], content);
        return code[0];
    }
    if (errorData === '0x') {
        return '';
    }
}
//# sourceMappingURL=utils.js.map