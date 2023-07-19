// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../OFT.sol";

contract TestOFT is OFT {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _localDecimals,
        address _endpoint
    ) OFT(_name, _symbol, _localDecimals, _endpoint) {}

    // @dev test mock token with publicly exposed mint function, do NOT use in production
    function mint(address _to, uint _amount) external {
        _mint(_to, _amount);
    }
}
