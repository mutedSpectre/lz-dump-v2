// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library OFTMsgCodec {
    uint8 private constant SEND_TO_OFFSET = 32;
    uint8 private constant SEND_AMOUNT_SD_OFFSET = 40;

    function encode(bytes32 _sendTo, uint64 _amountSD) internal pure returns (bytes memory _msg) {
        _msg = abi.encodePacked(_sendTo, _amountSD);
    }

    function encode(
        bytes32 _sendTo,
        uint64 _amountSD,
        bytes memory _composeMsg // 0x[msg.sender][composeMsg]
    ) internal pure returns (bytes memory _msg) {
        _msg = abi.encodePacked(_sendTo, _amountSD, _composeMsg);
    }

    function isComposed(bytes calldata _msg) internal pure returns (bool) {
        return _msg.length > SEND_AMOUNT_SD_OFFSET;
    }

    function sendTo(bytes calldata _msg) internal pure returns (bytes32) {
        return bytes32(_msg[:SEND_TO_OFFSET]);
    }

    function amountSD(bytes calldata _msg) internal pure returns (uint64) {
        return uint64(bytes8(_msg[SEND_TO_OFFSET:SEND_AMOUNT_SD_OFFSET]));
    }

    function composeMsg(bytes calldata _msg) internal pure returns (bytes memory) {
        return _msg[SEND_AMOUNT_SD_OFFSET:];
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _b) internal pure returns (address) {
        return address(uint160(uint(_b)));
    }
}
