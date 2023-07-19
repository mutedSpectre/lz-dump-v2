// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "../../libs/Errors.sol";
import "../../libs/CalldataBytesLib.sol";

library ExecutorOptions {
    using CalldataBytesLib for bytes;

    uint8 internal constant WORKER_ID = 1;

    uint8 internal constant OPTION_TYPE_LZRECEIVE = 1;
    uint8 internal constant OPTION_TYPE_AIRDROP = 2;
    uint8 internal constant OPTION_TYPE_LZCOMPOSE = 3;
    uint8 internal constant OPTION_TYPE_ORDERED_EXECUTION = 4;

    /// @dev decode the next executor option from the options starting from the specified cursor
    /// @param _options [executor_id][executor_option][executor_id][executor_option]...
    ///        executor_option = [option_size][option_type][option]
    ///        option_size = len(option_type) + len(option)
    ///        executor_id: uint8, option_size: uint16, option_type: uint8, option: bytes
    /// @param _cursor the cursor to start decoding from
    /// @return optionType the type of the option
    /// @return option the option of the executor
    /// @return cursor the cursor to start decoding the next executor option
    function nextExecutorOption(
        bytes calldata _options,
        uint _cursor
    ) internal pure returns (uint8 optionType, bytes calldata option, uint cursor) {
        unchecked {
            // skip worker id
            cursor = _cursor + 1;

            // read option size
            uint16 size = _options.toU16(cursor);
            cursor += 2;

            // read option type
            optionType = _options.toU8(cursor);

            // startCursor and endCursor are used to slice the option from _options
            uint startCursor = cursor + 1; // skip option type and verifier_idx
            uint endCursor = cursor + size;
            option = _options[startCursor:endCursor];
            cursor += size;
        }
    }

    function decodeLzReceiveOption(bytes calldata _option) internal pure returns (uint128 gas, uint128 value) {
        require(_option.length == 16 || _option.length == 32, Errors.INVALID_SIZE);
        gas = _option.toU128(0);
        value = _option.length == 32 ? _option.toU128(16) : 0;
    }

    function decodeAirdropOption(bytes calldata _option) internal pure returns (uint128 amount, bytes32 receiver) {
        require(_option.length == 48, Errors.INVALID_SIZE);
        amount = _option.toU128(0);
        receiver = _option.toB32(16);
    }

    function decodeLzComposeOption(bytes calldata _option) internal pure returns (uint128 gas, uint128 value) {
        require(_option.length == 16 || _option.length == 32, Errors.INVALID_SIZE);
        gas = _option.toU128(0);
        value = _option.length == 32 ? _option.toU128(16) : 0;
    }

    function encodeLzReceiveOption(uint128 _gas, uint128 _value) internal pure returns (bytes memory) {
        return _value == 0 ? abi.encodePacked(_gas) : abi.encodePacked(_gas, _value);
    }

    function encodeAirdropOption(uint128 _amount, bytes32 _receiver) internal pure returns (bytes memory) {
        return abi.encodePacked(_amount, _receiver);
    }

    function encodeLzComposeOption(uint128 _gas, uint128 _value) internal pure returns (bytes memory) {
        return _value == 0 ? abi.encodePacked(_gas) : abi.encodePacked(_gas, _value);
    }
}
