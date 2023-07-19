// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "hardhat-deploy/solc_0.8/proxy/Proxied.sol";

import "./uln/interfaces/IUltraLightNode.sol";
import "./interfaces/IExecutor.sol";
import "./interfaces/IExecutorFeeLib.sol";
import "./upgradeable/WorkerUpgradeable.sol";

contract Executor is WorkerUpgradeable, ReentrancyGuardUpgradeable, Proxied, IExecutor {
    mapping(uint32 dstEid => DstConfig) public dstConfig;
    address public endpoint;
    address public uln301;

    function initialize(
        address _endpoint,
        address _uln301,
        address[] memory _messageLibs,
        address _priceFeed,
        address _roleAdmin,
        address[] memory _admins
    ) public proxied initializer {
        __Worker_init(_messageLibs, _priceFeed, 12000, _roleAdmin, _admins);
        endpoint = _endpoint;
        uln301 = _uln301;
    }

    // --- Admin ---
    function setDstConfig(DstConfigParam[] memory _params) external onlyRole(ADMIN_ROLE) {
        for (uint i = 0; i < _params.length; i++) {
            DstConfigParam memory param = _params[i];
            dstConfig[param.dstEid] = DstConfig(
                param.baseGas,
                param.multiplierBps,
                param.floorMarginUSD,
                param.airdropCap
            );
        }
        emit SetDstConfig(_params);
    }

    function airdropAndExecute301(
        AirdropParams calldata _airdropParams,
        bytes calldata _packet,
        uint _gasLimit
    ) external payable onlyRole(ADMIN_ROLE) nonReentrant {
        _airdrop(_airdropParams);
        IUltraLightNode(uln301).deliver(_packet, _gasLimit);
    }

    function airdropAndExecute302(
        AirdropParams calldata _airdropParams,
        ExecutionParams calldata _executionParams
    ) external payable onlyRole(ADMIN_ROLE) nonReentrant {
        _airdrop(_airdropParams);

        uint value = msg.value - _airdropParams.amount;
        // ignore the execution result
        ILayerZeroEndpoint(endpoint).lzReceive{value: value, gas: _executionParams.gasLimit}(
            _executionParams.origin,
            _executionParams.receiver,
            _executionParams.guid,
            _executionParams.message,
            _executionParams.callerParams
        );
    }

    // --- Message Lib ---
    function assignJob(
        uint32 _dstEid,
        address _sender,
        uint _calldataSize,
        bytes calldata _options
    ) external payable onlyRole(MESSAGE_LIB_ROLE) returns (uint fee) {
        fee = getFee(_dstEid, _sender, _calldataSize, _options);
    }

    // --- Only ACL ---
    function getFee(
        uint32 _dstEid,
        address _sender,
        uint _calldataSize,
        bytes calldata _options
    ) public view onlyAcl(_sender) whenNotPaused returns (uint fee) {
        IExecutorFeeLib.FeeParams memory params = IExecutorFeeLib.FeeParams(
            priceFeed,
            _dstEid,
            _sender,
            _calldataSize,
            defaultMultiplierBps
        );
        return IExecutorFeeLib(workerFeeLib).getFee(params, dstConfig[_dstEid], _options);
    }

    // --- Internal ---
    function _checkWorkerFeeLibInterface(address _workerFeeLib) internal view override {
        require(
            IERC165(_workerFeeLib).supportsInterface(type(IExecutorFeeLib).interfaceId),
            "Executor: worker fee lib does not implement IExecutorFeeLib"
        );
    }

    function _airdrop(AirdropParams calldata _airdropParams) internal {
        (bool sent, ) = _airdropParams.receiver.call{value: _airdropParams.amount, gas: _airdropParams.gasLimit}("");
        if (!sent) {
            emit AirdropFailed(_airdropParams.receiver, _airdropParams.amount);
        }
    }
}
