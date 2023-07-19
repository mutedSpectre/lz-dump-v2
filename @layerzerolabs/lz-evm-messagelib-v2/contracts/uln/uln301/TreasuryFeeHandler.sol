// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/Errors.sol";
import "./interfaces/ITreasuryFeeHandler.sol";

contract TreasuryFeeHandler is ITreasuryFeeHandler {
    using SafeERC20 for IERC20;

    function payFee(
        address _lzToken,
        address _sender,
        address _lzTokenPaymentAddress,
        uint _required,
        uint _supplied,
        address _treasury
    ) external {
        // lz token payment address must equal the sender or the tx.origin otherwise the transaction reverts
        require(_lzTokenPaymentAddress == _sender || _lzTokenPaymentAddress == tx.origin, Errors.INVALID_ARGUMENT);
        require(_required <= _supplied, Errors.INVALID_AMOUNT);

        // send lz token fee to the treasury directly
        IERC20(_lzToken).safeTransferFrom(_lzTokenPaymentAddress, _treasury, _required);
    }
}
