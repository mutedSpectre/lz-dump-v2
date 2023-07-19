// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "@layerzerolabs/lz-evm-v1-0.8/contracts/interfaces/ILayerZeroUltraLightNodeV2.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import "../Worker.sol";
import "./MultiSig.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IOracleFeeLib.sol";
import "./interfaces/IUltraLightNode.sol";

struct ExecuteParam {
    address target;
    bytes callData;
    uint expiration;
    bytes signatures;
}

contract MultiSigOracle is Worker, MultiSig, IOracle {
    mapping(uint32 dstEid => DstConfig) public dstConfig;
    mapping(bytes32 executableHash => bool used) public usedHashes;

    event ExecuteFailed(uint _index, bytes _data);
    event HashAlreadyUsed(ExecuteParam param, bytes32 _hash);

    constructor(
        address[] memory _messageLibs,
        address _priceFeed,
        address[] memory _signers,
        uint64 _quorum,
        address[] memory _admins
    ) Worker(_messageLibs, _priceFeed, 12000, address(0x0), _admins) MultiSig(_signers, _quorum) {}

    // allowlist, denylist, messageLib role can only be granted/revoked by self
    // admin role can only be granted/revoked by admin
    // default role admin doesn't do anything in this case
    modifier onlySelfOrAdmin(bytes32 role) {
        if (role == ALLOWLIST || role == DENYLIST || role == MESSAGE_LIB_ROLE) {
            // self required
            require(address(this) == msg.sender, "Oracle: caller must be self");
        } else if (role == ADMIN_ROLE) {
            // admin required
            _checkRole(ADMIN_ROLE);
        } else {
            revert("Oracle: invalid role");
        }
        _;
    }

    modifier onlySelf() {
        require(address(this) == msg.sender, "Oracle: caller must be self");
        _;
    }

    // --- Only Self ---
    function setSigner(address _signer, bool _active) external onlySelf {
        _setSigner(_signer, _active);
    }

    function setQuorum(uint64 _quorum) external onlySelf {
        _setQuorum(_quorum);
    }

    function signAndDeliver(
        IUltraLightNode _uln,
        bytes calldata _packetHeader,
        bytes32 _payloadHash,
        uint64 _confirmations
    ) external onlySelf {
        require(hasRole(MESSAGE_LIB_ROLE, address(_uln)), "Oracle: invalid uln");
        _uln.oracleSign(_packetHeader, _payloadHash, _confirmations);
        if (_uln.deliverable(_packetHeader, _payloadHash) == IUltraLightNode.DeliveryState.Deliverable) {
            _uln.deliver(_packetHeader, _payloadHash);
        }
    }

    // --- Only Self / Only Admin (Override ACL) ---
    function grantRole(bytes32 role, address account) public virtual override onlySelfOrAdmin(role) {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual override onlySelfOrAdmin(role) {
        _revokeRole(role, account);
    }

    // --- Admin ---
    function setDstConfig(DstConfigParam[] memory _params) external onlyRole(ADMIN_ROLE) {
        for (uint i = 0; i < _params.length; i++) {
            DstConfigParam memory param = _params[i];
            dstConfig[param.dstEid] = DstConfig(param.gas, param.multiplierBps, param.floorMarginUSD);
        }
        emit SetDstConfig(_params);
    }

    // signer can call this function to:
    // 1. submit(and deliver) a block data to ULN
    // 2. change configuration of this oracle
    // execute will emit an error event on failure of a call, but will continue to execute the rest of the calls
    // also supports both ulv2 and uln301 of EndpointV1
    function execute(ExecuteParam[] calldata _params) external onlyRole(ADMIN_ROLE) {
        for (uint i = 0; i < _params.length; i++) {
            ExecuteParam calldata param = _params[i];

            // 1. skip if expired
            if (param.expiration <= block.timestamp) {
                continue;
            }

            // generate and validate hash
            bytes32 hash = hashCallData(param.target, param.callData, param.expiration);

            // 2. skip if hash used
            if (_shouldCheckHash(bytes4(param.callData))) {
                if (usedHashes[hash]) {
                    emit HashAlreadyUsed(param, hash);
                    continue;
                } else {
                    usedHashes[hash] = true; // prevent reentry and replay attack
                }
            }
            // 3. check signatures
            if (verifySignatures(hash, param.signatures)) {
                // execute call data
                (bool success, bytes memory rtnData) = param.target.call(param.callData);
                if (!success) {
                    emit ExecuteFailed(i, rtnData);
                }
            }
        }
    }

    // NOTE: to support ulnv2
    function withdrawFeeFromUlnV2(address _lib, address payable _to, uint _amount) external onlyRole(ADMIN_ROLE) {
        require(hasRole(MESSAGE_LIB_ROLE, _lib), "Oracle: Invalid message lib");
        ILayerZeroUltraLightNodeV2(_lib).withdrawNative(_to, _amount);
    }

    // --- Message Lib ---
    function assignJob(
        uint32 _dstEid,
        uint64 _confirmations,
        address _sender,
        bytes calldata _options
    ) external payable onlyRole(MESSAGE_LIB_ROLE) returns (uint totalFee) {
        totalFee = getFee(_dstEid, _confirmations, _sender, _options);
        emit AssignJob(_dstEid, _sender, _confirmations, totalFee);
    }

    // NOTE: to support ulnv2
    function assignJob(
        uint16 _dstEid,
        uint16 /*_outboundProofType*/,
        uint64 _confirmations,
        address _sender
    ) external onlyRole(MESSAGE_LIB_ROLE) returns (uint totalFee) {
        uint32 dstEid = uint32(_dstEid);
        totalFee = getFee(dstEid, _confirmations, _sender, bytes(""));
        emit AssignJob(dstEid, _sender, _confirmations, totalFee);
    }

    // --- Only ACL ---
    function getFee(
        uint32 _dstEid,
        uint64 _confirmations,
        address _sender,
        bytes memory _options
    ) public view onlyAcl(_sender) returns (uint fee) {
        IOracleFeeLib.FeeParams memory params = IOracleFeeLib.FeeParams(
            priceFeed,
            _dstEid,
            _confirmations,
            _sender,
            quorum,
            defaultMultiplierBps
        );
        return IOracleFeeLib(workerFeeLib).getFee(params, dstConfig[_dstEid], _options);
    }

    // NOTE: to support ulnv2
    function getFee(
        uint16 _dstEid,
        uint16 /*_outboundProofType*/,
        uint64 _confirmations,
        address _sender
    ) external view onlyAcl(_sender) returns (uint fee) {
        IOracleFeeLib.FeeParams memory params = IOracleFeeLib.FeeParams(
            priceFeed,
            _dstEid,
            _confirmations,
            _sender,
            quorum,
            defaultMultiplierBps
        );
        return IOracleFeeLib(workerFeeLib).getFee(params, dstConfig[_dstEid], bytes(""));
    }

    // --- View ---
    function hashCallData(address _target, bytes calldata _callData, uint _expiration) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_target, _expiration, _callData));
    }

    // --- Internal ---
    function _checkWorkerFeeLibInterface(address _workerFeeLib) internal view override {
        require(
            IERC165(_workerFeeLib).supportsInterface(type(IOracleFeeLib).interfaceId),
            "Oracle: worker fee lib does not implement IOracleFeeLib"
        );
    }

    function _shouldCheckHash(bytes4 _functionSig) internal pure returns (bool) {
        // never check for these selectors to save gas
        return
            _functionSig != IUltraLightNode.oracleSign.selector && // replaying won't change the state
            _functionSig != this.signAndDeliver.selector && // replaying calls deliver on top of oracleSign, which will be rejected at uln if not deliverable
            _functionSig != ILayerZeroUltraLightNodeV2.updateHash.selector; // replaying will be revert at uln
    }
}
