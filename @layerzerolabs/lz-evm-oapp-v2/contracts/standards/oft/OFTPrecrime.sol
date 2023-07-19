// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../PreCrime.sol";
import "../../interfaces/IOApp.sol";
import "./interfaces/IOFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./OFTAdapter.sol";

contract OFTPrecrime is PreCrime {
    address public oft;
    uint public EXPECTED_GLOBAL_SUPPLY;

    constructor(address _endpoint, address _oft) PreCrime(_endpoint) {
        oft = _oft;
    }

    struct SimulationResult {
        uint totalSupplyLD;
        bool isAdapter;
    }

    // @dev only necessary when its exclusive 'OFT', NOT 'OFTAdapter' type
    // sum of all tokens in the oft network, it can change, but this will need to be updated for pre-crime to pass
    function setGlobalSupply(uint _globalSupply) public onlyPrecrimeAdmin {
        EXPECTED_GLOBAL_SUPPLY = _globalSupply;
    }

    // -------------------------------
    // Precrime
    function _receiver() internal view override returns (address) {
        return address(oft);
    }

    function _precrime(bytes[] memory _simulation) internal view override returns (uint16 code, bytes memory reason) {
        uint globalSupply;
        uint expectedGlobalSupply = EXPECTED_GLOBAL_SUPPLY;

        // @dev indicates that there is an 'OFTAdapter' on one of the chains, not necessarily this local chain
        bool isOFTAdapter;

        for (uint i = 0; i < _simulation.length; i++) {
            SimulationResult memory result = abi.decode(_simulation[i], (SimulationResult));

            if (result.isAdapter) {
                // @dev does not support multiple' 'OFTAdapter' contracts for a given oft mesh
                if (isOFTAdapter) return (CODE_PRECRIME_FAILURE, "OFTPrecrime: multiple OFTAdapters found");
                isOFTAdapter = true;

                expectedGlobalSupply = result.totalSupplyLD;
            } else {
                globalSupply += result.totalSupplyLD;
            }
        }

        if (isOFTAdapter && globalSupply > expectedGlobalSupply) {
            // @dev expectedGlobal supply for an 'OFTAdapter' can be slightly higher due to users sending tokens direct
            // to the OFTAdapter contract, cant check explicitly "=="
            return (CODE_PRECRIME_FAILURE, "OFTPrecrime: globalSupply > expectedGlobalSupply");
        } else if (globalSupply != expectedGlobalSupply) {
            // @dev exclusively 'OFT', NOT 'OFTAdapter' instances, balances should be exactly "=="
            return (CODE_PRECRIME_FAILURE, "OFTPrecrime: globalSupply != expectedGlobalSupply");
        } else {
            return (CODE_SUCCESS, "");
        }
    }

    function simulationCallback() external view override returns (bytes memory result) {
        address token = IOFT(oft).token();

        // @dev checks if the corresponding _oft on this chain is an adapter version, or returns false if its regular 'OFT'
        // eg. 'OFTAdapter' lock/unlock tokens from an external token contract, vs. regular 'OFT' mints/burns
        bool isAdapter = token != oft;

        // @dev for 'OFTAdapter' the total supply is the total amount locked, otherwise its the totalSupply of oft tokens on the chain
        uint totalSupply = isAdapter ? IERC20(token).balanceOf(oft) : IERC20(oft).totalSupply();

        return abi.encode(SimulationResult(totalSupply, isAdapter));
    }

    function _simulate(Packet[] calldata _packets) internal override returns (uint16 code, bytes memory simulation) {
        (bool success, bytes memory result) = oft.call{value: msg.value}(
            abi.encodeWithSelector(IOApp.lzReceiveAndRevert.selector, _packets)
        );
        require(!success, "OFTPrecrime: simulationCallback should be called via revert");

        (, result) = _parseRevertResult(result, LzReceiveRevert.selector);
        return (CODE_SUCCESS, result);
    }

    // @dev need to ensure that all precrimePeers are present inside of the results passed into _checkResultsCompleteness()
    // when checking oft precrime we always want every simulation/result from the remote peers
    function _getPrecrimePeers(
        Packet[] calldata /*_packets*/
    ) internal view override returns (uint32[] memory eids, bytes32[] memory peers) {
        // @dev assumes that the precrimeEids is the full list of oft eids for this oft mesh
        return (precrimeEids, precrimePeers);
    }
}
