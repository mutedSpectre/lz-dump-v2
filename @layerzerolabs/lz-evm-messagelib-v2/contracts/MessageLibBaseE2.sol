// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {Origin} from "@layerzerolabs/lz-evm-protocol-v2/contracts/MessagingStructs.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLib.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/Errors.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/PacketV1Codec.sol";

import "./interfaces/ILayerZeroExecutor.sol";
import "./MessageLibBase.sol";

/// the base contract for msglib on Endpoint V2
abstract contract MessageLibBaseE2 is MessageLibBase, ERC165, IMessageLib {
    using SafeERC20 for IERC20;
    using PacketV1Codec for bytes;

    event NativeOrAltTokenFeeWithdrawn(address worker, address receiver, uint amount);
    event LzTokenFeeWithdrawn(address lzToken, address receiver, uint amount);

    constructor(
        address _endpoint,
        uint8 _packetVersion,
        uint _treasuryGasCap
    ) MessageLibBase(_endpoint, ILayerZeroEndpointV2(_endpoint).eid(), _packetVersion, _treasuryGasCap) {}

    function supportsInterface(bytes4 _interfaceId) public view override(ERC165, IERC165) returns (bool) {
        return _interfaceId == type(IMessageLib).interfaceId || super.supportsInterface(_interfaceId);
    }

    // ========================= OnlyEndpoint =========================
    function send(
        Packet calldata _packet,
        bytes calldata _options,
        bool _payInLzToken
    ) external onlyEndpoint returns (MessagingReceipt memory, bytes memory, bytes memory) {
        (bytes memory options, bytes memory encodedPacket, uint totalNativeFee) = _sendToWorkers(_packet, _options);

        // a hook to run local tests. in the implementation it should be empty
        _handleMessagingParamsHook(encodedPacket, options);

        (uint treasuryNativeFee, uint lzTokenFee) = _sendToTreasury(
            _packet.sender,
            _packet.dstEid,
            totalNativeFee,
            _payInLzToken
        );
        totalNativeFee += treasuryNativeFee;

        MessagingReceipt memory receipt = MessagingReceipt(
            _packet.guid,
            _packet.nonce,
            MessagingFee(totalNativeFee, lzTokenFee)
        );
        return (receipt, encodedPacket, options);
    }

    // ========================= OnlyOnwer =========================
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    // ========================= External =========================
    /// @dev E2 only
    function withdrawFee(address _to, uint _amount) external {
        _assertAndDebitAmount(_to, _amount);

        address altTokenAddr = ILayerZeroEndpointV2(endpoint).altFeeToken();
        bool isAltToken = altTokenAddr != address(0x0);

        if (isAltToken) {
            IERC20(altTokenAddr).safeTransfer(_to, _amount);
        } else {
            _transferNative(_to, _amount);
        }
        emit NativeOrAltTokenFeeWithdrawn(msg.sender, _to, _amount);
    }

    /// @dev _lzToken is a user-supplied value because lzToken might change in the endpoint before all lzToken can be taken out
    /// @dev E2 only
    /// @dev treasury only function
    function withdrawLzTokenFee(address _lzToken, address _to, uint _amount) external {
        require(msg.sender == treasury, Errors.PERMISSION_DENIED);

        // lz token cannot be alt token
        require(
            ILayerZeroEndpointV2(endpoint).altFeeToken() != _lzToken && _to != address(0x0),
            Errors.INVALID_ARGUMENT
        );

        IERC20(_lzToken).safeTransfer(_to, _amount);
        emit LzTokenFeeWithdrawn(_lzToken, _to, _amount);
    }

    // ========================= View =========================
    function quote(
        PacketForQuote calldata _packet,
        bool _payInLzToken,
        bytes calldata _options
    ) external view returns (MessagingFee memory) {
        (uint nativeFee, uint lzTokenFee) = _quote(
            _packet.sender,
            _packet.dstEid,
            _packet.message.length,
            _payInLzToken,
            _options
        );
        return MessagingFee(nativeFee, lzTokenFee);
    }

    // ========================= Internal =========================
    function _sendToWorkers(
        Packet calldata _packet,
        bytes calldata _options
    ) internal returns (bytes memory options, bytes memory encodedPacket, uint totalNativeFee) {
        encodedPacket = PacketV1Codec.encode(packetVersion, _packet);

        bytes memory executorOptions;
        WorkerOptions[] memory otherWorkerOptions;
        (options, executorOptions, otherWorkerOptions) = _getWorkerOptions(_packet.dstEid, _options);

        (uint otherWorkerFeeds, address executor, uint maxMsgSize) = _send(_packet, otherWorkerOptions);
        totalNativeFee += otherWorkerFeeds;

        uint msgSize = _packet.message.length;
        _assertMessageSize(msgSize, maxMsgSize);

        totalNativeFee += _sendToExecutor(executor, _packet.dstEid, _packet.sender, msgSize, executorOptions);
    }

    function _endpointDeliverable(
        uint32 _srcEid,
        address _receiver,
        bytes calldata _packetHeader
    ) internal view returns (DeliveryState) {
        // 1. check endpoint deliverable
        // not checking in the internal function as it would be checked by the endpoint
        Origin memory origin = Origin(_srcEid, _packetHeader.sender(), _packetHeader.nonce());

        // if endpoint didnot revert on deliverable check, it will return true if the message is deliverable. false if the message has been delivered
        bool endpointDeliverable = ILayerZeroEndpointV2(endpoint).deliverable(origin, address(this), _receiver);
        if (!endpointDeliverable) return DeliveryState.Delivered;

        // 2. check if has payload
        // endpoint allows redelivery, check if it has already been delivered
        bool hasPayload = ILayerZeroEndpointV2(endpoint).hasPayloadHash(
            _receiver,
            origin.srcEid,
            origin.sender,
            origin.nonce
        );
        if (hasPayload) return DeliveryState.Delivered;

        return DeliveryState.Deliverable;
    }

    // ======================= Virtual =======================
    // For implementation to override
    function _send(
        Packet calldata _packet,
        WorkerOptions[] memory _options
    ) internal virtual returns (uint, address, uint);

    function _handleMessagingParamsHook(bytes memory _encodedPacket, bytes memory _options) internal virtual {}

    // receive native token from endpoint
    receive() external payable virtual {}
}
