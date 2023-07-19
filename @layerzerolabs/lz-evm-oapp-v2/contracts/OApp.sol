// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpoint.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/Options.sol";

import "./Peer.sol";
import "./interfaces/IOApp.sol";

abstract contract OApp is Peer, IOApp {
    uint public version = 1;
    ILayerZeroEndpoint public immutable endpoint;

    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpoint(_endpoint);
    }

    function _quote(
        uint32 _eid,
        bytes memory _message,
        bool _useZro,
        bytes memory _options
    ) internal view returns (uint nativeFee, uint zroFee) {
        ILayerZeroEndpoint.MessagingFee memory fee = endpoint.quote(address(this), _eid, _message, _useZro, _options);
        return (fee.nativeFee, fee.lzTokenFee);
    }

    function _lzSend(
        ILayerZeroEndpoint.MessagingParams memory _msgParams,
        ILayerZeroEndpoint.MessagingFee memory _fee,
        address payable _refundAddress
    ) internal virtual returns (ILayerZeroEndpoint.MessagingReceipt memory) {
        // if receiver is not set, try to get it from the peer registry
        if (_msgParams.receiver == bytes32(0)) {
            _msgParams.receiver = safeGetPeer(_msgParams.dstEid);
        }
        ILayerZeroEndpoint.MessagingReceipt memory receipt = endpoint.send{value: _fee.nativeFee}(
            _msgParams,
            _fee.lzTokenFee,
            _refundAddress
        );
        return receipt;
    }

    function lzReceive(
        MessageOrigin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _callerParams
    ) public payable virtual {
        // check if the message is from the endpoint or self. If it's from self, it's a call for gas estimation
        require(address(endpoint) == msg.sender, "OApp: endpoint only");
        assertPeer(_origin.srcEid, _origin.sender);
        _acceptNonce(_origin.srcEid, _origin.sender, _origin.nonce);
        _lzReceive(_origin, _guid, _message, _executor, _callerParams);
    }

    function nextNonce(uint32 /*_srcEid*/, bytes32 /*_sender*/) public view virtual returns (uint64) {
        return 0; // path nonce starts from 1. if 0 it means that there is no specific nonce enforcement
    }

    function _acceptNonce(uint32 _srcEid, bytes32 _sender, uint64 _nonce) internal virtual {
        // do nth by default
    }

    // burn message
    function burn(MessageOrigin calldata _origin, bytes32 _guid, bytes calldata _message) public virtual onlyOwner {
        endpoint.clear(_origin, _guid, _message);
        assertPeer(_origin.srcEid, _origin.sender);
        /// oapp should override burn if they want to partially apply the message
    }

    function skipInboundNonce(uint32 _srcEid, bytes32 _sender, uint64 _nonce) public virtual onlyOwner {
        endpoint.skip(_srcEid, _sender, _nonce);
    }

    function _lzReceive(
        MessageOrigin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _callerParams
    ) internal virtual;

    /// receive ETH from lz endpoint when multiSend
    receive() external payable virtual {}

    /// ----------------------------- UA Config Functions -----------------------------
    function setConfig(
        address _messageLib,
        uint32 _eid,
        ILayerZeroEndpoint.ConfigParam[] calldata _params
    ) public virtual onlyOwner {
        endpoint.setConfig(_messageLib, _eid, _params);
    }

    function snapshotConfig(address _messageLib, uint32[] calldata _eids) public virtual onlyOwner {
        endpoint.snapshotConfig(_messageLib, _eids);
    }

    function resetConfig(address _messageLib, uint32[] calldata _eids) public virtual onlyOwner {
        endpoint.resetConfig(_messageLib, _eids);
    }

    function setSendMessageLib(uint32 _eid, address _newLib) public virtual onlyOwner {
        endpoint.setSendLibrary(_eid, _newLib);
    }

    function setReceiveMessageLib(uint32 _eid, address _newLib, uint _gracePeriod) public virtual onlyOwner {
        endpoint.setReceiveLibrary(_eid, _newLib, _gracePeriod);
    }

    function setReceiveMessageLibTimeout(uint32 _eid, address _lib, uint _timeout) public virtual onlyOwner {
        endpoint.setReceiveLibraryTimeout(_eid, _lib, _timeout);
    }
}
