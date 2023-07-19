// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/Options.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";

library OptionsBuilder {
    using BytesLib for bytes;

    modifier onlyType3(bytes memory _options) {
        require(_options.toUint16(0) == Options.TYPE_3, "OptionsBuilder: invalid options type");
        _;
    }

    function newOptions() internal pure returns (bytes memory) {
        return Options.encodeOptions(new Options.WorkerOptions[](0));
    }

    function addExecutorLzReceiveOption(
        bytes memory _options,
        uint128 _gas,
        uint128 _value
    ) internal pure returns (bytes memory) {
        Options.Option memory option = ExecutorOptions.encodeLzReceiveOption(_gas, _value);
        return addOption(_options, ExecutorOptions.WORKER_ID, option);
    }

    function addExecutorAirdropOption(
        bytes memory _options,
        uint128 _amount,
        bytes32 _receiver
    ) internal pure returns (bytes memory) {
        Options.Option memory option = ExecutorOptions.encodeAirdropOption(_amount, _receiver);
        return addOption(_options, ExecutorOptions.WORKER_ID, option);
    }

    function addExecutorLzComposeOption(
        bytes memory _options,
        uint128 _gas,
        uint128 _value
    ) internal pure returns (bytes memory) {
        Options.Option memory option = ExecutorOptions.encodeLzComposeOption(_gas, _value);
        return addOption(_options, ExecutorOptions.WORKER_ID, option);
    }

    function addExecutorOrderedExecutionOption(bytes memory _options) internal pure returns (bytes memory) {
        Options.Option memory option = ExecutorOptions.encodeOrderedExecutionOption();
        return addOption(_options, ExecutorOptions.WORKER_ID, option);
    }

    function addOption(
        bytes memory _options,
        uint16 _workerId,
        Options.Option memory _option
    ) internal pure onlyType3(_options) returns (bytes memory) {
        Options.WorkerOptions[] memory allWorkerOptions = Options.decodeOptions(_options);
        (bool found, uint index, bytes memory workerOptions) = Options.getWorkerOptionsByWorkerId(
            allWorkerOptions,
            _workerId
        );
        if (found) {
            Options.Option[] memory options = Options.decodeWorkerOptions(workerOptions);
            options = _insertNewOption(options, _option);
            allWorkerOptions[index].options = Options.encodeWorkerOptions(options);
        } else {
            // the only one executor option
            bytes memory options = Options.encodeWorkerOptions(_option);
            Options.WorkerOptions memory newWorkerOptions = Options.WorkerOptions(_workerId, options);
            allWorkerOptions = _insertNewWorkerOptions(allWorkerOptions, newWorkerOptions);
        }

        return Options.encodeOptions(allWorkerOptions);
    }

    /// @dev insert a new worker options into worker options array and sort by worker id
    function _insertNewWorkerOptions(
        Options.WorkerOptions[] memory _workerOptions,
        Options.WorkerOptions memory _newOptions
    ) private pure returns (Options.WorkerOptions[] memory) {
        Options.WorkerOptions[] memory newWorkerOptions = new Options.WorkerOptions[](_workerOptions.length + 1);
        if (newWorkerOptions.length == 1) {
            newWorkerOptions[0] = _newOptions;
            return newWorkerOptions;
        }

        for (uint i = 0; i < _workerOptions.length; i++) {
            require(_workerOptions[i].workerId != _newOptions.workerId, "OptionsBuilder: worker id already exists");

            if (_workerOptions[i].workerId < _newOptions.workerId) {
                newWorkerOptions[i] = _workerOptions[i];
            } else {
                newWorkerOptions[i] = _newOptions;
                for (uint j = i; j < _workerOptions.length; j++) {
                    newWorkerOptions[j + 1] = _workerOptions[j];
                }
                break;
            }

            if (i == _workerOptions.length - 1) {
                newWorkerOptions[i + 1] = _newOptions;
            }
        }
        return newWorkerOptions;
    }

    /// @dev insert a new option into options array and sort by option type
    function _insertNewOption(
        Options.Option[] memory _options,
        Options.Option memory _newOption
    ) private pure returns (Options.Option[] memory) {
        Options.Option[] memory newAllOptions = new Options.Option[](_options.length + 1);
        if (newAllOptions.length == 1) {
            newAllOptions[0] = _newOption;
            return newAllOptions;
        }

        for (uint i = 0; i < _options.length; i++) {
            require(_options[i].optionType != _newOption.optionType, "OptionsBuilder: option type already exists");

            if (_options[i].optionType < _newOption.optionType) {
                newAllOptions[i] = _options[i];
            } else {
                newAllOptions[i] = _newOption;
                for (uint j = i; j < _options.length; j++) {
                    newAllOptions[j + 1] = _options[j];
                }
                break;
            }

            if (i == _options.length - 1) {
                newAllOptions[i + 1] = _newOption;
            }
        }
        return newAllOptions;
    }
}
