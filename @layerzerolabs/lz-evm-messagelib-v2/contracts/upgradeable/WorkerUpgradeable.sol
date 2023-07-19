// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@layerzerolabs/lz-evm-v1-0.8/contracts/interfaces/ILayerZeroUltraLightNodeV2.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLib.sol";
import "../interfaces/ILayerZeroPriceFeed.sol";
import "../interfaces/IWorker.sol";

abstract contract WorkerUpgradeable is Initializable, AccessControlUpgradeable, IWorker {
    bytes32 public constant MESSAGE_LIB_ROLE = keccak256("MESSAGE_LIB_ROLE");
    bytes32 public constant ALLOWLIST = keccak256("ALLOWLIST");
    bytes32 public constant DENYLIST = keccak256("DENYLIST");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public workerFeeLib;

    uint64 public allowlistSize;
    uint16 public defaultMultiplierBps;
    address public priceFeed;

    bool public paused;

    function __Worker_init(
        address[] memory _messageLibs,
        address _priceFeed,
        uint16 _defaultMultiplierBps,
        address _roleAdmin,
        address[] memory _admins
    ) internal onlyInitializing {
        __Worker_init_unchained(_messageLibs, _priceFeed, _defaultMultiplierBps, _roleAdmin, _admins);
    }

    function __Worker_init_unchained(
        address[] memory _messageLibs,
        address _priceFeed,
        uint16 _defaultMultiplierBps,
        address _roleAdmin,
        address[] memory _admins
    ) internal onlyInitializing {
        defaultMultiplierBps = _defaultMultiplierBps;
        priceFeed = _priceFeed;

        _grantRole(DEFAULT_ADMIN_ROLE, _roleAdmin); // _roleAdmin can grant and revoke all roles

        for (uint i = 0; i < _messageLibs.length; i++) {
            _grantRole(MESSAGE_LIB_ROLE, _messageLibs[i]);
        }

        for (uint i = 0; i < _admins.length; i++) {
            _grantRole(ADMIN_ROLE, _admins[i]);
        }
    }

    /// 1) If one address is in the deny list -> deny
    /// 2) else If the allow list is empty (allows everyone) || address in the allow list -> allow
    /// 3) deny otherwise
    modifier onlyAcl(address _sender) {
        if (hasRole(DENYLIST, _sender)) {
            revert("Worker: not allowed");
        } else if (allowlistSize == 0 || hasRole(ALLOWLIST, _sender)) {
            _;
        } else {
            revert("Worker: not allowed");
        }
    }

    modifier whenNotPaused() {
        require(!paused, "Worker: paused");
        _;
    }

    // --- RoleAdmin ---
    function setPaused(bool _paused) external onlyRole(DEFAULT_ADMIN_ROLE) {
        paused = _paused;
    }

    // -- Admin --
    function setPriceFeed(address _priceFeed) external onlyRole(ADMIN_ROLE) {
        priceFeed = _priceFeed;
        emit SetPriceFeed(_priceFeed);
    }

    function setWorkerFeeLib(address _workerFeeLib) external onlyRole(ADMIN_ROLE) {
        _checkWorkerFeeLibInterface(_workerFeeLib);
        workerFeeLib = _workerFeeLib;
        emit SetWorkerLib(_workerFeeLib);
    }

    function setDefaultMultiplierBps(uint16 _multiplierBps) external onlyRole(ADMIN_ROLE) {
        defaultMultiplierBps = _multiplierBps;
        emit SetDefaultMultiplierBps(_multiplierBps);
    }

    function withdrawFee(address _lib, address payable _to, uint _amount) external virtual onlyRole(ADMIN_ROLE) {
        require(hasRole(MESSAGE_LIB_ROLE, _lib), "Worker: Invalid message lib");
        IMessageLib(_lib).withdrawFee(_to, _amount);
        emit Withdraw(_lib, _to, _amount);
    }

    function _checkWorkerFeeLibInterface(address _workerFeeLib) internal view virtual;

    // -- Override ACL --
    function _grantRole(bytes32 role, address account) internal override {
        if (role == ALLOWLIST && !hasRole(role, account)) {
            allowlistSize++;
        }
        super._grantRole(role, account);
    }

    function _revokeRole(bytes32 role, address account) internal override {
        if (role == ALLOWLIST && hasRole(role, account)) {
            allowlistSize--;
        }
        super._revokeRole(role, account);
    }

    function renounceRole(bytes32 /*role*/, address /*account*/) public virtual override {
        revert("Worker: cannot renounce role");
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
