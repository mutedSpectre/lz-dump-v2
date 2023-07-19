// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroReceiver.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageOrigin.sol";
import "./IWorker.sol";
import "./ILayerZeroExecutor.sol";

interface IExecutor is IWorker, ILayerZeroExecutor, IMessageOrigin {
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
        uint128 floorMarginUSD;
        uint128 airdropCap;
    }

    struct ExecutionParams {
        address receiver;
        MessageOrigin origin;
        bytes32 guid;
        bytes message;
        bytes callerParams;
        uint gasLimit;
    }

    struct AirdropParams {
        address receiver;
        uint amount;
        uint gasLimit;
    }

    event SetDstConfig(DstConfigParam[] params);
    event AirdropFailed(address indexed receiver, uint amount);

    function dstConfig(uint32 _dstEid) external view returns (uint64, uint16, uint128, uint128);
}
