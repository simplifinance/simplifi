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

    // Total fee generated from the contributors
    uint private aggregateFee;

    // Fee Receiver
    address public feeTo;

    // Collateral token
    IERC20 public collateralToken;

    // Mapping of unitId to addresses
    mapping(uint256 => Common.Contributor[]) private usersLists;

    // Mapping of user to unitId to access
    mapping(address => mapping(uint => User)) private access;

    // Mapping of users to unitId to Collateral
    mapping(address => mapping(uint => uint256)) private collateralBalances;

    ///@dev Only users with access role are permitted
    modifier hasAccess(address user, uint unitId) {
        if (!access[user][unitId].hasAccess) revert AccessDenied();
        _;
    }

    /**
     * @dev Initializes state variables.
     * OnlyOwner function.
     */
    constructor(
        IOwnerShip _ownershipManager,
        address _feeTo,
        IERC20 _collateralToken
    ) OnlyOwner(_ownershipManager) {
        feeTo = _feeTo;
        collateralToken = _collateralToken;
    }

    receive() external payable {
        (bool s, ) = address(ownershipManager).call{value: msg.value}("");
        require(s);
    }

    /**
     * @dev Registers new user
     * @param user New user
     * @param unitId : Unit Id
     */
    function _addNewUser(Common.Contributor memory user, uint unitId, User memory usr) private {
        access[user.id][unitId] = usr;
        usersLists[unitId].push(user);
    } 

    /**
     * @dev Implementation of IBank.addUp
     * See IBank.addUp
     */
    function addUp(Common.Contributor memory user, uint unitId) external onlyOwner {
        // userCount ++;
        _addNewUser(user, unitId, User(true, usersLists[unitId].length));
    }

    /**
     * @dev Swap two addresses without incrementing userCount
     */
    function _swap(Common.Contributor memory oldUser, Common.Contributor memory newUser, uint unitId) internal {
        // _removeUser(oldUser, unitId);
        User memory usr = access[oldUser.id][unitId];
        User memory usr_new = access[newUser.id][unitId];
        if (usr_new.hasAccess) {
            access[oldUser.id][unitId] = usr_new;
            usersLists[unitId][usr_new.index] = oldUser;
        }
        access[newUser.id][unitId] = usr;
        usersLists[unitId][usr.index] = newUser;
    }

    /**
     * @dev UnLocks collateral balances
     * @param user Existing user
     * @param unitId : Unit Id
     */
    function _removeUser(address user, uint unitId) private {
        User memory usr = access[user][unitId];
        Common.Contributor memory empty;
        if (usr.hasAccess) {
            access[user][unitId] = User(false, 0);
            usersLists[unitId][usr.index] = empty;
        }
    }

    /**
     * @dev Approve spender contributor 'to' to spend from contract's balance
     * @param to : Contributor
     * @param asset : Currency in use
     * @param amount : Value
     * @notice Consideration is not given to the previous allowances given to users.
     *          User are expected to withdraw allowances immediately they complete
     *          related transactions such as 'getFinance'.
     */
    function _setAllowance(address to, IERC20 asset, uint256 amount) private {
        uint prev = IERC20(asset).allowance(address(this), to);
        unchecked {
            IERC20(asset).approve(to, amount + prev);
        }
    }

    /**
     * @dev Complete a round if all the contributors have been financed
     * @param asset : Base asset used for contribution.
     * @param unitId : Unit Id or pool Id
     */
    function _tryRoundUp(IERC20 asset, uint unitId) internal {
        uint erc20Balances = IERC20(asset).balanceOf(address(this));
        uint fees = aggregateFee;
        if (erc20Balances > 0) {
            if (erc20Balances > fees && fees > 0) {
                erc20Balances -= fees;
                aggregateFee = 0;
                if (!IERC20(asset).transfer(feeTo, fees))
                    revert AssetTransferFailed();
            }
            Common.Contributor[] memory users = usersLists[unitId];
            if (erc20Balances > 0) {
                fees = erc20Balances.div(users.length); // Reusing the fee memory slot
                for (uint i = 0; i < users.length; i++) {
                    address to = users[i].id;
                    access[to][unitId] = User(false, 0);
                    _setAllowance(to, asset, fees);
                }
            }
        }
        // userCount = 0;
    }

    /**
     * @dev Get Finance - We send USD to user and accept collateral.
     * @param oldUser : Beneficiary.
     * @param loan : Amount to receive as loan.
     * @param asset : base asset
     * @param fee : Fee collacted
     * @param calculatedCol : Collateral amount user is expected to deposit
     * @param unitId : Unit Id
     * @param swap : Whether users were swapped or not
     * @param newUser : New account that replaced the old one if there was swap
     */
    function getFinance(
        Common.Contributor memory oldUser,
        IERC20 asset,
        uint256 loan,
        uint fee,
        uint256 calculatedCol,
        uint unitId,
        bool swap,
        Common.Contributor memory newUser
    ) external onlyOwner returns (uint) {
        assert(address(asset) != address(0) && oldUser.id != address(0));
        Common.Contributor memory user = oldUser;
        if (swap) {
            user = newUser;
            if (oldUser.id != newUser.id) _swap(oldUser, newUser, unitId);
        }
        collateralBalances[user.id][unitId] = calculatedCol;
        uint loanable = loan;
        if (fee > 0) {
            unchecked {
                aggregateFee += fee;
            }
            if (loan > fee) {
                unchecked {
                    loanable -= fee;
                }
            }
        }
        _setAllowance(user.id, asset, loanable);
        return loan;
    }

    /**
     * @dev Payback loan
     * @param user : User. Not msg.sender
     * @param asset : Base asset in use
     * @param debt : amount owe as debt
     * @param attestedInitialBal : Initial balance that was recorded before execution get to this point
     * @param allGF : If all has get finance or not
     * @param isSwapped : If the expected contributor defaults, and they're being liquidated, this flag becomes true
     * @param defaulted : Defaulted account
     * @param unitId : Unit Id
     */
    function payback(
        Common.Contributor memory user,
        IERC20 asset,
        uint256 debt,
        uint256 attestedInitialBal,
        bool allGF,
        bool isSwapped,
        Common.Contributor memory defaulted,
        uint unitId
    ) external onlyOwner {
        uint col = collateralBalances[user.id][unitId];
        if (isSwapped) {
            col = collateralBalances[defaulted.id][unitId];
            collateralBalances[defaulted.id][unitId] = 0;
            _swap(defaulted, user, unitId);
        }
        assert(
            IERC20(asset).balanceOf(address(this)) >=
                (attestedInitialBal + debt)
        );
        _setAllowance(user.id, collateralToken, col);
        if (allGF) _tryRoundUp(asset, unitId);
    }

    function cancel(
        address user,
        IERC20 asset,
        uint unit,
        uint unitId
    ) external onlyOwner {
        _setAllowance(user, asset, unit);
        _removeUser(user, unitId);
    }

    /**
     * @dev Alternate way of withdrawing collateral balance if user forget to do so before this safe
     * is transfered to a new set of contributors. It is advisable to withdraw collaterals before an epoch is
     * completed.
     * @param poolId : Poolid or unitId
     * @param asset : Asset that was in the pool
     */
    function withdrawCollateralFromPool(
        uint poolId,
        IERC20 asset
    ) public nonReentrant returns (bool) {
        uint colBal = collateralBalances[_msgSender()][poolId];
        require(colBal > 0, "Zero");
        if (address(asset) == address(0)) revert InvalidIERC20Contract();
        collateralBalances[_msgSender()][poolId] = 0;
        if (IERC20(collateralToken).balanceOf(address(this)) < colBal)
            revert InsufficientContractBalance();
        _setAllowance(_msgSender(), asset, colBal);
        return true;
    }

    function getData(uint unitId) external view returns (ViewData memory) {
        return ViewData(usersLists[unitId].length, aggregateFee);
    }

    function getUserData(
        address user,
        uint unitId
    ) external view returns (ViewUserData memory) {
        return
            ViewUserData(
                access[user][unitId].hasAccess,
                collateralBalances[user][unitId]
            );
    }

    function getContributors(uint unitId) external view returns(Common.Contributor[] memory){
        return usersLists[unitId];
    }

} 
