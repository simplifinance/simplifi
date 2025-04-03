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

    // Mapping of user to record Id to access
    mapping(address => mapping(uint => bool)) private access;

    // Mapping of users to unitId to Collateral
    mapping(address => mapping(uint => uint256)) private collateralBalances;

    ///@dev Only users with access role are allowed
    modifier hasAccess(address user, uint rId) {
        if (!access[user][rId]) revert Common.UserDoesNotHaveAccess();
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
        unchecked {
            userCount++;
        }
        _addUser(user, rId);
        return true;
    }

    /**
     * @dev UnLocks collateral balances
     * @param user Existing user

    */
    function _removeUser(address user, uint rId) private {
        assert(access[user][rId]);
        if(userCount > 0) {
            userCount--;
        }
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
    ) external hasAccess(user, rId) onlyOwner returns (uint) {
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
    function payback(Common.Payback_Bank memory _p) 
        external 
        onlyOwner 
        hasAccess(_p.isSwapped? _p.defaulted : _p.user, _p.rId) 
        returns (bool) 
    {
        uint col = collateralBalances[_p.user][_p.rId];
        if (_p.isSwapped) {
            col = collateralBalances[_p.defaulted][_p.rId];
            collateralBalances[_p.defaulted][_p.rId] = 0;
            _removeUser(_p.defaulted, _p.rId);
        } else {
            _removeUser(_p.user, _p.rId);
        }
        collateralBalances[_p.user][_p.rId] = 0;
        
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
    ) external onlyOwner hasAccess(user, rId) returns (bool) {
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
