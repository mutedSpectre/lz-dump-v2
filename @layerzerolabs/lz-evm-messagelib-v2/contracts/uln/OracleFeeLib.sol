// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/Options.sol";

import "../interfaces/ILayerZeroPriceFeed.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IOracleFeeLib.sol";

contract OracleFeeLib is IOracleFeeLib, ERC165 {
    uint16 internal constant EXECUTE_FIXED_BYTES = 68; // encoded: funcSigHash + params -> 4  + (32 * 2)
    uint16 internal constant SIGNATURE_RAW_BYTES = 65; // not encoded
    // callData(updateHash) = 132 (4 + 32 * 4), padded to 32 = 160 and encoded as bytes with an 64 byte overhead = 224
    uint16 internal constant UPDATE_HASH_BYTES = 224;
    uint internal constant NATIVE_DECIMALS_RATE = 1e18;

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IOracleFeeLib).interfaceId || super.supportsInterface(interfaceId);
    }

    // pass through for offchain fee calculation
    function getPrice(ILayerZeroPriceFeed _priceFeed, uint32 _dstEid) public view returns (uint128, uint64) {
        ILayerZeroPriceFeed.Price memory price = _priceFeed.getPrice(_dstEid);
        return (price.priceRatio, price.gasPriceInUnit);
    }

    function getFee(
        FeeParams memory _params,
        IOracle.DstConfig memory _dstConfig,
        bytes memory /* _options */
    ) external view returns (uint) {
        uint totalSignatureBytes = uint(_params.quorum) * SIGNATURE_RAW_BYTES;
        if (totalSignatureBytes % 32 != 0) {
            totalSignatureBytes = totalSignatureBytes - (totalSignatureBytes % 32) + 32;
        }
        // getFee should charge on execute(updateHash)
        // totalSignatureBytesPadded also has 64 overhead for bytes
        uint callDataSize = uint(EXECUTE_FIXED_BYTES) + UPDATE_HASH_BYTES + totalSignatureBytes + 64;
        (uint fee, , , uint128 nativePriceUSD) = ILayerZeroPriceFeed(_params.priceFeed).estimateFeeByEid(
            _params.dstEid,
            callDataSize,
            _dstConfig.gas
        );
        uint16 multiplierBps = _dstConfig.multiplierBps == 0 ? _params.defaultMultiplierBps : _dstConfig.multiplierBps;

        uint feeWithMultiplier = (fee * multiplierBps) / 10000;
        if (nativePriceUSD == 0 || _dstConfig.floorMarginUSD == 0) {
            return feeWithMultiplier;
        }

        uint feeWithFloorMargin = fee + (_dstConfig.floorMarginUSD * NATIVE_DECIMALS_RATE) / nativePriceUSD;

        return feeWithFloorMargin > feeWithMultiplier ? feeWithFloorMargin : feeWithMultiplier;
    }
}
