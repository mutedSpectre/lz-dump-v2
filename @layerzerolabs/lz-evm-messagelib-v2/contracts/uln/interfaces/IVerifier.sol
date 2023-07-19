// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "../../interfaces/IWorker.sol";
import "./ILayerZeroVerifier.sol";

interface IVerifier is IWorker, ILayerZeroVerifier {
    struct DstConfigParam {
        uint32 dstEid;
        uint64 gas;
        uint16 multiplierBps;
        uint128 floorMarginUSD;
    }

    struct DstConfig {
        uint64 gas;
        uint16 multiplierBps;
        uint128 floorMarginUSD; // uses priceFeed PRICE_RATIO_DENOMINATOR
    }

    event AssignJob(uint32 dstEid, address oapp, uint64 confirmations, uint totalFee);
    event SetDstConfig(DstConfigParam[] params);

    function dstConfig(uint32 _dstEid) external view returns (uint64, uint16, uint128);
}
