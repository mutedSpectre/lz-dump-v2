// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IPacket.sol";
import "@layerzerolabs/lz-evm-v1-0.7/contracts/interfaces/ILayerZeroMessagingLibrary.sol";

/// extends ILayerZeroMessagingLibrary instead of ILayerZeroMessagingLibraryV2 for reducing the contract size
interface IMessageLibE1 is ILayerZeroMessagingLibrary, IPacket {
    function setLayerZeroToken(address _treasury) external;

    function setTreasury(address _treasury) external;

    function getDefaultConfig(uint32 _eid, uint32 _configType) external view returns (bytes memory);

    function withdrawFee(address _to, uint _amount) external;

    // message libs of same major version are compatible
    function version() external view returns (uint64 major, uint8 minor, uint8 endpointVersion);
}
