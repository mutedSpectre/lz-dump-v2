// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/Errors.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IPacket.sol";

import "./interfaces/ILayerZeroExecutor.sol";
import "./interfaces/ILayerZeroTreasury.sol";
import "./interfaces/IMessageLibBase.sol";

struct WorkerOptions {
    uint8 workerId;
    bytes options;
}

abstract contract MessageLibBase is IMessageLibBase, Ownable {
    address internal immutable endpoint;
    uint32 internal immutable localEid;
    uint8 internal immutable packetVersion;
    uint internal immutable treasuryGasCap;

    // config
    address public treasury;
    mapping(uint32 dstEid => bytes option) public defaultOptions;

    // accumulated fees for workers and treasury
    mapping(address worker => uint) public fees;

    event ExecutorFeePaid(address executor, uint fee);

    // only the endpoint can call SEND() and setConfig()
    modifier onlyEndpoint() {
        require(endpoint == msg.sender, Errors.PERMISSION_DENIED);
        _;
    }

    constructor(address _endpoint, uint32 _localEid, uint8 _packetVersion, uint _treasuryGasCap) {
        endpoint = _endpoint;
        localEid = _localEid;
        packetVersion = _packetVersion;
        treasuryGasCap = _treasuryGasCap;
    }

    // ======================= OnlyOwner =======================
    function setDefaultOptions(uint32 _dstEid, bytes calldata _options) external onlyOwner {
        defaultOptions[_dstEid] = _options;
    }

    // ======================= Internal =======================
    function _assertMessageSize(uint _actual, uint _max) internal pure {
        require(_actual <= _max, Errors.INVALID_SIZE);
    }

    function _sendToExecutor(
        address _executor,
        uint32 _dstEid,
        address _sender,
        uint _msgSize,
        bytes memory _executorOptions
    ) internal returns (uint executorFee) {
        executorFee = ILayerZeroExecutor(_executor).assignJob(_dstEid, _sender, _msgSize, _executorOptions);
        if (executorFee > 0) {
            fees[_executor] += executorFee;
        }
        emit ExecutorFeePaid(_executor, executorFee);
    }

    function _sendToTreasury(
        address _sender,
        uint32 _dstEid,
        uint _totalNativeFee,
        bool _payInLzToken
    ) internal returns (uint treasuryNativeFee, uint lzTokenFee) {
        // fee should be in lzTokenFee if payInLzToken, otherwise in native
        (treasuryNativeFee, lzTokenFee) = _quoteTreasuryFee(_sender, _dstEid, _totalNativeFee, _payInLzToken);
        // if payInLzToken, handle in messagelib / endpoint
        if (treasuryNativeFee > 0) {
            fees[treasury] += treasuryNativeFee;
        }
    }

    function _getWorkerOptions(
        uint32 _dstEid,
        bytes calldata _options
    )
        internal
        view
        returns (bytes memory options, bytes memory executorOptions, WorkerOptions[] memory otherWorkerOptions)
    {
        // use default if no option provided
        if (_options.length == 0) {
            options = defaultOptions[_dstEid];
        } else {
            options = _options;
        }

        // split options by worker type
        if (options.length > 0) (executorOptions, otherWorkerOptions) = _getExecutorOptions(options);
    }

    function _quote(
        address _sender,
        uint32 _dstEid,
        uint _msgSize,
        bool _payInLzToken,
        bytes calldata _options
    ) internal view returns (uint, uint) {
        (, bytes memory executorOptions, WorkerOptions[] memory otherWorkerOptions) = _getWorkerOptions(
            _dstEid,
            _options
        );

        // quote other workers
        (uint nativeFee, address executor, uint maxMsgSize) = _quoteWorkers(_sender, _dstEid, otherWorkerOptions);

        // assert msg size
        _assertMessageSize(_msgSize, maxMsgSize);

        // quote executor
        nativeFee += ILayerZeroExecutor(executor).getFee(_dstEid, _sender, _msgSize, executorOptions);

        // quote treasury
        (uint treasuryNativeFee, uint lzTokenFee) = _quoteTreasuryFee(_sender, _dstEid, nativeFee, _payInLzToken);
        if (treasuryNativeFee > 0) {
            nativeFee += treasuryNativeFee;
        }

        return (nativeFee, lzTokenFee);
    }

    function _quoteTreasuryFee(
        address _sender,
        uint32 _eid,
        uint _totalFee,
        bool _payInLzToken
    ) internal view returns (uint nativeFee, uint lzTokenFee) {
        if (treasury != address(0x0)) {
            try ILayerZeroTreasury(treasury).getFee(_sender, _eid, _totalFee, _payInLzToken) returns (
                uint treasuryFee
            ) {
                // success
                if (_payInLzToken) {
                    lzTokenFee = treasuryFee;
                } else {
                    // pay in native, make sure that the treasury fee is not higher than the cap
                    uint gasFeeEstimate = tx.gasprice * treasuryGasCap;
                    // cap is the max of total fee and gasFeeEstimate. this is to prevent apps from forcing the cap to 0.
                    uint nativeFeeCap = _totalFee > gasFeeEstimate ? _totalFee : gasFeeEstimate;
                    // to prevent the treasury from returning an overly high value to break the path
                    nativeFee = treasuryFee > nativeFeeCap ? nativeFeeCap : treasuryFee;
                }
            } catch {
                // failure, something wrong with treasury contract, charge nothing and continue
            }
        }
    }

    function _transferNative(address _to, uint _amount) internal {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, Errors.INVALID_STATE);
    }

    // for msg.sender only
    function _assertAndDebitAmount(address _to, uint _amount) internal {
        require(_to != address(0x0) && _amount <= fees[msg.sender], Errors.INVALID_ARGUMENT);
        fees[msg.sender] -= _amount;
    }

    // ======================= Virtual =======================
    // For implementation to override
    function _quoteWorkers(
        address _oapp,
        uint32 _eid,
        WorkerOptions[] memory _options
    ) internal view virtual returns (uint, address, uint);

    function _getExecutorOptions(
        bytes memory _options
    ) internal view virtual returns (bytes memory executorOptions, WorkerOptions[] memory otherWorkerOptions);
}
