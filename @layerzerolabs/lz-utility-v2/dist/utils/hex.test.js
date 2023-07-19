"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("ethers/lib/utils");
const hex_1 = require("./hex");
describe('hex test', () => {
    test.each([
        [
            '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            (0, utils_1.arrayify)('0x000000000000000000000000f39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
        ],
        [
            'oeYf6KAJkLYhBuR8CiGc6L4D4Xtfepr85fuDgA9kq96',
            (0, utils_1.arrayify)('0x0bf32b9f0db09672038fea36139b18f98a5f0149ef4ce0332e44b9a77e83c22d'),
        ],
    ])(`addressToBytes32 %s`, (i, o) => {
        expect((0, hex_1.addressToBytes32)(i)).toEqual(o);
    });
    test.each([
        [
            '0x000000000000000000000000f39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        ],
        [
            (0, utils_1.arrayify)('0x000000000000000000000000f39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
            '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        ],
    ])('bytes32ToEthAddress %s', (i, o) => {
        expect((0, hex_1.bytes32ToEthAddress)(i)).toEqual(o);
    });
});
//# sourceMappingURL=hex.test.js.map