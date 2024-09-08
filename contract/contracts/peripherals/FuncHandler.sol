// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";

contract FuncHandler is Common {
  error FunctionNotCallable(uint8);
  error IndexOutOfBound(uint);
  error FunctionAlreadyUnlocked(FuncTag);
  error FunctionAlreadyLocked(FuncTag);
  
  /**
    @dev Mapping of `epochId` to `functions tags` to bool.
      Note: Functions can either be locked or opened.
      Ex.
      if locker[0][FuncTag.ADD] == false, execution will fail. 
  */
  mapping(uint => mapping(FuncTag => bool)) private locker;
  
  /**
    @dev Determines if function should be called for a specific pool.
      @param tag - Function handle.
      @param epochId - Pool index.
   */
  modifier checkFunctionPass(uint epochId, FuncTag tag) {
    if(!_getFunctionStatus(epochId, tag)) {
      revert FunctionNotCallable(uint8(tag));
    }
    _;
  }

  /**
   * @dev locks function
   * @param epochId : Pool Id
   * @param tag : Function tag
   */
  function _lockFunction(uint epochId, FuncTag tag) internal virtual {
    if(locker[epochId][tag]) {
      locker[epochId][tag] = false;
    } else {
      revert FunctionAlreadyLocked(tag);
    }
  }

  /**
    * @dev Unlocks function
    * @param epochId : Pool Id
    * @param tag : Function handle
   */
  function _unlockFunction(uint epochId, FuncTag tag) internal virtual{
    if(!locker[epochId][tag]){
      locker[epochId][tag] = true;
    } else {
      revert FunctionAlreadyUnlocked(tag);
    }
  }

  /**@dev Return status of functions i.e Whether function is locked or not.
   * @param epochId : pool Id
   * @param tag : Function tag
   */
  function _getFunctionStatus(uint epochId, FuncTag tag) internal view returns(bool) {
    return locker[epochId][tag];
  }

  /**
   * @dev Checks if function is invokable at this time
   * @param functionSelector : Functions in the Router contracts are mapped to unsigned integer uint8
   *                          i.e JoinBand -> 0 etc. Total callable functions are 4 in number which is why
   *                          functionSelector can not exceed 4. 
   */
  function isFunctionCallable(uint epochId, uint8 functionSelector) public view virtual returns(string memory _isCallable) {
    if(functionSelector > 3) revert IndexOutOfBound(functionSelector);
    return _getFunctionStatus(epochId, FuncTag(functionSelector))? "UNLOCKED" : "LOCKED";
  }

}