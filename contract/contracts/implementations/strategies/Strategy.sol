// pragma solidity 0.8.24;

// import { SafeCallERC20, IERC20 } from "../../libraries/SafeCallERC20.sol";
// import { ITrustee } from "../../apis/ITrustee.sol";
// import { ISmartStrategyAdmin } from "../../apis/ISmartStrategyAdmin.sol";
// import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

// contract Trustee is ITrustee, Ownable {
//   using SafeCallERC20 for IERC20;

//   error InvalidAddress(address);
//   error NotABeneficiary(address);
//   error NotPermitted();
//   error OnlyDev();

//   /**
//    * @dev Storage for beneficiary data
//    */
//   struct Beneficiary {
//     uint size;
//     uint256 claimable;
//     address asset;
//     mapping(address => bool) isStrategy;
//   }

//   /// Total fee generated to date.
//   uint256 private accumulatedFee;

//   address public feeTo;

//   /**
//    * @dev Strategy Admin
//    */
//   ISmartStrategyAdmin public strategyAdmin;

//   /**
//    * @dev Beneficiaries
//    */
//   mapping(uint => Beneficiary) private beneficiaries;

//   address public router;
  
//   modifier isBeneficiary(uint epochId) {
//     address strategy = _getStrategy(_msgSender());
//     if(!beneficiaries[epochId].isStrategy[strategy]) {
//       revert NotABeneficiary(strategy);
//     }
//     _;
//   }

//   /**
//    * @dev NotPermitted function
//    */
//   modifier onlyRouter {
//     address _routers = router;
//     address caller = _msgSender();
//     require(_routers != address(0), "Router not set");
//     require(caller == _routers, "NA");
//     _;
//   }

//   receive() external payable {
//     if(_getStrategy(_msgSender()) == address(0)) {
//       (bool _s,) = feeTo.call{value: msg.value}("");
//       require(_s);
//     }
//   }

//   /**
//    * @dev Initializes state variables.
//    * OnlyOwner function.
//    */
//   constructor () Ownable(_msgSender()) {}
  
//   /**
//    * @dev Get strategy
//   */
//   function _getStrategy(address target) internal view returns(address) {
//     return ISmartStrategyAdmin(strategyAdmin).getStrategy(target);
//   }

//   function setAddresses(address _router, ISmartStrategyAdmin _strategyAdmin, address _feeTo) public onlyOwner {
//     router = _router; 
//     feeTo = _feeTo;
//     if(address(_strategyAdmin) != address(0)) strategyAdmin = _strategyAdmin;
//   }

//   /**
//    * @dev Registers beneficiaries.
//    * OnlyOwner function
//    */
//   function registerBeneficiaries(
//     address[] memory strategies,
//     uint256 amount, 
//     uint epochId,
//     address asset
//   ) external onlyRouter returns(bool){
//     uint size = strategies.length;
//     beneficiaries[epochId].claimable = amount;
//     beneficiaries[epochId].asset = asset;
//     beneficiaries[epochId].size = size;
    
//     for(uint8 i = 0; i < size; i++) {
//       beneficiaries[epochId].isStrategy[strategies[i]] = true;
//     }

//     return true;
//   }

//   /**
//    * @dev Transfer asset to strategy.
//    * Function is called when a participant want to get finance or a 
//    * band is cancelled.
//    * @param asset: Asset to transfer. This function is agnostic to any 
//    * ERC20 standard asset.
//    * @param strategy: Recipient.
//    * @param amount : Value to transfer.
//    */
//   function transferOut(
//     address asset, 
//     address strategy, 
//     uint256 amount,
//     uint fee
//   ) external onlyRouter returns(bool) {
//     if(fee > 0) {
//       unchecked {
//         accumulatedFee += fee;
//       }
//       _transfer(feeTo, asset, fee);
//     }
//     _transfer(strategy, asset, amount);
//     return true;
//   }

