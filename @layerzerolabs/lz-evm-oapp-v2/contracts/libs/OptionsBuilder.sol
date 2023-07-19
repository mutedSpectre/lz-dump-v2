// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";
import "@layerzerolabs/lz-evm-messagelib-v2/contracts/uln/libs/VerifierOptions.sol";

library OptionsBuilder {
    using SafeCast for uint;
    using BytesLib for bytes;

    uint16 internal constant TYPE_1 = 1; // legacy options type 1
    uint16 internal constant TYPE_2 = 2; // legacy options type 2
    uint16 internal constant TYPE_3 = 3;

    modifier onlyType3(bytes memory _options) {
        require(_options.toUint16(0) == TYPE_3, "OptionsBuilder: invalid options type");
        _;
    }

    function newOptions() internal pure returns (bytes memory) {
        return abi.encodePacked(TYPE_3);
    }

    function addExecutorLzReceiveOption(
        bytes memory _options,
        uint128 _gas,
        uint128 _value
    ) internal pure onlyType3(_options) returns (bytes memory) {
        bytes memory option = ExecutorOptions.encodeLzReceiveOption(_gas, _value);
        return addExecutorOption(_options, ExecutorOptions.OPTION_TYPE_LZRECEIVE, option);
    }

    function addExecutorAirdropOption(
        bytes memory _options,
        uint128 _amount,
        bytes32 _receiver
    ) internal pure onlyType3(_options) returns (bytes memory) {
        bytes memory option = ExecutorOptions.encodeAirdropOption(_amount, _receiver);
        return addExecutorOption(_options, ExecutorOptions.OPTION_TYPE_AIRDROP, option);
    }

    function addExecutorLzComposeOption(
        bytes memory _options,
        uint128 _gas,
        uint128 _value
    ) internal pure onlyType3(_options) returns (bytes memory) {
        bytes memory option = ExecutorOptions.encodeLzComposeOption(_gas, _value);
        return addExecutorOption(_options, ExecutorOptions.OPTION_TYPE_LZCOMPOSE, option);
    }

    function addExecutorOrderedExecutionOption(
        bytes memory _options
    ) internal pure onlyType3(_options) returns (bytes memory) {
        return addExecutorOption(_options, ExecutorOptions.OPTION_TYPE_ORDERED_EXECUTION, bytes(""));
    }

    function addVerifierPrecrimeOption(
        bytes memory _options,
        uint8 _verifierIdx
    ) internal pure onlyType3(_options) returns (bytes memory) {
        return addVerifierOption(_options, _verifierIdx, VerifierOptions.OPTION_TYPE_PRECRIME, bytes(""));
    }

    function addExecutorOption(
        bytes memory _options,
        uint8 _optionType,
        bytes memory _option
    ) internal pure onlyType3(_options) returns (bytes memory) {
        return
            abi.encodePacked(
                _options,
                ExecutorOptions.WORKER_ID,
                _option.length.toUint16() + 1, // +1 for optionType
                _optionType,
                _option
            );
    }

    function addVerifierOption(
        bytes memory _options,
        uint8 _verifierIdx,
        uint8 _optionType,
        bytes memory _option
    ) internal pure onlyType3(_options) returns (bytes memory) {
        return
            abi.encodePacked(
                _options,
                VerifierOptions.WORKER_ID,
                _option.length.toUint16() + 2, // +2 for optionType and verifierIdx
                _verifierIdx,
                _optionType,
                _option
            );
    }

    function encodeLegacyOptionsType1(uint _executionGas) internal pure returns (bytes memory) {
        require(_executionGas <= type(uint128).max, Errors.INVALID_SIZE);
        return abi.encodePacked(TYPE_1, _executionGas);
    }

    function encodeLegacyOptionsType2(
        uint _executionGas,
        uint _amount,
        bytes memory _receiver // use bytes instead of bytes32 in legacy type 2
    ) internal pure returns (bytes memory) {
        require(
            _executionGas <= type(uint128).max && _amount <= type(uint128).max && _receiver.length <= 32,
            Errors.INVALID_SIZE
        );
        return abi.encodePacked(TYPE_2, _executionGas, _amount, _receiver);
    }
}
