// SPDX-License-Identifier: MIT 

pragma solidity 0.8.24;

// import "hardhat/console.sol";
import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { ReentrancyGuard } from "@thirdweb-dev/contracts/external-deps/openzeppelin/security/ReentrancyGuard.sol";
import { SafeCallERC20, IERC20 } from "../../libraries/SafeCallERC20.sol";
import { IBank } from "../../apis/IBank.sol";
import { Common } from "../../apis/Common.sol";
import { OnlyOwner, IOwnerShip } from "../../abstracts/OnlyOwner.sol";

contract Bank is IBank, OnlyOwner, ReentrancyGuard {
    using SafeMath for uint;

    // Number of contributors currently operating this safe
    uint private userCount;

    // Total fee collected
    uint private aggregateFee;

    // Collateral token
    // IERC20 public collateralToken;

    // Fee Receiver
    address public feeTo;

    // Mapping of user to unitId to access
    mapping(address => mapping(uint => bool)) private access;

    // Mapping of users to unitId to Collateral
    mapping(address => mapping(uint => uint256)) private collateralBalances;

    ///@dev Only users with access role are allowed
    modifier hasAccess(address user, uint unitId) {
        if (!access[user][unitId]) revert Common.UserDoesNotHaveAccess();
        _;
    }

    /**
     * @dev Initializes state variables.
     * OnlyOwner function.
     */
    constructor(
        IOwnerShip _ownershipManager,
        address _feeTo
    ) OnlyOwner(_ownershipManager) {
        feeTo = _feeTo;
    }

    receive() external payable {
        (bool s, ) = feeTo.call{value: msg.value}("");
        require(s);
    }

    /**
     * @dev Registers new user
     * @param user New user

    */
    function _addUser(address user, uint rId) private {
        assert(!access[user][rId]);
        access[user][rId] = true;
    }

    /**
     * @dev Implementation of IBank.addUp
     * See IBank.addUp
     */
    function addUp(address user, uint rId) external onlyOwner returns (bool) {
        userCount++;
        _addUser(user, rId);
        return true;
    }

    /**
     * @dev UnLocks collateral balances
     * @param user Existing user

    */
    function _removeUser(address user, uint rId) private {
        assert(access[user][rId]);
        access[user][rId] = false;
    }

    /**
     * @dev Approve spender contributor 'to' to spend from contract's balance
     * @param to : Contributor
     * @param asset : Currency in use
     * @param amount : Value
     * @notice Consideration is given to the previous allowances given to users.
     */
    function _setAllowance(address to, address asset, uint256 amount) private {
        uint prev = IERC20(asset).allowance(address(this), to);
        IERC20(asset).approve(to, amount.add(prev));
    }

    /**
     * @dev End the current epoch
     * @param asset : AssetBase
     * @param cData : Contributors data
     */
    function _tryRoundUp(
        address asset,
        Common.Contributor[] memory cData
    ) internal {
        uint erc20Balances = IERC20(asset).balanceOf(address(this));
        uint fees = aggregateFee;
        if (erc20Balances > 0) {
            if (erc20Balances > fees && fees > 0) {
                erc20Balances -= fees;
                aggregateFee = 0;
                if (!IERC20(asset).transfer(feeTo, fees))
                    revert AssetTransferFailed();
            }
            if (erc20Balances > 0) {
                fees = erc20Balances.div(cData.length); // Reusing the fee memory slot
                for (uint i = 0; i < cData.length; i++) {
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
     * @param asset : Asset base
     * @param loan : Amount to receive as loan.
     * @param fee : Amount charged as platform fee
     * @param calculatedCol : Amount required to pay as collateral
     * @param rId : Record Id
     */
    function getFinance(
        address user,
        address asset,
        uint256 loan,
        uint fee,
        uint256 calculatedCol,
        uint rId
    ) external onlyOwner returns (uint) {
        assert(asset != address(0) && user != address(0));
        collateralBalances[user][rId] = calculatedCol;
        uint loanable = loan;
        if (fee > 0) {
            unchecked {
                aggregateFee += fee;
                if (loanable > fee) {
                    loanable -= fee;
                }
            }
        }
        _setAllowance(user, asset, loanable);
        return loan;
    }

    /**
     * @dev Pays back loan
     * @param _p : Parameters of type PaybackParam
     * _p.user : Current txn.origin not msg.sender
     * _p.asset : Asset base
     * _p.debt : Amount owing by user
     * _p.attestedInitialBal : Initial recorded balance of this contract before asset was transfered from the user.
     * _p.allGF : Whether all the contributors have get finance or not
     * _p.cData : Contributors data
     * _p.isSwapped : If isSwapped is true, meaning the actual contributor defaulted.
     * _p.defaulted : Address of the defaulted
     * _p.rId : Record Id. Every pool has a record Id i.e pool.bigInt.recordId
     */
    function payback(Common.Payback_Bank memory _p) external onlyOwner returns (bool) {
        uint col = collateralBalances[_p.user][_p.rId];
        if (_p.isSwapped) {
            col = collateralBalances[_p.defaulted][_p.rId];
            collateralBalances[_p.defaulted][_p.rId] = 0;
            _removeUser(_p.defaulted, _p.rId);
            _addUser(_p.user, _p.rId);
        }
        assert(
            IERC20(_p.asset).balanceOf(address(this)) >=
                (_p.attestedInitialBal + _p.debt)
        );
        _setAllowance(_p.user, address(_p.collateralToken), col);
        if (_p.allGF) _tryRoundUp(_p.asset, _p.cData);
        return true;
    }

    /**
     * Called when a contributor remove a pool
     * @param user : Contributor
     * @param asset : Asset base
     * @param unit : Unit contribution
     * @param rId : Record Id
     */
    function cancel(
        address user,
        address asset,
        uint unit,
        uint rId
    ) external onlyOwner returns (bool) {
        _setAllowance(user, asset, unit);
        _removeUser(user, rId);
        return true;
    }

    /**
     * @dev Returns Safe-related data
     */
    function getData() external view returns (ViewData memory) {
        return ViewData(userCount, aggregateFee);
    }

    /**
     * @dev Returns User-related data
     * @param user : Contributor
     * @param rId : Record Id
     */
    function getUserData(
        address user,
        uint rId
    ) external view returns (ViewUserData memory) {
        return ViewUserData(access[user][rId], collateralBalances[user][rId]);
    }

}



    // function withdrawFee(
    //     address recipient, 
    //     address asset
    // ) 
    //     external 
    //     nonReentrant 
    //     onlyOwner
    // {
    //     uint fees = aggregateFee;
    //     if(fees == 0) revert NoFeeToWithdraw();
    //     if(asset == address(0)) revert TokenAddressIsZero();
    //     aggregateFee = 0;
    //     IERC20(asset).transfer(recipient, fees);


    // }

        // assert(asset != address(0) && user != address(0));
        // Collateral memory col = collateralBalances[user][rId];
        // uint primaryBal = col.balance.add(msg.value);
        // if(calculatedCol <= primaryBal){
        //     col.withdrawable = col.withdrawable.add(primaryBal.sub(calculatedCol));
        // } else {
        // uint agBalance = col.balance.add(msg.value).add(col.withdrawable);
        // require(agBalance >= calculatedCol, "Aggregate balances is insufficient");
        // col.withdrawable = agBalance.sub(calculatedCol);
        // }
        // col.balance = calculatedCol;
        // collateralBalances[user][rId] = col;
        // primaryBal = loan;
        // if(fee > 0) {
        // unchecked {
        //     aggregateFee += fee;
        // }
        // if(loan > fee){
        //     unchecked {
        //     primaryBal -= fee;
        //     }
        // }

        // }
        // _setAllowance(user, asset, primaryBal);
        // return loan;

        // assert(IERC20(asset).balanceOf(address(this)) >= (attestedInitialBal + debt));
        // Collateral memory col = collateralBalances[user][rId];
        // if(isSwapped) {
        // col = collateralBalances[defaulted][rId];
        // delete collateralBalances[defaulted][rId];
        // collateralBalances[user][rId] = col; 
        // _removeUser(defaulted, rId);
        // _addUser(user, rId);

        // }
        // collateralBalances[user][rId] = Collateral(0, col.withdrawable.add(col.balance));
        // if(allGF) { _tryRoundUp(asset, cData); }


    // /**
    //  *  @dev Withdraw Collateral.
    //  * @param rId : Record Slot
    //  */
    // function withdrawCollateral(uint rId) 
    //     public 
    //     hasAccess(_msgSender(), rId)
    //     nonReentrant
    //     returns(bool) 
    // {
    //     address caller = _msgSender();
    //     Collateral memory col = collateralBalances[caller][rId];
    //     uint balances = address(this).balance;
    //     if(col.withdrawable == 0) revert ZeroWithdrawable();
    //     if(col.balance == 0){
    //     _removeUser(caller, rId);
    //     delete collateralBalances[caller][rId];
    //     } else {
    //     collateralBalances[caller][rId].withdrawable = 0;
    //     }
    //     require(balances >= col.withdrawable, "Balance Anomaly");
    //     payable(caller).transfer(col.withdrawable);
    //     return true;
    // }

    //     /**
    //  * @notice User can deposit collateral ahead of time
    //  * @param amount msg.value
    //  * @param rId : Record Slot
    //  */
    // function _depositCollateral(uint amount, uint rId) 
    //     internal
    //     hasAccess(_msgSender(), rId)
    // {
    //     unchecked {
    //     collateralBalances[_msgSender()][rId].withdrawable += amount;
    //     }
    // }



// // import "hardhat/console.sol";
// import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
// import { ReentrancyGuard } from "@thirdweb-dev/contracts/external-deps/openzeppelin/security/ReentrancyGuard.sol";
// import { SafeCallERC20, IERC20 } from "../../libraries/SafeCallERC20.sol";
// import { IBank } from "../../apis/IBank.sol";
// import { Common } from "../../apis/Common.sol";
// import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";

// contract Bank is IBank, OnlyOwner, ReentrancyGuard {
//   using SafeMath for uint;

//   // Number of contributors currently operating this safe
//   uint private userCount;

//   // Total fee generated from the contributors
//   uint private aggregateFee;

//   // Fee Receiver
//   address public feeTo;

//   // Collateral token
//   IERC20 public collateralToken;

//   // Mapping of unitId to addresses
//   mapping (uint => address[]) private usersLists;

//   // Mapping of user to unitId to access
//   mapping (address => mapping(uint => User)) private access;

//   // Mapping of users to unitId to Collateral
//   mapping (address => mapping(uint => uint256)) private collateralBalances;

//   ///@dev Only users with access role are permitted
//   modifier hasAccess(address user, uint unitId) {
//     if(!access[user][unitId]) revert AccessDenied();
//     _;
//   }

//   /**
//    * @dev Initializes state variables.
//    * OnlyOwner function.
//    */
//   constructor (
//     address _ownershipManager, 
//     address _feeTo,
//     IERC20 _collateralToken
//   ) OnlyOwner(_ownershipManager)  {
//     feeTo = _feeTo;
//     collateralToken = _collateralToken;
//   }

//   receive() external payable {
//     (bool s,) = ownershipManager.call{value: msg.value}('');
//     require(s);
//   }

//   /**
//    * @dev Registers new user
//    * @param user New user
//    * @param unitId : Unit Id
//    */
//   function _addNewUser(address user, uint unitId, Users memory usr) private {
//     access[user][unitId] = usr;
//     usersLists[unitId].push(user);
//   }

//   /**
//    * @dev Implementation of IBank.addUp
//    * See IBank.addUp
//   */
//   function addUp(address user, uint unitId) 
//     external
//     onlyOwner
//   {
//     userCount ++;
//     _addNewUser(user, unitId, Users(true, usersLists[unitId].length));
//   }

//   /**
//    * @dev Swap two addresses without incrementing userCount
//   */
//   function _swap(address oldUser, address newUser, uint unitId) 
//     internal
//   {
//     // _removeUser(oldUser, unitId);
//     Users memory usr = access[oldUser][unitId];
//     Users memory usr_new = access[newUser][unitId];
//     if(usr_new.hasAccess) {
//       access[oldUser][unitId] = usr_new;
//       usersLists[unitId][usr_new.index] = oldUser;
//     }
//     access[newUser][unitId] = usr;
//     usersLists[unitId][usr.index] = newUser;
//   }

//   /**
//    * @dev UnLocks collateral balances
//    * @param user Existing user
//    * @param unitId : Unit Id
//    */
//   function _removeUser(address user, uint unitId) private {
//     Users memory usr = access[user][unitId];
//     if(usr.hasAccess) {
//       access[user][unitId] = Users(false, 0);
//       usersLists[unitId][usr.index] = address(0);
//     }
//   }

//   /**
//    * @dev Approve spender contributor 'to' to spend from contract's balance
//    * @param to : Contributor
//    * @param asset : Currency in use
//    * @param amount : Value
//    * @notice Consideration is not given to the previous allowances given to users.
//    *          Users are expected to withdraw allowances immediately they complete 
//    *          related transactions such as 'getFinance'.
//    */
//   function _setAllowance(
//     address to, 
//     IERC20 asset, 
//     uint256 amount
//   ) 
//     private 
//   {
//     IERC20(asset).approve(to, amount);
//   }

//   /**
//    * @dev Complete a round if all the contributors have been financed 
//    * @param asset : Base asset used for contribution.
//    * @param unitId : Unit Id or pool Id
//    */
//   function _tryRoundUp(IERC20 asset, uint unitId) internal {
//     uint erc20Balances = IERC20(asset).balanceOf(address(this));
//     uint fees = aggregateFee;
//     if(erc20Balances > 0) {
//       if(erc20Balances > fees && fees > 0) {
//         erc20Balances -= fees;
//         aggregateFee = 0;
//         if(!IERC20(asset).transfer(feeTo, fees)) revert AssetTransferFailed();
//       }
//       address[] memory users = usersLists[unitId];
//       if(erc20Balances > 0) {
//         fees = erc20Balances.div(users.length); // Reusing the fee memory slot
//         for(uint i = 0; i < users.length; i++) {
//           address to = users[i].id;
//           _setAllowance(to, asset, fees);
//         }
//       }
//     }
//     userCount = 0;
//   }

//   /**
//    * @dev Get Finance - We send USD to user and accept collateral.
//    * @param user : Beneficiary.
//    * @param loan : Amount to receive as loan.
//    * @param asset : base asset
//    * @param fee : Fee collacted
//    * @param calculatedCol : Collateral amount user is expected to deposit
//    * @param unitId : Unit Id
//    */
//   function getFinance(
//     address oldUser, 
//     IERC20 asset, 
//     uint256 loan, 
//     uint fee, 
//     uint256 calculatedCol,
//     uint unitId,
//     bool swap,
//     address newUser
//   ) 
//     external 
//     onlyOwner
//     returns(uint) 
//   {
//     assert(address(asset) != address(0) && user != address(0));
//     address user = oldUser;
//     if(swap) {
//       user = newUser;
//       if(oldUser != newUser) _swap(oldUser, newUser, unitId);
//     };
//     IERC20 token = collateralToken;
//     collateralBalances[user][unitId] = calculatedCol;
//     uint loanable = loan;
//     if(fee > 0) {
//       unchecked {
//         aggregateFee += fee;
//       }
//       if(loan > fee){
//         unchecked {
//           loanable -= fee;
//         }
//       }

//     }
//     _setAllowance(user, asset, loanable);
//     return loan;
//   }

//   /**
//    * @dev Payback loan
//    * @param user : User. Not msg.sender
//    * @param asset : Base asset in use
//    * @param debt : amount owe as debt
//    * @param attestedInitialBal : Initial balance that was recorded before execution get to this point
//    * @param allGF : If all has get finance or not
//    * @param cData : Contributors array
//    * @param isSwapped : If the expected contributor defaults, and they're being liquidated, this flag becomes true
//    * @param defaulted : Defaulted account
//    * @param unitId : Unit Id
//    */
//   function payback(
//     address user, 
//     IERC20 asset, 
//     uint256 debt,
//     uint256 attestedInitialBal,
//     bool allGF, 
//     bool isSwapped,
//     address defaulted,
//     uint unitId
//   ) external onlyOwner{
//     uint col = collateralBalances[user][unitId];
//     if(isSwapped) {
//       col = collateralBalances[defaulted][unitId];
//       collateralBalances[defaulted][unitId] = 0;
//       _swap(defaulted, user, unitId);
//     }
//     assert(IERC20(asset).balanceOf(address(this)) >= (attestedInitialBal + debt));
//     _setAllowance(user, collateralToken, col);
//     if(allGF) _tryRoundUp(asset, unitId);
//   }

//   function cancel(
//     address user, 
//     IERC20 asset, 
//     uint unit,
//     uint unitId
//   ) external onlyOwner  {
//     _setAllowance(user, asset, unit);
//     _removeUser(user, unitId);
//   }

//   /**
//    * @dev Alternate way of withdrawing collateral balance if user forget to do so before this safe
//    * is transfered to a new set of contributors. It is advisable to withdraw collaterals before an epoch is 
//    * completed.
//    * @param poolId : Poolid or unitId
//    * @param asset : Asset that was in the pool 
//    */
//   function withdrawCollateralFromPool(uint poolId, IERC20 asset) public nonReentrant returns(bool) {
//     uint colBal = collateralBalances[_msgSender()][poolId];
//     require(colBal > 0, "Zero");
//     if(address(asset) == address(0)) revert InvalidIERC20Contract();
//     collateralBalances[user][poolId] = 0;
//     if(IERC20(collateralToken).balanceOf(address(this)) < colBal) revert InsufficientContractBalance();
//     _setAllowance(_msgSender(), asset, colBal);
//     return true;
//   }

//   function getData() external view returns(ViewData memory) {
//     return ViewData(userCount, aggregateFee);
//   }

//   function getUserData(address user, uint unitId) external view returns(ViewUserData memory) {
//     return ViewUserData(
//       access[user][unitId],
//       collateralBalances[user][unitId]
//     );
//   }

// }
