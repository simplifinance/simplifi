// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface IStrategy {
  error ContractBalanceTooLow();
  error InsufficientNativeBalanceInContract(uint);
  error InsufficientCredit(uint, uint);
  
  /**
   * @dev Add contributor to the list
   * @param user : Contributor address
   * @param epochId : Epoch Id
   */
  function addUp(
    address user,
    uint epochId
  ) 
    external
    returns(bool);

  /**
   * @dev Map assetInUse to epoch Id in Strategy.
   * @param epochId: Epoch Id otherwise known as pool Id.
   * @param assetInUse: Contract address of the ERC20 token the contribution is based on.
   * @return success
   */
  function mapAsset(
    uint epochId, 
    address assetInUse
  ) 
    external 
    returns(bool success);

  /**
   * @dev Utility to activate claim for a contributor.
   * @param epochId: Epoch Id otherwise known as pool Id.
   * @param claim: withdrawable amount.
   * @param fee: Amount charged as fee.
   * @param user: User address.
   * @param feeTo: Fee receiver.
   * @param txType : The type of transaction to perform in the call.
   *                Can be either ERC20 or native transaction.
  *  @param allHasGF : A boolean flag indicating whether the epoch should end or not.
   * @return actualClaim
   */
  function setClaim(
    uint claim,
    uint fee,
    uint credit,
    uint epochId,
    address user,
    address feeTo,
    bool allHasGF,
    Common.TransactionType txType
  ) 
    external
    payable
    returns(uint actualClaim);

  function swapProvider(
    uint epochId, 
    address newProv, 
    address oldProv
  ) 
    external 
    returns(bool);

  function withdraw(
    uint epochId,
    address user
  )
    external
    returns(uint xfiBalances);
}