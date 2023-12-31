// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import {Origin} from "../MessagingStructs.sol";

interface ILayerZeroReceiver {
    function nextNonce(uint32 _eid, bytes32 _sender) external view returns (uint64);

    function lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes memory _message,
        address _executor,
        bytes calldata _extraData
    ) external payable;
}
