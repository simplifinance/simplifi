// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "./Common.sol";

/**
 * @title ISmartStrategy
 * @author Simplifinance
 * @notice Interface of the Smart account contract
 */
interface ISmartStrategy is Common {
  error TransferFailed();
  error AssetIndentifierNotMatch();

  function upgrade(address newAccount, address asset) external returns(bool);
  function closeTo(address to, address _asset) external returns(bool);
  function activateStrategy(address router) external returns(bool);
  function withdrawAsset(address _asset, address recipient, uint amount) external returns(bool); 
}                                                               
