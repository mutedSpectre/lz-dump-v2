// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroReceiver.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import "../../../interfaces/IOApp.sol";

interface IOFT {
    struct EnforcedOptionParam {
        uint executionType;
        uint32 eid;
        bytes options;
    }

    struct SendParam {
        bytes32 to;
        uint amountLD;
        uint minAmountLD;
        uint32 dstEid;
    }

    error LDMinusSD();
    error AmountSlippage(uint _amountLDSend, uint256 _minAmountLD);

    event SetInspector(address _inspector);
    event SetEnforcedOption(EnforcedOptionParam[] _enforcedOptions);
    event SendOFT(bytes32 indexed _guid, address indexed _fromAddress, uint _amountLD);
    event ReceiveOFT(bytes32 indexed _guid, address indexed _toAddress, uint _amountLD);

    function token() external view returns (address);

    function quoteSendFee(
        SendParam calldata _send,
        bytes calldata _options,
        bool _useLZToken
    ) external view returns (uint nativeFee, uint zroFee);

    function quoteSendAndCallFee(
        SendParam calldata _send,
        bytes calldata _options,
        bool _useLZToken,
        bytes calldata _composeMsg
    ) external view returns (uint nativeFee, uint zroFee);

    function send(
        SendParam calldata _send,
        bytes calldata _options,
        ILayerZeroEndpointV2.MessagingFee calldata _msgFee,
        address payable _refundAddress
    ) external payable returns (ILayerZeroEndpointV2.MessagingReceipt memory);

    function sendAndCall(
        SendParam calldata _send,
        bytes calldata _options,
        ILayerZeroEndpointV2.MessagingFee calldata _msgFee,
        address payable _refundAddress,
        bytes calldata _composeMsg
    ) external payable returns (ILayerZeroEndpointV2.MessagingReceipt memory);
}
