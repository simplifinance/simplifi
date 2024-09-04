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
  event Cancellation(uint poolId);

  event RoundUp(uint, Pool);
  event Rekeyed(address indexed, address indexed);

  enum Router { PERMISSIONLESS, PERMISSIONED }

  function getRouterWithPoolId(
    uint poolId
  ) 
    external 
    view 
    returns(string memory);
  
  function epoches() 
    external 
    view 
    returns(uint);

  function createPermissionlessPool(
    uint8 quorum, 
    uint8 durationInHours, 
    uint16 colCoverageRatio, 
    uint amount,
    address asset
  ) 
    external 
    payable 
    returns(bool);

  function createPermissionedPool(
    uint8 durationInHours, 
    uint16 colCoverageRatio, 
    uint amount,
    address asset,
    address[] memory participants
  ) 
    external 
    returns(bool);

  function payback(
    uint poolId
  ) 
    external 
    returns(bool);

  function joinBand(
    uint poolId
  ) 
    external 
    returns(bool);

  function liquidate(
    uint poolId
  ) 
    external 
    returns(bool);

  function removeBand(
    uint poolId
  ) 
    external 
    returns(bool);

  function getFinance(
    uint poolId
  ) 
    external 
    payable returns(bool);

  function getPoolData(
    uint poolId
  ) 
    external 
    view returns(Pool memory);

  function enquireLiquidation(
    uint poolId
  ) 
    external 
    view returns(Common.Contributor memory); 
 
  struct ContractData {
    address feeTo;
    address assetAdmin;
    uint16 makerRate;
    address strategyManager;
    address ownershipManager;
  }
}
