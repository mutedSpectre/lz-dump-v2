// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "./interfaces/IMessagingContext.sol";
import "./libs/Errors.sol";

/// this contract acts as a non-reentrancy guard and a source of messaging context
/// the context includes the remote eid and the sender/receiver address
/// it separates the send and receive context to allow messaging receipts (send back on receive())
contract MessagingContext is IMessagingContext {
    uint private constant _NOT_ENTERED = 1;
    uint private _sendContext = _NOT_ENTERED;

    /// @dev the sendContext is set to 8 bytes 0s + 4 bytes eid + 20 bytes sender
    modifier sendContext(uint32 _dstEid, address _sender) {
        require(_sendContext == _NOT_ENTERED, Errors.SEND_REENTRANCY);
        _sendContext = (uint(_dstEid) << 160) | uint160(_sender);
        _;
        _sendContext = _NOT_ENTERED;
    }

    /// @dev returns true if sending message
    function isSendingMessage() public view returns (bool) {
        return _sendContext != _NOT_ENTERED;
    }

    /// @dev returns (eid, sender) if sending message, (0, 0) otherwise
    function getSendContext() external view returns (uint32, address) {
        return isSendingMessage() ? (uint32(_sendContext >> 160), address(uint160(_sendContext))) : (0, address(0));
    }
}
