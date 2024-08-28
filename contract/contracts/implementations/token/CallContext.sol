// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

/**@title CallContext: Adding another layer of security to internal functions that modify the state
      even if they're gated. Some ungated internal functions should only be called 
      in the context of the public or external functions for which they're defined.
      We use this method to achieve that.

    Caution: Do not use this method as a way of restricting access to sensitive functions.
            You could introduce a DOS attack. The internal functions are gated by default.

    @author Simplifinance { Bobeu }
    Github: https://github.com/bobeu
 */
abstract contract CallContext {
  error FunctionNotCallable();
  
  enum Internal {
    MINT,
    BURN,
    PAUSE,
    BATCH,
    UNPAUSE,
    TRANSFER,
    TRANSFERFROM,
    INCREASEALLOWANCE,
    DECREASEALLOWANCE,
    LOCK,
    UNLOCK,
    SPENDALLOWANCE,
    APPROVE,
    PANIC
  }

  mapping(Internal => bool) private callables;

  ///@dev Can be used for multiple nested checks that evaluates to false.
  function _requireContext(bool condition) internal virtual {
    if(condition == false) revert FunctionNotCallable();
  }

  ///@dev Returns if a function is callable or not.
  function _isCallable(Internal funcTag) internal view returns(bool) {
    return callables[funcTag];
  }

  ///@dev Unlocks internal functions, then locks it when body of funtion terminates
  modifier toggleFunc(Internal funcTag) {
    _openTag(funcTag);
    _;
    _closeTag(funcTag);

  }

  ///@dev Activates internal function
  function _openTag(Internal funcTag) private {
    callables[funcTag] = true;
  }

  /// @dev Deactivate internal func tags
  function _closeTag(Internal funcTag) private {
    callables[funcTag] = false;
  }

}