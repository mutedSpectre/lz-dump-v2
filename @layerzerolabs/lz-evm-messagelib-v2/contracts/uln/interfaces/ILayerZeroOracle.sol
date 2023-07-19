// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface ILayerZeroOracle {
    // @notice query price and assign jobs at the same time
    // @param _dstEid - the destination endpoint identifier
    // @param _confirmations - block confirmation delay before relaying blocks
    // @param _sender - the source sending contract address
    // @param _options - options
    function assignJob(
        uint32 _dstEid,
        uint64 _confirmations,
        address _sender,
        bytes calldata _options
    ) external payable returns (uint fee);

    // @notice query the oracle fee for relaying block information to the destination chain
    // @param _dstEid the destination endpoint identifier
    // @param _confirmations - block confirmation delay before relaying blocks
    // @param _sender - the source sending contract address
    // @param _options - options
    function getFee(
        uint32 _dstEid,
        uint64 _confirmations,
        address _sender,
        bytes calldata _options
    ) external view returns (uint fee);
}