//   /**
//    * @dev Accumulated Withdraw fee
//    * OnlyOwner function.
//    */
//   function withdrawFee(address asset, address to) public onlyOwner {
//     uint _fee = accumulatedFee;
//     require(_fee > 0, "Nothing to withdraw");
//     accumulatedFee = 0;

//    _transfer(to, asset, _fee);
//   }

//   function _transfer(address to, address asset, uint256 amount) private {
//     IERC20(asset).safeTransfer(to, amount);
//   }

//   /**
//    * @dev Check if user have funds to claim
//    */
//   function claimable(uint epochId) public view override  returns(uint256) {
//     return beneficiaries[epochId].claimable;
//   }

//   function claimContribution(uint epochId) public payable override isBeneficiary(epochId) returns(bool) {
//     address strategy = _getStrategy(_msgSender());
//     beneficiaries[epochId].isStrategy[strategy] = false;
//     beneficiaries[epochId].size --;
//     address asset = beneficiaries[epochId].asset;
//     uint256 amount = beneficiaries[epochId].claimable;
//     if(beneficiaries[epochId].size == 0) beneficiaries[epochId].claimable = 0;
//     require(IERC20(asset).transfer(strategy, amount), "Transfer failed");

//     return true;
//   }

//   /**
//    * @dev Reads accumulated fee
//    */
//   function getAccumulatedFee() public view onlyOwner returns(uint256) {
//     return accumulatedFee;
//   }
// }




// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SafeCallERC20, IERC20 } from "../../libraries/SafeCallERC20.sol";
import { IStrategy } from "../../apis/IStrategy.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Strategy is IStrategy, Ownable, ReentrancyGuard {
  // using SafeCallERC20 for IERC20;

  struct Member {
    uint withdrawable;
    address user;
    bool hasClaim;
  }

  /**
   * @dev Mapping of epochId to Members
   * Supplying a epochId will return the list of members for that specific
   * pool. 
   * @notice Each pool id must be unique to one another. There should not be 
   * 2 identical pool ids.
   */
  mapping(uint => mapping (address => Member)) private members;

  /**
   * @dev mapping of epoch Id to assets.
   * Each epoch might use different asset as constribution base i.e
   * A band creator might want to contribute in USDT while another 
   * might choose USDC. The base point is that any asset in use must
   * conform to ERC20 standard.
   */
  mapping (uint => address) public assets;

  /// Total fee generated to date.
  // uint256 private accumulatedFee;

  // address public feeTo;

  /**
   * @dev Strategy Admin
   */
  // ISmartStrategyAdmin public strategyAdmin;

  /**
   * @dev Beneficiaries
   */
  // mapping(uint => Beneficiary) private beneficiaries;

  // address public router;
  
  // modifier isBeneficiary(uint epochId) {
  //   // address strategy = _getStrategy(_msgSender());
  //   if(!beneficiaries[epochId].isStrategy[strategy]) {
  //     revert NotABeneficiary(strategy);
  //   }
  //   _;
  // }

  // /**
  //  * @dev NotPermitted function
  //  */
  // modifier onlyRouter {
  //   address _routers = router;
  //   address caller = _msgSender();
  //   require(_routers != address(0), "Router not set");
  //   require(caller == _routers, "NA");
  //   _;
  // }

  receive() external payable onlyOwner {}
    // if(_getStrategy(_msgSender()) == address(0)) {
    //   (bool _s,) = feeTo.call{value: msg.value}("");
    //   require(_s);
    // }
  // }

  /**
   * @dev Initializes state variables.
   * OnlyOwner function.
   */
  constructor (address factory) Ownable(factory) {}
  
  function activateMember(uint epochId, address user, address assetInUse) external onlyOwner returns(bool) {
    assets[epochId] = assetInUse;
    members[epochId][user] = Member({
      user: user,
      withdrawable: 0,
      hasClaim: false
    });
    return true;
  }
  // /**
  //  * @dev Get strategy
  // */
  // function _getStrategy(address target) internal view returns(address) {
  //   return ISmartStrategyAdmin(strategyAdmin).getStrategy(target);
  // }

  // function setAddresses(address _router, ISmartStrategyAdmin _strategyAdmin, address _feeTo) public onlyOwner {
  //   router = _router; 
  //   feeTo = _feeTo;
  //   if(address(_strategyAdmin) != address(0)) strategyAdmin = _strategyAdmin;
  // }

  // /**
  //  * @dev Registers beneficiaries.
  //  * OnlyOwner function
  //  */
  // function registerBeneficiaries(
  //   address[] memory strategies,
  //   uint256 amount, 
  //   uint epochId,
  //   address asset
  // ) external onlyRouter returns(bool){
  //   uint size = strategies.length;
  //   beneficiaries[epochId].claimable = amount;
  //   beneficiaries[epochId].asset = asset;
  //   beneficiaries[epochId].size = size;
    
  //   for(uint8 i = 0; i < size; i++) {
  //     beneficiaries[epochId].isStrategy[strategies[i]] = true;
  //   }

  //   return true;
  // }

  // /**
  //  * @dev Transfer asset to strategy.
  //  * Function is called when a participant want to get finance or a 
  //  * band is cancelled.
  //  * @param asset: Asset to transfer. This function is agnostic to any 
  //  * ERC20 standard asset.
  //  * @param strategy: Recipient.
  //  * @param amount : Value to transfer.
  //  */
  // function transferOut(
  //   address asset, 
  //   address strategy, 
  //   uint256 amount,
  //   uint fee
  // ) external onlyRouter returns(bool) {
  //   if(fee > 0) {
  //     unchecked {
  //       accumulatedFee += fee;
  //     }
  //     _transfer(feeTo, asset, fee);
  //   }
  //   _transfer(strategy, asset, amount);
  //   return true;
  // }

  // /**
  //  * @dev Accumulated Withdraw fee
  //  * OnlyOwner function.
  //  */
  // function withdrawFee(address asset, address to) public onlyOwner {
  //   uint _fee = accumulatedFee;
  //   require(_fee > 0, "Nothing to withdraw");
  //   accumulatedFee = 0;

  //  _transfer(to, asset, _fee);
  // }

  function _transfer(address to, address asset, uint256 amount) private {
    require(IERC20(asset).transfer(to, amount), "Transfer failed");
  }

  /**
   * @dev Members of bands registered in this strategy can enquire if they 
   * have claims.
   */
  function claimable(uint epochId) external view  returns(uint256) {
    return members[epochId][_msgSender()].withdrawable;
  }

  function claim(uint epochId) 
    external 
    nonReentrant 
    returns(bool) 
  {
    address sender = _msgSender();
    Member memory _m = members[epochId][sender];
    address assetInUse = assets[epochId];
    require(_m.hasClaim, "No claim");
    if(IERC20(assetInUse).balanceOf(address(this)) < _m.withdrawable) {
      revert ContractBalanceTooLow();
    }
    members[epochId][sender] = Member({user: sender, hasClaim: false, withdrawable: 0});
    _transfer(sender, assetInUse, _m.withdrawable);
    return true;
  }

  // function claimContribution(uint epochId) public payable override isBeneficiary(epochId) returns(bool) {
  //   address strategy = _getStrategy(_msgSender());
  //   beneficiaries[epochId].isStrategy[strategy] = false;
  //   beneficiaries[epochId].size --;
  //   address asset = beneficiaries[epochId].asset;
  //   uint256 amount = beneficiaries[epochId].claimable;
  //   if(beneficiaries[epochId].size == 0) beneficiaries[epochId].claimable = 0;
  //   require(IERC20(asset).transfer(strategy, amount), "Transfer failed");

  //   return true;
  // }

  // /**
  //  * @dev Reads accumulated fee
  //  */
  // function getAccumulatedFee() public view onlyOwner returns(uint256) {
  //   return accumulatedFee;
  // }
}