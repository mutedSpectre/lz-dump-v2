"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = exports.RelayerOptionType = exports.WorkerId = exports.optionsType2 = exports.optionsType1 = void 0;
const ethers_1 = require("ethers");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const utils_1 = require("../utils");
/**
 *  txType 1
 *  bytes  [2       32      ]
 *  fields [txType  extraGas]
 */
const TYPE_1 = 1;
/**
 *  txType 2
 *  bytes  [2       32        32            bytes[]         ]
 *  fields [txType  extraGas  dstNativeAmt  dstNativeAddress]
 */
const TYPE_2 = 2;
/**
 * only available for V2
 * [type3][numWorkers][workerOps][workerOps]...
 * [workerOps] -> [workerId][size][options]
 */
const TYPE_3 = 3;
const MaxUint128 = ethers_1.ethers.BigNumber.from('0xffffffffffffffffffffffffffffffff');
function optionsType1(_extraGas) {
    const extraGas = ethers_1.ethers.BigNumber.from(_extraGas);
    (0, tiny_invariant_1.default)(extraGas.lte(MaxUint128), 'extraGas should be less than MaxUint128');
    return ethers_1.ethers.utils.solidityPack(['uint16', 'uint256'], [TYPE_1, extraGas]);
}
exports.optionsType1 = optionsType1;
function optionsType2(_extraGas, _dstNativeAmt, _dstNativeAddress) {
    const extraGas = ethers_1.ethers.BigNumber.from(_extraGas);
    (0, tiny_invariant_1.default)(extraGas.lte(MaxUint128), 'extraGas should be less than MaxUint128');
    const dstNativeAmt = ethers_1.ethers.BigNumber.from(_dstNativeAmt);
    (0, tiny_invariant_1.default)(dstNativeAmt.lte(MaxUint128), 'dstNativeAmt should be less than MaxUint128');
    return ethers_1.ethers.utils.solidityPack(['uint16', 'uint256', 'uint256', 'bytes'], [TYPE_2, ethers_1.ethers.BigNumber.from(extraGas), ethers_1.ethers.BigNumber.from(dstNativeAmt), _dstNativeAddress]);
}
exports.optionsType2 = optionsType2;
var WorkerId;
(function (WorkerId) {
    WorkerId[WorkerId["Relayer"] = 1] = "Relayer";
    WorkerId[WorkerId["Oracle"] = 2] = "Oracle";
})(WorkerId = exports.WorkerId || (exports.WorkerId = {}));
var RelayerOptionType;
(function (RelayerOptionType) {
    RelayerOptionType[RelayerOptionType["lzReceive"] = 1] = "lzReceive";
    RelayerOptionType[RelayerOptionType["airdrop"] = 2] = "airdrop";
    RelayerOptionType[RelayerOptionType["compose"] = 3] = "compose";
    RelayerOptionType[RelayerOptionType["ordered"] = 4] = "ordered";
})(RelayerOptionType = exports.RelayerOptionType || (exports.RelayerOptionType = {}));
/**
 * only available for V2
 * options builder
 */
