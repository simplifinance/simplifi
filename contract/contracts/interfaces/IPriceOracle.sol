// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface IPriceOracle {
  struct Oracle {
    address oracle;
    uint128 latestPrice; 
    uint128 timestampOflatestPrice; 
  }

  function getPriceQuote(string memory key, Common.Network network) external returns(uint128);
}