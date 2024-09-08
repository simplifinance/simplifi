// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title Interface of the Strateg manager
 * @author : Simplifinance
 */
interface IStrategyManager {
  error ZeroAddress(address);
  
  /**
   * Query strategy for user
   * @param user : Address to get strategy for
   * @return A strategy if none was found, it returns address(0).
   */
  function getStrategy(address user) external view returns(address);

/**
 * Clones and return a new strategy
 * @param user : Target address for whom to create strategy
 */
  function createStrategy(address user) external returns(address strategy);

  /**
   * Strategy struct map
   * key: user address { EOA }
   * value: Strategy { Contract } 
   */
  struct StrategyData {
    address key;
    address value;
  }
  
}