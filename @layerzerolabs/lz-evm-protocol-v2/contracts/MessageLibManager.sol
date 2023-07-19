// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMessageLib.sol";
import "./interfaces/IMessageLibManager.sol";
import "./libs/Errors.sol";

contract MessageLibManager is Ownable, IMessageLibManager {
    address private constant _DEFAULT_LIB = address(0);
    address private constant _UNSET_LIB = address(0);

    // the library that reverts both on send and quote
    // must be configured on construction and be immutable
    address public immutable blockedLibrary;

    // only registered libraries all valid libraries
    // the blockedLibrary will be registered on construction
    address[] internal registeredLibraries;
    mapping(address lib => bool) public isRegisteredLibrary;

    // both sendLibrary and receiveLibrary config can be lazily resolved
    mapping(address sender => mapping(uint32 dstEid => address lib)) internal sendLibrary;
    mapping(address receiver => mapping(uint32 srcEid => address lib)) internal receiveLibrary;
    mapping(address receiver => mapping(uint32 srcEid => Timeout)) public receiveLibraryTimeout;

    mapping(uint32 dstEid => address lib) public defaultSendLibrary;
    mapping(uint32 srcEid => address lib) public defaultReceiveLibrary;
    mapping(uint32 srcEid => Timeout) public defaultReceiveLibraryTimeout;

    modifier onlyRegistered(address _lib) {
        require(isRegisteredLibrary[_lib], Errors.ONLY_REGISTERED);
        _;
    }

    modifier onlyRegisteredOrDefault(address _lib) {
        require(isRegisteredLibrary[_lib] || _lib == _DEFAULT_LIB, Errors.ONLY_REGISTERED_OR_DEFAULT);
        _;
    }

    /// @dev check if the library supported the eid.
    modifier onlySupportedEid(address _lib, uint32 _eid) {
        if (_lib != _DEFAULT_LIB) {
            require(IMessageLib(_lib).isSupportedEid(_eid), Errors.INVALID_EID);
        }
        _;
    }

    constructor(address _blockedLib) {
        blockedLibrary = _blockedLib;
        registerLibrary(_blockedLib);
    }

    function getRegisteredLibraries() external view returns (address[] memory) {
        return registeredLibraries;
    }

    /// @dev the sendLibrary can be lazily resolved that if not set it will point to the default configured by LayerZero
    function getSendLibrary(address _sender, uint32 _dstEid) public view returns (address lib) {
        lib = sendLibrary[_sender][_dstEid];
        if (lib == _DEFAULT_LIB) {
            lib = defaultSendLibrary[_dstEid];
            require(lib != _UNSET_LIB, Errors.DEFAULT_LIBRARY_UNAVAILABLE);
        }
    }

    function isDefaultSendLibrary(address _sender, uint32 _dstEid) public view returns (bool) {
        return sendLibrary[_sender][_dstEid] == _DEFAULT_LIB;
    }

    /// @dev the receiveLibrary can be lazily resolved that if not set it will point to the default configured by LayerZero
    function getReceiveLibrary(address _receiver, uint32 _srcEid) public view returns (address lib, bool isDefault) {
        lib = receiveLibrary[_receiver][_srcEid];
        if (lib == _DEFAULT_LIB) {
            lib = defaultReceiveLibrary[_srcEid];
            require(lib != _UNSET_LIB, Errors.DEFAULT_LIBRARY_UNAVAILABLE);
            isDefault = true;
        }
    }

    /// @dev called when the endpoint checks if the msglib attempting to delever the msg is the configured msglib of the Oapp
    /// @dev this check provides the ability for Oapp to lock in a trusted msglib
    /// @dev it will fist check if the msglib is the currently configured one. then check if the msglib is the one in grace period of msglib versioning upgrade
    function isValidReceiveLibrary(
        address _receiver,
        uint32 _srcEid,
        address _actualReceiveLib
    ) public view returns (bool) {
        // early return true if the _actualReceiveLib is the currently configured one
        (address expectedReceiveLib, bool isDefault) = getReceiveLibrary(_receiver, _srcEid);
        if (_actualReceiveLib == expectedReceiveLib) {
            return true;
        }

        // check the timeout condition otherwise
        // if the Oapp is using defaultReceiveLibrary, use the default Timeout config
        // otherwise, use the Timeout configured by the Oapp
        Timeout memory timeout = isDefault
            ? defaultReceiveLibraryTimeout[_srcEid]
            : receiveLibraryTimeout[_receiver][_srcEid];

        // requires the _actualReceiveLib to be the same as the one in grace period and the grace period has not expired
        // block.timestamp is uint so timeout.expiry must > 0, which implies a non-ZERO value
        if (timeout.lib == _actualReceiveLib && timeout.expiry > block.timestamp) {
            // timeout lib set and has not expired
            return true;
        }

        // returns false by default
        return false;
    }

    //------- Owner interfaces
    /// @dev all libraries have to implement the erc165 interface to prevent wrong configurations
    /// @dev only owner
    function registerLibrary(address _lib) public onlyOwner {
        // must have the right interface
        require(IERC165(_lib).supportsInterface(type(IMessageLib).interfaceId), Errors.UNSUPPORTED_INTERFACE);
        // must have not been registered
        require(!isRegisteredLibrary[_lib], Errors.ALREADY_EXISTS);

        // insert into both the map and the list
        isRegisteredLibrary[_lib] = true;
        registeredLibraries.push(_lib);

        emit LibraryRegistered(_lib);
    }

    /// @dev owner setting the defaultSendLibrary
    /// @dev can set to the blockedLibrary, which is a registered library
    /// @dev the msglib must enable the support before they can be registered to the endpoint as the default
    /// @dev only owner
    function setDefaultSendLibrary(
        uint32 _eid,
        address _newLib
    ) external onlyOwner onlyRegistered(_newLib) onlySupportedEid(_newLib, _eid) {
        address oldLib = defaultSendLibrary[_eid];
        // must provide a different value
        require(oldLib != _newLib, Errors.SAME_VALUE);
        defaultSendLibrary[_eid] = _newLib;
        emit DefaultSendLibrarySet(_eid, _newLib);
    }

    /// @dev owner setting the defaultSendLibrary
    /// @dev must be a registered library (including blockLibrary) with the eid support enabled
    /// @dev in version migration, it can add a grace period to the old library. if the grace period is 0, it will delete the timeout configuration.
    /// @dev only owner
    function setDefaultReceiveLibrary(
        uint32 _eid,
        address _newLib,
        uint _gracePeriod
    ) external onlyOwner onlyRegistered(_newLib) onlySupportedEid(_newLib, _eid) {
        address oldLib = defaultReceiveLibrary[_eid];
        // must provide a different value
        require(oldLib != _newLib, Errors.SAME_VALUE);
        defaultReceiveLibrary[_eid] = _newLib;
        emit DefaultReceiveLibrarySet(_eid, oldLib, _newLib);

        if (_gracePeriod > 0) {
            // override the current default timeout to the [old_lib + new expiry]
            Timeout storage timeout = defaultReceiveLibraryTimeout[_eid];
            timeout.lib = oldLib;
            timeout.expiry = block.timestamp + _gracePeriod;
            emit DefaultReceiveLibraryTimeoutSet(_eid, oldLib, timeout.expiry);
        } else {
            // otherwise, remove the old configuration.
            delete defaultReceiveLibraryTimeout[_eid];
        }
    }

    /// @dev owner setting the defaultSendLibrary
    /// @dev must be a registered library (including blockLibrary) with the eid support enabled
    /// @dev can used to (1) extend the current configuration (2)  force remove the current configuration (3) change to a new configuration
    function setDefaultReceiveLibraryTimeout(
        uint32 _eid,
        address _lib,
        uint _expiry
    ) external onlyRegistered(_lib) onlySupportedEid(_lib, _eid) onlyOwner {
        if (_expiry == 0) {
            // force remove the current configuration
            delete defaultReceiveLibraryTimeout[_eid];
        } else {
            // override it with new configuration
            require(_expiry > block.timestamp, Errors.INVALID_ARGUMENT);
            Timeout storage timeout = defaultReceiveLibraryTimeout[_eid];
            timeout.lib = _lib;
            timeout.expiry = _expiry;
        }
        emit DefaultReceiveLibraryTimeoutSet(_eid, _lib, _expiry);
    }

    function defaultConfig(
        address _lib,
        uint32 _eid,
        uint32 _configType
    ) external view onlyRegistered(_lib) onlySupportedEid(_lib, _eid) returns (bytes memory) {
        return IMessageLib(_lib).getDefaultConfig(_eid, _configType);
    }

    /// @dev returns true only if both the default send/receive libraries are set
    function isSupportedEid(uint32 _eid) external view returns (bool) {
        return defaultSendLibrary[_eid] != address(0) && defaultReceiveLibrary[_eid] != address(0);
    }

    //------- OApp interfaces
    /// @dev Oapp setting the sendLibrary
    /// @dev must be a registered library (including blockLibrary) with the eid support enabled
    /// @dev authenticated by the Oapp
    function setSendLibrary(
        uint32 _eid,
        address _newLib
    ) external onlyRegisteredOrDefault(_newLib) onlySupportedEid(_newLib, _eid) {
        address oldLib = sendLibrary[msg.sender][_eid];
        // must provide a different value
        require(oldLib != _newLib, Errors.SAME_VALUE);
        sendLibrary[msg.sender][_eid] = _newLib;
        emit SendLibrarySet(msg.sender, _eid, _newLib);
    }

    /// @dev Oapp setting the receiveLibrary
    /// @dev must be a registered library (including blockLibrary) with the eid support enabled
    /// @dev in version migration, it can add a grace period to the old library. if the grace period is 0, it will delete the timeout configuration.
    /// @dev authenticated by the Oapp
    function setReceiveLibrary(
        uint32 _eid,
        address _newLib,
        uint _gracePeriod
    ) external onlyRegisteredOrDefault(_newLib) onlySupportedEid(_newLib, _eid) {
        address oldLib = receiveLibrary[msg.sender][_eid];
        // must provide new values
        require(oldLib != _newLib, Errors.SAME_VALUE);
        receiveLibrary[msg.sender][_eid] = _newLib;
        emit ReceiveLibrarySet(msg.sender, _eid, oldLib, _newLib);

        if (_gracePeriod > 0) {
            // to simplify the logic, we only allow to set timeout if neither the new lib or old lib is DEFAULT_LIB, which would should read the defaultTime configurations
            // (1) if the Oapp wants to fall back to the DEFAULT, then set the newlib to DEFAULT with grace period == 0
            // (2) if the Oapp wants to change to a non DEFAULT from DEFAULT, then set the new lib to non default with _gracePeriod == 0, then use setReceiveLibraryTimeout() interface
            require(oldLib != _DEFAULT_LIB && _newLib != _DEFAULT_LIB, Errors.ONLY_NON_DEFAULT);

            // write to storage
            Timeout memory timeout = Timeout({lib: oldLib, expiry: block.timestamp + _gracePeriod});
            receiveLibraryTimeout[msg.sender][_eid] = timeout;
            emit ReceiveLibraryTimoutSet(msg.sender, _eid, oldLib, timeout.expiry);
        } else {
            delete receiveLibraryTimeout[msg.sender][_eid];
        }
    }

    /// @dev Oapp setting the defaultSendLibrary
    /// @dev must be a registered library (including blockLibrary) with the eid support enabled
    /// @dev can used to (1) extend the current configuration (2)  force remove the current configuration (3) change to a new configuration
    function setReceiveLibraryTimeout(
        uint32 _eid,
        address _lib,
        uint _expiry
    ) external onlyRegistered(_lib) onlySupportedEid(_lib, _eid) {
        (, bool isDefault) = getReceiveLibrary(msg.sender, _eid);
        // if current library is DEFAULT, Oapp cant set the timeout
        require(!isDefault, Errors.ONLY_NON_DEFAULT);

        if (_expiry == 0) {
            // force remove the current configuration
            delete receiveLibraryTimeout[msg.sender][_eid];
        } else {
            // override it with new configuration
            require(_expiry > block.timestamp, Errors.INVALID_ARGUMENT);
            Timeout storage timeout = receiveLibraryTimeout[msg.sender][_eid];
            timeout.lib = _lib;
            timeout.expiry = _expiry;
        }
        emit ReceiveLibraryTimoutSet(msg.sender, _eid, _lib, _expiry);
    }

    //------- library config setter/getter. all pass-through functions to the msglib

    /// @dev authenticated by the msg.sender
    function setConfig(address _lib, uint32 _eid, SetConfigParam[] calldata _params) external onlyRegistered(_lib) {
        IMessageLib(_lib).setConfig(msg.sender, _eid, _params);
    }

    /// @dev a view function to query the current configuration of the oapp
    function getConfig(
        address _oapp,
        address _lib,
        uint32 _eid,
        uint32 _configType
    ) external view onlyRegistered(_lib) returns (bytes memory config, bool isDefault) {
        return IMessageLib(_lib).getConfig(_eid, _oapp, _configType);
    }

    /// @dev lock-in the current configuration of the provided eids to the Oapp , e.g. copying the default configuration.
    /// @dev it allows the Oapp to be not affected by Default configuration changes.
    /// @dev authenticated by the msg.sender
    function snapshotConfig(address _lib, uint32[] calldata _eids) external onlyRegistered(_lib) {
        IMessageLib(_lib).snapshotConfig(_eids, msg.sender);
    }

    /// @dev setting the Oapp's configuration to the default configurations of the provided eids
    /// @dev almost like the reverse action to snapshotConfig()
    /// @dev authenticated by the msg.sender
    function resetConfig(address _lib, uint32[] calldata _eids) external onlyRegistered(_lib) {
        IMessageLib(_lib).resetConfig(_eids, msg.sender);
    }
}
