// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SafeCallERC20 } from "../../libraries/SafeCallERC20.sol";
import { ITrustee } from "../../apis/ITrustee.sol";
import { ISmartStrategyAdmin } from "../../apis/ISmartStrategyAdmin.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Trustee is 
  ITrustee,
  Ownable,
{
  using SafeCallERC20 for IERC20;

  error InvalidAddress(address);
  error NotABeneficiary(address);
  error OnlyRouter();
  error OnlyDev();

  /**
   * @dev Storage for beneficiary data
   */
  struct Beneficiary {
    uint size;
    uint256 claimable;
    address asset;
    mapping(address => bool) isStrategy;
  }

  /// Total fee generated to date.
  uint256 private accumulatedFee;

  address public feeTo;

  /**
   * @dev Strategy Admin
   */
  ISmartStrategyAdmin public strategyAdmin;

  /**
   * @dev Beneficiaries
   */
  mapping(uint => Beneficiary) private beneficiaries;

  address public router;
  
  modifier isBeneficiary(uint poolId) {
    address strategy = _getStrategy(_msgSender());
    if(!beneficiaries[poolId].isStrategy[strategy]) {
      revert NotABeneficiary(strategy);
    }
    _;
  }

  /**
   * @dev OnlyRouter function
   */
  modifier onlyRouter {
    address _routers = router;
    address caller = _msgSender();
    require(_routers != address(0), "Router not set");
    require(caller == _routers, "NA");
    _;
  }

  receive() external payable {
    if(_getStrategy(_msgSender()) == address(0)) {
      (bool _s,) = feeTo.call{value: msg.value}("");
      require(_s);
    }
  }

  /**
   * @dev Initializes state variables.
   * OnlyOwner function.
   */
  constructor () Ownable(_msgSender()) {}
  
  function __Trustee_init_unchained() internal initializer {}

  /**
   * @dev Get strategy
  */
  function _getStrategy(address target) internal view returns(address) {
    return ISmartStrategyAdmin(strategyAdmin).getStrategy(target);
  }

  function setAddresses(address _router, ISmartStrategyAdmin _strategyAdmin, address _feeTo) public onlyOwner {
    router = _router; 
    feeTo = _feeTo;
    if(address(_strategyAdmin) != address(0)) strategyAdmin = _strategyAdmin;
  }

  /**
   * @dev Registers beneficiaries.
   * OnlyOwner function
   */
  function registerBeneficiaries(
    address[] memory strategies,
    uint256 amount, 
    uint poolId,
    address asset
  ) external onlyRouter returns(bool){
    uint size = strategies.length;
    beneficiaries[poolId].claimable = amount;
    beneficiaries[poolId].asset = asset;
    beneficiaries[poolId].size = size;
    
    for(uint8 i = 0; i < size; i++) {
      beneficiaries[poolId].isStrategy[strategies[i]] = true;
    }

    return true;
  }

  /**
   * @dev Transfer asset to strategy.
   * Function is called when a participant want to get finance or a 
   * band is cancelled.
   * @param asset: Asset to transfer. This function is agnostic to any 
   * ERC20 standard asset.
   * @param strategy: Recipient.
   * @param amount : Value to transfer.
   */
  function transferOut(
    address asset, 
    address strategy, 
    uint256 amount,
    uint fee
  ) external onlyRouter returns(bool) {
    if(fee > 0) {
      unchecked {
        accumulatedFee += fee;
      }
      _transfer(feeTo, asset, fee);
    }
    _transfer(strategy, asset, amount);
    return true;
  }

  /**
   * @dev Accumulated Withdraw fee
   * OnlyOwner function.
   */
  function withdrawFee(address asset, address to) public onlyOwner {
    uint _fee = accumulatedFee;
    require(_fee > 0, "Nothing to withdraw");
    accumulatedFee = 0;

   _transfer(to, asset, _fee);
  }

  function _transfer(address to, address asset, uint256 amount) private {
    IERC20(asset).safeTransfer(to, amount);
  }

  /**
   * @dev Check if user have funds to claim
   */
  function claimable(uint poolId) public view override  returns(uint256) {
    return beneficiaries[poolId].claimable;
  }

  function claimContribution(uint poolId) public payable override isBeneficiary(poolId) returns(bool) {
    address strategy = _getStrategy(_msgSender());
    beneficiaries[poolId].isStrategy[strategy] = false;
    beneficiaries[poolId].size --;
    address asset = beneficiaries[poolId].asset;
    uint256 amount = beneficiaries[poolId].claimable;
    if(beneficiaries[poolId].size == 0) beneficiaries[poolId].claimable = 0;
    require(IERC20(asset).transfer(strategy, amount), "Transfer failed");

    return true;
  }

  /**
   * @dev Reads accumulated fee
   */
  function getAccumulatedFee() public view onlyOwner returns(uint256) {
    return accumulatedFee;
  }
}