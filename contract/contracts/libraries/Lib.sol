// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

/**
 * @title Lib : Non-deployable contract
 * @author Simplifi
 */

library Lib {
  error AddressIsZero();
  error InsufficientBalance(uint256, uint256);

  /**
   * @dev Ensures that parameter parsed cannot be empty
   * @param _a : Parameter of type address
   */
  function cannotBeEmptyAddress(address _a) internal pure {
    if(_a == address(0)) {
      revert AddressIsZero();
    }
  }

  /**
   * @dev Invoking this function ensures parameter 'a' is greater than 'b'
   * @param _a : Parameter of type uint256
   * @param _b : Parameter of type uint256
   */
  function mustBeAbove(uint256 _a, uint256 _b) internal pure {
    if(_a < _b) revert InsufficientBalance(_a, _b);
  }

  /**
   * @dev Condition parsed to this function must be true
   * @param condition : Expected condition
   * @param errorMessage : Error message to return when assertion failed
   */
  function yes(bool condition, string memory errorMessage) internal pure {
    require(condition, errorMessage);
  }

  /**
   * @dev Condition parsed to this function must evaluate to false
   * @param condition : Expected condition
   * @param errorMessage : Error errorMto return when assertion failed
   */
  function no(bool condition, string memory errorMessage) internal pure {
    require(!condition, errorMessage);
  }
}