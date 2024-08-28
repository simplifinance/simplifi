// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Lib } from "../../libraries/Lib.sol";
import { SafeERC20 } from "./SafeERC20.sol";
import { IERC20 } from "../../apis/IERC20.sol";

/**Attorney
 * It acts on behalf of users who lost access to their account but had previously
 * set up a lock. Attorney enquires from the token contract if user is genuine, charges a small amount of fee
 * and unlock the token. 
 * Tokens are unlocked directly the escape address, where call must be made directly from the
 * escape address. 
 */

contract Attorney is Ownable {
  using Lib for *;
  using SafeERC20 for IERC20;

  error CallNotFromEscapeAccount();

  uint public fee;

  address private devAddress;

  IERC20 public token;

  receive() external payable {
    (bool _s,) = devAddress.call{value: msg.value}("");
    require(_s);
  }

  constructor(uint _fee, address _dev) Ownable(msg.sender) {
    _dev.cannotBeEmptyAddress();
    fee = _fee;
    devAddress = _dev;
  }

  function setToken(IERC20 _token) public onlyOwner {
    address(_token).cannotBeEmptyAddress();
    token = _token;
  }

  /**@dev Panic unlock token.
    Token balances is sent to address specified as an escape address.
    Note: Owner must invoke this method from the escape address
   */
  function panicUnlock(address accountToRetrieve) public payable {
    IERC20.Balances memory _b = IERC20(token).accountBalances(accountToRetrieve);
    require(_b.locked.value > 0, "No lock detected");
    if(_msgSender() != _b.locked.escapeTo) revert CallNotFromEscapeAccount();
    uint msgValue = msg.value;
    msgValue.mustBeAbove(fee);
    (bool _s,) = devAddress.call{value: msgValue}("");
    require(_s);
    token.safePanicUnlock(accountToRetrieve, _b);
  }

  function setFee(uint newFee) public {
    if(_msgSender() == devAddress) {
      fee = newFee;
    }
  }

}
