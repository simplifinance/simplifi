// SPDX-License-Identifier: MIT


pragma solidity 0.8.24;

interface ITrustee {
  function registerBeneficiaries(
    address[] memory beneficiaries, 
    uint256 amount, 
    uint poolId,
    address asset
  ) external returns(bool);
  
  function claimContribution(uint poolId) external payable returns(bool);
  function claimable(uint poolId) external view returns(uint256);
  function transferOut(address asset, address strategy, uint256 amount, uint fee) external returns(bool);
}