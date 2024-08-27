// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "../apis/Common.sol";
import "../apis/ISmartStrategyAdmin.sol";
import "../apis/IAssetClass.sol";
import "../apis/ISmartStrategy.sol";
import "../libraries/SafeCallSmartStrategy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

abstract contract AbstractStrategyAdmin is ISmartStrategyAdmin, Common, Ownable {
  using Clones for address;
  using SafeCallSmartStrategy for ISmartStrategy;

  // Total strategies created to date
  uint public totalStrategies;

  // Acount creation fee
  uint private creationFee;

  //Address to receive fee
  address private feeTo;

  // Token contract
  address public token;

  // Router contract address
  address public router;

  // Asset contract
  address public assetAdmin;

  //Implementation contract
  address public implementation;

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
   * mapping of implementation to strategies to bool
   */
  mapping(address => mapping(address => bool)) public upgraded;

  constructor (uint _alcCreationFee, address _feeTo,address _token,address _assetAdmin, ISmartStrategy _implementation) {
    feeTo = _feeTo;
    token = _token;
    assetAdmin = _assetAdmin;
    implementation = address(_implementation);
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
    require(IAssetClass(assetAdmin).isAssetSupported(asset),"NS");
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
    _createStrategy(creationFee, _msgSender());
    return true;
  }

  /**
   * @dev Create strategy - Internal
   * @param fee : Upgrade fee.
   * @param caller : msg.sender
   */
  function _createStrategy(uint256 fee, address caller)internal returns(address strategy) {
    require(msg.value >= fee, "AccountAdmin: Insufficient value");
    (bool done,) = feeTo.call{value: fee}("");
    if(!done) revert OperationFailed();
    if(router == address(0)) revert RouterNotSet();
    totalStrategies ++;
    strategy = implementation.cloneDeterministic(keccak256(abi.encodePacked(totalStrategies, caller)));
    _activateStrategy(caller, strategy);
    upgraded[implementation][strategy] = true;
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
   * If there are dormant strategy, user could safe some gas by selecting 
   * from the list instead of creating a new one.
   */
  function handpickStrategy(uint index) 
    external
    isStrategy(_msgSender(), false, "User's strategy exist")
    returns(bool) 
  {
    address caller = _msgSender();
    address strategy = _searchDormant(index, dormantStrategies.length);
    _activateStrategy(caller, strategy);
    ISmartStrategy(strategy).safeActivateStrategy(router);
    
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

  //Set new implementation address : onlyOwner
  function setImplementation(address newImplementation) public onlyOwner {
    if(newImplementation == address(0)) revert ZeroAddress(newImplementation);
    router = newImplementation;
  }

  /**@dev Upgrade to a new account.
   * We ensure that users are running a copy of the latest implementation.
   * Note: When upgraded[implementation][current.active] = true, it means 
   * there's no new implementation contract. Until the implementation address
   * is upgraded, upgrading strategy is not possible.
   */
  function rekeyStrategy(address _asset) 
    external
    isStrategy(_msgSender(), true, "Strategy not found")
    isSupportedAsset(_asset)
    returns(bool) 
  {
    address msgSender = _msgSender();
    address current = strategies[msgSender].active;
    if(upgraded[implementation][current]) revert UpgradeNotReady();
    upgraded[implementation][current] = true;
    address newStrategy = _createStrategy(creationFee/2, msgSender);
    _deactivateStrategy(msgSender, current);
    _activateStrategy(msgSender, newStrategy);
    ISmartStrategy(current).safeUpgrade(newStrategy, _asset);

    dormantStrategies.push(current);

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
   * @param account : EOA
   */
  function deactivateStrategy(address account) 
    public
    onlyOwner
    isStrategy(account, true, "User is deactivated")
  {
    Strategy memory alcs = strategies[account];
    if(alcs.deactivated == address(0)) revert NoStrategyFound();
    _deactivateStrategy(account, alcs.active);
  }

  function _deactivateStrategy(address account, address strategy) private {
    // if(alcs.active == address(0)) revert NoStrategyFound();
    // Strategy memory alcs = strategies[account];
    strategies[account] = Strategy(address(0), strategy);
  }

  ///@dev Activate strategy
  function activateStrategy(address account) 
    public
    onlyOwner
    isStrategy(account, false, "User already active")
  {
    Strategy memory alcs = strategies[account];
    if(alcs.deactivated == address(0)) revert NoStrategyFound();
    _activateStrategy(account, alcs.deactivated);
  }

  function _activateStrategy(address account, address strategy) private {
    strategies[account] = Strategy(strategy, address(0));
  }

}
