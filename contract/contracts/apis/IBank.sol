// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface IBank {
  error NotACustomer(address);
  error AlreadyACustomer(address);
  error ZeroWithdrawable();
  error UserDoesNotHaveAccess();
  error NoFeeToWithdraw();
  error TokenAddressIsZero();
  
  function addUp(address user) external;
  function borrow(
    address user, 
    address asset, 
    uint256 loan, 
    uint fee, 
    uint256 calculatedCol
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
    Common.Contributor[] memory cData,
    bool isSwapped,
    address defaulted
  ) external payable;

  function depositCollateral() external payable returns(bool);
  function cancel(address user, address asset, uint erc20Balances) external;
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