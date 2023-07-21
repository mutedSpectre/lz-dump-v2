// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {Origin} from "@layerzerolabs/lz-evm-protocol-v2/contracts/MessagingStructs.sol";
import "@layerzerolabs/lz-evm-v1-0.7/contracts/interfaces/ILayerZeroEndpoint.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/Errors.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/AddressCast.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions.sol";
import "@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/PacketV1Codec.sol";

import "./interfaces/IMessageLibE1.sol";
import "./interfaces/ITreasuryFeeHandler.sol";
import "./NonceContract.sol";

import "../../interfaces/ILayerZeroExecutor.sol";
import "../../MessageLibBase.sol";

/// @dev base contract for msglib on endpoint v1. It enforces the path convention
abstract contract MessageLibBaseE1 is MessageLibBase, IMessageLibE1 {
    using PacketV1Codec for bytes;
    using AddressCast for address;
    using AddressCast for bytes32;

    NonceContract internal immutable nonceContract;
    address internal immutable treasuryFeeHandler;

    // config
    address internal layerZeroToken;
    // EndpointV1 is using bytes as address. this map is for address length assertion
    mapping(uint32 dstEid => uint size) public addressSizes;

    // this event is the same as the PacketReceived event on EndpointV2
    event PacketReceived(Origin origin, address receiver);
    // this event should be identical to the one on Endpoint V2
    event PacketSent(bytes encodedPayload, bytes options, uint nativeFee, uint lzTokenFee);
    event NativeFeeWithdrawn(address user, address receiver, uint amount);
    event InvalidDst(
        uint16 indexed srcChainId,
        bytes32 srcAddress,
        address indexed dstAddress,
        uint64 nonce,
        bytes32 payloadHash
    );

    constructor(
        address _endpoint,
        uint8 _packetVersion,
        uint _treasuryGasCap,
        address _nonceContract,
        uint32 _localEid,
        address _treasuryFeeHandler
    ) MessageLibBase(_endpoint, _localEid, _packetVersion, _treasuryGasCap) {
        nonceContract = NonceContract(_nonceContract);
        treasuryFeeHandler = _treasuryFeeHandler;
    }

    // ======================= OnlyEndpoint =======================
    function send(
        address _sender,
        uint64, // _nonce
        uint16 _dstEid,
        bytes calldata _path, // remoteAddress + localAddress
        bytes calldata _message,
        address payable _refundAddress,
        address _lzTokenPaymentAddress,
        bytes calldata _options
    ) external payable onlyEndpoint {
        (bytes memory options, bytes memory encodedPacket, uint totalNativeFee) = _sendToWorkers(
            _sender,
            _dstEid,
            _path,
            _message,
            _options
        );

        // quote treasury fee
        uint32 dstEid = _dstEid; // stack too deep
        address sender = _sender; // stack too deep
        bool payInLzToken = _lzTokenPaymentAddress != address(0x0) && address(layerZeroToken) != address(0x0);
        (uint treasuryNativeFee, uint lzTokenFee) = _sendToTreasury(sender, dstEid, totalNativeFee, payInLzToken);
        totalNativeFee += treasuryNativeFee;

        // pay native fee
        // assert the user has attached enough native token for this address
        require(totalNativeFee <= msg.value, Errors.INVALID_AMOUNT);
        // refund if they send too much
        uint refundAmt = msg.value - totalNativeFee;
        if (refundAmt > 0) {
            _transferNative(_refundAddress, refundAmt);
        }

        // pay lz token fee if needed
        if (lzTokenFee > 0) {
            _payLzTokenFee(sender, _lzTokenPaymentAddress, lzTokenFee);
        }

        emit PacketSent(encodedPacket, options, totalNativeFee, lzTokenFee);
    }

    // ======================= OnlyOwner =======================
    function setLayerZeroToken(address _layerZeroToken) external onlyOwner {
        layerZeroToken = _layerZeroToken;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function setAddressSize(uint16 _eid, uint _size) external onlyOwner {
        require(_size <= 32, Errors.INVALID_SIZE);
        require(addressSizes[_eid] == 0, Errors.ALREADY_EXISTS);
        addressSizes[_eid] = _size;
    }

    // ======================= External =======================
    function withdrawFee(address _to, uint _amount) external {
        _assertAndDebitAmount(_to, _amount);
        _transferNative(_to, _amount);
        emit NativeFeeWithdrawn(msg.sender, _to, _amount);
    }

    // ======================= View =======================
    function estimateFees(
        uint16 _dstEid,
        address _sender,
        bytes calldata _message,
        bool _payInLzToken,
        bytes calldata _options
    ) external view returns (uint nativeFee, uint zroFee) {
        return _quote(_sender, _dstEid, _message.length, _payInLzToken, _options);
    }

    // ======================= Internal =======================
    /// @dev path = remoteAddress + localAddress.
    function _assertPath(address _sender, bytes calldata _path, uint remoteAddressSize) internal pure {
        require(_path.length == 20 + remoteAddressSize, Errors.INVALID_ARGUMENT);
        address srcInPath = AddressCast.toAddress(_path[remoteAddressSize:]);
        require(_sender == srcInPath, Errors.INVALID_ARGUMENT);
    }

    function _payLzTokenFee(address _sender, address _lzTokenPaymentAddress, uint _lzTokenFee) internal {
        ITreasuryFeeHandler(treasuryFeeHandler).payFee(
            layerZeroToken,
            _sender,
            _lzTokenPaymentAddress,
            _lzTokenFee, // the supplied fee is always equal to the required fee
            _lzTokenFee,
            treasury
        );
    }

    /// @dev outbound does three things
    /// @dev 1) asserts path
    /// @dev 2) increments the nonce
    /// @dev 3) assemble packet
    /// @return packet to be sent to workers
    function _outbound(
        address _sender,
        uint16 _dstEid,
        bytes calldata _path,
        bytes calldata _message
    ) internal returns (Packet memory packet) {
        // assert toAddress size
        uint remoteAddressSize = addressSizes[_dstEid];
        _assertPath(_sender, _path, remoteAddressSize);

        // increment nonce
        uint64 nonce = nonceContract.increment(_dstEid, _sender, _path);

        bytes32 receiver = AddressCast.toBytes32(_path[0:remoteAddressSize]);

        // todo: should use the PacketV1Codec?
        bytes32 guid = keccak256(abi.encodePacked(nonce, localEid, _sender.toBytes32(), uint32(_dstEid), receiver));

        // assemble packet
        packet = Packet(nonce, localEid, _sender, _dstEid, receiver, guid, _message);
    }

    function _sendToWorkers(
        address _sender,
        uint16 _dstEid,
        bytes calldata _path,
        bytes calldata _message,
        bytes calldata _options
    ) internal returns (bytes memory options, bytes memory encodedPacket, uint totalNativeFee) {
        Packet memory packet = _outbound(_sender, _dstEid, _path, _message);
        encodedPacket = PacketV1Codec.encode2(packetVersion, packet);

        bytes memory executorOptions;
        WorkerOptions[] memory otherWorkerOptions;
        (options, executorOptions, otherWorkerOptions) = _getWorkerOptions(packet.dstEid, _options);

        (uint otherWorkerFees, address executor, uint maxMsgSize) = _send(packet, otherWorkerOptions);
        totalNativeFee += otherWorkerFees;

        uint msgSize = packet.message.length;
        _assertMessageSize(msgSize, maxMsgSize);

        totalNativeFee += _sendToExecutor(executor, packet.dstEid, packet.sender, msgSize, executorOptions);
    }

    /// @dev this function change pack the path as required for EndpointV1
    function _execute(
        uint16 _srcEid,
        bytes32 _sender,
        address _receiver,
        uint64 _nonce,
        bytes memory _message,
        uint _gasLimit
    ) internal {
        if (_receiver.code.length == 0) {
            /// on chains where EOA has no codes, we will early return and emit InvalidDst event because it will result into a revert without msg ( call to non-contract account).
            // on chains where all address have codes, this will be skipped
            emit InvalidDst(_srcEid, _sender, _receiver, _nonce, keccak256(_message));
            return;
        }

        bytes memory pathData = abi.encodePacked(_sender.toBytes(addressSizes[_srcEid]), _receiver);
        ILayerZeroEndpoint(endpoint).receivePayload(_srcEid, pathData, _receiver, _nonce, _gasLimit, _message);

        Origin memory origin = Origin(_srcEid, _sender, _nonce);
        emit PacketReceived(origin, _receiver);
    }

    function _endpointDeliverable(
        uint16 _srcEid,
        address _receiver,
        bytes calldata _packetHeader
    ) internal view returns (DeliveryState) {
        ILayerZeroEndpoint lzEndpoint = ILayerZeroEndpoint(endpoint);

        bytes memory sender = _packetHeader.sender().toBytes(addressSizes[_srcEid]);
        bytes memory path = abi.encodePacked(sender, _receiver);
        uint64 nonce = _packetHeader.nonce();

        // assert message library
        require(lzEndpoint.getReceiveLibraryAddress(_receiver) == address(this), Errors.PERMISSION_DENIED);

        // 1. check if nonce is already delivered
        uint64 inboundNonce = lzEndpoint.getInboundNonce(_srcEid, path);
        if (nonce <= inboundNonce) return DeliveryState.Delivered;

        // 2. check nonce is next nonce
        // 3. check there are no stored payload
        if (nonce > inboundNonce + 1 || lzEndpoint.hasStoredPayload(_srcEid, path)) return DeliveryState.Waiting;

        return DeliveryState.Deliverable;
    }

    // ======================= Virtual =======================
    // For implementation to override
    // packet is assembled in memory for endpoint-v1
    function _send(
        Packet memory _packet,
        WorkerOptions[] memory _options
    ) internal virtual returns (uint, address, uint);
}
