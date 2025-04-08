// SPDX-License-Identifier: MIT 

pragma solidity 0.8.24;

import { ReentrancyGuard } from "@thirdweb-dev/contracts/external-deps/openzeppelin/security/ReentrancyGuard.sol";
import { SafeCallERC20, IERC20 } from "../../libraries/SafeCallERC20.sol";
import { ISafe } from "../../apis/ISafe.sol";
import { Common } from "../../apis/Common.sol";
import { OnlyRoleBase, IRoleBase } from "../../peripherals/OnlyRoleBase.sol";

contract Safe is ISafe, OnlyRoleBase, ReentrancyGuard {
    // Number of contributors currently operating this safe
    uint private userCount;

    // Total fee collected
    uint private aggregateFee;

    // Fee Receiver
    address public immutable feeTo;

    // Mapping of user to record Id to access
    mapping(address => mapping(uint => bool)) private access;

    // Mapping of users to recordId to Collateral
    mapping(address => mapping(uint => uint256)) private collateralBalances;

    ///@dev Only users with access role are allowed
    modifier hasAccess(address user, uint recordId) {
        if (!access[user][recordId]) revert Common.UserDoesNotHaveAccess();
        _;
    }

    /** ========== Constructor ===============
     * @param _roleManager : RoleBase manager contract
     * @param _feeTo : Fee receiver account
     */
    constructor(
        IOwnerShip _roleManager,
        address _feeTo
    ) OnlyRoleBase(_roleManager) {
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
    function _addUser(address user, uint recordId) private {
        assert(!access[user][recordId]);
        access[user][recordId] = true;
    }

    /**
     * @dev Implementation of ISafe.addUp
     * See ISafe.addUp
     */
    function addUp(address user, uint recordId) external onlyRoleBearer returns (bool) {
        unchecked {
            userCount++;
        }
        _addUser(user, recordId);
        return true;
    }

    /**
     * @dev UnLocks collateral balances
     * @param user Existing user

    */
    function _removeUser(address user, uint recordId) private {
        assert(access[user][recordId]);
        if(userCount > 0) {
            unchecked {
                userCount--;
            }
        }
        access[user][recordId] = false;
    }

    /**
     * @dev Approve spender contributor 'to' to spend from contract's balance
     * @param to : Contributor
     * @param asset : Currency in use
     * @param amount : Value
     * @notice Consideration is given to the previous allowances given to users.
     */
    function _setAllowance(address to, IERC20 asset, uint256 amount) private {
        uint prev = IERC20(asset).allowance(address(this), to);
        unchecked {
            IERC20(asset).approve(to, amount + prev);
        }
    }

    /**
     * @dev End the current epoch
     * @param asset : AssetBase
     * @param cData : Contributors data
     */
    function _tryRoundUp(
        IERC20 asset,
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
     * @param recordId : Record Id
     */
    function getFinance(
        address user,
        IERC20 baseAsset,
        uint256 loan,
        uint fee,
        uint256 calculatedCol,
        uint recordId
    ) external hasAccess(user, recordId) onlyRoleBearer returns (bool) {
        assert(address(baseAsset) != address(0) && user != address(0));
        collateralBalances[user][recordId] = calculatedCol;
        uint loanable = loan;
        if (fee > 0) {
            unchecked {
                aggregateFee += fee;
                if (loanable > fee) {
                    loanable -= fee;
                }
            }
        }
        _setAllowance(user, baseAsset, loanable);
        return true;
    }

    /**
     * @dev Pays back loan
     * @param _p : Parameters of type PaybackParam
     * _p.user : Current txn.origin not msg.sender
     * _p.baseAsset : Asset base
     * _p.debt : Amount owing by user
     * _p.attestedInitialBal : Initial recorded balance of this contract before asset was transfered from the user.
     * _p.allGF : Whether all the contributors have get finance or not
     * _p.cData : Contributors data
     * _p.isSwapped : If isSwapped is true, meaning the actual contributor defaulted.
     * _p.defaulted : Address of the defaulted
     * _p.collaterAsset: Asset used as collateral
     * _p.recordId : Record Id. Every pool has a record Id i.e pool.bigInt.recordId
     */
    function payback(Common.Payback_Safe memory _p) 
        external 
        onlyRoleBearer 
        hasAccess(_p.isSwapped? _p.defaulted : _p.user, _p.recordId) 
        returns (bool) 
    {
        uint col = collateralBalances[_p.user][_p.recordId];
        if (_p.isSwapped) {
            col = collateralBalances[_p.defaulted][_p.recordId];
            collateralBalances[_p.defaulted][_p.recordId] = 0;
            _removeUser(_p.defaulted, _p.recordId);
        } else {
            _removeUser(_p.user, _p.recordId);
        }
        collateralBalances[_p.user][_p.recordId] = 0;
        
        assert(
            IERC20(_p.baseAsset).balanceOf(address(this)) >=
                (_p.attestedInitialBal + _p.debt)
        );
        _setAllowance(_p.user, _p.collateralAsset, col);
        if (_p.allGF) _tryRoundUp(_p.asset, _p.cData);
        return true;
    }

    /**
     * Called when a contributor remove a pool
     * @param user : Contributor
     * @param baseAsset : Asset base
     * @param unit : Unit contribution
     * @param recordId : Record Id
     */
    function cancel(
        address user,
        IERC20 baseAsset,
        uint unit,
        uint recordId
    ) external onlyRoleBearer hasAccess(user, recordId) returns (bool) {
        _setAllowance(user, baseAsset, unit);
        _removeUser(user, recordId);
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
     * @param recordId : Record Id
     */
    function getUserData(
        address user,
        uint recordId
    ) external view returns (ViewUserData memory) {
        return ViewUserData(access[user][recordId], collateralBalances[user][recordId]);
    }

}
