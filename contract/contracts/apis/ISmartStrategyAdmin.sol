// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface ISmartStrategyAdmin {
  error OperationFailed();
  error RouterNotSet();
  error UpgradeNotReady();
  error NoStrategyFound();
  error ZeroAddress(address);
  error StatusAlreadyUpdated();
  error StrategyWasDeleted(uint);
  error InsufficientMsgValue(uint);
  
  function getStrategy(address account) external view returns(address);
  function createStrategy() external payable returns(bool);
  function rekeyStrategy(address _asset) external payable returns(bool);
}