// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../apis/ISmartWalletStrategy.sol";
import "../../apis/libraries/Lib.sol";
import "../../libraries/Utils.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
  @title SmartWalletStrategyV2: 
    Interactive account is a separate entity distinct from participants. 
    This account is created and managed by the Strategy admin contract.
    All interactions from the user must go through the admin.

    We created this account using the clone {deterministic} method. An instance of the account 
    strategy is deployed while ownership is renounced at construction. This mean 
    it is open to anyone to claim ownership. Since it is managed internally by the
    admin, it is presumably safe. When a participant is being added, we clone an 
    instance of the deployed strategy, and use the API to reset the variables to 
    our preference based on the status of the pool they belong.
    Note: Routers don't take actions on account unless triggered by the participants.
*/
contract SmartWalletStrategyV2 is  ISmartWalletStrategy, ReentrancyGuard, Ownable {
  using Lib for *;

  /// @dev Router contract
  address public router;

  /**@dev Constructor.
   * @notice Since we are going to use a clone version as instances 
   * for users, it makes sense that we use set the variable using
   * function other than the constructor.
   */
  constructor () {
    renounceOwnership();
  }

  // Fallback - receive platform asset
  receive() external payable {
    uint bal = address(this).balance;
    unchecked{
      if(bal > 1e17 wei) {
        (bool d,) = owner().call{value: bal - 1e17 wei}("");
        d.yes("/|/");
      }
    }
  }

  /**@dev Utility to upgrage to a new account.
   * Note : New account must be approved from the account admin
   *        before they can be upgraded.
   * 
   * All funds including ERC20 assets are sent to the `newAccount`.
   * 
   * Note: Account can only be reactivated by the Router by assigning it to a new
   * user.
   * @param _newStrategy : New strategy account.
   * @param _asset: ERC20 asset.
   */
  function upgrade(address _newStrategy, address _asset) 
    external 
    onlyOwner 
    returns(bool) 
  {
    Address.functionCall(
      _newStrategy,
      abi.encodeWithSelector(
        bytes4(keccak256(bytes("acceptRekey(address)"))), 
        _asset
      )
    );
    _tryTransfer(IERC20(_asset).balanceOf(address(this)), address(this).balance, _asset, _newStrategy);

    return true;
  }

  ///@dev Get the router address.
  function _router() internal view returns(address router_) { 
    router_ = router;
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
    address caller = _msgSender();
    bool(caller == _router() || caller == owner()).yes("Account: UnAuthorized caller");
    _tryTransfer(_amount, 0, _asset, _to);
    return true;
  }

  /**@dev initializes transfer asset out of this contract 
   * @param _to : Recipient
   * @param _amount : Value to transfer
   * @param _asset : ERC20 Asset to use.
  */
  function _transferERC20Asset(uint256 _amount, address _asset, address _to) private nonReentrant {
    IERC20(_asset).transfer(_to, _amount).yes("ERCTrx failed");
  }

  /**@dev Reset state variables for a new user.
   * This function can be called by the deployer. It has to be invoked 
   * multiple times only be the preset account. 
   * @param router_ : Router contract.
   */
  function activateStrategy(address router_) external returns(bool) {
    address caller = _msgSender();
    if(owner() == address(0)) _transferOwnership(caller);
    bool(caller == owner()).yes("Account: Not an Owner");
    router = router_;

    return true;
  }
  
  /**@dev User can close account if they wish.
    @notice Closing account does not remove the code from the blockchain.
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

  function acceptRekey(address _token) external returns(bool) {
    token = IERC20(_token);
    return true;
  }
  
  IERC20 public token;
}