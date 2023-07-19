// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import {OutboundConfigStruct} from "../OutboundConfig.sol";
import {IUlnConfig, UlnConfigStruct} from "./interfaces/IUlnConfig.sol";
import "./interfaces/ILayerZeroVerifier.sol";
import "./libs/UlnOptions.sol";
import {WorkerOptions} from "../MessageLibBase.sol";

/// @dev includes the utility functions for checking ULN states and logics
contract UlnBase {
    mapping(bytes32 headerHash => mapping(bytes32 payloadHash => mapping(address verifier => uint64 confirmations)))
        public hashLookup;
    IUlnConfig internal immutable ulnConfig;

    event PayloadSigned(address verifier, bytes header, uint confirmations, bytes32 proofHash);
    event VerifierFeePaid(address[] verifiers, address[] optionalVerifiers, uint[] fees);

    constructor(address _ulnConfig) {
        ulnConfig = IUlnConfig(_ulnConfig);
    }

    // ============================ View ===================================
    function verified(
        address _verifier,
        bytes32 _headerHash,
        bytes32 _payloadHash,
        uint64 _requiredConfirmation
    ) public view returns (bool) {
        uint64 verifiedConfirmations = hashLookup[_headerHash][_payloadHash][_verifier];
        // return true if the verifier has signed enough confirmations
        return verifiedConfirmations >= _requiredConfirmation;
    }

    /// @dev requires that the MUST-Verifiers have signed the payload and there is enough OPTIONAL-Verifiers signed
    function verifyConditionMet(
        UlnConfigStruct memory _config,
        bytes32 _headerHash,
        bytes32 _payloadHash
    ) public view returns (bool) {
        uint64 requiredConfirmations = _config.inboundConfirmations;
        // iterate the must-have verifiers
        unchecked {
            for (uint i = 0; i < _config.verifierCount; ++i) {
                if (!verified(_config.verifiers[i], _headerHash, _payloadHash, requiredConfirmations)) {
                    // return false if any of the must-have verifiers haven't signed
                    return false;
                }
            }

            if (_config.verifierCount > 0 && _config.optionalVerifierCount == 0) {
                // returns true if all must-have verifiers have signed and there are no optional verifiers
                return true;
            } else {
                // then the optional ones
                uint optionalCount = 0;
                for (uint i = 0; i < _config.optionalVerifierCount; ++i) {
                    if (verified(_config.optionalVerifiers[i], _headerHash, _payloadHash, requiredConfirmations)) {
                        // increment the optional count if the optional verifier has signed
                        ++optionalCount;
                        if (optionalCount >= _config.optionalVerifierThreshold) {
                            // early return if the optional threshold has hit
                            return true;
                        }
                    }
                }
            }
        }

        // return false by default as a catch-all
        return false;
    }

    // ============================ Internal ===================================
    function _getVerifierFees(
        UlnConfigStruct memory _config,
        uint32 _dstEid,
        uint64 _outboundConfirmations,
        address _sender,
        bytes[] memory _optionsArray,
        uint8[] memory _verifierIds
    ) internal view returns (uint totalFee) {
        uint8 verifiersLength = _config.verifierCount + _config.optionalVerifierCount;
        for (uint i = 0; i < verifiersLength; ) {
            address verifier;
            bytes memory options;
            unchecked {
                verifier = i < _config.verifierCount
                    ? _config.verifiers[i]
                    : _config.optionalVerifiers[i - _config.verifierCount];

                for (uint j = 0; j < _verifierIds.length; ++j) {
                    if (_verifierIds[j] == i) {
                        options = _optionsArray[j];
                        break;
                    }
                }
            }
            totalFee += ILayerZeroVerifier(verifier).getFee(_dstEid, _outboundConfirmations, _sender, options);

            unchecked {
                ++i;
            }
        }
    }

    function _assignJobToVerifiers(
        mapping(address => uint) storage _fees,
        UlnConfigStruct memory _config,
        uint32 _dstEid,
        uint64 _outboundConfirmations,
        address _sender,
        bytes[] memory _optionsArray,
        uint8[] memory _verifierIds
    ) internal returns (uint totalFee, uint[] memory verifierFees) {
        uint8 verifiersLength = _config.verifierCount + _config.optionalVerifierCount;
        verifierFees = new uint[](verifiersLength);
        uint j = 0;
        for (uint i = 0; i < verifiersLength; ) {
            address verifier;
            bytes memory options;
            unchecked {
                verifier = i < _config.verifierCount
                    ? _config.verifiers[i]
                    : _config.optionalVerifiers[i - _config.verifierCount];
                if (_verifierIds.length > 0 && i == _verifierIds[j]) {
                    options = _optionsArray[j++];
                }
            }

            verifierFees[i] = ILayerZeroVerifier(verifier).assignJob(_dstEid, _outboundConfirmations, _sender, options);
            if (verifierFees[i] > 0) {
                _fees[verifier] += verifierFees[i];
                totalFee += verifierFees[i];
            }

            unchecked {
                ++i;
            }
        }
    }

    function _getExecutorOptionsInternal(
        bytes memory _options
    ) internal pure returns (bytes memory, WorkerOptions[] memory) {
        (bytes memory executorOpts, bytes memory verifierOpts) = UlnOptions.decode(_options);

        if (verifierOpts.length == 0) {
            return (executorOpts, new WorkerOptions[](0));
        }

        WorkerOptions[] memory workerOpts = new WorkerOptions[](1);
        workerOpts[0] = WorkerOptions(VerifierOptions.WORKER_ID, verifierOpts);
        return (executorOpts, workerOpts);
    }

    function _ulnSend(
        mapping(address => uint) storage _fees,
        WorkerOptions[] memory _options,
        address _sender,
        uint32 _dstEid
    ) internal returns (uint totalFee, address executor, uint maxMsgSize) {
        (UlnConfigStruct memory config, OutboundConfigStruct memory outboundConfig) = ulnConfig.getUlnAndOutboundConfig(
            _sender,
            _dstEid
        );
        executor = outboundConfig.executor;
        maxMsgSize = outboundConfig.maxMessageSize;

        // if options is not empty, it must be verifier options
        bytes memory verifierOptions = _options.length == 0 ? bytes("") : _options[0].options;
        (bytes[] memory optionsArray, uint8[] memory verifierIndices) = VerifierOptions.groupVerifierOptionsByIdx(
            verifierOptions
        );

        uint[] memory verifierFees;
        (totalFee, verifierFees) = _assignJobToVerifiers(
            _fees,
            config,
            _dstEid,
            outboundConfig.outboundConfirmations,
            _sender,
            optionsArray,
            verifierIndices
        );

        emit VerifierFeePaid(config.verifiers, config.optionalVerifiers, verifierFees);
    }

    function _quoteUlnWorkers(
        address _sender,
        uint32 _dstEid,
        WorkerOptions[] memory _options
    ) internal view returns (uint totalFee, address executor, uint maxMsgSize) {
        (UlnConfigStruct memory config, OutboundConfigStruct memory outboundConfig) = ulnConfig.getUlnAndOutboundConfig(
            _sender,
            _dstEid
        );
        executor = outboundConfig.executor;
        maxMsgSize = outboundConfig.maxMessageSize;

        // if options is not empty, it must be verifier options
        bytes memory verifierOptions = _options.length == 0 ? bytes("") : _options[0].options;
        (bytes[] memory optionsArray, uint8[] memory verifierIndices) = VerifierOptions.groupVerifierOptionsByIdx(
            verifierOptions
        );

        totalFee = _getVerifierFees(
            config,
            _dstEid,
            outboundConfig.outboundConfirmations,
            _sender,
            optionsArray,
            verifierIndices
        );
    }

    function _verify(bytes calldata _packetHeader, bytes32 _payloadHash, uint64 _confirmations) internal {
        hashLookup[keccak256(_packetHeader)][_payloadHash][msg.sender] = _confirmations;
        emit PayloadSigned(msg.sender, _packetHeader, _confirmations, _payloadHash);
    }
}
