// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/BitMaps.sol";

import "./interfaces/ILayerZeroPriceFeed.sol";
import "./interfaces/IExecutorFeeLib.sol";

contract ExecutorFeeLib is IExecutorFeeLib {
    using ExecutorOptions for bytes;
    using BitMaps for BitMaps.BitMap256;

    uint private constant NATIVE_DECIMALS_RATE = 1e18;

    function getFeeOnSend(
        FeeParams memory _params,
        IExecutor.DstConfig memory _dstConfig,
        bytes calldata _options
    ) external returns (uint fee) {
        (uint totalDstAmount, uint totalGas) = _decodeExecutorOptions(
            _dstConfig.baseGas,
            _dstConfig.airdropCap,
            _options
        );

        uint priceFeedFee = ILayerZeroPriceFeed(_params.priceFeed).getFee(
            _params.dstEid,
            _params.calldataSize,
            totalGas
        );
        (
            uint totalGasFee,
            uint128 priceRatio,
            uint128 priceRatioDenominator,
            uint128 nativePriceUSD
        ) = ILayerZeroPriceFeed(_params.priceFeed).estimateFeeOnSend{value: priceFeedFee}(
                _params.dstEid,
                _params.calldataSize,
                totalGas
            );

        fee = _applyPremiumToGas(
            totalGasFee,
            _dstConfig.multiplierBps,
            _params.defaultMultiplierBps,
            _dstConfig.floorMarginUSD,
            nativePriceUSD
        );
        fee += _convertAndApplyPremiumToValue(
            totalDstAmount,
            priceRatio,
            priceRatioDenominator,
            _params.defaultMultiplierBps
        );
    }

    function getFee(
        FeeParams memory _params,
        IExecutor.DstConfig memory _dstConfig,
        bytes calldata _options
    ) external view returns (uint fee) {
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

        fee = _applyPremiumToGas(
            totalGasFee,
            _dstConfig.multiplierBps,
            _params.defaultMultiplierBps,
            _dstConfig.floorMarginUSD,
            nativePriceUSD
        );
        fee += _convertAndApplyPremiumToValue(
            totalDstAmount,
            priceRatio,
            priceRatioDenominator,
            _params.defaultMultiplierBps
        );
    }

    // @dev decode executor options into dstAmount and totalGas
    function _decodeExecutorOptions(
        uint64 _baseGas,
        uint128 _airdropCap,
        bytes calldata _options
    ) internal pure returns (uint dstAmount, uint totalGas) {
        require(_options.length > 0, "ExecutorFeeLib: no options provided");

        BitMaps.BitMap256 bitmap;
        uint cursor;
        bool ordered = false;
        totalGas = _baseGas;

        while (cursor < _options.length) {
            (uint8 optionType, bytes calldata option, uint newCursor) = _options.nextExecutorOption(cursor);
            cursor = newCursor;

            // check if option type is duplicated
            require(!bitmap.get(optionType), Errors.DUPLICATED);
            bitmap = bitmap.set(optionType);

            if (optionType == ExecutorOptions.OPTION_TYPE_LZRECEIVE) {
                (uint128 gas, uint128 value) = ExecutorOptions.decodeLzReceiveOption(option);
                dstAmount += value;
                totalGas += gas;
            } else if (optionType == ExecutorOptions.OPTION_TYPE_AIRDROP) {
                (uint128 airdropAmount, ) = ExecutorOptions.decodeAirdropOption(option);
                require(airdropAmount <= _airdropCap, "ExecutorFeeLib: airdrop amount exceeds cap");
                dstAmount += airdropAmount;
            } else if (optionType == ExecutorOptions.OPTION_TYPE_LZCOMPOSE) {
                (uint128 gas, uint128 value) = ExecutorOptions.decodeLzComposeOption(option);
                dstAmount += value;
                totalGas += gas;
            } else if (optionType == ExecutorOptions.OPTION_TYPE_ORDERED_EXECUTION) {
                ordered = true;
            } else {
                revert("ExecutorFeeLib: invalid option type");
            }
        }
        require(cursor == _options.length, "ExecutorFeeLib: invalid options");

        if (ordered) {
            // todo: finalize the premium for ordered
            totalGas = (totalGas * 102) / 100;
        }
    }

    function _applyPremiumToGas(
        uint _fee,
        uint16 _bps,
        uint16 _defaultBps,
        uint128 _marginUSD,
        uint128 _nativePriceUSD
    ) internal pure returns (uint) {
        uint16 multiplierBps = _bps == 0 ? _defaultBps : _bps;

        uint feeWithMultiplier = (_fee * multiplierBps) / 10000;

        if (_nativePriceUSD == 0 || _marginUSD == 0) {
            return feeWithMultiplier;
        }
        uint feeWithMargin = (_marginUSD * NATIVE_DECIMALS_RATE) / _nativePriceUSD + _fee;
        return feeWithMargin > feeWithMultiplier ? feeWithMargin : feeWithMultiplier;
    }

    // includes value and airdrop
    function _convertAndApplyPremiumToValue(
        uint _value,
        uint128 _ratio,
        uint128 _denom,
        uint16 _defaultBps
    ) internal pure returns (uint fee) {
        if (_value > 0) {
            fee = (((_value * _ratio) / _denom) * _defaultBps) / 10000;
        }
    }
}
