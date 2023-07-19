// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.0;

interface IWorker {
    event SetWorkerLib(address workerLib);
    event SetPriceFeed(address priceFeed);
    event SetDefaultMultiplierBps(uint16 multiplierBps);
    event Withdraw(address lib, address to, uint amount);

    function priceFeed() external view returns (address);

    function setDefaultMultiplierBps(uint16 _multiplierBps) external;

    function withdrawFee(address _lib, address payable _to, uint _amount) external;

    function defaultMultiplierBps() external view returns (uint16);
}
