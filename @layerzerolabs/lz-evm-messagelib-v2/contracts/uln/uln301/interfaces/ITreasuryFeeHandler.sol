// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface ITreasuryFeeHandler {
    function payFee(
        address _lzToken,
        address _sender,
        address _lzTokenPaymentAddress,
        uint _required,
        uint _supplied,
        address _treasury
    ) external;
}
