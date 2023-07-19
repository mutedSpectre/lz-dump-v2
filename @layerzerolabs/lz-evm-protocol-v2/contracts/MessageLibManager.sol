// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMessageLib.sol";
import "./interfaces/IMessageLibManager.sol";

contract MessageLibManager is Ownable, IMessageLibManager {
    address private constant _DEFAULT_LIB = address(0);

    address public immutable blockedLibrary;

    address[] internal registeredLibraries;
    mapping(address lib => bool) public isRegisteredLibrary;

    mapping(address sender => mapping(uint32 dstEid => address lib)) internal sendLibrary;
    mapping(address receiver => mapping(uint32 srcEid => address lib)) internal receiveLibrary;
    mapping(address receiver => mapping(uint32 srcEid => Timeout)) public receiveLibraryTimeout;

    mapping(uint32 dstEid => address lib) public defaultSendLibrary;
    mapping(uint32 srcEid => address lib) public defaultReceiveLibrary;
    mapping(uint32 srcEid => Timeout) public defaultReceiveLibraryTimeout;

    modifier onlyRegistered(address _lib) {
        require(isRegisteredLibrary[_lib], "LZ10001");
        _;
    }

    modifier onlyRegisteredOrDefault(address _lib) {
        require(isRegisteredLibrary[_lib] || _lib == _DEFAULT_LIB, "LZ10002");
        _;
    }

    modifier onlySupportedEid(address _lib, uint32 _eid) {
        if (_lib != _DEFAULT_LIB) {
            require(IMessageLib(_lib).isSupportedEid(_eid), "LZ10008");
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

    function getSendLibrary(address _sender, uint32 _dstEid) public view returns (address lib, bool isDefault) {
        lib = sendLibrary[_sender][_dstEid];
        if (lib == _DEFAULT_LIB) {
            lib = defaultSendLibrary[_dstEid];
            require(lib != address(0x0), "LZD0004");
            isDefault = true;
        }
    }

    function getReceiveLibrary(address _receiver, uint32 _srcEid) public view returns (address lib, bool isDefault) {
        lib = receiveLibrary[_receiver][_srcEid];
        if (lib == _DEFAULT_LIB) {
            lib = defaultReceiveLibrary[_srcEid];
            require(lib != address(0x0), "LZD0004");
            isDefault = true;
        }
    }

    function isValidReceiveLibrary(
        address _receiver,
        uint32 _srcEid,
        address _actualReceiveLib
    ) public view returns (bool) {
        (address expectedReceiveLib, bool isDefault) = getReceiveLibrary(_receiver, _srcEid);
        if (_actualReceiveLib == expectedReceiveLib) {
            return true;
        }

        // if current library is default, use default configured timeout
        Timeout memory timeout = isDefault
            ? defaultReceiveLibraryTimeout[_srcEid]
            : receiveLibraryTimeout[_receiver][_srcEid];

        if (timeout.lib == _actualReceiveLib && timeout.expiry > 0 && timeout.expiry > block.timestamp) {
            // timeout lib set and has not expired
            return true;
        }
        return false;
    }

    //------- Owner interfaces
    function registerLibrary(address _lib) public onlyOwner {
        require(IERC165(_lib).supportsInterface(type(IMessageLib).interfaceId), "LZC0001");
        require(!isRegisteredLibrary[_lib], "LZ80000");
        isRegisteredLibrary[_lib] = true;
        registeredLibraries.push(_lib);
        emit LibraryRegistered(_lib);
    }

    function setDefaultSendLibrary(
        uint32 _eid,
        address _newLib
    ) external onlyOwner onlyRegistered(_newLib) onlySupportedEid(_newLib, _eid) {
        address oldLib = defaultSendLibrary[_eid];
        require(oldLib != _newLib, "LZ10005");
        defaultSendLibrary[_eid] = _newLib;
        emit DefaultSendLibrarySet(_eid, _newLib);
    }

    function setDefaultReceiveLibrary(
        uint32 _eid,
        address _newLib,
        uint _gracePeriod
    ) external onlyOwner onlyRegistered(_newLib) onlySupportedEid(_newLib, _eid) {
        address oldLib = defaultReceiveLibrary[_eid];
        require(oldLib != _newLib, "LZ10005");

        if (_gracePeriod > 0) {
            Timeout storage timeout = defaultReceiveLibraryTimeout[_eid];
            timeout.lib = oldLib;
            timeout.expiry = block.timestamp + _gracePeriod;
            emit DefaultReceiveLibraryTimeoutSet(_eid, oldLib, timeout.expiry);
        } else {
            delete defaultReceiveLibraryTimeout[_eid];
        }

        defaultReceiveLibrary[_eid] = _newLib;
        emit DefaultReceiveLibrarySet(_eid, oldLib, _newLib);
    }

    function setDefaultReceiveLibraryTimeout(
        uint32 _eid,
        address _lib,
        uint _expiry
    ) external onlyRegistered(_lib) onlySupportedEid(_lib, _eid) onlyOwner {
        if (_expiry == 0) {
            delete defaultReceiveLibraryTimeout[_eid];
        } else {
            require(_expiry > block.timestamp, "LZ10000");
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

    function isSupportedEid(uint32 _eid) external view returns (bool) {
        return defaultSendLibrary[_eid] != address(0) && defaultReceiveLibrary[_eid] != address(0);
    }

    //------- OApp interfaces
    function setSendLibrary(
        uint32 _eid,
        address _newLib
    ) external onlyRegisteredOrDefault(_newLib) onlySupportedEid(_newLib, _eid) {
        address oldLib = sendLibrary[msg.sender][_eid];
        require(oldLib != _newLib, "LZ10005");
        sendLibrary[msg.sender][_eid] = _newLib;
        emit SendLibrarySet(msg.sender, _eid, _newLib);
    }

    function setReceiveLibrary(
        uint32 _eid,
        address _newLib,
        uint _gracePeriod
    ) external onlyRegisteredOrDefault(_newLib) onlySupportedEid(_newLib, _eid) {
        address oldLib = receiveLibrary[msg.sender][_eid];
        require(oldLib != _newLib, "LZ10005");
        receiveLibrary[msg.sender][_eid] = _newLib;
        emit ReceiveLibrarySet(msg.sender, _eid, oldLib, _newLib);

        // if the new lib is default, it will use the default timeout configuration
        if (_gracePeriod > 0) {
            require(oldLib != _DEFAULT_LIB && _newLib != _DEFAULT_LIB, "LZ10010");
            Timeout memory timeout = Timeout({lib: oldLib, expiry: block.timestamp + _gracePeriod});
            receiveLibraryTimeout[msg.sender][_eid] = timeout;
            emit ReceiveLibraryTimoutSet(msg.sender, _eid, oldLib, timeout.expiry);
        } else {
            delete receiveLibraryTimeout[msg.sender][_eid];
        }
    }

    function setReceiveLibraryTimeout(
        uint32 _eid,
        address _lib,
        uint _expiry
    ) external onlyRegistered(_lib) onlySupportedEid(_lib, _eid) {
        (, bool isDefault) = getReceiveLibrary(msg.sender, _eid);
        require(!isDefault, "LZ10010"); // if current library is default, it cannot set timeout

        if (_expiry == 0) {
            delete receiveLibraryTimeout[msg.sender][_eid];
        } else {
            require(_expiry > block.timestamp, "LZ10000");
            Timeout storage timeout = receiveLibraryTimeout[msg.sender][_eid];
            timeout.lib = _lib;
            timeout.expiry = _expiry;
        }
        emit ReceiveLibraryTimoutSet(msg.sender, _eid, _lib, _expiry);
    }

    function setConfig(address _lib, uint32 _eid, ConfigParam[] calldata _params) external onlyRegistered(_lib) {
        IMessageLib(_lib).setConfig(msg.sender, _eid, _params);
    }

    function getConfig(
        address _oapp,
        address _lib,
        uint32 _eid,
        uint32 _configType
    ) external view onlyRegistered(_lib) returns (bytes memory config, bool isDefault) {
        return IMessageLib(_lib).getConfig(_eid, _oapp, _configType);
    }

    function snapshotConfig(address _lib, uint32[] calldata _eids) external onlyRegistered(_lib) {
        IMessageLib(_lib).snapshotConfig(_eids, msg.sender);
    }

    function resetConfig(address _lib, uint32[] calldata _eids) external onlyRegistered(_lib) {
        IMessageLib(_lib).resetConfig(_eids, msg.sender);
    }
}