class Options {
    constructor() {
        this.workerOptions = [];
    }
    static newOptions() {
        return new Options();
    }
    static fromOptions(optionsHex) {
        const options = new Options();
        const optionsBytes = ethers_1.ethers.utils.arrayify(optionsHex);
        // 0-2 bytes is options type
        const optionsType = ethers_1.ethers.BigNumber.from(optionsBytes.slice(0, 2)).toNumber();
        if (optionsType === TYPE_3) {
            const workerCount = ethers_1.ethers.BigNumber.from(optionsBytes.slice(2, 4)).toNumber();
            let offset = 4;
            for (let i = 0; i < workerCount; i++) {
                const workerId = ethers_1.ethers.BigNumber.from(optionsBytes.slice(offset, offset + 2)).toNumber();
                offset += 2;
                const optionBytesSize = ethers_1.ethers.BigNumber.from(optionsBytes.slice(offset, offset + 2)).toNumber();
                offset += 2;
                const optionBytes = optionsBytes.slice(offset, offset + optionBytesSize);
                // parse options bytes
                // const optionNums = ethers.BigNumber.from(optionBytes.slice(0, 2)).toNumber()
                let optionOffset = 2; // 0-2 bytes is options nums
                while (optionOffset < optionBytesSize) {
                    const optionType = ethers_1.ethers.BigNumber.from(optionBytes.slice(optionOffset, optionOffset + 2)).toNumber();
                    optionOffset += 2;
                    const optionParamsSize = ethers_1.ethers.BigNumber.from(optionBytes.slice(optionOffset, optionOffset + 2)).toNumber();
                    optionOffset += 2;
                    const optionParams = optionBytes.slice(optionOffset, optionOffset + optionParamsSize);
                    optionOffset += optionParamsSize;
                    options.addOption(workerId, {
                        type: optionType,
                        params: ethers_1.ethers.utils.hexlify(optionParams),
                    });
                }
            }
        }
        else if (optionsType === TYPE_2) {
            const extraGas = ethers_1.ethers.BigNumber.from(optionsBytes.slice(2, 34)).toNumber();
            const dstNativeAmt = ethers_1.ethers.BigNumber.from(optionsBytes.slice(34, 66)).toNumber();
            const dstNativeAddress = ethers_1.ethers.utils.hexlify(optionsBytes.slice(66, optionsBytes.byteLength));
            options.addRelayerLzReceiveOption(extraGas).addRelayerAirdropOption(dstNativeAmt, dstNativeAddress);
        }
        else if (optionsType === TYPE_1) {
            const extraGas = ethers_1.ethers.BigNumber.from(optionsBytes.slice(2, 34)).toNumber();
            options.addRelayerLzReceiveOption(extraGas);
        }
        return options;
    }
    addRelayerLzReceiveOption(gas, value = 0) {
        const gasBN = ethers_1.ethers.BigNumber.from(gas);
        (0, tiny_invariant_1.default)(gasBN.lte(MaxUint128), "gas shouldn't be greater than MaxUint128");
        const valueBN = ethers_1.ethers.BigNumber.from(value);
        (0, tiny_invariant_1.default)(valueBN.lte(MaxUint128), "value shouldn't be greater than MaxUint128");
        this.addOption(WorkerId.Relayer, {
            type: RelayerOptionType.lzReceive,
            params: valueBN.eq(0)
                ? ethers_1.ethers.utils.solidityPack(['uint128'], [gasBN])
                : ethers_1.ethers.utils.solidityPack(['uint128', 'uint128'], [gasBN, valueBN]),
        });
        return this;
    }
    addRelayerAirdropOption(amount, receiver) {
        const amountBN = ethers_1.ethers.BigNumber.from(amount);
        (0, tiny_invariant_1.default)(amountBN.lte(MaxUint128), "amount shouldn't be greater than MaxUint128");
        this.addOption(WorkerId.Relayer, {
            type: RelayerOptionType.airdrop,
            params: ethers_1.ethers.utils.solidityPack(['uint128', 'bytes32'], [amountBN, (0, utils_1.hexZeroPadTo32)(receiver)]),
        });
        return this;
    }
    addRelayerComposeOption(gas, value = 0) {
        const gasBN = ethers_1.ethers.BigNumber.from(gas);
        (0, tiny_invariant_1.default)(gasBN.lte(MaxUint128), "gas shouldn't be greater than MaxUint128");
        const valueBN = ethers_1.ethers.BigNumber.from(value);
        (0, tiny_invariant_1.default)(valueBN.lte(MaxUint128), "value shouldn't be greater than MaxUint128");
        this.addOption(WorkerId.Relayer, {
            type: RelayerOptionType.compose,
            params: ethers_1.ethers.utils.solidityPack(['uint128', 'uint128'], [gasBN, valueBN]),
        });
        return this;
    }
    addRelayerOrderedExecutionOption() {
        this.addOption(WorkerId.Relayer, {
            type: RelayerOptionType.ordered,
            params: '0x',
        });
        return this;
    }
    toHex() {
        // sort this.workerOptions by workerId ASC
        this.workerOptions = this.workerOptions.sort((a, b) => a.workerId - b.workerId);
        // sort each workerOptions.options by type ASC
        this.workerOptions.forEach((w) => {
            w.options = w.options.sort((a, b) => a.type - b.type);
        });
        // output encoded hex
        let hex = ethers_1.ethers.utils.solidityPack(['uint16', 'uint16'], [TYPE_3, this.workerOptions.length]);
        this.workerOptions.forEach((w) => {
            const workerOptions = this.encodeOptionList(w.options);
            hex += (0, utils_1.trim0x)(ethers_1.ethers.utils.solidityPack(['uint16', 'uint16', 'bytes'], [w.workerId, (0, utils_1.trim0x)(workerOptions).length / 2, workerOptions]));
        });
        return hex;
    }
    toBytes() {
        return ethers_1.ethers.utils.arrayify(this.toHex());
    }
    encodeOptionList(optionList) {
        let hex = ethers_1.ethers.utils.solidityPack(['uint16'], [optionList.length]);
        optionList.forEach((o) => {
            hex += (0, utils_1.trim0x)(ethers_1.ethers.utils.solidityPack(['uint16', 'uint16', 'bytes'], [o.type, (0, utils_1.trim0x)(o.params).length / 2, o.params]));
        });
        return hex;
    }
    addOption(workerId, option) {
        const worker = this.workerOptions.find((w) => w.workerId === workerId);
        if (worker) {
            worker.options.push(option);
        }
        else {
            this.workerOptions.push({ workerId, options: [option] });
        }
    }
    decodeRelayerLzReceiveOption() {
        const option = this.findOption(WorkerId.Relayer, RelayerOptionType.lzReceive);
        if (!option) {
            return;
        }
        const buffer = Buffer.from((0, utils_1.trim0x)(option.params), 'hex');
        const gas = ethers_1.ethers.BigNumber.from(buffer.slice(0, 16));
        if (buffer.length === 16) {
            return { gas, value: ethers_1.ethers.BigNumber.from(0) };
        }
        const value = ethers_1.ethers.BigNumber.from(buffer.slice(16, 32));
        return { gas, value };
    }
    decodeRelayerAirdropOption() {
        const option = this.findOption(WorkerId.Relayer, RelayerOptionType.airdrop);
        if (!option) {
            return;
        }
        const buffer = Buffer.from((0, utils_1.trim0x)(option.params), 'hex');
        const amount = ethers_1.ethers.BigNumber.from(buffer.slice(0, 16));
        const receiver = ethers_1.ethers.utils.hexlify(buffer.slice(16, 48));
        return { amount, receiver };
    }
    decodeRelayerComposeOption() {
        const option = this.findOption(WorkerId.Relayer, RelayerOptionType.compose);
        if (!option) {
            return;
        }
        const buffer = Buffer.from((0, utils_1.trim0x)(option.params), 'hex');
        const gas = ethers_1.ethers.BigNumber.from(buffer.slice(0, 16));
        const value = ethers_1.ethers.BigNumber.from(buffer.slice(16, 32));
        return { gas, value };
    }
    relayerOptionExists() {
        const option = this.findOption(WorkerId.Relayer, RelayerOptionType.ordered);
        return option !== undefined;
    }
    findOption(workerId, optionType) {
        const worker = this.workerOptions.find((w) => w.workerId === workerId);
        if (worker) {
            return worker.options.find((o) => o.type === optionType);
        }
    }
}
exports.Options = Options;
//# sourceMappingURL=options.js.map