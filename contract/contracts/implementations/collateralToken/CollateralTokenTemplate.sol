// // SPDX-License-Identifier: MIT

// pragma solidity 0.8.24;

// import { ERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
// import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";
// import { Utils } from "../../libraries/Utils.sol";

// interface ICollateralTokenTemplate{
//   error OnlyOwnerPermitted();
//   error AccountFrozen();
//   error BalanceIsZero();

//   struct TemplateInfo {
//     uint price;
//     uint amount;
//     bool frozen;
//   }

//   struct NetworkData {
//     uint256 totalPairedInCirculation;
//     uint networkStakePercent;
//     // uint256 totalCollateralInNetwork;
//     uint currentPrice;
//   }

//   function mint(address to, uint256 amount, uint amountPaid) external;
// }

// contract CollateralTokenTemplate is ICollateralTokenTemplate, OnlyOwner, ERC20 {
//   using SafeMath for uint;
//   using Utils for uint;

//   NetworkData public networkData;

//   // Asset paired to collateral token. i.e Base asset used for contribution
//   IERC20 public immutable pair;

//   // Account to control and manage the different tokens i.e CollateralTokenManager.
//   address public manager;

//   // Restrictions
//   mapping(address => TemplateInfo) public templates;

//   // Account should not be frozen
//   modifier isNotFrozen(address target) {
//     if(templates[target].frozen) revert AccountFrozen();
//     _;
//   }
//   modifier onlyCreator {
//     if(_msgSender() != manager) revert OnlyOwnerPermitted();
//     _;
//   }

//   constructor(
//     string memory tokenName, 
//     string memory tokenSymbol,
//     IERC20 _pair,
//     address _ownershipManager
//   ) ERC20(tokenName, tokenSymbol) OnlyOwner(_ownershipManager) {
//     require(address(_pair) != address(0), "_pair arg is zero address");
//     pair = _pair;
//     manager = _msgSender();
//     networkData.networkStakePercent = 50; // 0.5% See Utils.sol
//   }

//   /**
//    * @dev Calculate networkStake amount
//    * @param amount : Principal
//    */
//   function _calculateNetworkStake(uint amount, uint16 stakePercent) internal view returns(uint result){
//     result = amount._getPercentage(stakePercent);
//   }

//   /**
//    * @dev Mint token to an address
//    * @param to : Accoun to receive token
//    * @param amount : Amount to mint
//    * @param amountPaid : Total amount paid to mint the token 'amount'
//    */
//   function mint(address to, uint256 amount, uint collateral) external onlyCreator {
//     NetworkData memory nData = networkData;
//     uint emission = _calculateNetworkStake(collateral, uint16(nData.networkStakePercent));
//     unchecked {
//       nData.totalPairedInCirculation += (collateral - emission);
//       // nData.totalCollateralInNetwork += collateral;
//     }
//     // uint sTokenRelease = nData.totalCollateralInNetwork.sub(nData.totalPairedInCirculation);
//     nData.currentPrice = 
//     templates[to].amount += amount;
//     templates[to].;
//     _mint(to, amount);

//     // Pool A
//     // e.g 500 amountPaid
//     // interest 0.2% = 1 network stake
//     // totalPairedInCirculation = 0 + (500 - 500 * 0.2/100) = 499
//     // amountMintedInSToken = 500 - 499 = 1
//     // lastPrice = 1 * 499 = 499

//     // Pool B
//     // Alice amountPaid = 300
//     // interest 0.2% = 1 network stake
//     // totalPairedInCirculation =  499 + (500 - 500 * 0.2/100) = 998
//     // amountMintedInSToken = 500 - 499 = 1
//     // lastPrice = 1 * 499 = 499 
//     // amountMintedInSToken = 2
//     // lastPrice = 998 

//     // If A pull out, 
//     // lastprice = 499


//   }

//   /**
//    * @dev Refer to Openzeppelin ERC20.sol for doc
//    */
//   function _update(
//     address from, 
//     address to, 
//     uint256 value
//   ) internal override isNotFrozen(from) {
//     _update(from, to, value);
//   }

//   // /**
//   //  * @dev Restricts 'target' from transfering token
//   //  * @param target : Account to restrict.
//   //  */
//   // function _freeze(address target) internal {
//   //   frozen[target] = true;
//   // }

//   /**
//    * @dev Unban 'target' from transfering token
//    * @param target : Account to unban.
//    */
//   function _unfreeze(address target) internal {
//     templates[target].frozen = false;
//   }

//   /**
//    * @dev Holders can convert their holdings to the base/paired currency
//    */
//   function redeem() public isNotFrozen(_msgSender()) returns(bool) {
//     address caller = _msgSender();
//     uint bal = balanceOf(caller);
//     if(bal == 0) revert BalanceIsZero();
//     _burn(caller, bal);

//     return true;
//   }

//   /**
//    * @dev Sets network stake rate. NetworkStakePercent is a minimal amount levied on collaterals to support and build the network.
//    * Instead of charging a network fee on loaned amount, we use this method in order to build a custom exchange and price for our
//    * native token which is the fuel that powers the network.
//    * @notice 
//    *    Raw rate must be multiply by 100 to get the expected value i.e if rate is 0.1%, it should be parsed as 0.1 * 100 = 10.
//    */
//   funciton setNetworkStakePercent(uint16 newPercent) public onlyOwner {
//     networkStakePercent = newPercent;
//   }

// }