// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./OFTCore.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OFT is OFTCore, ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _localDecimals,
        address _endpoint
    ) ERC20(_name, _symbol) OFTCore(_localDecimals, _endpoint) {
        require(_localDecimals == decimals());
    }

    function token() public view virtual override returns (address) {
        return address(this);
    }

    function _debit(uint _amountLD) internal virtual override returns (uint) {
        uint amountLDSend = _removeDust(_amountLD);

        _burn(msg.sender, amountLDSend);
        return amountLDSend;
    }

    function _credit(address _to, uint _amountLD) internal virtual override returns (uint) {
        _mint(_to, _amountLD);
        return _amountLD;
    }
}
