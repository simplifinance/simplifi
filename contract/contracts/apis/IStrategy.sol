// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

interface IStrategy {
  error ContractBalanceTooLow();

  /**
   * @dev Utility to activate members
   * @param epochId: Epoch Id otherwise known as pool Id.
   * @param user: User address different from msg.sender.
   * @param assetInUse: Contract address of the ERC20 token the contribution is based on.
   * @return success
   */
  function activateMember(
    uint epochId, 
    address user, 
    address assetInUse
  ) 
    external 
    returns(bool success);

  /**
   * @dev Utility to check for claimable. 
   * @param epochId: Epoch Id otherwise known as pool Id.
   * @return Withdrawable (type Uint256)
   */
  function claimable(uint epochId) 
    external 
    view  
    returns(uint256);

  /**
   * @dev Utility to claim any withdrawable fund. 
   * @param epochId: Epoch Id otherwise known as pool Id.
   * @return success
   */
  function claim(uint epochId) 
    external 
    returns(bool success);

}