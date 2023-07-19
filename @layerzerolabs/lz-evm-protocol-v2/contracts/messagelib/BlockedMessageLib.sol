// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../interfaces/IMessageLib.sol";
import "../libs/Errors.sol";

contract BlockedMessageLib is ERC165 {
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IMessageLib).interfaceId || super.supportsInterface(interfaceId);
    }

    function version() external pure returns (uint64 major, uint8 minor, uint8 endpointVersion) {
        return (type(uint64).max, type(uint8).max, 2);
    }

    fallback() external {
        revert(Errors.NOT_IMPLEMENTED);
    }
}
