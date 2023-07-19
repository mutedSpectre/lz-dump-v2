// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import "@layerzerolabs/lz-evm-v1-0.7/contracts/interfaces/ILayerZeroEndpoint.sol";

contract NonceContract {
    ILayerZeroEndpoint public immutable endpoint;
    mapping(uint16 dstEid => mapping(bytes path => uint64 nonce)) public outboundNonce;

    constructor(address _endpoint) {
        endpoint = ILayerZeroEndpoint(_endpoint);
    }

    function increment(uint16 _chainId, address _ua, bytes calldata _path) external returns (uint64) {
        require(
            endpoint.getSendLibraryAddress(_ua) == msg.sender,
            "NonceContract: msg.sender is not valid sendlibrary"
        );
        return ++outboundNonce[_chainId][_path];
    }
}
