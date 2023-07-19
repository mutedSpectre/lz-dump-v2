// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLib.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/Errors.sol";
import "./interfaces/ILayerZeroTreasury.sol";

contract Treasury is Ownable, ILayerZeroTreasury {
    using SafeERC20 for IERC20;

    uint public nativeBP;
    // todo: merge into one slot
    uint public lzTokenFee;
    bool public lzTokenEnabled;

    function getFee(
        address /*_sender*/,
        uint32 /*_eid*/,
        uint _totalFee,
        bool _payInLzToken
    ) external view override returns (uint) {
        if (_payInLzToken) {
            require(lzTokenEnabled, Errors.TOKEN_UNAVAILABLE);
            return lzTokenFee;
        } else {
            return (_totalFee * nativeBP) / 10000;
        }
    }

    function setLzTokenEnabled(bool _zroEnabled) external onlyOwner {
        lzTokenEnabled = _zroEnabled;
    }

    function setNativeFeeBP(uint _nativeBP) external onlyOwner {
        nativeBP = _nativeBP;
    }

    function setLzToken(uint _zroFee) external onlyOwner {
        lzTokenFee = _zroFee;
    }

    function withdrawLzToken(address _messageLib, address _lzToken, address _to, uint _amount) external onlyOwner {
        IMessageLib(_messageLib).withdrawLzTokenFee(_lzToken, _to, _amount);
    }

    // this is for withdrawing lz token sent to this contract by uln301 and fee handler
    function withdrawLzToken(address _lzToken, address _to, uint _amount) external onlyOwner {
        IERC20(_lzToken).safeTransfer(_to, _amount);
    }

    function withdrawNativeFee(address _messageLib, address payable _to, uint _amount) external onlyOwner {
        IMessageLib(_messageLib).withdrawFee(_to, _amount);
    }
}
