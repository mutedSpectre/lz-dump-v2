// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "solidity-bytes-utils/contracts/BytesLib.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/Options.sol";

library TreasuryOptions {
    using BytesLib for bytes;

    uint16 public constant WORKER_ID = type(uint16).max;

    uint16 public constant OPTION_TYPE_TREASURY_FEE = 1;

    function decodeTreasuryFeeParams(bytes memory _params) internal pure returns (uint) {
        require(_params.length == 32, "LZ10009");
        return _params.toUint256(0);
    }

    function encodeTreasuryFeeOption(uint _fee) internal pure returns (Options.Option memory) {
        bytes memory params = abi.encodePacked(_fee);
        return Options.Option(OPTION_TYPE_TREASURY_FEE, params);
    }
}
