// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../apis/ISmartWallet.sol";
import "../libraries/Lib.sol";
import "../libraries/Utils.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
  @title SmartWallet: 
    Interactive account is a separate entity distinct from participants created and managed by the Strategy admin contract.
    All calls and interactions from the user must go through the admin.

    We created this account using the clone {deterministic} method. An instance of the account 
    strategy is deployed while ownership is renounced at construction. This mean 
    it is open to anyone to claim ownership. Since it is managed internally by the
    admin, it is presumably safe. When a participant is being added, we clone an 
    instance of the deployed strategy, and reset the state variables via the API to 
    our preference based on the status of the pool they belong.
    Note: Routers don't take actions on account unless triggered by the participants.
*/
contract SmartWallet is  ISmartWallet, Ownable, ReentrancyGuard {
  using Lib for *;

  /// @dev User address
  address public user;

  /**@dev Constructor.
   * @notice Since we are going to use a cloned version as instances 
   * for users, it makes sense that we set the variables using
   * function other than the constructor.
   * At construction, we make Router contract the owner.
   */
  constructor (address _router) Ownable(_router) { }

  // Fallback - receive platform asset
  receive() external payable {
    (bool d,) = owner().call{value: msg.value}("");
    d.yes("/|/");
  }

  /**@dev Utility to upgrage to a new Wallet.
   * Note : New Wallet must be approved from the Wallet admin
   *        before they can be upgraded.
   * 
   * All funds including ERC20 assets are sent to the `newWallet`.
   * 
   * Note: Smart wallet can only be reactivated by the Router by assigning it to a new
   * user.
   * @param _newWalletStrategy : New strategy account.
   * @param _asset : ERC20 asset
   * @notice Only Router can call.
   */
  function upgrade(address _newWalletStrategy, address _asset) 
    external 
    onlyOwner 
    returns(bool) 
  {
    Address.functionCall(
      _newWalletStrategy,
      abi.encodeWithSelector(
        bytes4(keccak256(bytes("acceptRekey(address)"))), 
        _asset
      )
    );
    _tryTransfer(IERC20(_asset).balanceOf(address(this)), address(this).balance, _asset, _newStrategy);

    return true;
  }

  ///@dev Get user address.
  function _getUser() internal view returns(address user_) { 
    user_ = user;
  }

  /**
   * @dev Withdraw ERC20 asset
   * @param _to : Address to receive the value.
   * @param _amount : Amount to withdraw.
  */
  function withdrawAsset(
    address _asset,
    address _to, 
    uint _amount
  ) 
    external
    nonReentrant
    returns(bool)
  {
    bool(_msgSender() == _getUser()).yes("Smart Wallet: UnAuthorized caller");
    _tryTransfer(_amount, 0, _asset, _to);
    return true;
  }

  /**@dev Transfers asset out of this contract 
   * @param _to : Recipient
   * @param _amount : Value to transfer
   * @param _asset : ERC20 Asset to use.
  */
  function _transferERC20Asset(uint256 _amount, address _asset, address _to) private {
    IERC20(_asset).transfer(_to, _amount).yes("ERCTrx failed");
  }

  /**@dev Reset state variables for a new user.
   * This function can be called by the deployer. It can be invoked 
   * multiple times only by the owner. 
   * @param router_ : Router contract.
   * @notice Where @param newRouter : {New version of Router contract} is not address(0)
   *         is an indication to upgrade the router contract to the latest version.
   */
  function activateStrategy(address newRouter) external onlyOwner returns(bool) {
    address caller = _msgSender();
    if(newRouter != address(0)) {
      _transferOwnership(newRouter);
    }
    bool(caller == owner()).yes("Account: Not an Owner");
    router = router_;

    return true;
  }
  
  /**@dev User can close wallet if they wish.
    @notice Closing wallet does not remove the code from the blockchain.
    We simply detach the user from this strategy. It can be reused by another 
    user. A major reason for this could be that user want to upgrade to another
    strategy version.
   */
  function closeTo(address _to, address _asset) external onlyOwner returns(bool) {
    _tryTransfer(IERC20(_asset).balanceOf(address(this)), address(this).balance, _asset, _to);
    return true;
  }

  function _tryTransfer(uint256 _erc20Bal, uint256 _ethValue, address _asset, address _to) private {
    if(_erc20Bal > 0) {
      _transferERC20Asset(_erc20Bal, _asset, _to);
    } 
    
    if(_ethValue > 0) {
      Address.sendValue(payable(_to), _ethValue);
    } 
  }
}