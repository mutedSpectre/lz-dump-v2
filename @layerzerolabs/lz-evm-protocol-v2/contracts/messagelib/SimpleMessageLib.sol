// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IMessageLib.sol";
import "../interfaces/ILayerZeroEndpointV2.sol";
import "../libs/Errors.sol";
import "./libs/PacketV1Codec.sol";
import "../MessagingStructs.sol";

contract SimpleMessageLib is Ownable, ERC165 {
    using SafeERC20 for IERC20;
    using PacketV1Codec for bytes;

    address public immutable endpoint;
    address public immutable treasury;
    uint32 public immutable localEid;
    uint8 public constant packetVersion = 1;

    address public whitelistCaller;

    uint public lzTokenFee;
    uint public nativeFee;

    bytes public defaultOption;

    error InvalidEndpoint(address expected, address actual);

    // only the endpoint can call SEND() and setConfig()
    modifier onlyEndpoint() {
        require(endpoint == msg.sender, Errors.PERMISSION_DENIED);
        _;
    }

    constructor(address _endpoint, address _treasury) {
        endpoint = _endpoint;
        treasury = _treasury;
        localEid = ILayerZeroEndpointV2(_endpoint).eid();
        lzTokenFee = 99;
        nativeFee = 100;
        //        defaultOption = Options.encodeLegacyOptionsType1(200000);
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IMessageLib).interfaceId || super.supportsInterface(interfaceId);
    }

    // no validation logic at all
    function validatePacket(bytes calldata packetBytes) external {
        require(whitelistCaller == address(0x0) || msg.sender == whitelistCaller, Errors.PERMISSION_DENIED);
        Origin memory origin = Origin(packetBytes.srcEid(), packetBytes.sender(), packetBytes.nonce());
        ILayerZeroEndpointV2(endpoint).deliver(origin, packetBytes.receiverB20(), keccak256(packetBytes.payload()));
    }

    // ------------------ onlyEndpoint ------------------
    function send(
        Packet calldata _packet,
        bytes memory _options,
        bool _payInLzToken
    )
        external
        onlyEndpoint
        returns (MessagingReceipt memory receipt, bytes memory encodedPacket, bytes memory options)
    {
        encodedPacket = PacketV1Codec.encode(packetVersion, _packet);

        options = _options.length == 0 ? defaultOption : _options;
        _handleMessagingParamsHook(encodedPacket, options);

        receipt = MessagingReceipt(
            _packet.guid,
            _packet.nonce,
            MessagingFee(nativeFee, _payInLzToken ? lzTokenFee : 0)
        );
    }

    // ------------------ onlyOwner ------------------
    function setDefaultOption(bytes memory _defaultOption) external onlyOwner {
        defaultOption = _defaultOption;
    }

    function setMessagingFee(uint _nativeFee, uint _lzTokenFee) external onlyOwner {
        nativeFee = _nativeFee;
        lzTokenFee = _lzTokenFee;
    }

    function setWhitelistCaller(address _whitelistCaller) external onlyOwner {
        whitelistCaller = _whitelistCaller;
    }

    function withdrawFee(address _to, uint _amount) external onlyOwner {
        require(_to != address(0x0), Errors.INVALID_ARGUMENT);

        address altTokenAddr = ILayerZeroEndpointV2(endpoint).altFeeToken();
        bool isAltToken = altTokenAddr != address(0x0);

        if (isAltToken) {
            IERC20(altTokenAddr).safeTransfer(_to, _amount);
        } else {
            payable(_to).transfer(_amount);
        }
    }

    function withdrawLzTokenFee(address _to, uint _amount) external onlyOwner {
        require(_to != address(0x0), Errors.INVALID_ARGUMENT);

        address lzToken = ILayerZeroEndpointV2(endpoint).layerZeroToken();
        require(lzToken != address(0x0), Errors.TOKEN_UNAVAILABLE);

        IERC20(lzToken).safeTransfer(_to, _amount);
    }

    // ------------------ View ------------------
    function quote(
        PacketForQuote calldata /*_packet*/,
        bool _payInLzToken,
        bytes calldata /*_adapterParam*/
    ) external view returns (MessagingFee memory) {
        return MessagingFee(nativeFee, _payInLzToken ? lzTokenFee : 0);
    }

    function isSupportedEid(uint32) external pure returns (bool) {
        return true;
    }

    function version() external pure returns (uint64 major, uint8 minor, uint8 endpointVersion) {
        return (0, 0, 2);
    }

    // ------------------ Internal ------------------
    function _handleMessagingParamsHook(bytes memory _encodedPacket, bytes memory _options) internal virtual {}

    fallback() external payable {
        revert(Errors.NOT_IMPLEMENTED);
    }

    receive() external payable {}
}
