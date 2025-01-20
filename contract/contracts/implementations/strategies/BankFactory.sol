// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IBankFactory } from "../../apis/IBankFactory.sol";
import { Bank } from "./Bank.sol";
import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";

/**@title SmartBankAdmin: A standalone contract that manages bank creation, 
   deletion, read and write data.

   Author: Simplifinance
 */
contract BankFactory is IBankFactory, OnlyOwner {
  // using Clones for address;

  // Bank count 
  uint public totalBanks;

/**
 * @dev List of Strategies and their keys 
 */
  // BankData[] private strategies;

 /**
 * @dev Mapping of addresses to strategies.
 * Also used as reverse map of strategies to status.
 */
  mapping(uint256 => address) private bankMap;

  constructor (
    address _ownershipManager
  ) OnlyOwner(_ownershipManager) {}

  receive() 
    external 
    payable 
  {
    revert();
  }
  
  /**@dev Return if account owns a bank or not
  */
  function _hasBank(
    uint256 unit
  ) 
    internal 
    view 
    returns (bool) 
  {
    return bankMap[unit] != address(0);
  }

  // Returns smartBank for 'user'
  function _getBank(
    uint256 unit
  ) 
    internal 
    view returns(address) 
  { 
    return bankMap[unit];
  }
  
  // function _getBank(
  //   address user
  // ) 
  //   internal 
  //   view returns(address) 
  // { 
  //   return bankMap[user];
  // }
  
  /**@dev Create a new bank.
   * @notice 'unit' should not own a bank before now.
   *          only address with owner permission can call.
  */
  function createBank(
    uint256 unit
  )
    external
    onlyOwner("BankFactory - createBank: Not permitted")
    returns(address _bank) 
  {
    if(!_hasBank(unit)){
      _bank = _createBank(unit);
    } else {
      _bank = _getBank(unit);
    }
    return _bank;
  }

  /**
    * @param unit : Amount
   * 
   * @notice Even if user is trying to rekey or upgrade smartbank, same amount of fee is required
   * for successful upgrade.
   */
  function _createBank(
    uint256 unit
  ) 
    private 
    returns(address bank) 
  {
    totalBanks ++;
    // address ssi = instance;
    // bank = ssi.cloneDeterministic(keccak256(abi.encodePacked(totalBanks, caller)));
    bank = address(new Bank(ownershipManager));
    _updateBank(unit, bank);
  }

  /**
   * Update storage with the new Bank instance : {internal}
   * @param unit : Unit amount 
   * @param bank : New Bank address
   */
  function _updateBank(
    uint256 unit, 
    address bank
  ) 
    private 
  {
    bankMap[unit] = bank;
  }

  /// Returns then bank for 'unit'
  /// @param unit : Unit amount
  function getBank(
    uint unit
  ) 
    external 
    view 
    returns(address) 
  { 
    return _getBank(unit);
  }
}
