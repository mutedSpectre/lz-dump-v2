// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/Options.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";

library OptionsParser {
    function parseExecutorLzReceiveOption(bytes memory _options) internal pure returns (uint gas, uint value) {
        Options.WorkerOptions[] memory workerOptions = Options.decodeOptions(_options);
        (bool found, bytes memory params) = Options.getOptionByWorkerIdAndOptionType(
            workerOptions,
            ExecutorOptions.WORKER_ID,
            ExecutorOptions.OPTION_TYPE_LZRECEIVE
        );
        require(found, "OptionsParser: option not found");
        (gas, value) = ExecutorOptions.decodeLzReceiveParams(params);
    }

    function parseExecutorAirdropOption(bytes memory _options) internal pure returns (uint amount, bytes32 receiver) {
        Options.WorkerOptions[] memory workerOptions = Options.decodeOptions(_options);
        (bool found, bytes memory params) = Options.getOptionByWorkerIdAndOptionType(
            workerOptions,
            ExecutorOptions.WORKER_ID,
            ExecutorOptions.OPTION_TYPE_AIRDROP
        );
        require(found, "OptionsParser: option not found");
        (amount, receiver) = ExecutorOptions.decodeAirdropParams(params);
    }

    function parseExecutorLzComposeOption(bytes memory _options) internal pure returns (uint gas, uint value) {
        Options.WorkerOptions[] memory workerOptions = Options.decodeOptions(_options);
        (bool found, bytes memory params) = Options.getOptionByWorkerIdAndOptionType(
            workerOptions,
            ExecutorOptions.WORKER_ID,
            ExecutorOptions.OPTION_TYPE_LZCOMPOSE
        );
        require(found, "OptionsParser: option not found");
        (gas, value) = ExecutorOptions.decodeLzComposeParams(params);
    }

    function executorOptionExists(bytes memory _options, uint16 _executorOptionType) internal pure returns (bool) {
        Options.WorkerOptions[] memory workerOptions = Options.decodeOptions(_options);
        (bool found, ) = Options.getOptionByWorkerIdAndOptionType(
            workerOptions,
            ExecutorOptions.WORKER_ID,
            _executorOptionType
        );
        return found;
    }
}
