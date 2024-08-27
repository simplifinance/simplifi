// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import { Common } from "../apis/Common.sol";

contract FuncHandler is Common {
  error FunctionNotCallable(uint8);
  error IndexOutOfBound(uint);
  
  /**
    @dev Mapping of `poolId` to `functions handles` to bool.
      Note: Functions can either be locked or opened.
      We use slot `0` to toggle contract access.
      Ex.
      if fLock[0][FuncTag.ADD] == false, even if fLock[1][FuncTag.ADD] is true, 
      execution will not proceed. 
  */
  mapping(uint => mapping(FuncTag => bool)) private fLock;
  
  /**
    @dev Determines if function should be called for each pool and the 
      contract in general
      @param tag - Function handle.
      @param poolId - Pool index.
   */
  modifier checkFunctionPass(uint poolId, FuncTag tag) {
    if(!_fStatus(poolId, tag)) {
      revert FunctionNotCallable(uint8(tag));
    }
    _;
  }

  /**
   * @dev All tags mapped to slot `0` is unlocked at construction.
   * This however does not guarantee that the function will successfully 
   * execute unless the corresponding local tag { fLock[poolId][tag] } is
   * true.
  */
  constructor(bool lockFunctions) {
    for(uint8 i = 0; i < 4; ++i) {
      lockFunctions? _lock(0, FuncTag(i)) : _unlock(0, FuncTag(i));
    }
  }
  
  /**
   * @dev locks function
   * @param poolId : Pool Id
   * @param tag : Function handle
   */
  function _lock(uint poolId, FuncTag tag) internal virtual {
    fLock[poolId][tag] = false;
  }

  /**
    * @dev Unlocks function
    * @param poolId : Pool Id
    * @param tag : Function handle
   */
  function _unlock(uint poolId, FuncTag tag) internal virtual{
    fLock[poolId][tag] = true;
  }

  /**@dev Return status of functions i.e Whether function is locked or not.
   * @param poolId : pool Id
   * @param tag : Function tag
   */
  function _fStatus(uint poolId, FuncTag tag) internal virtual view returns(bool) {
    return fLock[poolId][tag];
  }

  /**
   * @dev Checks if function is invokable at this time
   * @param functionSelector : Functions in the Router contracts are mapped to unsigned integer uint8
   *                          i.e JoinBand -> 0 etc. Total callable functions are 4 in number which is why
   *                          functionSelector can not exceed 4. 
   */
  function callable(uint poolId, uint8 functionSelector) public view virtual returns(bool) {
    if(functionSelector > 3) revert IndexOutOfBound(functionSelector);
    return _fStatus(poolId, FuncTag(functionSelector));
  }

}