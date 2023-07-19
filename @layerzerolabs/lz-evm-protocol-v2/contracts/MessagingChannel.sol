// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "./interfaces/IMessageOrigin.sol";

contract MessagingChannel is IMessageOrigin {
    mapping(address receiver => mapping(uint32 srcEid => mapping(bytes32 sender => uint64 nonce)))
        internal lazyInboundNonce;
    mapping(address receiver => mapping(uint32 srcEid => mapping(bytes32 sender => mapping(uint64 inboundNonce => bytes32 payloadHash))))
        internal inboundPayloadHash;
    mapping(address sender => mapping(uint32 dstEid => mapping(bytes32 receiver => uint64 nonce)))
        internal outboundNonce;

    function _outbound(address _sender, uint32 _dstEid, bytes32 _receiver) internal returns (uint64) {
        return ++outboundNonce[_sender][_dstEid][_receiver];
    }

    function _inbound(MessageOrigin calldata _origin, address _receiver, bytes32 _payloadHash) internal {
        if (!_inboundDeliverable(_origin, _receiver)) {
            revert("LZ10004");
        }
        inboundPayloadHash[_receiver][_origin.srcEid][_origin.sender][_origin.nonce] = _payloadHash;
    }

    function _inboundDeliverable(MessageOrigin calldata _origin, address _receiver) internal view returns (bool) {
        // payload hashes can only be cleared in order, lazyInboundNonce is updated to the latest nonce cleared
        // when payload gets cleared it must have already been delivered
        // hence, as long as nonce > lazyInboundNonce, it has not been cleared and can be re/delivered
        return _origin.nonce > lazyInboundNonce[_receiver][_origin.srcEid][_origin.sender];
    }

    function _hasPayload(
        address _receiver,
        uint32 _srcEid,
        bytes32 _sender,
        uint64 _nonce
    ) internal view returns (bool) {
        return inboundPayloadHash[_receiver][_srcEid][_sender][_nonce] != bytes32(0);
    }

    // this is an emergency function if a message can not be delivered for some reasons
    // required to provide _nextNonce to avoid race condition
    function _skipInboundNonce(address _receiver, uint32 _srcEid, bytes32 _sender, uint64 _nextNonce) internal {
        require(_nextNonce == _getInboundNonce(_receiver, _srcEid, _sender) + 1, "LZ10004");
        lazyInboundNonce[_receiver][_srcEid][_sender] = _nextNonce;
    }

    function _clearPayload(
        MessageOrigin calldata _origin,
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
            for (uint64 i = currentNonce + 1; i <= nonce; ++i) {
                require(_hasPayload(_receiver, srcEid, sender, i), "LZ10004");
            }
            lazyInboundNonce[_receiver][srcEid][sender] = nonce;
        }

        // check hash
        actualHash = keccak256(_payload);
        bytes32 expectedHash = inboundPayloadHash[_receiver][srcEid][sender][nonce];
        require(expectedHash == actualHash, "LZ60000");
        // remove it from the storage
        delete inboundPayloadHash[_receiver][srcEid][sender][nonce];
    }

    function _getInboundNonce(address _receiver, uint32 _srcEid, bytes32 _sender) internal view returns (uint64) {
        uint64 nonceCursor = lazyInboundNonce[_receiver][_srcEid][_sender];
        // find the effective inbound currentNonce
        while (_hasPayload(_receiver, _srcEid, _sender, nonceCursor + 1)) {
            ++nonceCursor;
        }
        return nonceCursor;
    }
}
