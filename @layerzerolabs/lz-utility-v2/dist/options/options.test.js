"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const options_1 = require("./options");
const ADDRESS_ONE = '0x0000000000000000000000000000000000000001';
describe('options tests', function () {
    test.each([
        // gas, result
        [1, '0x00010000000000000000000000000000000000000000000000000000000000000001'],
    ])('optionsType1(%s)', (gas, result) => {
        const ops = (0, options_1.optionsType1)(gas);
        (0, globals_1.expect)(ops).toEqual(result);
    });
    test.each([
        // gas, nativeAmount, recipient, result
        [
            1,
            1,
            ADDRESS_ONE,
            '0x0002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000001',
        ],
    ])('optionsType2(%s, %s, %s)', (gas, nativeAmount, recipient, result) => {
        const ops = (0, options_1.optionsType2)(gas, nativeAmount, recipient);
        (0, globals_1.expect)(ops).toEqual(result);
    });
    it('convert type1(legacy) to type3', async function () {
        const t1 = (0, options_1.optionsType1)(1);
        const t3 = options_1.Options.fromOptions(t1);
        const ops = options_1.Options.newOptions().addRelayerLzReceiveOption(1, 0);
        (0, globals_1.expect)(t3.toBytes()).toEqual(ops.toBytes());
    });
    it('convert type2(legacy) to type3', async function () {
        const t2 = (0, options_1.optionsType2)(1, 1, ADDRESS_ONE);
        const t3 = options_1.Options.fromOptions(t2);
        const ops = options_1.Options.newOptions().addRelayerLzReceiveOption(1, 0).addRelayerAirdropOption(1, ADDRESS_ONE);
        (0, globals_1.expect)(t3.toBytes()).toEqual(ops.toBytes());
    });
    it('ordered', async function () {
        const ops = options_1.Options.newOptions().addRelayerOrderedExecutionOption();
        (0, globals_1.expect)(ops.relayerOptionExists()).toEqual(true);
        const ops2 = options_1.Options.newOptions();
        (0, globals_1.expect)(ops2.relayerOptionExists()).toEqual(false);
    });
});
//# sourceMappingURL=options.test.js.map