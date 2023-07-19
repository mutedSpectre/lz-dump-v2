// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../OApp.sol";
import "./interfaces/IOFT.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroComposer.sol";
import "../../OApp.sol";
import "./interfaces/IOFT.sol";
import "../../interfaces/IInspector.sol";
import "./libs/OFTMsgCodec.sol";
import "./libs/OFTComposeMsgCodec.sol";

abstract contract OFTCore is IOFT, OApp {
    using OFTMsgCodec for bytes;
    using OFTMsgCodec for bytes32;

    // @dev ensure no overflows when converting from amountLD to amountSD
    // amountLDMax = amountSDMax * ld2sdRate
    // (2^256 - 1) = (2^64 - 1) * ld2sdRate
    // (2^256 - 1) = (2^64 - 1) * (10 ^ (_localDecimals - sharedDecimals()))
    // (2^256 - 1) = (2^64 - 1) * (10 ^ MAX_LD_SD_DECIMAL_DIFF)
    // (2^256 - 1) = (2^64 - 1) * (10 ^ 57.931~)
    // ld - sd <= 57;
    uint internal immutable ld2sdRate;

    // @dev These enforced options can vary as the potential options/execution on remote may differ
    // eg. Amount of lzReceive gas necessary to deliver a composed message adds overhear you dont want to pay
    // if you are only make a standard crosschain call (no deliver compose)
    // enforcedOptions[eid][executionType] = enforcedOptions
    // The "executionType" should be defined in the child contract
    mapping(uint32 => mapping(uint => bytes)) internal enforcedOptions;

    // @dev execution types to handle different enforcedOptions
    uint internal constant SEND = 1;
    uint internal constant SEND_AND_CALL = 2;

    // @dev optional interface for an arbitrary contract to inspect both 'message' and 'options'
    IInspector public inspector;

    constructor(uint8 _localDecimals, address _endpoint) OApp(_endpoint) {
        if (_localDecimals < sharedDecimals()) revert LDMinusSD();
        ld2sdRate = 10 ** (_localDecimals - sharedDecimals());
    }

    // @dev Sets an implicit cap on the amount of tokens, over uint64.max() will need some sort of outbound cap / totalSupply cap
    // Lowest common decimal denominator between chains.
    // Defaults to 6 decimal places to provide up to 18,446,744,073,709.551615 units (max uint64).
    // For tokens exceeding this totalSupply(), they will need to override the sharedDecimals function with something smaller.
    // ie. 4 sharedDecimals would be 1,844,674,407,370,955.1615
    function sharedDecimals() public view virtual returns (uint8) {
        return 6;
    }

    function setInspector(address _inspector) public virtual onlyOwner {
        inspector = IInspector(_inspector);
        emit SetInspector(_inspector);
    }

    function setEnforcedOptions(EnforcedOptionParam[] calldata _enforcedOptions) public virtual onlyOwner {
        for (uint i = 0; i < _enforcedOptions.length; i++) {
            enforcedOptions[_enforcedOptions[i].eid][_enforcedOptions[i].executionType] = _enforcedOptions[i].options;
        }

        emit SetEnforcedOption(_enforcedOptions);
    }

    function _buildOptions(
        uint32 _eid,
        uint _executionType,
        bytes memory _extraOptions
    ) internal view virtual returns (bytes memory options) {
        options = bytes.concat(enforcedOptions[_eid][_executionType], _extraOptions);
    }

    // @dev Requests a nativeFee/lzTokenFee quote for sending the corresponding msg crosschain through the layerZero Endpoint
    function quoteSendFee(
        SendParam calldata _send,
        bytes calldata _extraOptions,
        bool _useLZToken
    ) public view virtual override returns (uint nativeFee, uint lzTokenFee) {
        (nativeFee, lzTokenFee) = _quote(
            _send.dstEid,
            OFTMsgCodec.encode(_send.to, _LDtoSD(_send.amountLD)),
            _useLZToken,
            _buildOptions(_send.dstEid, SEND, _extraOptions)
        );
    }

    // @dev Similar to quoteSendFee(), except with the addition of executing a composed payload on the remote chain
    function quoteSendAndCallFee(
        SendParam calldata _send,
        bytes calldata _extraOptions,
        bool _useLZToken,
        bytes calldata _composeMsg
    ) public view virtual override returns (uint nativeFee, uint lzTokenFee) {
        (nativeFee, lzTokenFee) = _quote(
            _send.dstEid,
            OFTMsgCodec.encode(
                _send.to,
                _LDtoSD(_send.amountLD),
                // @dev Similar to the comments from sendAndCall(), we must append the msg.sender etc.~
                abi.encodePacked(OFTMsgCodec.addressToBytes32(msg.sender), _composeMsg)
            ),
            _useLZToken,
            _buildOptions(_send.dstEid, SEND_AND_CALL, _extraOptions)
        );
    }

    // @dev executes a crosschain OFT swap via layerZero Endpoint
    function send(
        SendParam calldata _send,
        bytes calldata _extraOptions,
        ILayerZeroEndpointV2.MessagingFee calldata _msgFee,
        address payable _refundAddress
    ) public payable virtual returns (ILayerZeroEndpointV2.MessagingReceipt memory msgReceipt) {
        msgReceipt = _sendInternal(
            _send,
            _buildOptions(_send.dstEid, SEND, _extraOptions),
            _msgFee,
            _refundAddress,
            ""
        );
    }

    // @dev executes a crosschain OFT swap via layerZero Endpoint AND a lzCompose msg
    function sendAndCall(
        SendParam calldata _send,
        bytes calldata _extraOptions,
        ILayerZeroEndpointV2.MessagingFee calldata _msgFee,
        address payable _refundAddress,
        bytes calldata _composeMsg
    ) public payable virtual returns (ILayerZeroEndpointV2.MessagingReceipt memory msgReceipt) {
        msgReceipt = _sendInternal(
            _send,
            _buildOptions(_send.dstEid, SEND_AND_CALL, _extraOptions),
            _msgFee,
            _refundAddress,
            // @dev Remote chains will want to know the composed function caller.
            // ALSO, the presence of a composeFrom msg.sender inside of the bytes array indicates the payload should
            // be composed. ie. this allows users to compose with an empty payload, vs it must be length > 0
            abi.encodePacked(OFTMsgCodec.addressToBytes32(msg.sender), _composeMsg)
        );
    }

    function _sendInternal(
        SendParam calldata _send,
        bytes memory _options, // @dev a combination of enforcedOptions, and extraOptions
        ILayerZeroEndpointV2.MessagingFee calldata _msgFee,
        address payable _refundAddress,
        // @dev '0x' for a regular non composed crosschain swap, OR '0x[msg.sender][composeMsg]' for composed.
        // 'composeMsg' can be an empty bytes array, but msg.sender will always be there
        bytes memory _composeMsg
    ) internal virtual returns (ILayerZeroEndpointV2.MessagingReceipt memory msgReceipt) {
        uint amountLD = _beforeDebit(_send.amountLD, _send.dstEid);
        uint amountLDSend = _debit(amountLD);

        // @dev Slippage protection in the event there is fees or custom logic inside of _debit() or _beforeDebit()
        if (amountLDSend < _send.minAmountLD) revert AmountSlippage(amountLDSend, _send.minAmountLD);

        bytes memory message;

        if (_composeMsg.length == 0) {
            message = OFTMsgCodec.encode(_send.to, _LDtoSD(amountLDSend));
        } else {
            message = OFTMsgCodec.encode(_send.to, _LDtoSD(amountLDSend), _composeMsg);
        }

        // @dev only enforced if explicitly set by the owner
        if (address(inspector) != address(0)) inspector.inspect(message, _options);

        msgReceipt = _lzSend(
            ILayerZeroEndpointV2.MessagingParams(_send.dstEid, safeGetPeer(_send.dstEid), message, _options),
            _msgFee,
            _refundAddress
        );

        emit SendOFT(msgReceipt.guid, msg.sender, amountLDSend);
    }

    function _lzReceive(
        MessageOrigin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal virtual override {
        // @dev sendTo is always a bytes32 as the remote chain initiating the call doesnt know remote chain address size
        address toAddress = _message.sendTo().bytes32ToAddress();

        uint amountLD = _beforeCredit(_SDtoLD(_message.amountSD()), toAddress, _origin.srcEid);
        uint amountLDReceive = _credit(toAddress, amountLD);

        if (_message.isComposed()) {
            bytes memory composeMsg = OFTComposeMsgCodec.encode(
                _origin.nonce,
                _origin.srcEid,
                amountLDReceive,
                _message.composeMsg()
            );
            // @dev Stores the lzCompose payload that will be executed in a separate tx.
            // standardizes functionality for delivering/executing arbitrary contract invocation on some non evm chains.
            // @dev Composed toAddress is the same as the receiver of the oft/tokens
            endpoint.deliverComposedMessage(toAddress, _guid, composeMsg);
        }

        emit ReceiveOFT(_guid, _message.sendTo().bytes32ToAddress(), amountLDReceive);
    }

    function _removeDust(uint _amountLD) internal view virtual returns (uint amountLD) {
        amountLD = (_amountLD / ld2sdRate) * ld2sdRate;
    }

    function _SDtoLD(uint64 _amountSD) internal view virtual returns (uint amountLD) {
        amountLD = _amountSD * ld2sdRate;
    }

    function _LDtoSD(uint _amountLD) internal view virtual returns (uint64 amountSD) {
        amountSD = uint64(_amountLD / ld2sdRate);
    }

    // @dev hooks for implementing additional logic on debits, override to add things like fees etc.
    function _beforeDebit(uint _amountLD, uint32 /*_dstEid*/) internal virtual returns (uint) {
        return _amountLD;
    }

    // @dev hooks for implementing additional logic on credits, override to add things like fees etc.
    function _beforeCredit(uint _amountLD, address /*_to*/, uint32 /*_srcEid*/) internal virtual returns (uint) {
        return _amountLD;
    }

    function _debit(uint _amountLD) internal virtual returns (uint);

    function _credit(address _to, uint _amountLD) internal virtual returns (uint);
}
