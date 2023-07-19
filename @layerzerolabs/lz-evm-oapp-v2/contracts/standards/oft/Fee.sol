// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// TODO not finished yet
abstract contract Fee is Ownable {
    uint public constant BP_DENOMINATOR = 10000;

    mapping(uint32 => FeeConfig) public dstEidToFeeBps;
    uint16 public defaultFeeBp;
    address public feeOwner; // defaults to owner
    //    bool public feesEnabled;

    struct FeeConfig {
        uint16 feeBP;
        bool enabled;
    }

    event SetFeeBp(uint32 dstEid, bool enabled, uint16 feeBp);
    event SetDefaultFeeBp(uint16 feeBp);
    event SetFeeOwner(address feeOwner);
    event SetFeesEnabled(bool isEnabled);

    constructor() {
        feeOwner = owner();
    }

    //    function setFeesEnabled(bool _isEnabled) public virtual onlyOwner {
    //        feesEnabled = _isEnabled;
    //        emit SetFeesEnabled(feesEnabled);
    //    }

    function setDefaultFeeBp(uint16 _feeBp) public virtual onlyOwner {
        require(_feeBp <= BP_DENOMINATOR, "Fee: fee bp must be <= BP_DENOMINATOR");
        defaultFeeBp = _feeBp;
        emit SetDefaultFeeBp(defaultFeeBp);
    }

    function setFeeBp(uint32 _dstEid, bool _enabled, uint16 _feeBp) public virtual onlyOwner {
        require(_feeBp <= BP_DENOMINATOR, "Fee: fee bp must be <= BP_DENOMINATOR");
        dstEidToFeeBps[_dstEid] = FeeConfig(_feeBp, _enabled);
        emit SetFeeBp(_dstEid, _enabled, _feeBp);
    }

    function setFeeOwner(address _feeOwner) public virtual onlyOwner {
        require(_feeOwner != address(0x0), "Fee: feeOwner cannot be 0x");
        feeOwner = _feeOwner;
        emit SetFeeOwner(_feeOwner);
    }

    function quoteOFTFee(uint32 _dstEid, uint _amount) public view virtual returns (uint fee) {
        FeeConfig memory config = dstEidToFeeBps[_dstEid];
        if (config.enabled) {
            fee = (_amount * config.feeBP) / BP_DENOMINATOR;
        } else if (defaultFeeBp > 0) {
            fee = (_amount * defaultFeeBp) / BP_DENOMINATOR;
        } else {
            fee = 0;
        }
    }
}
