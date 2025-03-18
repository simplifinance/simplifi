// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "hardhat/console.sol";
import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { ReentrancyGuard } from "@thirdweb-dev/contracts/external-deps/openzeppelin/security/ReentrancyGuard.sol";
import { SafeCallERC20, IERC20 } from "../../libraries/SafeCallERC20.sol";
import { IBank } from "../../apis/IBank.sol";
import { Common } from "../../apis/Common.sol";
import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";

contract Bank is IBank, OnlyOwner, ReentrancyGuard {
  using SafeMath for uint;

  // Number of contributors currently operating this safe
  uint private userCount;

  // Total fee generated from the contributors
  uint private aggregateFee;

  // Fee Receiver
  address public feeTo;

  // Collateral token
  IERC20 public collateralToken;

  // Mapping of user to unitId to access
  mapping (address => mapping(uint => bool)) private access;

  // Mapping of users to unitId to Collateral
  mapping (address => mapping(uint => uint256)) private collateralBalances;

  ///@dev Only users with access role are permitted
  modifier hasAccess(address user, uint unitId) {
    if(!access[user][unitId]) revert AccessDenied();
    _;
  }

  /**
   * @dev Initializes state variables.
   * OnlyOwner function.
   */
  constructor (
    address _ownershipManager, 
    address _feeTo,
    IERC20 _collateralToken
  ) OnlyOwner(_ownershipManager)  {
    feeTo = _feeTo;
    collateralToken = _collateralToken;
  }

  receive() external payable {
    (bool s,) = ownershipManager.call{value: msg.value}('');
    require(s);
  }

  /**
   * @dev Registers new user
   * @param user New user
   * @param unitId : Unit Id
   */
  function _addNewUser(address user, uint unitId) private {
    assert(!access[user][unitId]);
    access[user][unitId] = true;
  }

  /**
   * @dev Implementation of IBank.addUp
   * See IBank.addUp
  */
  function addUp(address user, uint unitId) 
    external
    onlyOwner
  {
    userCount ++;
    _addNewUser(user, unitId);
  }

  /**
   * @dev UnLocks collateral balances
   * @param user Existing user
   * @param unitId : Unit Id
   */
  function _removeUser(address user, uint unitId) private {
    if(!access[user][unitId]) revert NotACustomer(user);
    access[user][unitId] = false;
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
    IERC20 asset, 
    uint256 amount
  ) 
    private 
  {
    IERC20(asset).approve(to, amount);
  }

  /**
   * @dev Complete a round if all the contributors have been financed 
   * @param asset : Base asset used for contribution.
   * @param cData : Array of Contributors
   */
  function _tryRoundUp(IERC20 asset, Common.Contributor[] memory cData) internal {
    uint erc20Balances = IERC20(asset).balanceOf(address(this));
    uint fees = aggregateFee;
    if(erc20Balances > 0) {
      if(erc20Balances > fees && fees > 0) {
        erc20Balances -= fees;
        aggregateFee = 0;
        IERC20(asset).transfer(feeTo, fees);
      }
      if(erc20Balances > 0) {
        fees = erc20Balances.div(cData.length); // Reusing the fee memory slot
        for(uint i = 0; i < cData.length; i++) {
          address to = cData[i].id;
          _setAllowance(to, asset, fees);
        }
      }
    }
    userCount = 0;
  }

  /**
   * @dev Get Finance - We send USD to user and accept collateral.
   * @param user : Beneficiary.
   * @param loan : Amount to receive as loan.
   * @param asset : base asset
   * @param fee : Fee collacted
   * @param calculatedCol : Collateral amount user is expected to deposit
   * @param unitId : Unit Id
   */
  function borrow(
    address user, 
    IERC20 asset, 
    uint256 loan, 
    uint fee, 
    uint256 calculatedCol,
    uint unitId
  ) 
    external 
    onlyOwner
    returns(uint) 
  {
    assert(address(asset) != address(0) && user != address(0));
    // uint256 memory col = collateralBalances[user][unitId];
    IERC20 token = collateralToken;
    uint expectedCol = IERC20(token).allowance(user, address(this));
    if(expectedCol < calculatedCol) revert InsufficientAllowance();
    collateralBalances[user][unitId] = calculatedCol;
    if(!IERC20(token).transferFrom(user, address(this), calculatedCol)) revert TranferingCollateralFailed();
    uint loanable = loan;
    if(fee > 0) {
      unchecked {
        aggregateFee += fee;
      }
      if(loan > fee){
        unchecked {
          loanable -= fee;
        }
      }

    }
    _setAllowance(user, asset, loanable);
    return loan;
  }

  /**
   * @dev Payback loan
   * @param user : User. Not msg.sender
   * @param asset : Base asset in use
   * @param debt : amount owe as debt
   * @param attestedInitialBal : Initial balance that was recorded before execution get to this point
   * @param allGF : If all has get finance or not
   * @param cData : Contributors array
   * @param isSwapped : If the expected contributor defaults, and they're being liquidated, this flag becomes true
   * @param defaulted : Defaulted account
   * @param unitId : Unit Id
   */
  function payback(
    address user, 
    IERC20 asset, 
    uint256 debt,
    uint256 attestedInitialBal,
    bool allGF, 
    Common.Contributor[] memory cData,
    bool isSwapped,
    address defaulted,
    uint unitId
  ) external onlyOwner{
    assert(IERC20(asset).balanceOf(address(this)) >= (attestedInitialBal + debt));
    uint col = collateralBalances[user][unitId];
    if(isSwapped) {
      col = collateralBalances[defaulted][unitId];
      collateralBalances[defaulted][unitId] = 0;
      // collateralBalances[user][unitId] = col; 
      _removeUser(defaulted, unitId);
      if(!access[user][unitId]) _addNewUser(user, unitId);

    }
    _setAllowance(user, collateralToken, col);
    if(allGF) _tryRoundUp(asset, cData);
  }

  function cancel(
    address user, 
    IERC20 asset, 
    uint erc20Balances,
    uint unitId
  ) external onlyOwner  {
    _setAllowance(user, asset, erc20Balances);
    _removeUser(user, unitId);
  }

  function getData() external view returns(ViewData memory) {
    return ViewData(userCount, aggregateFee);
  }

  function getUserData(address user, uint unitId) external view returns(ViewUserData memory) {
    return ViewUserData(
      access[user][unitId],
      collateralBalances[user][unitId]
    );
  }

}
