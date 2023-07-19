// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface ILayerZeroTreasury is IERC165 {
    function getFees(address _sender, uint32 _eid, uint _totalFee, bool _payInLzToken) external view returns (uint);
}
