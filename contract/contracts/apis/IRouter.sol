// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./Common.sol";

interface IRouter is Common {
  error InsufficientFund();
  error AllMemberIsPaid();
  error QuorumIsInvalid();

  event BandCreated(uint poolId, Common.Pool pool, Common.StrategyInfo info, uint16 position);
  event NewMemberAdded(uint poolId, Common.StrategyInfo info);
  event GetFinanced(uint poolId, Common.StrategyInfo info);
  event Payback(uint poolId, Common.StrategyInfo info);
  event Liquidated(uint poolId, Common.StrategyInfo info);
  event Cancellation(uint poolId);

  event RoundUp(uint, Pool);
  event Rekeyed(address indexed, address indexed);

  enum Router { PERMISSIONLESS, PERMISSIONED }

  function getRouterWithPoolId(uint poolId) external view returns(string memory);
  function currentPoolId() external view returns(uint);
    function createPermissionlessPool(
    uint8 quorum, 
    uint8 durationInHours, 
    uint16 colCoverageRatio, 
    uint amount,
    address asset
  ) external payable returns(bool);

  function createPermissionedPool(
    uint8 durationInHours, 
    uint16 colCoverageRatio, 
    uint amount,
    address asset,
    address[] memory participants
  ) external payable returns(bool);

  function payback(uint poolId) external payable returns(bool);
  function joinBand(uint poolId) external payable returns(bool);
  function liquidate(uint poolId) external payable returns(bool);
  function removeBand(uint poolId) external payable returns(bool);
  function getFinance(uint poolId) external payable returns(bool);
  function getPoolData(uint poolId) external view returns(Pool memory);
  function enquireLiquidation(uint poolId) external view returns(Liquidation memory);

  struct ContractData {
    address feeTo;
    address token;
    address assetAdmin;
    uint16 makerRate;
  }
}
