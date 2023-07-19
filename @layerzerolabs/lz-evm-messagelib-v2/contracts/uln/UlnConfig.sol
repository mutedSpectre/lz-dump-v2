// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IUlnConfig.sol";

contract UlnConfig is IUlnConfig, Ownable {
    // Application config, extending from MessageLibBase
    uint32 private constant CONFIG_TYPE_INBOUND_CONFIRMATIONS = 4;
    uint32 private constant CONFIG_TYPE_ORACLES = 5;
    uint32 private constant CONFIG_TYPE_OPTIONAL_ORACLES = 6;

    mapping(address oapp => mapping(uint32 eid => Config)) internal ulnConfig;
    mapping(uint32 eid => Config) internal defaultUlnConfig;
    // maximum number of oracles allowed
    uint16 public maxOracleCount = 100;
    uint16 public maxOptionalOracleCount = 100;
    address public uln;

    modifier onlyUln() {
        require(msg.sender == uln, "LZ50000");
        _;
    }

    function getUlnConfig(address _oapp, uint32 _remoteEid) public view returns (Config memory) {
        Config memory config = ulnConfig[_oapp][_remoteEid];
        Config storage defaultConfig = defaultUlnConfig[_remoteEid];

        uint64 inboundConfirmations = defaultConfig.inboundConfirmations;
        require(inboundConfirmations > 0, "LZ10008"); // available remote eid

        if (config.inboundConfirmations == 0) {
            config.inboundConfirmations = inboundConfirmations;
        }

        if (!config.useCustomOracles) {
            config.oracles = defaultConfig.oracles;
            config.oraclesCount = defaultConfig.oraclesCount;
        }

        if (!config.useCustomOptionalOracles) {
            config.optionalOracles = defaultConfig.optionalOracles;
            config.optionalOraclesCount = defaultConfig.optionalOraclesCount;
            config.optionalOraclesThreshold = defaultConfig.optionalOraclesThreshold;
        }

        require(config.oraclesCount > 0 || config.optionalOraclesThreshold > 0, "LZD0005");

        return config;
    }

    function setConfig(uint32 _remoteEid, address _oapp, uint32 _configType, bytes calldata _config) external onlyUln {
        Config storage config = ulnConfig[_oapp][_remoteEid];
        if (_configType == CONFIG_TYPE_INBOUND_CONFIRMATIONS) {
            uint64 blockConfirmations = abi.decode(_config, (uint64));
            config.inboundConfirmations = blockConfirmations;
        } else if (_configType == CONFIG_TYPE_ORACLES) {
            // oracles list must be sorted by ascending order and contain no duplicates
            (bool useCustomOracles, address[] memory oracles) = abi.decode(_config, (bool, address[]));

            uint oracleCount = oracles.length;
            bool isValidCount = useCustomOracles ? oracleCount <= maxOracleCount : oracleCount == 0;
            require(isValidCount, "LZ10009");
            _assertNoDuplicates(oracles, oracleCount);

            config.oraclesCount = uint16(oracleCount);
            config.oracles = oracles;
            config.useCustomOracles = useCustomOracles;

            getUlnConfig(_oapp, _remoteEid); // validate the latest config by getting it
        } else if (_configType == CONFIG_TYPE_OPTIONAL_ORACLES) {
            // oracles list must be sorted by ascending order and contain no duplicates
            (bool useCustomOptionalOracles, address[] memory optionalOracles, uint16 threshold) = abi.decode(
                _config,
                (bool, address[], uint16)
            );

            uint optionalOraclesCount = optionalOracles.length;
            bool isValidCount = useCustomOptionalOracles
                ? optionalOraclesCount <= maxOptionalOracleCount
                : optionalOraclesCount == 0;
            require(isValidCount, "LZ10009");
            require(threshold <= optionalOraclesCount, "LZ10003");
            _assertNoDuplicates(optionalOracles, optionalOraclesCount);

            config.optionalOraclesCount = uint16(optionalOraclesCount);
            config.optionalOracles = optionalOracles;
            config.optionalOraclesThreshold = threshold;
            config.useCustomOptionalOracles = useCustomOptionalOracles;

            getUlnConfig(_oapp, _remoteEid); // validate the latest config by getting it
        } else {
            revert("LZC0000");
        }

        emit UlnConfigUpdated(_oapp, _configType, _config);
    }

    function getConfig(uint32 _remoteEid, address _oapp, uint _configType) external view returns (bytes memory, bool) {
        Config storage config = ulnConfig[_oapp][_remoteEid];
        Config storage defaultConfig = defaultUlnConfig[_remoteEid];

        if (_configType == CONFIG_TYPE_INBOUND_CONFIRMATIONS) {
            if (config.inboundConfirmations == 0) {
                return (abi.encode(defaultConfig.inboundConfirmations), true);
            }
            return (abi.encode(config.inboundConfirmations), false);
        } else if (_configType == CONFIG_TYPE_ORACLES) {
            if (config.useCustomOracles) {
                return (abi.encode(config.oracles), false);
            }
            return (abi.encode(defaultConfig.oracles), true);
        } else if (_configType == CONFIG_TYPE_OPTIONAL_ORACLES) {
            if (config.useCustomOptionalOracles) {
                return (abi.encode(config.optionalOracles, config.optionalOraclesThreshold), false);
            }
            return (abi.encode(defaultConfig.optionalOracles, defaultConfig.optionalOraclesThreshold), true);
        } else {
            revert("LZC0000");
        }
    }

    function getDefaultConfig(uint32 _remoteEid, uint _configType) external view returns (bytes memory) {
        Config storage config = defaultUlnConfig[_remoteEid];

        if (_configType == CONFIG_TYPE_INBOUND_CONFIRMATIONS) {
            return abi.encode(config.inboundConfirmations);
        } else if (_configType == CONFIG_TYPE_ORACLES) {
            return abi.encode(config.oracles);
        } else if (_configType == CONFIG_TYPE_OPTIONAL_ORACLES) {
            return abi.encode(config.optionalOracles, config.optionalOraclesThreshold);
        } else {
            revert("LZC0000");
        }
    }

    function snapshotConfig(uint32[] calldata _eids, address _oapp) external onlyUln {
        for (uint i = 0; i < _eids.length; i++) {
            uint32 eid = _eids[i];
            Config memory config = getUlnConfig(_oapp, eid);
            ulnConfig[_oapp][eid] = config;
        }
    }

    function resetConfig(uint32[] calldata _eids, address _oapp) external onlyUln {
        for (uint i = 0; i < _eids.length; i++) {
            uint32 eid = _eids[i];
            delete ulnConfig[_oapp][eid];
        }
    }

    function isSupportedEid(uint32 _remoteEid) external view returns (bool) {
        return defaultUlnConfig[_remoteEid].inboundConfirmations > 0;
    }

    function setMaxOraclesCount(uint16 _maxOracleCount, uint16 _maxOptionalOracleCount) external onlyOwner {
        maxOracleCount = _maxOracleCount;
        maxOptionalOracleCount = _maxOptionalOracleCount;
    }

    function setDefaultUlnConfig(
        uint32 _eid,
        uint64 _inboundConfirmations,
        address[] calldata _oracles,
        address[] calldata _optionalOracles,
        uint16 _optionalOraclesThreshold
    ) external onlyOwner {
        uint oracleCount = _oracles.length;
        uint optionalOracleCount = _optionalOracles.length;

        require(_inboundConfirmations > 0, "LZ10000");
        require(
            oracleCount <= maxOracleCount &&
                optionalOracleCount <= maxOptionalOracleCount &&
                _optionalOraclesThreshold <= optionalOracleCount,
            "LZ10009"
        );
        require(oracleCount > 0 || _optionalOraclesThreshold > 0, "LZ10011");
        _assertNoDuplicates(_oracles, oracleCount);
        _assertNoDuplicates(_optionalOracles, optionalOracleCount);

        defaultUlnConfig[_eid] = Config(
            _inboundConfirmations,
            false, // unused for default config
            false, // unused for default config
            uint16(oracleCount),
            uint16(optionalOracleCount),
            _optionalOraclesThreshold,
            _oracles,
            _optionalOracles
        );

        emit SetDefaultConfig(_eid, _inboundConfirmations, _oracles, _optionalOracles, _optionalOraclesThreshold);
    }

    function setUln(address _uln) external onlyOwner {
        require(uln == address(0), "LZ80000"); // only set once
        uln = _uln;
    }

    function _assertNoDuplicates(address[] memory _oracles, uint _oracleCount) internal pure {
        address lastOracle = address(0);
        for (uint i = 0; i < _oracleCount; i++) {
            address oracle = _oracles[i];
            require(oracle > lastOracle, "LZ10006"); // to ensure no duplicates
            lastOracle = oracle;
        }
    }

    /// @dev Get the uln config without the default config for the given remoteEid.
    function getRawUlnConfig(address _oapp, uint32 _remoteEid) external view returns (Config memory) {
        return ulnConfig[_oapp][_remoteEid];
    }

    function getDefaultUlnConfig(uint32 _remoteEid) external view returns (Config memory) {
        return defaultUlnConfig[_remoteEid];
    }
}
