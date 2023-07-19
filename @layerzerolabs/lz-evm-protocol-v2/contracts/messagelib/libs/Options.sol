// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "solidity-bytes-utils/contracts/BytesLib.sol";

library Options {
    using BytesLib for bytes;

    struct WorkerOptions {
        uint16 workerId;
        bytes options;
    }

    struct Option {
        uint16 optionType;
        bytes params;
    }

    uint16 internal constant EXECUTOR_WORKER_ID = 1; // matches ExecutorOptions WORKER_ID

    uint16 internal constant TYPE_1 = 1; // simple option type 1
    uint16 internal constant TYPE_2 = 2; // simple option type 2
    uint16 internal constant TYPE_3 = 3; // cannot overlap with simple option types

    /// ======================= Decoding Functions =======================
    function decodeOptions(bytes memory _options) internal pure returns (WorkerOptions[] memory) {
        uint16 formatType = _options.toUint16(0);
        if (formatType == TYPE_1 || formatType == TYPE_2) {
            WorkerOptions[] memory options = _convert(formatType, _options);
            return options;
        }

        // new format type 3
        // [type3][numWorkers][workerOps][workerOps]...
        // [workerOps] -> [workerId][size][options]
        if (formatType == 3) {
            uint16 numWorkers = _options.toUint16(2);
            WorkerOptions[] memory options = new WorkerOptions[](numWorkers);

            // parse options for each worker
            uint cursor = 4;
            uint16 lastWorkerId;
            for (uint i = 0; i < uint(numWorkers); i++) {
                // must be ascending order
                uint16 workerId = _options.toUint16(cursor);
                cursor += 2;

                // no duplicated worker id, and the first worker id can be 0 because of enum type
                require(i == 0 || workerId > lastWorkerId, "LZ10006");
                lastWorkerId = workerId;

                // option size
                uint16 size = _options.toUint16(cursor);
                cursor += 2;

                options[i] = WorkerOptions(workerId, _options.slice(cursor, size));
                cursor += size;
            }
            require(cursor == _options.length, "LZ10009");
            return options;
        }

        revert("LZC0000");
    }

    /// @dev decode worker options
    function decodeWorkerOptions(bytes memory _options) internal pure returns (Option[] memory) {
        uint cursor = 0;
        uint16 numOptions = _options.toUint16(cursor);
        cursor += 2;

        Option[] memory options = new Option[](numOptions);
        uint16 lastOptionType;
        for (uint16 i = 0; i < numOptions; i++) {
            uint16 optionType = _options.toUint16(cursor);
            cursor += 2;
            // no duplicated option type
            require(optionType > lastOptionType, "LZ10006");
            lastOptionType = optionType;

            uint16 paramSize = _options.toUint16(cursor);
            cursor += 2;

            bytes memory param = _options.slice(cursor, paramSize);
            cursor += paramSize;
            options[i] = Option(optionType, param);
        }
        return options;
    }

    // executor only
    // legacy type 1
    // bytes  [32      ]
    // fields [extraGas]
    // legacy type 2
    // bytes  [32        32            bytes[]         ]
    // fields [extraGas  dstNativeAmt  dstNativeAddress]
    function _convert(
        uint _optionType,
        bytes memory _options
    ) private pure returns (WorkerOptions[] memory workerOptions) {
        workerOptions = new WorkerOptions[](1);
        bytes memory options;

        if (_optionType == TYPE_1) {
            require(_options.length == 34, "LZ10009");

            // execution gas
            uint executionGas = _options.toUint256(2);
            require(executionGas <= type(uint128).max, "LZ10009");

            options = abi.encodePacked(uint16(1)); // option num
            options = abi.encodePacked(options, TYPE_1, uint16(16), uint128(executionGas));
        } else if (_optionType == TYPE_2) {
            require(_options.length > 66 && _options.length <= 98, "LZ10009");

            // execution gas
            uint executionGas = _options.toUint256(2);
            require(executionGas <= type(uint128).max, "LZ10009");

            // airdrop (amount + receiver)
            uint amount = _options.toUint256(34);
            require(amount <= type(uint128).max, "LZ10009");

            uint receiverLen = _options.length - 66;
            bytes32 receiver = bytes32(_options.slice(66, receiverLen));
            receiver = receiver >> (8 * (32 - receiverLen)); // padding 0 to the left
            bytes memory airdrop = abi.encodePacked(uint128(amount), receiver);

            options = abi.encodePacked(uint16(2)); // option num
            options = abi.encodePacked(options, TYPE_1, uint16(16), uint128(executionGas));
            options = abi.encodePacked(options, TYPE_2, uint16(airdrop.length), airdrop);
        } else {
            revert("LZC0000");
        }

        workerOptions[0] = WorkerOptions(EXECUTOR_WORKER_ID, options);
    }

    /// ======================= Encoding Functions =======================

    function encodeWorkerOptions(Option memory _option) internal pure returns (bytes memory) {
        Option[] memory options = new Option[](1);
        options[0] = _option;
        return encodeWorkerOptions(options);
    }

    function encodeWorkerOptions(Option[] memory _options) internal pure returns (bytes memory) {
        require(_options.length > 0, "LZ10009");
        uint16 numOptions = _safeToUint16(_options.length);
        bytes memory options = abi.encodePacked(numOptions);

        uint16 lastOptionType;
        for (uint i = 0; i < numOptions; i++) {
            // no duplicated option type
            uint16 optionType = _options[i].optionType;
            require(i == 0 || optionType > lastOptionType, "LZ10006");
            lastOptionType = optionType;

            uint16 paramSize = _safeToUint16(_options[i].params.length);
            bytes memory option = abi.encodePacked(_options[i].optionType, paramSize, _options[i].params);

            options = options.concat(option);
        }

        return options;
    }

    function encodeOptions(WorkerOptions[] memory _workerOptions) internal pure returns (bytes memory) {
        uint16 numWorkers = _safeToUint16(_workerOptions.length);
        bytes memory options = abi.encodePacked(TYPE_3, numWorkers);

        uint16 lastWorkerId;
        for (uint i = 0; i < numWorkers; i++) {
            uint16 workerId = uint16(_workerOptions[i].workerId);
            // prevent duplicated worker id
            require(i == 0 || workerId > lastWorkerId, "LZ10006");

            uint16 optionSize = _safeToUint16(_workerOptions[i].options.length);
            options = abi.encodePacked(options, workerId, optionSize, _workerOptions[i].options);

            lastWorkerId = workerId;
        }

        return options;
    }

    function encodeSimpleOptionsType1(uint256 _executionGas) internal pure returns (bytes memory) {
        require(_executionGas <= type(uint128).max, "LZ10009");
        return abi.encodePacked(TYPE_1, _executionGas);
    }

    function encodeSimpleOptionsType2(
        uint256 _executionGas,
        uint256 _amount,
        bytes32 _receiver
    ) internal pure returns (bytes memory) {
        require(_executionGas <= type(uint128).max && _amount <= type(uint128).max, "LZ10009");
        return abi.encodePacked(TYPE_2, _executionGas, _amount, _receiver);
    }

    /// ======================= Getter Functions =======================

    function getWorkerOptionsByWorkerId(
        WorkerOptions[] memory _workerOptions,
        uint16 _workerId
    ) internal pure returns (bool, uint, bytes memory) {
        for (uint i = 0; i < _workerOptions.length; i++) {
            if (_workerOptions[i].workerId == _workerId) {
                return (true, i, _workerOptions[i].options);
            }
        }
        return (false, 0, bytes(""));
    }

    function getOptionByOptionType(
        Option[] memory _options,
        uint16 _optionType
    ) internal pure returns (bool, uint, bytes memory) {
        for (uint i = 0; i < _options.length; i++) {
            if (_options[i].optionType == _optionType) {
                return (true, i, _options[i].params);
            }
        }
        return (false, 0, bytes(""));
    }

    function getOptionByWorkerIdAndOptionType(
        WorkerOptions[] memory _workerOptions,
        uint16 _workerId,
        uint16 _optionType
    ) internal pure returns (bool, bytes memory) {
        (bool found, , bytes memory options) = getWorkerOptionsByWorkerId(_workerOptions, _workerId);
        if (!found) {
            return (false, bytes(""));
        }

        (found, , options) = getOptionByOptionType(decodeWorkerOptions(options), _optionType);
        return (found, options);
    }

    function _safeToUint16(uint _value) private pure returns (uint16) {
        require(_value <= type(uint16).max, "LZ10009");
        return uint16(_value);
    }
}
