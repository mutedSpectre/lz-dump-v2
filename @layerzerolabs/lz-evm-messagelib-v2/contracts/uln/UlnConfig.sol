// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/Errors.sol";
import "./interfaces/IUlnConfig.sol";
import {OutboundConfig} from "../OutboundConfig.sol";

contract UlnConfig is OutboundConfig, IUlnConfig, Ownable {
    using SafeCast for uint;

    // Application config, extending from OutboundConfig
    uint32 private constant CONFIG_TYPE_INBOUND_CONFIRMATIONS = 4;
    uint32 private constant CONFIG_TYPE_VERIFIERS = 5;
    uint32 private constant CONFIG_TYPE_OPTIONAL_VERIFIERS = 6;

    mapping(address oapp => mapping(uint32 eid => UlnConfigStruct)) internal ulnConfig;
    mapping(uint32 eid => UlnConfigStruct) internal defaultUlnConfig;
    address public uln;

    modifier onlyUln() {
        require(msg.sender == uln, Errors.PERMISSION_DENIED);
        _;
    }

    // ============================ OnlyOwner ===================================

    function setUln(address _uln) external onlyOwner {
        require(uln == address(0), Errors.ALREADY_EXISTS); // only set once
        uln = _uln;
    }

    function setDefaultConfig(SetDefaultConfigParam[] calldata _params) external onlyOwner {
        for (uint i = 0; i < _params.length; ++i) {
            SetDefaultConfigParam calldata param = _params[i];

            uint verifierCount = param.verifiers.length;
            uint optionalVerifierCount = param.optionalVerifiers.length;

            require(param.inboundConfirmations > 0, Errors.INVALID_ARGUMENT);
            require(verifierCount + optionalVerifierCount <= type(uint8).max, Errors.INVALID_SIZE);
            require(param.optionalVerifierThreshold <= optionalVerifierCount, Errors.INVALID_SIZE);
            require(verifierCount > 0 || param.optionalVerifierThreshold > 0, Errors.INVALID_VERIFIERS);
            // we can only assert the nonce duplication in each list respectively. the two lists might have duplicated ones
            // should do sanity check before submitting to the config here
            _assertNoDuplicates(param.verifiers, verifierCount);
            _assertNoDuplicates(param.optionalVerifiers, optionalVerifierCount);

            defaultUlnConfig[param.eid] = UlnConfigStruct(
                param.inboundConfirmations,
                false, // unused for default config
                false, // unused for default config
                uint8(verifierCount),
                uint8(optionalVerifierCount),
                param.optionalVerifierThreshold,
                param.verifiers,
                param.optionalVerifiers
            );

            _setDefaultOutboundConfig(param.eid, param.outboundConfig);
        }
    }

    // ============================ OnlyUln =====================================

    function setConfigByType(
        uint32 _remoteEid,
        address _oapp,
        uint32 _configType,
        bytes calldata _config
    ) external onlyUln {
        UlnConfigStruct storage config = ulnConfig[_oapp][_remoteEid];
        if (_configType <= CONFIG_TYPE_EXECUTOR) {
            _setOutboundConfigByType(_oapp, _remoteEid, _configType, _config);
        } else if (_configType == CONFIG_TYPE_INBOUND_CONFIRMATIONS) {
            uint64 blockConfirmations = abi.decode(_config, (uint64));
            config.inboundConfirmations = blockConfirmations;
        } else if (_configType == CONFIG_TYPE_VERIFIERS) {
            // verifiers list must be sorted by ascending order and contain no duplicates
            (bool useCustomVerifiers, address[] memory verifiers) = abi.decode(_config, (bool, address[]));

            uint8 verifierCount = verifiers.length.toUint8();
            _assertNoDuplicates(verifiers, verifierCount);

            config.useCustomVerifiers = useCustomVerifiers;
            config.verifierCount = verifierCount;
            config.verifiers = verifiers;

            _assertVerifierList(_remoteEid, _oapp);
        } else if (_configType == CONFIG_TYPE_OPTIONAL_VERIFIERS) {
            // verifiers list must be sorted by ascending order and contain no duplicates
            (bool useCustomOptionalVerifiers, address[] memory optionalVerifiers, uint8 threshold) = abi.decode(
                _config,
                (bool, address[], uint8)
            );

            uint8 optionalVerifierCount = optionalVerifiers.length.toUint8();
            require(threshold <= optionalVerifierCount, Errors.INVALID_ARGUMENT);
            _assertNoDuplicates(optionalVerifiers, optionalVerifierCount);

            config.useCustomOptionalVerifiers = useCustomOptionalVerifiers;
            config.optionalVerifierCount = optionalVerifierCount;
            config.optionalVerifiers = optionalVerifiers;
            config.optionalVerifierThreshold = threshold;

            _assertVerifierList(_remoteEid, _oapp);
        } else {
            revert(Errors.NOT_IMPLEMENTED);
        }
    }

    function snapshotConfig(uint32[] calldata _eids, address _oapp) external onlyUln {
        for (uint i = 0; i < _eids.length; i++) {
            uint32 eid = _eids[i];
            UlnConfigStruct memory config = getUlnConfig(_oapp, eid);
            config.useCustomVerifiers = true;
            config.useCustomOptionalVerifiers = true;
            ulnConfig[_oapp][eid] = config;

            _snapshotOutboundConfig(eid, _oapp);
        }
    }

    function resetConfig(uint32[] calldata _eids, address _oapp) external onlyUln {
        for (uint i = 0; i < _eids.length; i++) {
            uint32 eid = _eids[i];
            delete ulnConfig[_oapp][eid];

            _resetOutboundConfig(eid, _oapp);
        }
    }

    // ============================ View =====================================

    function getUlnConfig(address _oapp, uint32 _remoteEid) public view returns (UlnConfigStruct memory) {
        UlnConfigStruct memory config = ulnConfig[_oapp][_remoteEid];
        UlnConfigStruct storage defaultConfig = defaultUlnConfig[_remoteEid];

        uint64 inboundConfirmations = defaultConfig.inboundConfirmations;
        require(inboundConfirmations > 0, Errors.INVALID_EID); // available remote eid

        if (config.inboundConfirmations == 0) {
            config.inboundConfirmations = inboundConfirmations;
        }

        if (!config.useCustomVerifiers) {
            config.verifiers = defaultConfig.verifiers;
            config.verifierCount = defaultConfig.verifierCount;
        }

        if (!config.useCustomOptionalVerifiers) {
            config.optionalVerifiers = defaultConfig.optionalVerifiers;
            config.optionalVerifierCount = defaultConfig.optionalVerifierCount;
            config.optionalVerifierThreshold = defaultConfig.optionalVerifierThreshold;
        }

        return config;
    }

    function getUlnAndOutboundConfig(
        address _oapp,
        uint32 _remoteEid
    ) public view returns (UlnConfigStruct memory, OutboundConfigStruct memory) {
        return (getUlnConfig(_oapp, _remoteEid), getOutboundConfig(_oapp, _remoteEid));
    }

    function getConfigByType(
        uint32 _remoteEid,
        address _oapp,
        uint32 _configType
    ) external view returns (bytes memory, bool) {
        UlnConfigStruct storage config = ulnConfig[_oapp][_remoteEid];
        UlnConfigStruct storage defaultConfig = defaultUlnConfig[_remoteEid];

        // type 1/2/3 are for the outboundConfig
        if (_configType <= CONFIG_TYPE_EXECUTOR) {
            return getOutboundConfigByType(_remoteEid, _oapp, _configType);
        } else if (_configType == CONFIG_TYPE_INBOUND_CONFIRMATIONS) {
            if (config.inboundConfirmations == 0) {
                return (abi.encode(defaultConfig.inboundConfirmations), true);
            }
            return (abi.encode(config.inboundConfirmations), false);
        } else if (_configType == CONFIG_TYPE_VERIFIERS) {
            if (config.useCustomVerifiers) {
                return (abi.encode(config.verifiers), false);
            }
            return (abi.encode(defaultConfig.verifiers), true);
        } else if (_configType == CONFIG_TYPE_OPTIONAL_VERIFIERS) {
            if (config.useCustomOptionalVerifiers) {
                return (abi.encode(config.optionalVerifiers, config.optionalVerifierThreshold), false);
            }
            return (abi.encode(defaultConfig.optionalVerifiers, defaultConfig.optionalVerifierThreshold), true);
        }
        revert(Errors.NOT_IMPLEMENTED);
    }

    function getDefaultConfigByType(uint32 _remoteEid, uint32 _configType) external view returns (bytes memory) {
        if (_configType <= CONFIG_TYPE_EXECUTOR) {
            return getDefaultOutboundConfigByType(_remoteEid, _configType);
        } else if (_configType == CONFIG_TYPE_INBOUND_CONFIRMATIONS) {
            UlnConfigStruct storage config = defaultUlnConfig[_remoteEid];
            return abi.encode(config.inboundConfirmations);
        } else if (_configType == CONFIG_TYPE_VERIFIERS) {
            UlnConfigStruct storage config = defaultUlnConfig[_remoteEid];
            return abi.encode(config.verifiers);
        } else if (_configType == CONFIG_TYPE_OPTIONAL_VERIFIERS) {
            UlnConfigStruct storage config = defaultUlnConfig[_remoteEid];
            return abi.encode(config.optionalVerifiers, config.optionalVerifierThreshold);
        }
        revert(Errors.NOT_IMPLEMENTED);
    }

    function isSupportedEid(uint32 _remoteEid) external view returns (bool) {
        return defaultUlnConfig[_remoteEid].inboundConfirmations > 0;
    }

    /// @dev Get the uln config without the default config for the given remoteEid.
    function getRawUlnConfig(address _oapp, uint32 _remoteEid) external view returns (UlnConfigStruct memory) {
        return ulnConfig[_oapp][_remoteEid];
    }

    function getDefaultUlnConfig(uint32 _remoteEid) external view returns (UlnConfigStruct memory) {
        return defaultUlnConfig[_remoteEid];
    }

    // ============================ Internal =====================================

    function _assertNoDuplicates(address[] memory _verifiers, uint _verifierCount) internal pure {
        address lastVerifier = address(0);
        for (uint i = 0; i < _verifierCount; i++) {
            address verifier = _verifiers[i];
            require(verifier > lastVerifier, Errors.UNSORTED); // to ensure no duplicates
            lastVerifier = verifier;
        }
    }

    function _assertVerifierList(uint32 _remoteEid, address _oapp) internal view {
        UlnConfigStruct memory config = getUlnConfig(_oapp, _remoteEid);
        // it is possible for sender to configure nil verifiers
        require(config.verifierCount > 0 || config.optionalVerifierThreshold > 0, Errors.VERIFIERS_UNAVAILABLE);
        // verifier options restricts total verifiers to 255
        require(config.verifierCount + config.optionalVerifierCount <= type(uint8).max, Errors.INVALID_SIZE);
    }
}
