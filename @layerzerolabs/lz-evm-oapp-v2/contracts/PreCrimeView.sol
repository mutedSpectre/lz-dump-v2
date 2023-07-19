// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PreCrimeBase.sol";

abstract contract PreCrimeView is PreCrimeBase {
    constructor(address _endpoint) PreCrimeBase(_endpoint) {}

    function simulate(
        Packet[] calldata /*_packets*/
    ) external payable virtual override returns (uint16 /*code*/, bytes memory /*result*/) {
        revert("not implemented");
    }

    function simulationCallback() external pure returns (bytes memory) {
        revert("not implemented");
    }

    function simulateView(Packet[] calldata _packets) external view override returns (uint16 code, bytes memory data) {
        // params check
        (code, data) = _checkPacketsMaxSizeAndNonceOrder(_packets);
        if (code != CODE_SUCCESS) {
            return (code, data);
        }

        (code, data) = _simulate(_packets);
        if (code == CODE_SUCCESS) {
            data = abi.encode(localEid, data); // add localEid to the header
        }
    }

    // ----------------- to be implemented -----------------
    function _simulate(Packet[] calldata _packets) internal view virtual returns (uint16 code, bytes memory result);
}
