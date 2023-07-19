// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "./IExecutor.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IExecutorFeeLib is IERC165 {
    struct FeeParams {
        address priceFeed;
        uint32 dstEid;
        address sender;
        uint calldataSize;
        uint16 defaultMultiplierBps;
    }

    function getFee(
        FeeParams memory _params,
        IExecutor.DstConfig memory _dstConfig,
        bytes calldata _options
    ) external view returns (uint fee);
}
