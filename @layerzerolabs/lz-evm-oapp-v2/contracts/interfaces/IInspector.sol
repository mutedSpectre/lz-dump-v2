// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

interface IInspector {
    // @dev allow the inspector to examine contents and potentially throw a revert if either is invalid
    function inspect(bytes calldata _message, bytes calldata _options) external view returns (bool valid);
}
