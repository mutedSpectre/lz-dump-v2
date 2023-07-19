// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface IUlnConfig {
    struct Config {
        uint64 inboundConfirmations;
        bool useCustomOracles; // unused for default config
        bool useCustomOptionalOracles; // unused for default config
        uint16 oraclesCount;
        uint16 optionalOraclesCount;
        uint16 optionalOraclesThreshold;
        address[] oracles; // allowed overlap with optionalOracles
        address[] optionalOracles; // allowed overlap with oracles
    }

    event SetDefaultConfig(
        uint32 indexed eid,
        uint64 inboundBlockConfirm,
        address[] oracles,
        address[] optionalOracles,
        uint16 optionalOraclesThreshold
    );
    event UlnConfigUpdated(address indexed oapp, uint indexed configType, bytes newConfig);

    function setConfig(uint32 _remoteEid, address _oapp, uint32 _configType, bytes calldata _config) external;

    function snapshotConfig(uint32[] calldata _eids, address _oapp) external;

    function resetConfig(uint32[] calldata _eids, address _oapp) external;

    function isSupportedEid(uint32 _remoteEid) external view returns (bool);

    function getUlnConfig(address _oapp, uint32 _remoteEid) external view returns (Config memory);

    function getConfig(uint32 _remoteEid, address _oapp, uint _configType) external view returns (bytes memory, bool);

    function getDefaultConfig(uint32 _remoteEid, uint _configType) external view returns (bytes memory);

    function setDefaultUlnConfig(
        uint32 _eid,
        uint64 _inboundConfirmations,
        address[] calldata _oracles,
        address[] calldata _optionalOracles,
        uint16 _optionalOraclesThreshold
    ) external;
}
