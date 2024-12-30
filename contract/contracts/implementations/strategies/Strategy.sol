// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { SafeCallERC20, IERC20 } from "../../libraries/SafeCallERC20.sol";
import { IStrategy } from "../../apis/IStrategy.sol";
import { Common } from "../../apis/Common.sol";
import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";

contract Strategy is IStrategy, OnlyOwner {
  using SafeMath for uint;

  /**
   * @dev Approvals in native coin i.e XFI 
   * mapping of providera to balances.
   */
  mapping(address => mapping (uint => uint)) private nativeApprovals;

  /**
   * @dev mapping of epoch Id to assets.
   * Each epoch might use different asset as constribution base i.e
   * A band creator might want to contribute in USDT while another 
   * might choose USDC. The base point is that any asset in use must
   * conform to ERC20 standard.
   */
  mapping (uint => address) public assets;

  /**
   * @notice Mapping of epoches to list of contributors.
   */
  mapping (uint => address[]) public contributors;

  /**
   * @notice Every loan repayment is recorded here
   * Mapping of epochId to credit balances.
   * Using this method to track amortization records will enables us 
   * to properly account for loans and interests payments from all 
   * contributors in an epoch. 
   */
  mapping (uint => uint) public credits;

  /**
   * @dev Initializes state variables.
   * OnlyOwner function.
   */
  constructor (address _ownershipManager) OnlyOwner(_ownershipManager)  {}

  receive() external payable onlyOwner("Strategy: Not received - Not permitted") {}

  /**
   * @dev Implementation of IStrategy.addUp
   * See IStrategy.addUp for doc
  */
  function addUp(
    address user,
    uint epochId
  ) 
    external
    onlyOwner("Strategy - addUp: Not permitted")
    returns(bool)
  {
    contributors[epochId].push(user);
    return true;
  }

  /**
   * @dev Implementation of IStrategy.mapAsset
   * See IStrategy.mapAsset for doc
   */
  function mapAsset(
    uint epochId, 
    address assetInUse
  ) 
    external
    onlyOwner("Strategy - mapAsset: Not permitted")
    returns(bool) 
  {
    assets[epochId] = assetInUse;
    return true;
  }

  /**
   * @notice Return outstanding allowance
   * @param asset : Asset in use
   * @param user : provider
   */
  function _prevAllowance(
    address asset, 
    address user
  ) 
    internal 
    view returns(uint allowance) 
  {
    allowance = IERC20(asset).allowance(address(this), user);
  }
  
  /**
   * @dev Implementation of IStrategy.setClaim
   * See IStrategy.setClaim for doc.
   * @notice 'credit' should only be set if borrower is returning the borrowed fund.
  */ 
  function setClaim(
    uint claim,
    uint fee,
    uint credit,
    uint epochId,
    address user,
    address feeTo, 
    bool allHasGF,
    Common.TransactionType txType
  ) 
    external
    payable
    onlyOwner("Strategy - setClaim: Not permitted")
    returns(uint actualClaim)
  {
    address asset = assets[epochId];
    if(txType == Common.TransactionType.ERC20) {
      actualClaim = claim > fee? claim - fee : claim;
      _setAllowance(user, asset, actualClaim);
      if(fee > 0) {
        IERC20(asset).transfer(feeTo, fee);
      }
    } else {
      nativeApprovals[user][epochId] += claim;
      if(allHasGF) {
        _roundUp(epochId, assets[epochId]);
      }
      if(credit > 0) credits[epochId] += credit;
    }
    return actualClaim;
  }

  /**
   * @notice Closes the current epoch and set claims for all contributors 
   *          of this epoch.
   * @param epochId : Epoch Id.
   * @param asset : Asset in use
   */
  function _roundUp(
    uint epochId,
    address asset
  ) 
    private 
  {
    uint credit = credits[epochId];
    address[] memory providers = contributors[epochId];
    credits[epochId] = credit.sub(credit);
    uint size = providers.length;
    if(credit < size) revert InsufficientCredit(credit, size);
    uint allowance = credit.sub(size);
    for(uint i = 0; i < size; i++){
      _setAllowance(providers[i], asset, allowance);
    }
  }

  /**
   * @dev Approve spender contributor 'to' to spend from contract's balance
   * @param to : Contributor
   * @param asset : Currency in use
   * @param amount : Value
   */
  function _setAllowance(
    address to, 
    address asset, 
    uint256 amount
  ) 
    private 
  {
    uint prevAllow = _prevAllowance(asset, to);
    IERC20(asset).approve(to, prevAllow > 0? amount + prevAllow : amount);
  }

  /**
   *  @dev Withdraw Native coin. 
   */
  function withdraw(
    uint epochId,
    address user
  ) 
    external 
    onlyOwner("Strategy: Not Permitted")
    returns(bool) 
  {
    uint balance = nativeApprovals[user][epochId];
    nativeApprovals[user][epochId] = 0;
    require(balance > 0, "No claim");
    if(address(this).balance == 0) {
      revert InsufficientNativeBalanceInContract(address(this).balance);
    }
    payable(user).transfer(balance);
    // (bool sent,) = sender.call{value: balance}("");
    // require(sent,"Op failed");
    return true;
  }

  /**
   * @dev Swaps addresses. Only during liquidation. We attemp to replace
   *  the defaulted party with the liquidated.
   * @param epochId : EpochId.
   * @param newProv : New address.
   * @param oldProv : Old address.
   */
  function swapProvider(
    uint epochId, 
    address newProv, 
    address oldProv
  ) 
    external 
    onlyOwner("Strategy - swapProvider: Not permitted")
    returns(bool success) 
  {
    address[] memory addrs = contributors[epochId]; 
    uint slot;
    for(uint i = 0; i < addrs.length; i++) {
      if(addrs[i] == oldProv) {
        slot = i;
        success = true;
      }
    }
    if(success) {
      contributors[epochId][slot] = newProv;
    }
    return success;
  }

}