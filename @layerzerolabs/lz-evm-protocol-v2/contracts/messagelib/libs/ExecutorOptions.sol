// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "solidity-bytes-utils/contracts/BytesLib.sol";
import "./Options.sol";

library ExecutorOptions {
    using BytesLib for bytes;

    uint16 internal constant WORKER_ID = 1;

    uint16 internal constant OPTION_TYPE_LZRECEIVE = 1;
    uint16 internal constant OPTION_TYPE_AIRDROP = 2;
    uint16 internal constant OPTION_TYPE_LZCOMPOSE = 3;
    uint16 internal constant OPTION_TYPE_ORDERED_EXECUTION = 4;

    function decodeLzReceiveParams(bytes memory _params) internal pure returns (uint gas, uint value) {
        require(_params.length == 16 || _params.length == 32, "LZ10009");
        gas = _params.toUint128(0);
        value = _params.length == 32 ? _params.toUint128(16) : 0;
    }

    function decodeAirdropParams(bytes memory _params) internal pure returns (uint amount, bytes32 receiver) {
        require(_params.length == 48, "LZ10009");
        amount = _params.toUint128(0);
        receiver = _params.toBytes32(16);
    }

    function decodeLzComposeParams(bytes memory _params) internal pure returns (uint gas, uint value) {
        require(_params.length == 32, "LZ10009");
        gas = _params.toUint128(0);
        value = _params.toUint128(16);
    }

    function encodeLzReceiveOption(uint128 _gas, uint128 _value) internal pure returns (Options.Option memory) {
        bytes memory params = _value == 0 ? abi.encodePacked(_gas) : abi.encodePacked(_gas, _value);
        return Options.Option(OPTION_TYPE_LZRECEIVE, params);
    }

    function encodeAirdropOption(uint128 _amount, bytes32 _receiver) internal pure returns (Options.Option memory) {
        return Options.Option(OPTION_TYPE_AIRDROP, abi.encodePacked(_amount, _receiver));
    }

    function encodeLzComposeOption(uint128 _gas, uint128 _value) internal pure returns (Options.Option memory) {
        return Options.Option(OPTION_TYPE_LZCOMPOSE, abi.encodePacked(_gas, _value));
    }

    function encodeOrderedExecutionOption() internal pure returns (Options.Option memory) {
        return Options.Option(OPTION_TYPE_ORDERED_EXECUTION, "");
    }
}
