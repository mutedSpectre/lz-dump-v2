// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/Errors.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";
import "./VerifierOptions.sol";

library UlnOptions {
    using BytesLib for bytes;
    using SafeCast for uint;

    uint16 internal constant TYPE_1 = 1; // legacy options type 1
    uint16 internal constant TYPE_2 = 2; // legacy options type 2
    uint16 internal constant TYPE_3 = 3;

    // todo: need another decode function for calldata options?
    /// @dev decode the options into executorOptions and verifierOptions
    /// @param _options the options can be either legacy options (type 1 or 2) or type 3 options
    /// @return executorOptions the executor options, share the same format of type 3 options
    /// @return verifierOptions the verifier options, share the same format of type 3 options
    function decode(
        bytes memory _options
    ) internal pure returns (bytes memory executorOptions, bytes memory verifierOptions) {
        uint16 optionsType = _options.toUint16(0);
        uint cursor = 2;

        // type3 options: [worker_option][worker_option]...
        // worker_option: [worker_id][option_size][option]
        // worker_id: uint8, option_size: uint16, option: bytes
        if (optionsType == TYPE_3) {
            unchecked {
                uint start = cursor;
                uint8 lastWorkerId; // worker_id starts from 1, so 0 is an invalid worker_id

                // heuristic: we assume that the options are mostly EXECUTOR options only
                // checking the workerID can reduce gas usage for most cases
                while (cursor < _options.length) {
                    uint8 workerId = _options.toUint8(cursor);
                    if (lastWorkerId == 0) {
                        lastWorkerId = workerId;
                    }

                    // workerId must equal to the lastWorkerId for the first option
                    // so it is always skipped in the first option
                    // this operation slices out options whenever the the scan finds a different workerId
                    if (workerId != lastWorkerId) {
                        bytes memory op = _options.slice(start, cursor - start); // slice out the last worker's options
                        (executorOptions, verifierOptions) = _insertWorkerOptions(
                            executorOptions,
                            verifierOptions,
                            lastWorkerId,
                            op
                        );

                        // reset the start cursor and lastWorkerId
                        start = cursor;
                        lastWorkerId = workerId;
                    }

                    ++cursor; // for workerId

                    uint16 size = _options.toUint16(cursor);
                    require(size > 0, Errors.INVALID_SIZE);
                    cursor += size + 2;

                    // if we have reached the end of the options, we need to process the last worker's options
                    if (cursor == _options.length) {
                        bytes memory op = _options.slice(start, cursor - start);
                        (executorOptions, verifierOptions) = _insertWorkerOptions(
                            executorOptions,
                            verifierOptions,
                            workerId,
                            op
                        );
                    }
                }
                // the options length must be the same as the cursor at the end
                require(cursor == _options.length, Errors.INVALID_SIZE);
            }
        } else {
            executorOptions = decodeLegacyOptions(optionsType, _options);
        }
    }

    function _insertWorkerOptions(
        bytes memory _executorOptions,
        bytes memory _verifierOptions,
        uint8 _workerId,
        bytes memory _newOptions
    ) private pure returns (bytes memory, bytes memory) {
        if (_workerId == ExecutorOptions.WORKER_ID) {
            _executorOptions = _executorOptions.length == 0
                ? _newOptions
                : abi.encodePacked(_executorOptions, _newOptions);
        } else if (_workerId == VerifierOptions.WORKER_ID) {
            _verifierOptions = _verifierOptions.length == 0
                ? _newOptions
                : abi.encodePacked(_verifierOptions, _newOptions);
        } else {
            revert(Errors.INVALID_WORKER_ID);
        }
        return (_executorOptions, _verifierOptions);
    }

    /// @dev decode the legacy options (type 1 or 2) into executorOptions
    /// @param _optionType the legacy option type
    /// @param _options the legacy options, which still has the option type in the first 2 bytes
    /// @return executorOptions the executor options, share the same format of type 3 options
    /// Data format:
    /// legacy type 1: [extraGas]
    /// legacy type 2: [extraGas][dstNativeAmt][dstNativeAddress]
    /// extraGas: uint256, dstNativeAmt: uint256, dstNativeAddress: bytes
    function decodeLegacyOptions(
        uint16 _optionType,
        bytes memory _options
    ) internal pure returns (bytes memory executorOptions) {
        if (_optionType == TYPE_1) {
            require(_options.length == 34, Errors.INVALID_SIZE);

            // execution gas
            uint128 executionGas = _options.toUint256(2).toUint128();

            // dont use the encode function in the ExecutorOptions lib for saving gas by calling abi.encodePacked once
            // the result is a lzReceive option: [executor_id][option_size][option_type][execution_gas]
            // option_type: uint8, executionGas: uint128
            // option_size = len(option_type) + len(execution_gas) = 1 + 16 = 17
            executorOptions = abi.encodePacked(
                ExecutorOptions.WORKER_ID,
                uint16(17), // 16 + 1, 16 for option_length, + 1 for option_type
                ExecutorOptions.OPTION_TYPE_LZRECEIVE,
                executionGas
            );
        } else if (_optionType == TYPE_2) {
            // receiver size <= 32
            require(_options.length > 66 && _options.length <= 98, Errors.INVALID_SIZE);

            // execution gas
            uint128 executionGas = _options.toUint256(2).toUint128();

            // airdrop (amount + receiver)
            uint128 amount = _options.toUint256(34).toUint128(); // offset 2 + 32
            bytes32 receiver;
            unchecked {
                uint receiverLen = _options.length - 66; // offset 2 + 32 + 32
                receiver = bytes32(_options.slice(66, receiverLen));
                receiver = receiver >> (8 * (32 - receiverLen)); // padding 0 to the left
            }

            // dont use the encode function in the ExecutorOptions lib for saving gas by calling abi.encodePacked once
            // the result has one lzReceive option and one airdrop option:
            //      [executor_id][lzReceive_option_size][option_type][execution_gas] +
            //      [executor_id][airdrop_option_size][option_type][airdrop_amount][receiver]
            // option_type: uint8, execution_gas: uint128, airdrop_amount: uint128, receiver: bytes32
            // lzReceive_option_size = len(option_type) + len(execution_gas) = 1 + 16 = 17
            // airdrop_option_size = len(option_type) + len(airdrop_amount) + len(receiver) = 1 + 16 + 32 = 49
            executorOptions = abi.encodePacked(
                ExecutorOptions.WORKER_ID,
                uint16(17), // 16 + 1, 16 for option_length, + 1 for option_type
                ExecutorOptions.OPTION_TYPE_LZRECEIVE,
                executionGas,
                ExecutorOptions.WORKER_ID,
                uint16(49), // 48 + 1, 32 + 16 for option_length, + 1 for option_type
                ExecutorOptions.OPTION_TYPE_AIRDROP,
                amount,
                receiver
            );
        } else {
            revert(Errors.NOT_IMPLEMENTED);
        }
    }
}
