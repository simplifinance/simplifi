// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Pausable, IOwnerShip } from "../../abstracts/Pausable.sol";
import { Lib } from "./ERC20Abstract.sol";
import { SafeERC20 } from "./SafeERC20.sol";
import { IERC20 } from "../../apis/IERC20.sol";

/**
 * Attorney acts as mediator between token and their holders when they lost access to their account and had previously
 * set up a lock. Attorney run attestation om the token contract if user's claim is genuine, charges a small amount of fee
 * and unlocks the token. 
 * Tokens are unlocked and sent to the escape address. 
 */

contract Attorney is Pausable {
  using Lib for *;
  using SafeERC20 for IERC20;

  error CallNotFromEscapeAccount();

  // Service fee
  uint public fee;

  // Fee receiver
  address private feeTo;

  IERC20 public token;

  receive() external payable {
    (bool _s,) = feeTo.call{value: msg.value}("");
    require(_s);
  }

  constructor(
    uint _fee, 
    address _feeTo,
    IOwnerShip _ownershipManager
  ) 
    Pausable(_ownershipManager) 
  {
    _feeTo.cannotBeEmptyAddress();
    fee = _fee;
    feeTo = _feeTo;
  }

  function setToken(IERC20 _token) 
    public 
    onlyOwner
  {
    address(_token).cannotBeEmptyAddress();
    token = _token;
  }

  /**@dev Panic unlock token.
    Token balances is sent to address specified as an escape address.
   */
  function panicUnlock(
    address lostAccount
  ) 
    public 
    payable 
    whenNotPaused
  {
    IERC20.Balances memory _b = IERC20(token).accountBalances(lostAccount);
    require(_b.locked.value > 0, "No lock detected");
    // if(_msgSender() != _b.locked.escapeTo) revert CallNotFromEscapeAccount();
    msg.value.mustBeAbove(fee);
    (bool _s,) = feeTo.call{value: msg.value}("");
    require(_s);
    token.safePanicUnlock(lostAccount, _b);
  }

  function setFee(uint newFee) public onlyOwner {
    fee = newFee;
  }

}
