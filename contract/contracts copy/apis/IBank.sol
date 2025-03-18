// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";
import { IERC20 } from "./IERC20.sol";

interface IBank {
  error NotACustomer(address);
  error ZeroWithdrawable();
  error NoFeeToWithdraw();
  error TokenAddressIsZero();
  error InsufficientAllowance();
  error AccessDenied();
  error TranferingCollateralFailed();
  
  function addUp(address user, uint unitId) external;
  function borrow(
    address user, 
    IERC20 asset, 
    uint256 loan, 
    uint fee, 
    uint256 calculatedCol,
    uint unitId
  ) 
    external 
    returns(uint);

  function payback(
    address user, 
    IERC20 asset, 
    uint256 debt,
    uint256 attestedInitialBal,
    bool allGH,
    Common.Contributor[] memory cData,
    bool isSwapped,
    address defaulted,
    uint unitId
  ) external ;

  function cancel(address user, IERC20 asset, uint erc20Balances, uint unitId) external;
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