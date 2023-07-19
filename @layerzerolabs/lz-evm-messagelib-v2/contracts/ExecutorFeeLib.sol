// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/Options.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";

import "./interfaces/ILayerZeroPriceFeed.sol";
import "./interfaces/IExecutorFeeLib.sol";

contract ExecutorFeeLib is IExecutorFeeLib, ERC165 {
    uint constant NATIVE_DECIMALS_RATE = 1e18;

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IExecutorFeeLib).interfaceId || super.supportsInterface(interfaceId);
    }

    // pass through for offchain fee calculation
    function getPrice(ILayerZeroPriceFeed _priceFeed, uint32 _dstEid) public view returns (uint128, uint64) {
        ILayerZeroPriceFeed.Price memory price = _priceFeed.getPrice(_dstEid);
        return (price.priceRatio, price.gasPriceInUnit);
    }

    function getFee(
        FeeParams memory _params,
        IExecutor.DstConfig memory _dstConfig,
        bytes calldata _options
    ) external view returns (uint fee) {
        require(_options.length > 0, "ExecutorFeeLib: no options provided");

        (uint totalDstAmount, uint totalGas) = _decodeExecutorOptions(
            _dstConfig.baseGas,
            _dstConfig.airdropCap,
            _options
        );

        (
            uint totalGasFee,
            uint128 priceRatio,
            uint128 priceRatioDenominator,
            uint128 nativePriceUSD
        ) = ILayerZeroPriceFeed(_params.priceFeed).estimateFeeByEid(_params.dstEid, _params.calldataSize, totalGas);

        fee = _getTxFee(
            totalGasFee,
            _dstConfig.multiplierBps == 0 ? _params.defaultMultiplierBps : _dstConfig.multiplierBps,
            _dstConfig.floorMarginUSD,
            nativePriceUSD
        );

        if (totalDstAmount > 0) {
            fee =
                fee +
                (((totalDstAmount * priceRatio) / priceRatioDenominator) * _params.defaultMultiplierBps) /
                10000;
        }
    }

    function _decodeExecutorOptions(
        uint64 _baseGas,
        uint128 _airdropCap,
        bytes calldata _options
    ) private pure returns (uint dstAmount, uint totalGas) {
        Options.Option[] memory options = Options.decodeWorkerOptions(_options);

        bool ordered = false;
        totalGas = _baseGas;
        for (uint i = 0; i < options.length; i++) {
            if (options[i].optionType == ExecutorOptions.OPTION_TYPE_AIRDROP) {
                (uint airdropAmount, ) = ExecutorOptions.decodeAirdropParams(options[i].params);
                require(airdropAmount <= _airdropCap, "ExecutorFeeLib: airdrop amount exceeds cap");
                dstAmount += airdropAmount;
            } else if (options[i].optionType == ExecutorOptions.OPTION_TYPE_LZRECEIVE) {
                (uint gas, uint value) = ExecutorOptions.decodeLzReceiveParams(options[i].params);
                dstAmount += value;
                totalGas += gas;
            } else if (options[i].optionType == ExecutorOptions.OPTION_TYPE_LZCOMPOSE) {
                (uint gas, uint value) = ExecutorOptions.decodeLzComposeParams(options[i].params);
                dstAmount += value;
                totalGas += gas;
            } else if (options[i].optionType == ExecutorOptions.OPTION_TYPE_ORDERED_EXECUTION) {
                ordered = true;
            } else {
                revert("ExecutorFeeLib: invalid option type");
            }
        }
        if (ordered) {
            // todo: finalize the premium for ordered
            totalGas = (totalGas * 102) / 100;
        }
    }

    function _getTxFee(
        uint _fee,
        uint16 _multiplierBps,
        uint128 _floorMarginUSD,
        uint128 _nativePriceUSD
    ) private pure returns (uint) {
        uint feeWithMultiplier = (_fee * _multiplierBps) / 10000;

        if (_nativePriceUSD == 0 || _floorMarginUSD == 0) {
            return feeWithMultiplier;
        }
        uint feeWithMargin = (_floorMarginUSD * NATIVE_DECIMALS_RATE) / _nativePriceUSD + _fee;
        return feeWithMargin > feeWithMultiplier ? feeWithMargin : feeWithMultiplier;
    }
}
