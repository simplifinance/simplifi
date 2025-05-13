// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface ISupportedAsset {
  struct SupportedAsset {
    address id;
    string name;
    string symbol;
  }
  function isSupportedAsset(address _asset) external view returns(bool);
  function getDefaultSupportedCollateralAsset() external view returns(address);
} 