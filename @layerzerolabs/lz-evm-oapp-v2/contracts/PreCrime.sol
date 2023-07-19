// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PreCrimeBase.sol";

abstract contract PreCrime is PreCrimeBase {
    error SimulateRevert(uint16 code, bytes message);

    constructor(address _endpoint) PreCrimeBase(_endpoint) {}

    function simulate(Packet[] calldata _packets) external payable override returns (uint16 code, bytes memory data) {
        (code, data) = _checkPacketsMaxSizeAndNonceOrder(_packets);
        if (code != CODE_SUCCESS) {
            return (code, data);
        }

        (bool success, bytes memory result) = address(this).call{value: msg.value}(
            abi.encodeWithSelector(this._simulateAndRevert.selector, _packets)
        );
        // refund for those who send eth to simulate accidentally
        if (msg.value > 0) {
            payable(msg.sender).transfer(msg.value);
        }
        // the _simulateAndRevert will never return success
        require(!success, "simulate should never return success");

        (code, data) = _parseRevertResult(result, SimulateRevert.selector);
        if (code == CODE_SUCCESS) {
            data = abi.encode(localEid, data); // add localEid to the header
        }
    }

    function simulateView(
        Packet[] calldata /*_packets*/
    ) external pure override returns (uint16 /*code*/, bytes memory /*result*/) {
        revert("not implemented");
    }

    function _parseRevertResult(
        bytes memory result,
        bytes4 _selector
    ) internal pure returns (uint16 code, bytes memory data) {
        // if not expected selector, bubble up error
        if (bytes4(result) != _selector) {
            assembly {
                revert(add(result, 0x20), mload(result))
            }
        }
        // parse code and result
        assembly {
            // Slice the sighash. Remove the selector which is the first 4 bytes
            result := add(result, 0x04)
        }
        return abi.decode(result, (uint16, bytes));
    }

    function _simulateAndRevert(Packet[] calldata _packets) external payable {
        require(msg.sender == address(this), "Precrime: only self");
        (uint16 code, bytes memory result) = _simulate(_packets);
        revert SimulateRevert(code, result);
    }

    // ----------------- to be implemented -----------------
    function _simulate(Packet[] calldata _packets) internal virtual returns (uint16 code, bytes memory result);
}
