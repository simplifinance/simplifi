// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface ISupportedAsset {
  function isSupportedAsset(address _asset) external view returns(bool);
  function getPriceWithoutUpdating(address asset, Common.Network network) external view returns(uint128 price);
  function getPriceQuote(Common.Network network, address asset) external returns(uint price);
  function getDefaultSupportedCollateralAsset() external view returns(address);
}