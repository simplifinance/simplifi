// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";
import { IERC20 } from "./IERC20.sol";

interface IBank {
  error ZeroWithdrawable();
  error NoFeeToWithdraw();
  error TokenAddressIsZero();
  error InsufficientAllowance();
  error AccessDenied();
  error InvalidIERC20Contract();
  error InsufficientContractBalance();
  error AssetTransferFailed();
  
  // function addUp(Common.Contributor memory user, uint unitId) external;
  // function getFinance(
  //   Common.Contributor memory user, 
  //   IERC20 asset, 
  //   uint256 loan, 
  //   uint fee, 
  //   uint256 calculatedCol,
  //   uint unitId,
  //   bool swap,
  //   Common.Contributor memory newUser
  // ) 
  //   external 
  //   returns(uint);

  // function payback(
  //   Common.Contributor memory user, 
  //   IERC20 asset, 
  //   uint256 debt,
  //   uint256 attestedInitialBal,
  //   bool allGH,
  //   bool isSwapped,
  //   Common.Contributor memory defaulted,
  //   uint unitId
  // ) external ;

  // function cancel(address user, IERC20 asset, uint erc20Balances, uint unitId) external;
  // function getData(uint unitId) external view returns(ViewData memory);

  struct ViewData {
    uint totalClients;
    uint aggregateFee;
  }

  struct ViewUserData {
    bool access;
    uint collateralBalance;
  }

  struct User {
    bool hasAccess;
    uint index;
  }
}