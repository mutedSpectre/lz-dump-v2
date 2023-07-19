// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import {OutboundConfigStruct} from "../../OutboundConfig.sol";

struct SetDefaultConfigParam {
    uint32 eid;
    OutboundConfigStruct outboundConfig;
    uint64 inboundConfirmations;
    address[] verifiers;
    address[] optionalVerifiers;
    uint8 optionalVerifierThreshold;
}

struct UlnConfigStruct {
    uint64 inboundConfirmations;
    bool useCustomVerifiers; // unused for default config
    bool useCustomOptionalVerifiers; // unused for default config
    uint8 verifierCount;
    uint8 optionalVerifierCount;
    uint8 optionalVerifierThreshold;
    address[] verifiers; // allowed overlap with optionalVerifiers
    address[] optionalVerifiers; // allowed overlap with verifiers
}

interface IUlnConfig {
    function setConfigByType(uint32 _remoteEid, address _oapp, uint32 _configType, bytes calldata _config) external;

    function snapshotConfig(uint32[] calldata _eids, address _oapp) external;

    function resetConfig(uint32[] calldata _eids, address _oapp) external;

    function isSupportedEid(uint32 _remoteEid) external view returns (bool);

    function getUlnConfig(address _oapp, uint32 _remoteEid) external view returns (UlnConfigStruct memory);

    function getUlnAndOutboundConfig(
        address _oapp,
        uint32 _remoteEid
    ) external view returns (UlnConfigStruct memory, OutboundConfigStruct memory);

    function getConfigByType(
        uint32 _remoteEid,
        address _oapp,
        uint32 _configType
    ) external view returns (bytes memory, bool);

    function getDefaultConfigByType(uint32 _remoteEid, uint32 _configType) external view returns (bytes memory);

    function setDefaultConfig(SetDefaultConfigParam[] calldata _params) external;
}
