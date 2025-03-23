// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";
import { IERC20 } from "./IERC20.sol";

interface IBank {
  error AssetTransferFailed();
  
  function addUp(address user, uint rId) external returns(bool);
  function getFinance(
    address user, 
    address asset, 
    uint256 loan, 
    uint fee, 
    uint256 calculatedCol,
    uint rId
  ) 
    external 
    returns(uint);

  function payback(Common.Payback_Bank memory) external returns(bool);
  function cancel(address user, address asset, uint unit, uint rId) external returns(bool);
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