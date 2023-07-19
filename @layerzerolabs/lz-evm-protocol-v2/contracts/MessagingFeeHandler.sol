// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MessagingFeeHandler {
    using SafeERC20 for IERC20;

    address internal immutable altToken; // alternative fee token instead of native
    address internal lzToken;

    constructor(address _altToken) {
        altToken = _altToken;
    }

    function _setLayerZeroToken(address _lzToken) internal {
        lzToken = _lzToken;
    }

    function _payLayerZeroToken(address _sender, uint _required, uint _supplied, address _sendLibrary) internal {
        if (_required == 0) return;

        address token = lzToken; // save one SLOAD
        require(token != address(0x0), "LZD0003");
        require(_required <= _supplied, "LZ10003");
        IERC20(token).safeTransferFrom(_sender, _sendLibrary, _required);
    }

    function _payAltToken(address _sender, uint _required, uint _supplied, address _sendLibrary) internal {
        if (_required == 0) return;

        require(altToken != address(0x0), "LZD0002");
        require(_required <= _supplied, "LZ10003");
        IERC20(altToken).safeTransferFrom(_sender, _sendLibrary, _required);
    }

    function _payNative(
        uint _required,
        uint _supplied,
        address payable _sendLibrary,
        address payable _refundAddress
    ) internal {
        require(altToken == address(0x0), "LZD0001");
        require(_required <= _supplied, "LZ10003");
        if (_required > 0) {
            (bool success, ) = _sendLibrary.call{value: _required}("");
            require(success, "LZ30000");
        }
        if (_required < _supplied) {
            // refund the excess
            (bool success, ) = _refundAddress.call{value: _supplied - _required}("");
            require(success, "LZ30000");
        }
    }
}
