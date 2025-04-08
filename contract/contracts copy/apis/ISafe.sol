// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";
import { IERC20 } from "./IERC20.sol";

interface ISafe {
  function addUp(address user, uint recordId) external returns(bool);
  function getFinance(
    address user, 
    IERC20 baseAsset, 
    uint256 loan, 
    uint fee, 
    uint256 calculatedCol,
    uint recordId
  ) 
    external 
    returns(bool);

  function payback(Common.Payback_Safe memory) external returns(bool);
  function cancel(address user, IERC20 asset, uint unit, uint recordId) external returns(bool);
  function getData() external view returns(ViewData memory);

  struct ViewData {
    uint totalClients;
    uint aggregateFee;
  }

  struct ViewUserData {
    bool access;
    uint collateralBalance;
  }
}