// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IStrategyAdmin {
  error OperationFailed();
  error RouterNotSet();
  error UpgradeNotReady();
  error NoStrategyFound();
  error ZeroAddress(address);
  error StatusAlreadyUpdated();
  
  function getStrategy(address account) external view returns(address);
  function createStrategy() external payable returns(bool);
}