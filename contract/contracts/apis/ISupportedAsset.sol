// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

interface ISupportedAsset {
  function isSupportedAsset(address _asset) external view returns(bool);
  function getDefaultSupportedCollateralAsset() external view returns(address _default);
}