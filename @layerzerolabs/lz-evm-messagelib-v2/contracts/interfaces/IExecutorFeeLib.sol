// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "./IExecutor.sol";

interface IExecutorFeeLib {
    struct FeeParams {
        address priceFeed;
        uint32 dstEid;
        address sender;
        uint calldataSize;
        uint16 defaultMultiplierBps;
    }

    function getFeeOnSend(
        FeeParams memory _params,
        IExecutor.DstConfig memory _dstConfig,
        bytes memory _options
    ) external returns (uint fee);

    function getFee(
        FeeParams memory _params,
        IExecutor.DstConfig memory _dstConfig,
        bytes calldata _options
    ) external view returns (uint fee);
}
