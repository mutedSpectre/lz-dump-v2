// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface IMessageOrigin {
    struct MessageOrigin {
        uint32 srcEid;
        bytes32 sender;
        uint64 nonce;
    }
}
