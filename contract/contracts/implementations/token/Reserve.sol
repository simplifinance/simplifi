// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";
import { SafeERC20 } from "./SafeERC20.sol";
import { Lib } from "../../libraries/Lib.sol";
import { IERC20 } from "../../apis/IERC20.sol";

/**
 * @title Reserve
 * @dev Total supply is minted to this contract and is controlled by an owner address
 * expected to be a multisig account.
 */
contract Reserve is OnlyOwner {
  using Lib for *;
  using SafeERC20 for IERC20;

  IERC20 public token;

  ///@dev Contract accepts platform coin
  receive () external payable {
    revert("NA");
  } 

  constructor( 
    address _ownershipManager
  ) OnlyOwner(_ownershipManager) { }

  function setToken(IERC20 newToken) public onlyOwner {
    address(newToken).cannotBeEmptyAddress();
    token = newToken;
  }

  ///@dev Transfer Token to @param account : Token recipient
  function transferToken(address account, uint amount) public onlyOwner {
    token.safeTransfer(account, amount);
  }

  ///@dev Batch tranfer: Sends token to many addresses
  function batchTransfer(address[] memory accounts, uint256[] memory amounts) public onlyOwner {
    token.safeBatchTransfer(accounts, amounts);
  }

  ///@dev Locks certain amount i.e Move from private ledger to the regular balance
  function lockToken(address _routeTo, uint256 amount) public onlyOwner {
    token.safeLock(_routeTo, amount);
  }

  ///@dev Unlocks certain amount i.e Move from private ledger to the regular balance
  function unlockToken(uint256 amount) public onlyOwner {
    token.safeUnlock(amount);
  }

}
