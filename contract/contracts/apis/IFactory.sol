// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface IFactory is Common {
  error InsufficientFund();
  error AllMemberIsPaid();
  error QuorumIsInvalid();
  error OwnershipManagerIsNotSet();
  error AmountLowerThanMinimumContribution();

  event BandCreated(CreatePoolReturnValue);
  event NewMemberAdded(CommonEventData);
  event GetFinanced(CommonEventData);
  event Payback(CommonEventData);
  event Liquidated(CommonEventData);
  event Cancellation(uint epochId);

  event RoundUp(uint, Pool);
  event Rekeyed(address indexed, address indexed);
  
  function getEpoches() external view returns(uint);
  function createPermissionlessPool(
    uint16 intRate,
    uint8 quorum,
    uint16 durationInHours,
    uint24 colCoverage,
    uint unitLiquidity,
    address liquidAsset
  ) 
    external 
    returns(bool);

  function createPermissionedPool(
    uint16 intRate,
    uint16 durationInHours,
    uint24 colCoverage,
    uint unitLiquidity,
    address liquidAsset,
    address[] memory contributors
  ) 
    external 
    returns(bool);

  function payback(uint256 unit) external returns(bool);
  function joinAPool(uint256 unit) external returns(bool);
  function liquidate(uint256 unit) external returns(bool);
  function removeLiquidityPool(uint256 unit) external returns(bool);
  function getFinance(uint256 unit, uint8 daysOfUseInHr) external payable returns(bool);
  function getPoolData(uint256 unitId) external view returns(Pool memory);
  function enquireLiquidation(uint256 unit)external view returns(Common.Contributor memory _liq, bool defaulted, uint currentDebt, Slot memory slot, address); 
  function getCurrentDebt( uint256 unit, address target) external view returns(uint debtToDate); 
  function getProfile(uint256 unit, address user) external view returns(Contributor memory);
  function getBalances(uint256 unit) external view returns(Balances memory);
  function getPoint(address user) external view returns(Point memory);
  function getRecordEpoches() external view returns(uint);
  function getSlot(address user, uint256 unit) external view returns(Slot memory);
  function getStatus(uint256 unit) external view returns(Unit memory _unit);
  
  /**
   * @notice sendFee: will be used as flag to auto-withdraw fee from each strategy. If sendFee is true, 
   * when a round is completed, the fee balances in a strategy will be forwarded to 'feeReceiver'.
   */
  struct ContractData {
    address feeTo;
    address assetAdmin;
    uint16 makerRate;
    address bankFactory;
  }

  struct Analytics {
    uint256 tvlInXFI;
    uint256 tvlInUsd;
    uint totalPermissioned;
    uint totalPermissionless;
  }

  struct ViewFactoryData {
    Analytics analytics;
    ContractData contractData;
    uint currentEpoches;
    uint recordEpoches;
  }
}
