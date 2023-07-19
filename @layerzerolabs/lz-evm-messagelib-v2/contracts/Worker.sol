// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLib.sol";
import "./interfaces/ILayerZeroPriceFeed.sol";
import "./interfaces/IWorker.sol";

abstract contract Worker is AccessControl, IWorker {
    bytes32 internal constant MESSAGE_LIB_ROLE = keccak256("MESSAGE_LIB_ROLE");
    bytes32 internal constant ALLOWLIST = keccak256("ALLOWLIST");
    bytes32 internal constant DENYLIST = keccak256("DENYLIST");
    bytes32 internal constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public workerFeeLib;

    uint64 public allowlistSize;
    uint16 public defaultMultiplierBps;
    address public priceFeed;

    bool public paused;

    // ========================= Constructor =========================

    /// @param _messageLibs array of message lib addresses that are granted the MESSAGE_LIB_ROLE
    /// @param _priceFeed price feed address
    /// @param _defaultMultiplierBps default multiplier for worker fee
    /// @param _roleAdmin address that is granted the DEFAULT_ADMIN_ROLE (can grant and revoke all roles)
    /// @param _admins array of admin addresses that are granted the ADMIN_ROLE
    constructor(
        address[] memory _messageLibs,
        address _priceFeed,
        uint16 _defaultMultiplierBps,
        address _roleAdmin,
        address[] memory _admins
    ) {
        defaultMultiplierBps = _defaultMultiplierBps;
        priceFeed = _priceFeed;

        _grantRole(DEFAULT_ADMIN_ROLE, _roleAdmin); // _roleAdmin can grant and revoke all roles

        for (uint i = 0; i < _messageLibs.length; ++i) {
            _grantRole(MESSAGE_LIB_ROLE, _messageLibs[i]);
        }

        for (uint i = 0; i < _admins.length; ++i) {
            _grantRole(ADMIN_ROLE, _admins[i]);
        }
    }

    // ========================= Modifier =========================

    /// @dev Access control list using allowlist and denylist
    /// @dev 1) if one address is in the denylist -> deny
    /// @dev 2) else if address in the allowlist OR allowlist is empty (allows everyone)-> allow
    /// @dev 3) else deny
    /// @param _sender address to check
    modifier onlyAcl(address _sender) {
        if (hasRole(DENYLIST, _sender)) {
            revert("Worker: not allowed");
        } else if (allowlistSize == 0 || hasRole(ALLOWLIST, _sender)) {
            _;
        } else {
            revert("Worker: not allowed");
        }
    }

    /// @dev can be used to pause execution of workers
    modifier whenNotPaused() {
        require(!paused, "Worker: paused");
        _;
    }

    // ========================= OnyDefaultAdmin =========================

    /// @dev flag to pause execution of workers (if used with whenNotPaused modifier)
    /// @param _paused true to pause, false to unpause
    function setPaused(bool _paused) external onlyRole(DEFAULT_ADMIN_ROLE) {
        paused = _paused;
    }

    // ========================= OnlyAdmin =========================

    /// @param _priceFeed price feed address
    function setPriceFeed(address _priceFeed) external onlyRole(ADMIN_ROLE) {
        priceFeed = _priceFeed;
        emit SetPriceFeed(_priceFeed);
    }

    /// @param _workerFeeLib worker fee lib address
    function setWorkerFeeLib(address _workerFeeLib) external onlyRole(ADMIN_ROLE) {
        workerFeeLib = _workerFeeLib;
        emit SetWorkerLib(_workerFeeLib);
    }

    /// @param _multiplierBps default multiplier for worker fee
    function setDefaultMultiplierBps(uint16 _multiplierBps) external onlyRole(ADMIN_ROLE) {
        defaultMultiplierBps = _multiplierBps;
        emit SetDefaultMultiplierBps(_multiplierBps);
    }

    /// @dev supports withdrawing fee from ULN301, ULN302 and more
    /// @param _lib message lib address
    /// @param _to address to withdraw fee to
    /// @param _amount amount to withdraw
    function withdrawFee(address _lib, address _to, uint _amount) external onlyRole(ADMIN_ROLE) {
        require(hasRole(MESSAGE_LIB_ROLE, _lib), "Worker: Invalid message lib");
        IMessageLib(_lib).withdrawFee(_to, _amount);
        emit Withdraw(_lib, _to, _amount);
    }

    /// @dev overrides AccessControl to allow for counting of allowlistSize
    /// @param _role role to grant
    /// @param _account address to grant role to
    function _grantRole(bytes32 _role, address _account) internal override {
        if (_role == ALLOWLIST && !hasRole(_role, _account)) {
            ++allowlistSize;
        }
        super._grantRole(_role, _account);
    }

    /// @dev overrides AccessControl to allow for counting of allowlistSize
    /// @param _role role to revoke
    /// @param _account address to revoke role from
    function _revokeRole(bytes32 _role, address _account) internal override {
        if (_role == ALLOWLIST && hasRole(_role, _account)) {
            --allowlistSize;
        }
        super._revokeRole(_role, _account);
    }

    /// @dev overrides AccessControl to disable renouncing of roles
    function renounceRole(bytes32 /*role*/, address /*account*/) public pure override {
        revert("Worker: cannot renounce role");
    }
}
