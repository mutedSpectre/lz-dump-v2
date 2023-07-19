// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface IUltraLightNode301 {
    function deliver(bytes calldata _packet, uint _gasLimit) external;
}
