// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface IFactory is Common {
  function contributeThroughProvider(Provider[] memory providers, address borrower, uint unit) external returns(bool);
  function getContributorProviders(address target, uint96 recordId) external view returns(Provider[] memory);
  function getPool(uint unit) external view returns(Common.Pool memory);
}