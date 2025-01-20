// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title Interface of the Bank manager
 * @author : Simplifinance
 */
interface IBankFactory {
  error ZeroAddress(address);
  
  /**
   * Query bank for user
   * @param unit : Address to get bank for
   * @return A bank if none was found, it returns address(0).
   */
  function getBank(uint256 unit) external view returns(address);
  // function getBank(address user) external view returns(address);

/**
 * Clones and return a new bank 
 * @param unit : Target address for whom to create bank
 */
  function createBank(uint256 unit) external returns(address bank);

  /**
   * Bank struct map
   * key: user address { EOA }
   * value: Bank { Contract } 
   */
  struct BankData {
    address key;
    address value;
  }
  
}