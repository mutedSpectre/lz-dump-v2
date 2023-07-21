// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import {Origin} from "@layerzerolabs/lz-evm-protocol-v2/contracts/MessagingStructs.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroReceiver.sol";
import "./IWorker.sol";
import "./ILayerZeroExecutor.sol";

interface IExecutor is IWorker, ILayerZeroExecutor {
    struct DstConfigParam {
        uint32 dstEid;
        uint64 baseGas;
        uint16 multiplierBps;
        uint128 floorMarginUSD;
        uint128 airdropCap;
    }

    struct DstConfig {
        uint64 baseGas; // for delivering / fixed calldata overhead
        uint16 multiplierBps;
        uint128 floorMarginUSD; // uses priceFeed PRICE_RATIO_DENOMINATOR
        uint128 airdropCap;
    }

    struct ExecutionParams {
        address receiver;
        Origin origin;
        bytes32 guid;
        bytes message;
        bytes extraData;
        uint gasLimit;
    }

    struct AirdropParams {
        address receiver;
        uint amount;
        uint gasLimit;
    }

    event DstConfigSet(DstConfigParam[] params);
    event AirdropFailed(address receiver, uint amount);
    event AirdropSucceeded(address receiver, uint amount);

    function dstConfig(uint32 _dstEid) external view returns (uint64, uint16, uint128, uint128);
}
