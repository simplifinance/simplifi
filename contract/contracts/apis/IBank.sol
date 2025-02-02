// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { C3 } from "./C3.sol";

interface IBank {
  error NotACustomer(address);
  error AlreadyACustomer(address);
  error ZeroWithdrawable();
  error UserDoesNotHaveAccess();
  error NoFeeToWithdraw();
  error TokenAddressIsZero();
  
  function addUp(address user, uint rId) external;
  function borrow(
    address user, 
    address asset, 
    uint256 loan, 
    uint fee, 
    uint256 calculatedCol,
    uint rId
  ) 
    external 
    payable 
    returns(uint);

  function payback(
    address user, 
    address asset, 
    uint256 debt,
    uint256 attestedInitialBal,
    bool allGH,
    C3.Contributor[] memory cData,
    bool isSwapped,
    address defaulted,
    uint rId
  ) external payable;

  function depositCollateral(uint rId) external payable returns(bool);
  function cancel(address user, address asset, uint erc20Balances, uint rId) external;
  function withdrawFee(address recipient, address asset) external;
  function getData() external view returns(ViewData memory);

  struct ViewData {
    uint totalClients;
    uint aggregateFee;
  }

  struct ViewUserData {
    bool access;
    Collateral collateral;
  }

  struct Collateral {
    uint balance;
    uint withdrawable;
  }
}