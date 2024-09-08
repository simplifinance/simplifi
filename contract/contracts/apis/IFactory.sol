// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface IFactory is Common {
  error InsufficientFund();
  error AllMemberIsPaid();
  error QuorumIsInvalid();
  error OwnershipManagerIsNotSet();

  event BandCreated(CreatePoolReturnValue);
  event NewMemberAdded(CommonEventData);
  event GetFinanced(CommonEventData);
  event Payback(CommonEventData);
  event Liquidated(CommonEventData);
  event Cancellation(uint epochId);

  event RoundUp(uint, Pool);
  event Rekeyed(address indexed, address indexed);

  enum Router { PERMISSIONLESS, PERMISSIONED }

  // function getRouterWithPoolId(
  //   uint epochId
  // ) 
  //   external 
  //   view 
  //   returns(string memory);
  
  function epoches() 
    external 
    view 
    returns(uint);

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

  function payback(
    uint epochId
  ) 
    external 
    returns(bool);

  function joinAPool(
    uint epochId
  ) 
    external 
    returns(bool);

  function liquidate(
    uint epochId
  ) 
    external 
    returns(bool);

  function removeLiquidityPool(
    uint epochId
  ) 
    external 
    returns(bool);

  function getFinance(
    uint epochId,
    uint8 daysOfUseInHr
  ) 
    external 
    payable returns(bool);

  function getPoolData(
    uint epochId
  ) 
    external 
    view returns(Pool memory);

  function enquireLiquidation(
    uint epochId
  ) 
    external 
    view 
    returns(Contributor memory prof, bool defaulted, uint debtToDate); 
  
  function getCurrentDebt(
    uint epochId,
    address target
  ) 
    external 
    view 
    returns(uint debtToDate); 

  function getProfile(
    uint epochId,
    address user
  )
    external
    view
    returns(ContributorData memory);
        
  function getBalances(
    uint epochId
  )   
    external
    view
    returns(Balances memory);

  function withdrawCollateral(
    uint epochId
  )
    external
    returns(bool);
 
  struct ContractData {
    address feeTo;
    address assetAdmin;
    uint16 makerRate;
    address strategyManager;
  }
}
