// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../OApp.sol";
import "../libs/OptionsBuilder.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroComposer.sol";

library MsgCodec {
    uint8 internal constant VANILLA_TYPE = 1;
    uint8 internal constant COMPOSED_TYPE = 2;
    uint8 internal constant ABA_TYPE = 3;
    uint8 internal constant COMPOSED_ABA_TYPE = 4;

    uint8 internal constant MSG_TYPE_OFFSET = 0;
    uint8 internal constant SRC_EID_OFFSET = 1;

    function encode(uint8 _type, uint32 _srcEid) internal pure returns (bytes memory) {
        return abi.encodePacked(_type, _srcEid);
    }

    function msgType(bytes calldata _message) internal pure returns (uint8) {
        return uint8(bytes1(_message[MSG_TYPE_OFFSET:SRC_EID_OFFSET]));
    }

    function srcEid(bytes calldata _message) internal pure returns (uint32) {
        return uint32(bytes4(_message[SRC_EID_OFFSET:]));
    }
}

contract OmniCounter is ILayerZeroComposer, OApp {
    using MsgCodec for bytes;
    using OptionsBuilder for bytes;

    uint public count;
    uint public composedCount;

    address public admin;
    uint32 public eid;

    mapping(uint32 srcEid => mapping(bytes32 sender => uint64 nonce)) private maxReceivedNonce;
    bool private orderedNonce;

    // for global assertions
    mapping(uint32 srcEid => uint count) public inboundCount;
    mapping(uint32 dstEid => uint count) public outboundCount;

    constructor(address _endpoint) OApp(_endpoint) {
        admin = msg.sender;
        eid = endpoint.eid();
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

    // -------------------------------
    // Only Admin
    function setAdmin(address _admin) external onlyAdmin {
        admin = _admin;
    }

    function withdraw(address payable _to, uint _amount) external onlyAdmin {
        _to.transfer(_amount);
    }

    // -------------------------------
    // Send
    function increment(uint32 _eid, uint8 _type, bytes calldata _options) external payable {
        _lzSend(
            ILayerZeroEndpointV2.MessagingParams(_eid, safeGetPeer(_eid), MsgCodec.encode(_type, eid), _options),
            ILayerZeroEndpointV2.MessagingFee(msg.value, 0),
            payable(msg.sender)
        );
        _incrementOutbound(_eid);
    }

    // this is a broken function to skip incrementing outbound count
    // so that precrime will fail
    function brokenIncrement(uint32 _eid, uint8 _type, bytes calldata _options) external payable onlyAdmin {
        _lzSend(
            ILayerZeroEndpointV2.MessagingParams(_eid, safeGetPeer(_eid), MsgCodec.encode(_type, eid), _options),
            ILayerZeroEndpointV2.MessagingFee(msg.value, 0),
            payable(msg.sender)
        );
    }

    function batchIncrement(
        uint32[] calldata _eids,
        uint8[] calldata _types,
        bytes[] calldata _options
    ) external payable {
        require(_eids.length == _options.length && _eids.length == _types.length, "OmniCounter: length mismatch");

        ILayerZeroEndpointV2.MessagingReceipt memory receipt;
        uint providedFee = msg.value;
        for (uint i = 0; i < _eids.length; i++) {
            address refundAddress = i == _eids.length - 1 ? msg.sender : address(this);
            receipt = _lzSend(
                ILayerZeroEndpointV2.MessagingParams(
                    _eids[i],
                    safeGetPeer(_eids[i]),
                    MsgCodec.encode(_types[i], eid),
                    _options[i]
                ),
                ILayerZeroEndpointV2.MessagingFee(providedFee, 0),
                payable(refundAddress)
            );
            _incrementOutbound(_eids[i]);
            providedFee -= receipt.fee.nativeFee;
        }
    }

    // -------------------------------
    // View
    function quote(
        uint32 _eid,
        uint8 _type,
        bytes calldata _options
    ) public view returns (uint nativeFee, uint zroFee) {
        return _quote(_eid, MsgCodec.encode(_type, eid), false, _options);
    }

    // -------------------------------
    // Receive
    function _lzReceive(
        MessageOrigin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        uint8 messageType = _message.msgType();

        if (messageType == MsgCodec.VANILLA_TYPE) {
            count++;
            _incrementInbound(_origin.srcEid);
        } else if (messageType == MsgCodec.COMPOSED_TYPE || messageType == MsgCodec.COMPOSED_ABA_TYPE) {
            count++;
            _incrementInbound(_origin.srcEid);
            endpoint.deliverComposedMessage(address(this), _guid, _message);
        } else if (messageType == MsgCodec.ABA_TYPE) {
            count++;
            _incrementInbound(_origin.srcEid);

            // send back to the sender
            _incrementOutbound(_origin.srcEid);
            bytes memory options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(200000, 0);
            _lzSend(
                ILayerZeroEndpointV2.MessagingParams(
                    _origin.srcEid,
                    safeGetPeer(_origin.srcEid),
                    MsgCodec.encode(MsgCodec.VANILLA_TYPE, eid),
                    options
                ),
                ILayerZeroEndpointV2.MessagingFee(msg.value, 0),
                payable(address(this))
            );
        } else {
            revert("invalid message type");
        }
    }

    function _incrementInbound(uint32 _srcEid) internal {
        inboundCount[_srcEid]++;
    }

    function _incrementOutbound(uint32 _dstEid) internal {
        outboundCount[_dstEid]++;
    }

    function lzCompose(
        address /*_oapp*/,
        bytes32 /*_guid*/,
        bytes calldata _message,
        address,
        bytes calldata
    ) external payable override {
        require(msg.sender == address(endpoint), "!endpoint");

        uint8 msgType = _message.msgType();
        if (msgType == MsgCodec.COMPOSED_TYPE) {
            composedCount += 1;
        } else if (msgType == MsgCodec.COMPOSED_ABA_TYPE) {
            composedCount += 1;

            uint32 srcEid = _message.srcEid();
            _incrementOutbound(srcEid);
            bytes memory options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(200000, 0);
            _lzSend(
                ILayerZeroEndpointV2.MessagingParams(
                    srcEid,
                    safeGetPeer(srcEid),
                    MsgCodec.encode(MsgCodec.VANILLA_TYPE, eid),
                    options
                ),
                ILayerZeroEndpointV2.MessagingFee(msg.value, 0),
                payable(address(this))
            );
        } else {
            revert("invalid message type");
        }
    }

    // -------------------------------
    // Ordered OApp
    // this demonstrates how to build an app that requires execution nonce ordering
    // normally an app should decide ordered or not on contract construction
    // this is just a demo
    function setOrderedNonce(bool _orderedNonce) external onlyOwner {
        orderedNonce = _orderedNonce;
    }

    function _acceptNonce(uint32 _srcEid, bytes32 _sender, uint64 _nonce) internal virtual override {
        uint64 currentNonce = maxReceivedNonce[_srcEid][_sender];
        if (orderedNonce) {
            require(_nonce == currentNonce + 1, "OApp: invalid nonce");
        }
        // update the max nonce anyway. once the ordered mode is turned on, missing early nonces will be rejected
        if (_nonce > currentNonce) {
            maxReceivedNonce[_srcEid][_sender] = _nonce;
        }
    }

    function nextNonce(uint32 _srcEid, bytes32 _sender) public view virtual override returns (uint64) {
        if (orderedNonce) {
            return maxReceivedNonce[_srcEid][_sender] + 1;
        } else {
            return 0; // path nonce starts from 1. if 0 it means that there is no specific nonce enforcement
        }
    }

    // a governance function to skip nonce
    function skipInboundNonce(uint32 _srcEid, bytes32 _sender, uint64 _nonce) public virtual onlyOwner {
        endpoint.skip(_srcEid, _sender, _nonce);
        if (orderedNonce) {
            maxReceivedNonce[_srcEid][_sender]++;
        }
    }

    // be able to receive ether
    fallback() external payable {}
}
