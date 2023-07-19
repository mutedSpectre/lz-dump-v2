// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLibManager.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroReceiver.sol";

interface IOApp is ILayerZeroReceiver {
    function setConfig(address _messageLib, uint32 _eid, IMessageLibManager.ConfigParam[] calldata _params) external;

    function snapshotConfig(address _messageLib, uint32[] calldata _eids) external;

    function resetConfig(address _messageLib, uint32[] calldata _eids) external;

    function setSendMessageLib(uint32 _eid, address _newLib) external;

    function setReceiveMessageLib(uint32 _eid, address _newLib, uint _gracePeriod) external;

    function setReceiveMessageLibTimeout(uint32 _eid, address _lib, uint _timeout) external;

    function version() external view returns (uint);
}
