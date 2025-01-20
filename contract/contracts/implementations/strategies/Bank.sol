// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "hardhat/console.sol";
import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { ReentrancyGuard } from "@thirdweb-dev/contracts/external-deps/openzeppelin/security/ReentrancyGuard.sol";
import { SafeCallERC20, IERC20 } from "../../libraries/SafeCallERC20.sol";
import { IBank } from "../../apis/IBank.sol";
import { Common } from "../../apis/Common.sol";
import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";

// Stores and tracks total USD locked in an epoch
// When stage in: 
/**
 *  CREATE & JOIN: 
 *      - From Factory, we transfer USD to bank, then inform bank to keep track of it against the epoch.
 *      Ex. Bob and Alice joined an epoch with unit contribution of $2, quorum is 2, expected contribution will be $4 hence $4 is sent
 *      to Stretegy.
 *  GET-FINANCE:
 *      - Withdraw USD to the next contributor. i.e $4 is sent to a contributor.
 *      - Takes fee if applicable, and forward to 'feeReceiver'.
 *      - Retrieves collateral from the borrower (in XFI) to corresponding bank.
 *  PAYBACK:
 *      - Return USD (with interest) to bank. i.e Bob returned $4 plus interest accrued.
 *      - Forward collateral balance to the contributor.
 *      - If all the contributors have GF:
 *            - Divide total returns (i.e USD) in an epoch by number of contributors.
 *            - Set allowance to withdraw the result for each contributor.
*/
contract Bank is IBank, OnlyOwner, ReentrancyGuard {
  using SafeMath for uint;

  uint private clients;

  uint private aggregateFee;

  // Mapping of user to unitId to access
  mapping (address => mapping(uint => bool)) private access;

  // Mapping of users to unitId to Collateral
  mapping (address => mapping(uint => Collateral)) private collateralBalances;

  ///@dev Only users with access role are allowed
  modifier hasAccess(address user, uint unitId) {
    if(!access[user][unitId]) revert UserDoesNotHaveAccess();
    _;
  }

  /**
   * @dev Initializes state variables.
   * OnlyOwner function.
   */
  constructor (address _ownershipManager) OnlyOwner(_ownershipManager)  {}

  receive() external payable {
    revert('Please use the deposit() function');
  }

  /**
   * @dev Registers new user
   * @param user New user
   */
  function _registerClient(address user, uint rId) private {
    if(access[user][rId]) revert AlreadyACustomer(user);
    access[user][rId] = true;
  }

  /**
   * @dev Implementation of IBank.addUp
   * See IBank.addUp
  */
  function addUp(address user, uint rId) 
    external
    onlyOwner("Bank - addUp: Not permitted")
  {
    clients ++;
    _registerClient(user, rId);
  }

  /**
   * @dev UnLocks collateral balances
   * @param user Existing user
   */
  function _unRegisterClient(address user, uint rId) private {
    if(!access[user][rId]) revert NotACustomer(user);
    access[user][rId] = false;
  }

  /**
   * @dev Approve spender contributor 'to' to spend from contract's balance
   * @param to : Contributor
   * @param asset : Currency in use
   * @param amount : Value
   * @notice Consideration is not given to the previous allowances given to users.
   *          Users are expected to withdraw allowances immediately they complete 
   *          related transactions such as 'getFinance'.
   */
  function _setAllowance(
    address to, 
    address asset, 
    uint256 amount
  ) 
    private 
  {
    IERC20(asset).approve(to, amount);
  }

  function _tryRoundUp(address asset, Common.Contributor[] memory cData) internal {
    uint erc20bBalances = IERC20(asset).balanceOf(address(this));
    uint fees = aggregateFee;
    if(erc20bBalances > fees) {
      erc20bBalances -= fees;
      fees = erc20bBalances.div(cData.length);
      for(uint i = 0; i < cData.length; i++) {
        address user = cData[i].id;
        _setAllowance(user, asset, fees);
      }
    }
    clients = 0;
  }

  /**
   * @dev Get Finance - We send USD to user and accept collateral.
   * @param user : Beneficiary.
   * @param loan : Amount to receive as loan.
   */
  function borrow(
    address user, 
    address asset, 
    uint256 loan, 
    uint fee, 
    uint256 calculatedCol,
    uint rId
  ) 
    external 
    payable 
    onlyOwner("Bank: Not Permitted")
    returns(uint) 
  {
    assert(asset != address(0) && user != address(0));
    Collateral memory col = collateralBalances[user][rId];
    uint primaryBal = col.balance.add(msg.value);
    if(calculatedCol <= primaryBal){
      col.withdrawable = col.withdrawable.add(primaryBal.sub(calculatedCol));
    } else {
      uint agBalance = col.balance.add(msg.value).add(col.withdrawable);
      require(agBalance >= calculatedCol, "Aggregate balances is insufficient");
      col.withdrawable = agBalance.sub(calculatedCol);
    }
    col.balance = calculatedCol;
    collateralBalances[user][rId] = col;
    primaryBal = loan;
    if(fee > 0) {
      unchecked {
        aggregateFee += fee;
      }
      if(loan > fee){
        unchecked {
          primaryBal -= fee;
        }
      }

    }
    _setAllowance(user, asset, primaryBal);
    return loan;
  }

  function payback(
    address user, 
    address asset, 
    uint256 debt,
    uint256 attestedInitialBal,
    bool allGF, 
    Common.Contributor[] memory cData,
    bool isSwapped,
    address defaulted,
    uint rId
  ) external payable onlyOwner("Bank: Not Permitted"){
    assert(IERC20(asset).balanceOf(address(this)) >= (attestedInitialBal + debt));
    Collateral memory col = collateralBalances[user][rId];
    if(isSwapped) {
      col = collateralBalances[defaulted][rId];
      delete collateralBalances[defaulted][rId];
      collateralBalances[user][rId] = col; 
      _unRegisterClient(defaulted, rId);
      _registerClient(user, rId);

    }
    collateralBalances[user][rId] = Collateral(0, col.withdrawable.add(col.balance));
    if(allGF) { _tryRoundUp(asset, cData); }
  }

  /**
   *  @dev Withdraw Collateral.
   * @param rId : Record Slot
   */
  function withdrawCollateral(uint rId) 
    public 
    hasAccess(_msgSender(), rId)
    nonReentrant
    returns(bool) 
  {
    address caller = _msgSender();
    Collateral memory col = collateralBalances[caller][rId];
    uint balances = address(this).balance;
    if(col.withdrawable == 0) revert ZeroWithdrawable();
    if(col.balance == 0){
      _unRegisterClient(caller, rId);
      delete collateralBalances[caller][rId];
    } else {
      collateralBalances[caller][rId].withdrawable = 0;
    }
    require(balances >= col.withdrawable, "Balance Anomaly");
    payable(caller).transfer(col.withdrawable);
    return true;
  }

  function depositCollateral(uint rId) 
    external 
    payable 
    returns(bool)
  {
    _depositCollateral(msg.value, rId);
    return true;
  }

  /**
   * @notice User can deposit collateral ahead of time
   * @param amount msg.value
   * @param rId : Record Slot
   */
  function _depositCollateral(uint amount, uint rId) 
    internal
    hasAccess(_msgSender(), rId)
  {
    unchecked {
      collateralBalances[_msgSender()][rId].withdrawable += amount;
    }
  }

  function cancel(
    address user, 
    address asset, 
    uint erc20Balances,
    uint rId
  ) external onlyOwner("Bank: Not permitted")  {
    _setAllowance(user, asset, erc20Balances);
    _unRegisterClient(user, rId);
  }

  function withdrawFee(
    address recipient, 
    address asset
  ) 
    external 
    nonReentrant 
    onlyOwner("Bank: Not permitted") 
  {
    uint fees = aggregateFee;
    if(fees == 0) revert NoFeeToWithdraw();
    if(asset == address(0)) revert TokenAddressIsZero();
    aggregateFee = 0;
    IERC20(asset).transfer(recipient, fees);
  }

  function getData() external view returns(ViewData memory) {
    return ViewData(clients, aggregateFee);
  }

  function getUserData(address user, uint rId) external view returns(ViewUserData memory) {
    return ViewUserData(
      access[user][rId],
      collateralBalances[user][rId]
    );
  }

}