// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library OFTComposeMsgCodec {
    uint8 private constant NONCE_OFFSET = 8;
    uint8 private constant SRC_EID_OFFSET = 12;
    uint8 private constant AMOUNT_LD_OFFSET = 44;
    uint8 private constant COMPOSE_FROM_OFFSET = 76;

    function encode(
        uint64 _nonce,
        uint32 _srcEid,
        uint _amountLD,
        bytes memory _composeMsg // 0x[composeFrom][composeMsg]
    ) internal pure returns (bytes memory _msg) {
        _msg = abi.encodePacked(_nonce, _srcEid, _amountLD, _composeMsg);
    }

    function nonce(bytes calldata _msg) internal pure returns (uint64) {
        return uint64(bytes8(_msg[:NONCE_OFFSET]));
    }

    function srcEid(bytes calldata _msg) internal pure returns (uint32) {
        return uint32(bytes4(_msg[NONCE_OFFSET:SRC_EID_OFFSET]));
    }

    function amountLD(bytes calldata _msg) internal pure returns (uint) {
        return uint256(bytes32(_msg[SRC_EID_OFFSET:AMOUNT_LD_OFFSET]));
    }

    function composeFrom(bytes calldata _msg) internal pure returns (bytes32) {
        return bytes32(_msg[AMOUNT_LD_OFFSET:COMPOSE_FROM_OFFSET]);
    }

    function composeMsg(bytes calldata _msg) internal pure returns (bytes memory) {
        return _msg[COMPOSE_FROM_OFFSET:];
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _b) internal pure returns (address) {
        return address(uint160(uint(_b)));
    }
}
