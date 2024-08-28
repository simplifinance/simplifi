// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";
import { ISmartStrategyAdmin } from "../apis/ISmartStrategyAdmin.sol";
import { IAssetClass } from "../apis/IAssetClass.sol";
import { ISmartStrategy } from "../apis/ISmartStrategy.sol";
import { SafeCallSmartStrategy } from "../libraries/SafeCallSmartStrategy.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";

abstract contract AbstractStrategyAdmin is ISmartStrategyAdmin, Common, Ownable {
  using Clones for address;
  using SafeCallSmartStrategy for ISmartStrategy;

  // Total strategies created to date
  uint public totalStrategies;

  // Acount creation fee
  uint private creationFee;

  //Address to receive fee
  address public feeTo;

  // Token contract
  address public token;

  // Router contract address
  address public router;

  // Asset contract
  address public assetAdmin;

  /**
   * @notice An instance of the SmartStrategy deployed beforehand
   */
  address public smartStrategyInstance;

  /**
   * @dev Strategies already upgraded and not in use
   */
  address[] public dormantStrategies;

  //Approvals to upgrade to a new account
  mapping(address=>bool) public approvals;

  /**
   * @dev Mapping of addresses to strategies.
   * Also used as reverse map of strategies to status.
   * The status is used only during account upgrade.
   */
  mapping(address => Strategy) private strategies;

  /**
   * @dev Upgraded strategies
   * mapping of smartStrategyInstance to strategies to bool
   */
  mapping(address => mapping(address => bool)) public upgraded;

  constructor (
    uint _alcCreationFee, 
    address _feeTo,
    address _token,
    address _assetAdmin, 
    ISmartStrategy _smartStrategyInstance
  ) Ownable(_msgSender()) {
    feeTo = _feeTo;
    token = _token;
    assetAdmin = _assetAdmin;
    smartStrategyInstance = address(_smartStrategyInstance);
    _setCreationFee(_alcCreationFee);
  }

  /**
   * @dev Only when account owns a strategy or not.
   * @param account : Caller or any bytes address
   */
  modifier isStrategy(address account, bool value, string memory errorMessage) {
    require(_hasStrategy(account) == value, errorMessage);
    _;
  }

  /**@dev Only support asset
   */
  modifier isSupportedAsset(address asset) {
    require(IAssetClass(assetAdmin).isSupportedAsset(asset),"NS");
    _;
  }
  
  /**@dev Return if account owns a strategy or not
   */
  function _hasStrategy(address account) internal view returns (bool) {
    return strategies[account].active != address(0);
  }

  // Set account creation fee : Should be called only by the multisig account
  function _setCreationFee(uint newFee) internal {
    creationFee = newFee;
  }

  // Set account creation fee : Should be called only by the multisig account
  function setStrategyCreationFee(uint newFee) public onlyOwner {
    _setCreationFee(newFee);
  }

  // Returns account for 'account'
  function _getStrategy(address account) internal view returns(address) { 
    return strategies[account].active; 
  }
  
  /**@dev Create a new strategy.
  */
  function createStrategy()
    external 
    payable
    isStrategy(_msgSender(), false, "User's strategy exist")
    returns(bool) 
  {
    _createStrategy(msg.value, _msgSender());
    return true;
  }

  /**
   * @dev Create strategy - private function
   * @param valueSent : Msg.value
   * @param caller : msg.sender
   * 
   * @notice Even if user is trying to rekey or upgrade smartstrategy, same amount of fee is required
   * for successful upgrade.
   */
  function _createStrategy(uint256 valueSent, address caller)private returns(address strategy) {
    uint fee = creationFee;
    if(valueSent < fee) {
      revert InsufficientMsgValue(valueSent);
    }
    if(valueSent > 0) {
      (bool done,) = feeTo.call{value: valueSent}("");
      require(done, "Fallback not executed: Check FeeTo");
    }
    if(router == address(0)) revert RouterNotSet();
    totalStrategies ++;
    address ssi = smartStrategyInstance;
    strategy = ssi.cloneDeterministic(keccak256(abi.encodePacked(totalStrategies, caller)));
    _activateStrategy(caller, strategy);
    upgraded[ssi][strategy] = true;
    ISmartStrategy(strategy).safeActivateStrategy(router);
    // safeSetVariables(router, token);
  }

  /**
   * 
   * @param index : The position of the strategy to pick.
   * Note: Arrays are zero-base, users will have to pass 
   * actual index - 1 otherwise a wrong strategy will be picked or 
   * execution fails.
   * 
   * If there are dormant strategies , user could safe some gas by selecting 
   * from the list instead of creating a new one.
   */
  function handpickStrategy(uint index) 
    external
    isStrategy(_msgSender(), false, "User's strategy exist")
    returns(bool) 
  {
    address caller = _msgSender();
    address strategy = _searchDormant(index, dormantStrategies.length);
    if(strategy != address(0)) {
      _activateStrategy(caller, strategy);
      ISmartStrategy(strategy).safeActivateStrategy(router);
    } else {
      revert StrategyWasDeleted(index);
    }
    
    return true;
  }

  /**
   * @dev Searches the list for dormant strategy.
   * This utility will always return last item in the array. 
   */
  function _searchDormant(uint index, uint size) internal view returns(address found) {
    if(index >= size) revert NoStrategyFound();
    found = dormantStrategies[index];
    require(found != address(0), "Not found");
  }

  // Reset address to receive fee : only by owner account.
  function setFeeTo(address newFeeTo) public onlyOwner {
    if(newFeeTo == address(0)) revert ZeroAddress(newFeeTo);
    feeTo = newFeeTo;
  }

  //Reset router contract address : onlyOwner
  function setRouter(address newRouter) public onlyOwner {
    if(newRouter == address(0)) revert ZeroAddress(newRouter);
    router = newRouter;
  }

  //Reset token contract address : onlyOwner
  function setToken(address newToken) public onlyOwner {
    if(newToken == address(0)) revert ZeroAddress(newToken);
    token = newToken;
  }

  //Reset asset admin contract address : onlyOwner
  function setAssetAdmin(address newAssetAdmin) public onlyOwner {
    if(newAssetAdmin == address(0)) revert ZeroAddress(newAssetAdmin);
    assetAdmin = newAssetAdmin;
  }

  //Set new smartStrategyInstance address : onlyOwner function
  function setdeployedInstance(address newInstance) public onlyOwner {
    if(newInstance == address(0)) revert ZeroAddress(newInstance);
    smartStrategyInstance = newInstance;
  }

  /**@dev Upgrade to a new smartstrategy wallet.
   * This function ensures users are running a copy of the latest smartStrategyInstance.
   * Note: When upgraded[smartStrategyInstance][current.active] is true, it means 
   * there's no new version of smartStrategyInstance contract. Until the smartStrategyInstance address
   * is upgraded, upgrading strategy is not possible.
   */
  function rekeyStrategy(address _asset) 
    external
    payable
    isStrategy(_msgSender(), true, "Strategy not found")
    isSupportedAsset(_asset)
    returns(bool) 
  {
    address msgSender = _msgSender();
    address ssi = smartStrategyInstance;
    address oldStrategy = strategies[msgSender].active;
    if(upgraded[ssi][oldStrategy]) revert UpgradeNotReady();
    address newStrategy = _createStrategy(msg.value, msgSender);
    _deactivateStrategy(msgSender, oldStrategy);
    _activateStrategy(msgSender, newStrategy);
    ISmartStrategy(oldStrategy).safeUpgrade(newStrategy, _asset);

    dormantStrategies.push(oldStrategy);

    return true;
  }

  // /**@dev Approves new account for upgrade
  //  * Note : Same utility can also disapprove
  // */
  // function approveForUpgrade(address newStrategy, bool _approval) public onlyOwner {
  //   if(approvals[newStrategy] == _approval) revert StatusAlreadyUpdated();
  //   approvals[newStrategy] = _approval;
  // }

  /**
   * @dev Deactivate strategy
   * @param user : EOA
   */
  function deactivateStrategy(address user) 
    public
    onlyOwner
    isStrategy(user, true, "User already deactivated")
  {
    Strategy memory alcs = strategies[user];
    _deactivateStrategy(user, alcs.active);
  }

  function _deactivateStrategy(address user, address strategy) private {
    strategies[user] = Strategy({active: address(0), deactivated: strategy});
  }

  /**
   * @dev Utility to activate strategy. 
   * @param user : Target account to active
   * @notice Only owner function. Account with owner permission can use this 
   *          method to create new strategy for user if none was found.
   */
  function activateStrategy(address user) 
    public
    payable
    onlyOwner
    isStrategy(user, false, "User already active")
    returns(bool)
  {
    Strategy memory alcs = strategies[user];
    if(alcs.active == address(0) && alcs.deactivated == address(0)) {
      _createStrategy(msg.value, user);
    } else {
      require(alcs.deactivated != address(0), "User was deactivated");
      _activateStrategy(user, alcs.deactivated);
    }
    return true;
  }

  function _activateStrategy(address account, address strategy) private {
    strategies[account] = Strategy(strategy, address(0));
  }

}
