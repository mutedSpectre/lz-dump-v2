// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface ILayerZeroComposer {
    function lzCompose(
        address _receiver,
        bytes32 _guid,
        bytes calldata _message,
        address _caller,
        bytes calldata _callerParams
    ) external payable;
}
