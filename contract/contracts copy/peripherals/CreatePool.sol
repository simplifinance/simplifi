// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// import { Agent } from "./Agent.sol";
import { Pools } from "./Pools.sol";
import { Safe } from "./Safe.sol";
import { Contributor } from "./Contributor.sol";
import { Common } from "../apis/Common.sol";
import { IOwnerShip } from "../apis/IOwnerShip.sol";
import { IERC20 } from "../apis/IERC20.sol";
import { TokensInUse } from "./TokensInUse.sol";
import { Point } from "./Point.sol";
import { Utils } from "../libraries/Utils.sol";
import { Bank } from "../implementations/strategies/Bank.sol";

contract CreatePool is Pools, Safe, Point, TokensInUse, Contributor {
    // using SafeMath for uint256;
    using Utils for *;

    // Fee receiver
    address public feeTo;

    constructor(
        IERC20 _collateralToken,
        IERC20 _supportedAsset,
        IOwnerShip _ownershipMgr,
        address _feeTo
    ) 
        TokensInUse(_supportedAsset, _ownershipMgr, _collateralToken)
    {
        feeTo = _feeTo;
    }

    /**
     * @dev Create a new pool : Permissioned or Permissionless
     * @param asset : Asset to use. It should be a supported asset
     * @param users : Users. If Router is Permissioned, list is expected to minimum 2
     * @param unit : Unit contribution
     * @param quorum : Number of participants expected to participate
     * @param intRate : Rate of interest that should be charged
     * @param durationInHours : Number of hours each contributor will have the possession of funds before they return it to the pool
     * @param colCoverage : Collateral index coverage. Collateral determinant for contributors to borrow.
                            This is expressed as a multiplier index in the total loanable amount.
     * @param router : Flat of type Router to determined the type of pool to create. It could be Permissioned or Permissionless
     * @notice We removed collateral coverage check so as to enable more flexible tuning and customization. Example: Bob, Alice and Kate agreed
   *            to operate a flexpool of unit $100 at zero collateral index. So Bob creates a flexpool of $100 setting quorum to maximum 3 participants.
   *            He set colCoverage to 0. If particapant A wants to get finance, they will be required to provide (collateralCalculor * 0) which is 0
   *            in order to get finance.
     */
    function _createPool(
        IERC20 asset, 
        address[] memory users, 
        uint256 unit,
        uint8 quorum,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        Common.Router router
    ) internal onlySupportedAsset(asset) {
        bool isPermissionless = router == Common.Router.PERMISSIONLESS;
        if(isPermissionless) {
            if(quorum <= 1) revert MinimumParticipantIsTwo();
        } else {
            if(users.length < 2) revert MinimumParticipantIsTwo();
        }
        if(_getPool(unit, Common.UnitStatus.RECORD).lInt.status == Common.Status.TAKEN) revert PoolIsTaken();
        if(colCoverage < 100) revert CollaterlCoverageTooLow();
        if(durationInHours == 0 || durationInHours > 720) revert DurationExceed720HoursOrIsZero();      
        Bank safe = _checkAndCreateSafe(unit, feeTo, collateralToken);
        _checkAndWithdrawToken(asset, unit, users[0], address(this), address(safe));
        safe.addUp(users[0], unit);

        unchecked {
            _setPool(
                Common.Pool(
                    users[0],
                    address(0),
                    Common.LowInt(quorum, colCoverage, durationInHours * 1 hours, Common.Status.TAKEN, router, Common.Stage.JOIN),
                    Common.BigInt(unit, unit, _generateRecordId(), _generateCurrentId()),
                    (unit * quorum).computeInterestsBasedOnDuration(intRate, uint24(durationInHours))
                ),
                unit,
                Common.UnitStatus.CURRENT
            );
        }
        _updateContributor(users, unit);
    }

    /**
     * @dev Update contributor's storage data
     * @param addrs : A list of contributors account
     * @param unit : Unit contributor
     */
    function _updateContributor(
        address[] memory addrs, 
        uint256 unit
    ) internal {
        uint size = addrs.length;
        for(uint i = 0; i < size; i++) {
            address addr = addrs[i];
            bool isAdmin = addr == addrs[0];
            if(isAdmin) _setPoint(addr, 0, 2);
            _addContributor(unit, Common.Contributor(true, 0, 0, 0, 0, addr, true));
            _incrementUserCount(unit);
        }
    }

    /**
     * @dev Add contributor to pool
     * @param unit : Unit contribution
     */
    function addUserToPool(uint256 unit) public returns(bool) {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        Common.Contributor memory _c = _getProfile(_msgSender(), unit);
        _updateContributor(_msgSender(), unit, address(0));
        unchecked {
            _p.bigInt.currentPool += unit;
        }
        if(_p.lInt.stage != Common.Stage.JOIN) revert AddingUserEnded();
        if(_msgSender().length > 1) revert UserArrayExceedOne();
        if(IERC20(_getToken()).balanceOf(_getSafe(unit).id) < _p.bigInt.currentPool) revert TokenBalanceInSafeNotTally();
        if(_p.lInt.router == Common.Router.PERMISSIONLESS) require(!_c.isMember, "User exist");
        else require(_c.isMember && !_c.sentQuota, "Already sent quota");
        _incrementUserCount(unit);
        _addContributor(unit, Common.Contributor(true, 0, 0, 0, 0, _msgSender(), true));
        if(_getUserCount(unit) == _p.lInt.quorum) {
            _p.lInt.stage = Common.Stage.GET;
            _resetUserCount(unit);
            _setTurnTime(_p.admin, unit, Utils._now());
            // _p.beneficiary = _p.admin;
        }
        _setPool(_p, unit, Common.UnitStatus.CURRENT);

        return true;
    }

    function setToken(IERC20 newToken) public onlyOwner {
        _replaceToken(newToken);
    }
    
}



        // bytes32 ownerHash = _updateContributor(users, unit, users[0]);
        // if(_getSafe(unit).id == address(0)) {
        //     if(newSafe == address(0)) revert InvalidSafe();
        //     require(IERC20(_getToken()).balanceOf(newSafe) >= unit, "Low Liq");
        //     _setSafe(Common.Safe(newSafe, ownerHash), unit); 
        // }