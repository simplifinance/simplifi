// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

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
import { Analytics } from "./Analytics.sol";
import { RatesAndFeeTo } from "./RatesAndFeeTo.sol";

contract CreatePool is 
    Pools, 
    Safe, 
    Point, 
    TokensInUse, 
    Contributor, 
    Analytics,
    RatesAndFeeTo
{
    using Utils for *;

    constructor(
        IERC20 _collateralToken,
        IERC20 _supportedAsset,
        IOwnerShip _ownershipMgr,
        address _feeTo,
        uint16 _makeRate
    ) 
        Safe(_ownershipMgr)
        TokensInUse(_supportedAsset, _ownershipMgr, _collateralToken)
        RatesAndFeeTo(_ownershipMgr, _makerRate, _feeTo)
    {}

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
        Bank safe = _getSafe(unit, feeTo, collateralToken);
        _checkAndWithdrawToken(asset, unit, users[0], address(this), address(safe));

        unchecked {
            _setPool(
                Common.Pool(
                    Common.Addresses(users[0], address(0), asset),
                    Common.LowInt(quorum, colCoverage, durationInHours * 1 hours, Common.Status.TAKEN, router, Common.Stage.JOIN),
                    Common.BigInt(unit, unit, _generateRecordId(), _generateCurrentId()),
                    (unit * quorum).computeInterestsBasedOnDuration(intRate, uint24(durationInHours))
                ),
                unit,
                Common.UnitStatus.CURRENT
            );
        }
        for(uint i = 0; i < users.length; i++) {
            _updateContributor(users, unit, users[i] == users[0], safe);
        }
        _createAnalytics(unit, 0, true, isPermissionless, true, false);
        emit PoolCreated(_getPool(unit, Common.UnitStatus.RECORD));
    }

    /**
     * @dev Update contributor's storage data
     * @param addrs : A list of contributors account
     * @param unit : Unit contributor
     * @param isAdmin : Whether user is the creator or not
     */
    function _updateContributor(
        address addr, 
        uint256 unit,
        bool isAdmin,
        Bank safe
    ) internal {
        if(isAdmin) _setPoint(addr, 0, 2);
        _addContributor(unit, Common.Contributor(true, 0, 0, 0, 0, 0, 0, addr, true));
        _incrementUserCount(unit);
        safe.addUp(addr, unit);
    }

    /**
     * @dev Add contributor to pool
     * @param unit : Unit contribution
     */
    function joinAPool(uint256 unit) public isValidUnitContribution(unit) returns(bool) {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        Common.Contributor memory _c = _getProfile(_msgSender(), unit);
        if(_p.lInt.stage != Common.Stage.JOIN) revert AddingUserEnded();
        if(_c.isMember) revert AlreadyAMemeber();
        Bank safe = _checkAndCreateSafe(unit, feeTo, collateralToken);
        _checkAndWithdrawToken(_p.addrs.asset, unit, _msgSender(), address(this), address(safe));

        if(_p.lInt.router == Common.Router.PERMISSIONLESS) require(!_c.isMember, "User exist");
        else require(_c.isMember && !_c.sentQuota, "Already sent quota");
        unchecked {
            _p.bigInt.currentPool += unit;
        }
        _updateContributor(_msgSender(), unit, false, safe);
        _setPool(_p, unit, Common.UnitStatus.CURRENT);
        if(_getUserCount(unit) == _p.lInt.quorum) {
            _p.lInt.stage = Common.Stage.GET;
            _resetUserCount(unit);
            _setTurnTime(_p.admin, unit, Utils._now());
        }
        _createAnalytics(unit, 0, false, false, true, false);
        emit NewContributorAdded(_getPool(unit, Common.UnitStatus.CURRENT));
        return true;
    }

    /**
     * @dev Pay back loan
     * @param unit : Unit contribution
     * @param contributor : Contributor
     */
    function _payback(
        uint256 unit, 
        address contributor,
        bool isSwapped,
        address defaulter
    ) internal {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        Common.Contributor memory _c = _getProfile(contributor, unit);
        if(_p.lInt.stage != Common.Stage.PAYBACK) revert PaybackModeNotActivated();
        uint debt = _getCurrentDebt(unit, contributor);
        if(debt == 0) revert NoDebtFound();
        _c.loan = 0;
        Bank safe = _checkAndCreateSafe(unit, address(0), _p.addrs.asset);
        uint256 attestedInitialBal = IERC20(_p.addrs.asset).balanceOf(address(safe));
        _checkAndWithdrawToken(_p.addrs.asset, debt, contributor, address(this), address(safe));
        bool allGF = _getUserCount(unit) == _p.lInt.quorum;
        if(!allGF){
            unchecked {
                _p.bigInt.currentPool = _p.bigInt.unit * _p.lInt.quorum;
            }
            _p.lInt.stage = Common.Stage.GET;
            _setTurnTime(address(0), unit, Utils._now());
            _setPool(_p, unit, Common.UnitStatus.CURRENT);
        } else {
            _p.lInt.stage = Common.Stage.ENDED;
            _shufflePool(unit, _p);
        }
        safe.payback(contributor,  _p.addrs.asset,  debt, attestedInitialBal, allGF,  isSwapped, defaulter, _p.bigInt.unitId);
        _addContributor(unit, _c);
    }

    /**
        @dev Removes a pool i.e Newly created pool with only one contributor.
        The creator of a pool can cancel it only if no one has join the pool.
        @param self : Storage
        @param unit : Unit contribution.
        @param isPermissionLess : Whether pool is public or not.

        @notice : Setting the quorum to 0 is an indication that a pool was removed.
    */
    function removeLiquidity(uint unit) 
        external
        returns(bool)
    {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        address creator = _msgSender();
        if(creator != _p.addr.admin) revert OnlyCreatorIsAllowed();

        if(_p.lInt.router == Common.Router.PERMISSIONLESS) {
        if(_getUserCount(unit) > 1) revert CancellationNotAllowed();
        } else {
        if(_p.bigInt.currentPool > _p.bigInt.unit) revert CancellationNotAllowed();
        }
        _p.stage = Common.FuncTag.CANCELED;
        _shufflePool(unit, _p);
        Bank safe = _checkAndCreateSafe(unit, address(0), collateralToken);
        safe.cancel(creator, _p.addrs.asset, unit, _p.bigInt.unitId);

        emit Cancellation(unit);
    }

    /**
     * @dev Return struct object with data if current beneficiary has defaulted otherwise an empty struct is returned.
     * @param unit: Unit contribution
     */
    function _enquireLiquidation(uint256 unit) internal view 
        returns (Common.Contributor memory _liq, bool defaulted, uint currentDebt, uint slot, address defaulter) 
    {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        Common.Contributor memory _c = _getProfile(_p.addrs.beneficiary, unit);
        
        (_liq, defaulted, currentDebt, slot, defaulter)
        = 
            Utils._now() <= _c.paybackTime? 
            (_liq, false, uint256(0), 0, address(0)) 
                : 
                ( prof, true, _getCurrentDebt(unit, _c.id), _getSlot(_c.id, unit), _c.id);
    }

    /**
     * @dev Check if the last beneficiary has defaulted in payment
     */
    function enquireLiquidation(uint256 unit) external view returns (Common.Contributor memory, bool, uint, uint, address) {
        return _enquireLiquidation(unit);
    }

    function getFactoryData()
        public
        view
        returns(Common.ViewFactoryData memory)
    {
        return Common.ViewFactoryData(
            analytics, 
            currentPools, 
            pastRecords
        );
    }

}
