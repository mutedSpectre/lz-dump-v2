// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface IMessageLibBase {
    enum DeliveryState {
        Signing,
        Deliverable,
        Delivered,
        Waiting
    }
}
