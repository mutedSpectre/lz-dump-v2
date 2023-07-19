// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./OFTCore.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract OFTAdapter is OFTCore {
    using SafeERC20 for IERC20;

    IERC20 internal immutable proxiedToken;

    constructor(address _token, uint8 _localDecimals, address _endpoint) OFTCore(_localDecimals, _endpoint) {
        proxiedToken = IERC20(_token);

        (bool success, bytes memory data) = _token.staticcall(abi.encodeWithSignature("decimals()"));
        require(success);

        uint8 decimals = abi.decode(data, (uint8));
        require(_localDecimals == decimals);
    }

    function token() public view virtual returns (address) {
        return address(proxiedToken);
    }

    function _debit(uint _amountLD) internal virtual override returns (uint) {
        uint amountLDSend = _removeDust(_amountLD);

        // @dev msg.sender will need to approve this amountLD of tokens to be locked inside of the contract
        proxiedToken.safeTransferFrom(msg.sender, address(this), amountLDSend);
        return amountLDSend;
    }

    function _credit(address _to, uint _amountLD) internal virtual override returns (uint) {
        proxiedToken.safeTransfer(_to, _amountLD);
        return _amountLD;
    }
}
