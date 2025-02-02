// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { C3 } from "../apis/C3.sol";
import { Pausable } from "../abstracts/Pausable.sol";

contract FuncHandler is Pausable {
  /**
   * @notice Mapping of epochId to permit
   * Permit is used to give instructions to the child contract who can
   * withdraw from an epoch.
   * Only one provider can withdraw at a time in an apoch.
   */
  mapping (uint => mapping (address => bool)) public permits;
  
  /**
    @dev Determines if function should be called for a specific pool.
      @param tag - Function handle.
      @param epochId - Pool index.
  */
  modifier checkPermit(uint epochId, C3.FuncTag tag) {
    address caller = _msgSender();
    require(permits[epochId][caller], "FuncHandler: No Permission detected");
   
    _;
    _setPermit(caller, epochId, false);
  }

  constructor(address _ownershipManager) Pausable(_ownershipManager) {}

  function _setPermit(
    address target, 
    uint epochId, 
    bool permit
  ) 
    internal 
  {
    permits[epochId][target] = permit;
  }

}