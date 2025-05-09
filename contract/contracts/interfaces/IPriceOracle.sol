// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface IPriceOracle {
  struct Oracle {
    uint latestPrice; 
    uint timestampOflatestPrice; 
  }

  function getPriceQuote(string memory key, Common.Network network) external returns(uint128);
}