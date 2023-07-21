// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import {Origin} from "./MessagingStructs.sol";
import "./interfaces/IMessagingChannel.sol";
import "./libs/Errors.sol";
import "./libs/AddressCast.sol";

contract MessagingChannel is IMessagingChannel {
    using AddressCast for address;

    uint32 public immutable eid;

    mapping(address receiver => mapping(uint32 srcEid => mapping(bytes32 sender => uint64 nonce)))
        internal lazyInboundNonce;
    mapping(address receiver => mapping(uint32 srcEid => mapping(bytes32 sender => mapping(uint64 inboundNonce => bytes32 payloadHash))))
        public inboundPayloadHash;
    mapping(address sender => mapping(uint32 dstEid => mapping(bytes32 receiver => uint64 nonce))) public outboundNonce;

    constructor(uint32 _eid) {
        eid = _eid;
    }

    /// @dev increase and return the next outbound nonce
    function _outbound(address _sender, uint32 _dstEid, bytes32 _receiver) internal returns (uint64 nonce) {
        unchecked {
            nonce = ++outboundNonce[_sender][_dstEid][_receiver];
        }
    }

    /// @dev inbound wont update the nonce eagerly to allow unordered delivery
    /// @dev instead, it will update the nonce lazily when the message is received
    /// @dev messages can only be cleared in order to preserve censorship-resistance
    function _inbound(Origin calldata _origin, address _receiver, bytes32 _payloadHash) internal {
        inboundPayloadHash[_receiver][_origin.srcEid][_origin.sender][_origin.nonce] = _payloadHash;
    }

    /// @dev as long as nonce > lazyInboundNonce, the nonce has not be received and it can be re/delivered.
    /// @dev for honest msglibs, redelivering the same message is idempotent
    /// @dev for malicious/buggy msglibs, in the extreme cases, allowing redelivery provide the ability to recover from the failure if the message was not received (can be rejected by the app by some forms of time-lock window)
    function _inboundDeliverable(Origin calldata _origin, address _receiver) internal view returns (bool) {
        return _origin.nonce > lazyInboundNonce[_receiver][_origin.srcEid][_origin.sender];
    }

    /// @dev returns the effective inbound nonce which has all its prior messages delivered
    /// @dev it starts from the lazyInboundNonce (last checkpoint) and iteratively check if the next nonce has been delivered
    /// @dev in extreme cases where there are a lot of messages, this function can OOG. but it can be trivially fixed by just clearing some prior messages
    /// @dev if the app can not receive any of the queued message, the app is most likely broken
    function inboundNonce(address _receiver, uint32 _srcEid, bytes32 _sender) public view returns (uint64) {
        uint64 nonceCursor = lazyInboundNonce[_receiver][_srcEid][_sender];
        // find the effective inbound currentNonce
        unchecked {
            while (hasPayloadHash(_receiver, _srcEid, _sender, nonceCursor + 1)) {
                ++nonceCursor;
            }
        }
        return nonceCursor;
    }

    /// @dev simply checking if the storage slot is not initialized. assuming the payload can be not hashed to 0
    function hasPayloadHash(
        address _receiver,
        uint32 _srcEid,
        bytes32 _sender,
        uint64 _nonce
    ) public view returns (bool) {
        return inboundPayloadHash[_receiver][_srcEid][_sender][_nonce] != bytes32(0);
    }

    /// @dev the caller must provide _nonce to prevent skipping the unintended nonce
    /// @dev it could happen in some race conditions, e.g. intent to skip nonce 3, but nonce 3 was consumed before this transaction was included in the block
    /// @dev NOTE: only allows skipping the next of the effective inbound nonce (from the inboundNonce() function). if the Oapp wants to skips a delivered message, it should call the clear() function and ignore the payload instead
    /// @dev after skipping the lazyInboundNonce is set to the provided nonce, which makes the inboundNonce also the provided nonce
    function skip(uint32 _srcEid, bytes32 _sender, uint64 _nonce) external {
        require(_nonce == inboundNonce(msg.sender, _srcEid, _sender) + 1, Errors.INVALID_NONCE);
        lazyInboundNonce[msg.sender][_srcEid][_sender] = _nonce;
        emit InboundNonceSkipped(_srcEid, _sender, msg.sender, _nonce);
    }

    /// @dev calling this function will clear the stored message and increment the lazyInboundNonce to the provided nonce
    /// @dev if a lot of messages are queued, the messages can be cleared with a smaller step size to prevent OOG
    /// @dev NOTE: this function does not change inboundNonce, it only changes the lazyInboundNonce up to the provided nonce
    function _clearPayload(
        Origin calldata _origin,
        address _receiver,
        bytes memory _payload
    ) internal returns (bytes32 actualHash) {
        uint32 srcEid = _origin.srcEid;
        bytes32 sender = _origin.sender;
        uint64 nonce = _origin.nonce;
        // require the _nonce to be no greater than the inboundNonce
        uint64 currentNonce = lazyInboundNonce[_receiver][srcEid][sender];
        if (nonce > currentNonce) {
            // try to lazily update the inboundNonce till the _nonce
            unchecked {
                for (uint64 i = currentNonce + 1; i <= nonce; ++i) {
                    require(hasPayloadHash(_receiver, srcEid, sender, i), Errors.INVALID_NONCE);
                }
            }
            lazyInboundNonce[_receiver][srcEid][sender] = nonce;
        }

        // check hash
        actualHash = keccak256(_payload);
        bytes32 expectedHash = inboundPayloadHash[_receiver][srcEid][sender][nonce];
        require(expectedHash == actualHash, Errors.NOT_FOUND);
        // remove it from the storage
        delete inboundPayloadHash[_receiver][srcEid][sender][nonce];
    }

    /// @dev returns the GUID for the next message given the path
    /// @dev the Oapp might want to include the GUID into the message in some cases
    function nextGuid(address _sender, uint32 _dstEid, bytes32 _receiver) external view returns (bytes32) {
        uint64 nextNonce = outboundNonce[_sender][_dstEid][_receiver] + 1;
        return _getGuid(nextNonce, _sender, _dstEid, _receiver);
    }

    function _getGuid(
        uint64 _nonce,
        address _sender,
        uint32 _dstEid,
        bytes32 _receiver
    ) internal view returns (bytes32 guid) {
        bytes memory path = abi.encodePacked(eid, _sender.toBytes32(), _dstEid, _receiver);
        guid = keccak256(abi.encodePacked(_nonce, path));
    }
}
