// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IStrategyManager } from "../../apis/IStrategyManager.sol";
import { Strategy } from "./Strategy.sol";
// import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";
import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";

/**@title SmartStrategyAdmin: A standalone contract that manages strategy creation, 
   deletion, read and write data.

   Author: Simplifinance
 */
contract StrategyManager is IStrategyManager, OnlyOwner {
  // using Clones for address;

  // Strategy count 
  uint public totalStrategies;

  /* @notice A deployed instance of the SmartStrategy contract
   */
  // address public instance;

  // /// @notice Address that can perform upgrade to deployed instance
  // address public admin;

/**
 * @dev List of Strategies and their keys 
 */
  StrategyData[] private strategies;

 /**
 * @dev Mapping of addresses to strategies.
 * Also used as reverse map of strategies to status.
 */
  mapping(address => address) private strategyMap;

  constructor (
    // address _instance,
    address _ownershipManager
  ) 
    OnlyOwner(_ownershipManager) 
  {
    // instance = _instance;
  }

  receive() 
    external 
    payable 
  {
    revert();
  }
  
  /**@dev Return if account owns a strategy or not
  */
  function _hasStrategy(
    address user
  ) 
    internal 
    view 
    returns (bool) 
  {
    return strategyMap[user] != address(0);
  }

  // Returns smartStrategy for 'user'
  function _getStrategy(
    address user
  ) 
    internal 
    view returns(address) 
  { 
    return strategyMap[user];
  }
  
  /**@dev Create a new strategy.
   * @notice 'user' should not own a strategy before now.
   *          only address with owner permission can call.
  */
  function createStrategy(
    address user
  )
    external
    onlyOwner("StrategyMgr - createStrategy: Not permitted")
    returns(address _strategy) 
  {
    if(!_hasStrategy(user)){
      _strategy = _createStrategy(user);
    } else {
      _strategy = _getStrategy(user);
    }
    return _strategy;
  }

  /**
   * @dev Create strategy - private function
    * @param caller : msg.sender
   * 
   * @notice Even if user is trying to rekey or upgrade smartstrategy, same amount of fee is required
   * for successful upgrade.
   */
  function _createStrategy(
    address caller
  ) 
    private 
    returns(address strategy) 
  {
    totalStrategies ++;
    // address ssi = instance;
    // strategy = ssi.cloneDeterministic(keccak256(abi.encodePacked(totalStrategies, caller)));
    strategy = address(new Strategy(ownershipManager));
    _updateStrategy(caller, strategy);
  }

  // //Set new instance address : onlyOwner function
  // function setInstance(
  //   address newInstance
  // ) 
  //   public
  //   onlyOwner("Strategy - setInstance: Not permitted")
  // {
  //   if(newInstance == address(0)) revert ZeroAddress(newInstance);
  //   instance = newInstance;
  // }

  /**
   * Update storage with the new Strategy instance : {internal}
   * @param user : User/Caller address 
   * @param strategy : New Strategy address
   */
  function _updateStrategy(
    address user, 
    address strategy
  ) 
    private 
  {
    strategyMap[user] = strategy;
  }

  /// Returns strategy of 'user'
  /// @param user : User Address
  function getStrategy(
    address user
  ) 
    external 
    view 
    returns(address) 
  { 
    return _getStrategy(user);
  }
}
