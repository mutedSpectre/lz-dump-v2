// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.7.0;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IPacket.sol";
import "@layerzerolabs/lz-evm-v1-0.7/contracts/interfaces/ILayerZeroMessagingLibraryV2.sol";

interface IMessageLibE1 is ILayerZeroMessagingLibraryV2, IPacket {
    function setLayerZeroToken(address _treasury) external;

    function setTreasury(address _treasury) external;

    function treasury() external view returns (address);

    function getDefaultConfig(uint32 _eid, uint32 _configType) external view returns (bytes memory);

    function withdrawFee(address _to, uint _amount) external;

    // message libs of same major version are compatible
    function version() external view returns (uint64 major, uint8 minor, uint8 endpointVersion);
}
