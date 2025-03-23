// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { ERC20, Context } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { OnlyOwner, MsgSender, IOwnerShip } from "../abstracts/OnlyOwner.sol";
import { IERC20 } from "../apis/IERC20.sol";

contract TestBaseAsset is OnlyOwner, ERC20 {
  error AlreadySignedUp();
  struct Tester {
    bool isSignedUp;
    bool isApproved;
  }

  address[] public testers;

  IERC20 public collateralToken;

  mapping (address => Tester) public indexes;

  constructor(
    IOwnerShip _ownershipManager,
    IERC20 _collateralToken
  ) ERC20("Test Base Asset", "TBSD") OnlyOwner(_ownershipManager) {
    require(address(_collateralToken) != address(0), "Collateral token is zero");
    require(address(_ownershipManager) != address(0), "OwnershipManager addr is zero");
    collateralToken = _collateralToken;
    _mint(msg.sender, 100000 * (10**18));
    _signUp();
  }

  /**
   * @dev Claim test token 
   * @param to : Recipient
   * @notice Two assets are sent to recipient:
   *      1. Base contribution asset
   *      2. Collateral token
   *  Sender must registered and be approved in order to claim test tokens
   */
  function _claimTestTokens(address to) internal {
    require(indexes[to].isApproved, "Not approved");
    uint amount = 5000 * (10**18);
    uint colAmount = amount * 4;
    if(balanceOf(to) == 0) _mint(to, amount);
    if(IERC20(collateralToken).balanceOf(to) == 0 && IERC20(collateralToken).balanceOf(address(this)) >= colAmount) IERC20(collateralToken).transfer(to, colAmount);
  }

  function claimTestTokens() public returns(bool) {
    _claimTestTokens(_msgSender());
    return true;
  }
   
  /**
   * @dev Assigned owner account (s) can send test tokens to multiple users provided they're 
   * registered and approved.
   * @param tos : A list of recipients
   * @notice Sender must have ownership right or access
   */
  function mintBatch(address[] memory tos) public onlyOwner {
    for(uint i = 0; i < tos.length; i++) {
      _claimTestTokens(tos[i]);
    }
  }

  function _signUp() internal {
    Tester memory ts = indexes[_msgSender()];
    if(!ts.isSignedUp){
      indexes[_msgSender()].isSignedUp = true;
      testers.push(_msgSender());
    } else revert AlreadySignedUp();
  }
  
  /**
   * @dev Register users for testnet participation
   */
  function joinTestnet() public returns(bool) {
    _signUp();
    return true;
  }

  /**
   * @dev Owner accounts can approve testers
   * @param targets : List of accounts to approve 
   */
  function approveTester(address[] memory targets) public onlyOwner {
    for(uint i = 0; i < targets.length; i++){
      address target = targets[i];
      Tester memory ts = indexes[target];
      if(ts.isSignedUp && !ts.isApproved) indexes[target].isApproved = true;
    }
  }

  function _msgSender() internal view override(Context, MsgSender) returns(address sender) {
    sender = msg.sender;
  }
}