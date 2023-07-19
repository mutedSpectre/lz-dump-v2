// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLib.sol";
import "./interfaces/ILayerZeroTreasury.sol";

contract Treasury is Ownable, ILayerZeroTreasury, ERC165 {
    uint public nativeBP;
    uint public zroFee;
    bool public feeEnabled;
    bool public zroEnabled;

    event NativeBP(uint bp);
    event ZroFee(uint zroFee);
    event FeeEnabled(bool feeEnabled);
    event ZroEnabled(bool zroEnabled);

    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool) {
        return interfaceId == type(ILayerZeroTreasury).interfaceId || super.supportsInterface(interfaceId);
    }

    function getFees(
        address /*_sender*/,
        uint32 /*_eid*/,
        uint _totalFee,
        bool _payInLzToken
    ) external view override returns (uint) {
        if (feeEnabled) {
            if (_payInLzToken) {
                require(zroEnabled, "LZD0003");
                return zroFee;
            } else {
                return (_totalFee * nativeBP) / 10000;
            }
        }
        return 0;
    }

    function setFeeEnabled(bool _feeEnabled) external onlyOwner {
        feeEnabled = _feeEnabled;
        emit FeeEnabled(_feeEnabled);
    }

    function setZroEnabled(bool _zroEnabled) external onlyOwner {
        zroEnabled = _zroEnabled;
        emit ZroEnabled(_zroEnabled);
    }

    function setNativeFeeBP(uint _nativeBP) external onlyOwner {
        nativeBP = _nativeBP;
        emit NativeBP(_nativeBP);
    }

    function setZroFee(uint _zroFee) external onlyOwner {
        zroFee = _zroFee;
        emit ZroFee(_zroFee);
    }

    function withdrawZroFee(address _messageLib, address _lzToken, address _to, uint _amount) external onlyOwner {
        IMessageLib(_messageLib).withdrawLzTokenFee(_lzToken, _to, _amount);
    }

    function withdrawNativeFee(address _messageLib, address payable _to, uint _amount) external onlyOwner {
        IMessageLib(_messageLib).withdrawFee(_to, _amount);
    }

    // todo: transfer lz token from this contract
}
