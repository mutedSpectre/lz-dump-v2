// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Origin} from "@layerzerolabs/lz-evm-protocol-v2/contracts/MessagingStructs.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLibManager.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessagingChannel.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IOApp.sol";
import "./interfaces/IPreCrime.sol";

/// @dev the template class for OApps. Refer to the OmniCounter for examples
abstract contract OApp is IOApp, Ownable {
    /// @dev we version the OApp to version the OApp Behaviours (e.g. future version might have different precrime interfaces)
    uint public constant override version = 1;
    ILayerZeroEndpointV2 public immutable endpoint;
    mapping(uint32 => bytes32) public peers;

    // @dev These enforced options can vary as the potential options/execution on remote may differ
    // eg. Amount of lzReceive gas necessary to deliver a composed message adds overhear you dont want to pay
    // if you are only make a standard crosschain call (no deliver compose)
    // enforcedOptions[eid][executionType] = enforcedOptions
    // The "msgType" should be defined in the child contract
    mapping(uint32 eid => mapping(uint16 msgType => bytes)) internal enforcedOptions;

    IPreCrime public precrime;

    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpointV2(_endpoint);
    }

    function setEnforcedOptions(EnforcedOptionParam[] calldata _enforcedOptions) public virtual onlyOwner {
        for (uint i = 0; i < _enforcedOptions.length; i++) {
            enforcedOptions[_enforcedOptions[i].eid][_enforcedOptions[i].msgType] = _enforcedOptions[i].options;
        }

        emit SetEnforcedOption(_enforcedOptions);
    }

    /// @dev the generic send interface to interact with the LayerZero EndpointV2.quote()
    function _quote(
        uint32 _eid,
        bytes memory _message,
        bool _useLZToken,
        bytes memory _options
    ) internal view virtual returns (uint nativeFee, uint lzTokenFee) {
        MessagingFee memory fee = endpoint.quote(address(this), _eid, _message, _useLZToken, _options);
        return (fee.nativeFee, fee.lzTokenFee);
    }

    /// @dev the generic send interface to interact with the LayerZero EndpointV2.send()
    function _lzSend(
        MessagingParams memory _msgParams,
        MessagingFee memory _fee,
        address payable _refundAddress
    ) internal virtual returns (MessagingReceipt memory) {
        MessagingReceipt memory receipt = endpoint.send{value: _fee.nativeFee}(
            _msgParams,
            _fee.lzTokenFee,
            _refundAddress
        );
        return receipt;
    }

    /// @dev Oapp can override this interface for custom logics (e.g. more assertion)
    function lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) public payable virtual {
        // assert the call is from the endpoint
        if (address(endpoint) != msg.sender) revert EndpointOnly(msg.sender);
        // assert that it is from a trusted peer
        if (safeGetPeer(_origin.srcEid) != _origin.sender) revert InvalidPeer(_origin.sender);
        // assert that the nonce is acceptable
        _acceptNonce(_origin.srcEid, _origin.sender, _origin.nonce);

        // perform the state transition logic
        _lzReceive(_origin, _guid, _message, _executor, _extraData);
    }

    /// @dev needs to be implemented by the OApp
    /// @dev basic security checks are already performed
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal virtual;

    /// @dev a generic interface for precrime simulations
    /// @dev this function reverts at the end with the simulation results
    /// @dev value is provided as a lump sum, does not restrict how much each packet can consume
    function lzReceiveAndRevert(IPreCrime.Packet[] calldata _packets) external payable virtual override {
        if (address(precrime) != msg.sender) revert PreCrimeOnly(msg.sender);

        for (uint i = 0; i < _packets.length; i++) {
            IPreCrime.Packet calldata packet = _packets[i];
            bytes32 peer = safeGetPeer(packet.origin.srcEid);
            if (peer != packet.origin.sender) {
                // packet from untrusted peer cannot be lzReceived, hence cannot change state
                continue;
            }
            // don't need to accept nonce, as by precrime protocol, all packets are sorted
            _lzReceive(packet.origin, packet.guid, packet.message, msg.sender, packet.callParams);
        }
        revert IPreCrime.LzReceiveRevert(1, precrime.simulationCallback());
    }

    /// @dev path nonce starts from 1. if 0 it means that there is no specific nonce enforcement
    /// @dev only used to guide the executor actions if the app specify the msg execution to be ordered.
    function nextNonce(uint32 /*_srcEid*/, bytes32 /*_sender*/) public view virtual returns (uint64) {
        return 0;
    }

    /// @dev if the app wants to enforce ordered execution, it should override this function to return the correct value
    /// @dev check OmniCounter for example
    function _acceptNonce(uint32 /*_srcEid*/, bytes32 /*_sender*/, uint64 /*_nonce*/) internal virtual {
        // do nth by default
    }

    /// @dev receive native tokens. this might be used for the endpoint to refund
    receive() external payable virtual {}

    /// ----------------------------- OAPP Config Functions -----------------------------

    /// @dev set _peer to bytes32(0) (the default value) to "untrust"
    function setPeer(uint32 _eid, bytes32 _peer) public virtual onlyOwner {
        if (peers[_eid] == _peer) revert InvalidPeerState();
        peers[_eid] = _peer;
        emit SetPeer(_eid, _peer);
    }

    /// @dev check non-zero peer and return it
    function safeGetPeer(uint32 _eid) public view virtual returns (bytes32 peer) {
        peer = peers[_eid];
        if (peer == bytes32(0)) revert NoPeerSet(_eid);
    }

    /// @dev set the precrime contract. can upgrade the precrime implementation overtime
    function setPrecrime(address _precrime) external onlyOwner {
        precrime = IPreCrime(_precrime);
        emit SetPrecrime(_precrime);
    }

    /// @dev a generic interface to set the endpoint config
    /// @dev this is a low level interface, and should be used with caution
    /// @dev use our SDK to generate the properly abi.encoded config
    function callEndpoint(bytes calldata _callData) public virtual onlyOwner {
        bytes4 functionSig = bytes4(_callData);
        require(
            functionSig == IMessageLibManager.setConfig.selector ||
                functionSig == IMessageLibManager.snapshotConfig.selector ||
                functionSig == IMessageLibManager.resetConfig.selector ||
                functionSig == IMessageLibManager.setReceiveLibrary.selector ||
                functionSig == IMessageLibManager.setSendLibrary.selector ||
                functionSig == IMessageLibManager.setReceiveLibraryTimeout.selector ||
                functionSig == ILayerZeroEndpointV2.clear.selector ||
                functionSig == IMessagingChannel.skip.selector,
            "OApp: function not allowed"
        );

        (bool success, bytes memory reason) = address(endpoint).call(_callData);
        if (!success) {
            assembly {
                revert(add(reason, 32), mload(reason))
            }
        }
    }
}
