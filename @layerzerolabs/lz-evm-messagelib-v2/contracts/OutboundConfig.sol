// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/Errors.sol";
import "./interfaces/ILayerZeroExecutor.sol";

struct OutboundConfigStruct {
    uint32 maxMessageSize;
    uint64 outboundConfirmations;
    address executor;
}

/// extract it because it might be reused by future non-ULN msglibs
contract OutboundConfig {
    // Derived MessageLibs should never use this as config type
    uint32 internal constant CONFIG_TYPE_MAX_MESSAGE_SIZE = 1;
    uint32 internal constant CONFIG_TYPE_OUTBOUND_CONFIRMATIONS = 2;
    uint32 internal constant CONFIG_TYPE_EXECUTOR = 3;

    mapping(uint32 dstEid => OutboundConfigStruct) public defaultOutboundConfig;
    mapping(address oapp => mapping(uint32 dstEid => OutboundConfigStruct)) public outboundConfig;

    // ============================ View ===================================
    function getOutboundConfigByType(
        uint32 _eid,
        address _oapp,
        uint _configType
    ) public view returns (bytes memory, bool) {
        if (_configType == CONFIG_TYPE_MAX_MESSAGE_SIZE) {
            OutboundConfigStruct storage config = outboundConfig[_oapp][_eid];
            if (config.maxMessageSize == 0) {
                OutboundConfigStruct storage defaultConfig = defaultOutboundConfig[_eid];
                return (abi.encode(defaultConfig.maxMessageSize), true);
            }
            return (abi.encode(config.maxMessageSize), false);
        } else if (_configType == CONFIG_TYPE_OUTBOUND_CONFIRMATIONS) {
            OutboundConfigStruct storage config = outboundConfig[_oapp][_eid];
            if (config.outboundConfirmations == 0) {
                OutboundConfigStruct storage defaultConfig = defaultOutboundConfig[_eid];
                return (abi.encode(defaultConfig.outboundConfirmations), true);
            }
            return (abi.encode(config.outboundConfirmations), false);
        } else if (_configType == CONFIG_TYPE_EXECUTOR) {
            OutboundConfigStruct storage config = outboundConfig[_oapp][_eid];
            if (config.executor == address(0x0)) {
                OutboundConfigStruct storage defaultConfig = defaultOutboundConfig[_eid];
                return (abi.encode(defaultConfig.executor), true);
            }
            return (abi.encode(config.executor), false);
        } else {
            revert(Errors.NOT_IMPLEMENTED);
        }
    }

    function getDefaultOutboundConfigByType(uint32 _eid, uint32 _configType) public view returns (bytes memory) {
        if (_configType == CONFIG_TYPE_MAX_MESSAGE_SIZE) {
            OutboundConfigStruct storage config = defaultOutboundConfig[_eid];
            return abi.encode(config.maxMessageSize);
        } else if (_configType == CONFIG_TYPE_OUTBOUND_CONFIRMATIONS) {
            OutboundConfigStruct storage config = defaultOutboundConfig[_eid];
            return abi.encode(config.outboundConfirmations);
        } else if (_configType == CONFIG_TYPE_EXECUTOR) {
            OutboundConfigStruct storage config = defaultOutboundConfig[_eid];
            return abi.encode(config.executor);
        } else {
            revert(Errors.NOT_IMPLEMENTED);
        }
    }

    function getOutboundConfig(address _oapp, uint32 _dstEid) public view returns (OutboundConfigStruct memory) {
        OutboundConfigStruct memory config = outboundConfig[_oapp][_dstEid];
        OutboundConfigStruct memory defaultConfig = defaultOutboundConfig[_dstEid];
        require(defaultConfig.maxMessageSize > 0, Errors.INVALID_EID); // available remote eid

        if (config.maxMessageSize == 0) {
            config.maxMessageSize = defaultConfig.maxMessageSize;
        }
        if (config.outboundConfirmations == 0) {
            config.outboundConfirmations = defaultConfig.outboundConfirmations;
        }
        if (config.executor == address(0x0)) {
            config.executor = defaultConfig.executor;
        }
        return config;
    }

    // ============================ Internal ===================================
    function _setDefaultOutboundConfig(uint32 _eid, OutboundConfigStruct calldata _config) internal {
        require(_config.outboundConfirmations > 0 && _config.executor != address(0x0), Errors.INVALID_ARGUMENT);
        require(_config.maxMessageSize > 0, Errors.INVALID_SIZE);

        OutboundConfigStruct storage config = defaultOutboundConfig[_eid];
        config.executor = _config.executor;
        config.maxMessageSize = _config.maxMessageSize;
        config.outboundConfirmations = _config.outboundConfirmations;
    }

    function _setOutboundConfigByType(address _oapp, uint32 _eid, uint32 _configType, bytes calldata _config) internal {
        OutboundConfigStruct storage config = outboundConfig[_oapp][_eid];
        if (_configType == CONFIG_TYPE_MAX_MESSAGE_SIZE) {
            uint32 maxMessageSize = abi.decode(_config, (uint32));
            config.maxMessageSize = maxMessageSize;
        } else if (_configType == CONFIG_TYPE_OUTBOUND_CONFIRMATIONS) {
            uint64 outboundConfirmations = abi.decode(_config, (uint64));
            config.outboundConfirmations = outboundConfirmations;
        } else if (_configType == CONFIG_TYPE_EXECUTOR) {
            address executor = abi.decode(_config, (address));
            config.executor = executor;
        } else {
            revert(Errors.NOT_IMPLEMENTED);
        }
    }

    function _snapshotOutboundConfig(uint32 _eid, address _oapp) internal {
        outboundConfig[_oapp][_eid] = getOutboundConfig(_oapp, _eid);
    }

    function _resetOutboundConfig(uint32 _eid, address _oapp) internal {
        delete outboundConfig[_oapp][_eid];
    }
}
