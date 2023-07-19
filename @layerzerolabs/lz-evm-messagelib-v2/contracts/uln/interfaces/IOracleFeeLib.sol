// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "./IOracle.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IOracleFeeLib is IERC165 {
    struct FeeParams {
        address priceFeed;
        uint32 dstEid;
        uint64 confirmations;
        address sender;
        uint64 quorum;
        uint16 defaultMultiplierBps;
    }

    function getFee(
        FeeParams memory _params,
        IOracle.DstConfig memory _dstConfig,
        bytes memory _options
    ) external view returns (uint fee);
}
