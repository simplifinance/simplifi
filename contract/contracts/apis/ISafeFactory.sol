// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title Interface of the Safe manager
 * @author : Simplifinance (Written by Bobeu)
 */
interface ISafeFactory {  
  /**
   * Query safe for user
   * @param unit : Address to get safe for
   * @return A safe if none was found, it returns address(0).
   */
  function getSafe(uint256 unit) external view returns(address);
  // function getSafe(address user) external view returns(address);

/**
 * Clones and return a new safe 
 * @param unit : Target address for whom to create safe
 */
  function pingSafe(uint256 unit) external returns(address safe);

  /**
   * Safe struct map
   * key: user address { EOA }
   * value: Safe { Contract } 
   */
  struct SafeData {
    address key;
    address value;
  }

}