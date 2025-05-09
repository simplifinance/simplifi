// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface IDIAOracleV2{
  function getValue(string memory) external returns (uint128, uint128);
}