// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../../apis/Common.sol";
import { ISmartStrategyAdmin } from "../../apis/ISmartStrategyAdmin.sol";
import { ISmartStrategy } from "../../apis/ISmartStrategy.sol";
import { SafeCallSmartStrategy } from "../../libraries/SafeCallSmartStrategy.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";
import { AbstractStrategyAdmin } from "../../abstracts/AbstractStrategyAdmin.sol";

/**@title SmartStrategyAdmin: A standalone contract that manages account creation, 
   deletion, including read and write data.

   Author: Simplify
 */
contract StrategyAdmin is StrategyAdminAbstract {

  constructor (
    uint _alcCreationFee,
    address _feeTo,
    address _token,
    address _assetAdmin, 
    ISmartStrategy _implementation
  ) StrategyAdminAbstract(_alcCreationFee, _feeTo, _token, _assetAdmin, _implementation) {}


  receive() external payable {}
  
  /**@dev Strategy owner withdraw from strategy.
    Only ERC20 withdrawal is allowed.
   */
  function withdraw(uint amount, address asset) public isSupportedAsset(asset) {
    address caller = _msgSender();
    if(_hasStrategy(caller)) {
      require(ISmartStrategy(_getStrategy(caller)).withdrawAsset(asset, caller, amount), "Withdrawal failed");
    } else {
      revert("No strategy");
    }
  }

  /// Returns smart wallet for 'user'
  /// @param user : User Address
  function getStrategy(address user) external view returns(address) { 
    return _getStrategy(account);
  }
}


// safeCloseTo(
//     ISmartStrategy strategy,
//     address account
//   )