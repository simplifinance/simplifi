// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Contributor, IOwnerShip, Common, IERC20, Utils } from "./Contributor.sol";
import { Bank } from "../implementations/strategies/Bank.sol";

abstract contract CreatePool is Contributor {
    using Utils for *;

    constructor(
        IERC20 _collateralToken,
        IERC20 _supportedAsset,
        IOwnerShip _ownershipMgr,
        address _feeTo,
        uint16 _makerRate
    ) 
        Contributor(_collateralToken, _supportedAsset, _ownershipMgr, _feeTo, _makerRate)
    {}

//     /**
//      * @dev Create a new pool : Permissioned or Permissionless
//      * @param asset : Asset to use. It should be a supported asset
//      * @param users : Users. If Router is Permissioned, list is expected to minimum 2
//      * @param unit : Unit contribution
//      * @param quorum : Number of participants expected to participate
//      * @param intRate : Rate of interest that should be charged
//      * @param durationInHours : Number of hours each contributor will have the possession of funds before they return it to the pool
//      * @param colCoverage : Collateral index coverage. Collateral determinant for contributors to borrow.
//                             This is expressed as a multiplier index in the total loanable amount.
//      * @param router : Flat of type Router to determined the type of pool to create. It could be Permissioned or Permissionless
//      * @notice We removed collateral coverage check so as to enable more flexible tuning and customization. Example: Bob, Alice and Kate agreed
//    *            to operate a flexpool of unit $100 at zero collateral index. So Bob creates a flexpool of $100 setting quorum to maximum 3 participants.
//    *            He set colCoverage to 0. If particapant A wants to get finance, they will be required to provide (collateralCalculor * 0) which is 0
//    *            in order to get finance.
//      */
//     function _createPool(
//         IERC20 asset, 
//         address[] memory users, 
//         uint256 unit,
//         uint8 quorum,
//         uint16 intRate,
//         uint16 durationInHours,
//         uint24 colCoverage,
//         Common.Router router
//     ) internal onlySupportedAsset(asset) {
//         if(router == Common.Router.PERMISSIONLESS) {
//             if(quorum <= 1) revert MinimumParticipantIsTwo();
//         } else {
//             if(users.length < 2) revert MinimumParticipantIsTwo();
//         }
//         if(_getPool(unit, Common.Branch.CURRENT).lInt.status == Common.Status.TAKEN) revert PoolIsTaken();
//         if(colCoverage < 100) revert CollaterlCoverageTooLow();
//         if(durationInHours == 0 || durationInHours > 720) revert DurationExceed720HoursOrIsZero();      
//         Bank safe = _getSafe(unit, feeTo, collateralToken);
//         _checkAndWithdrawToken(asset, unit, users[0], address(this), address(safe));

//         unchecked {
//             _setPool(
//                 Common.Pool(
//                     Common.Addresses(users[0], address(0), asset),
//                     Common.LowInt(0, quorum, colCoverage, uint(durationInHours) * 1 hours, Common.Status.TAKEN, router, Common.Stage.JOIN),
//                     Common.BigInt(unit, unit, _generateRecordId(), _getUnitId(false)),
//                     uint256(unit * uint(quorum)).computeInterestsBasedOnDuration(intRate, uint24(durationInHours))
//                 ),
//                 unit,
//                 Common.Branch.CURRENT
//             );
//         }
//         safe.addUp(_getProfile(users[0], unit), _getUnitId(true));
//         for(uint i = 0; i < users.length; i++) {
//             bool isAdmin = users[i] == users[0];
//             _updateContributor(users[i], unit, isAdmin, isAdmin? true : false, true);
//         }
//         _createAnalytics(unit, 0, true, router == Common.Router.PERMISSIONLESS, true, false);
//         emit PoolCreated(_getPool(unit, Common.Branch.CURRENT));
//     }

    /**
     * @dev Update contributor's storage data
     * @param addr : Contributor
     * @param unit : Unit contributor
     * @param isAdmin : Whether user is the creator or not
     * @param sentQuota : Whether user is has sent their contribution or not
     * @param isMember : Whether user is a member or not
     */
    function _updateContributor(
        address addr, 
        uint256 unit,
        bool isAdmin,
        bool sentQuota,
        bool isMember
    ) internal {
        if(isAdmin) _setPoint(addr, 0, 2);
        _addContributor(unit, Common.Contributor(isMember, 0, 0, 0, 0, 0, addr, sentQuota, 0, 0));
        _incrementUserCount(unit);
    }

    /**
     * @dev Add contributor to pool
     * @param unit : Unit contribution
     */
    function joinAPool(uint256 unit) public  isValidUnitContribution(unit) returns(bool) {
        Common.Pool memory _p = _getPool(unit, Common.Branch.CURRENT);
        Common.Contributor memory _c = _getProfile(_msgSender(), unit);
        if(_p.lInt.stage != Common.Stage.JOIN) revert AddingUserEnded();
        Bank safe = _getSafe(unit, feeTo, collateralToken);
        _checkAndWithdrawToken(_p.addrs.asset, unit, _msgSender(), address(this), address(safe));

        if(_p.lInt.router == Common.Router.PERMISSIONLESS) {
            if(_c.isMember) revert UserExist();
            // require(!_c.isMember, "User exist");
        } else {
            if(!_c.isMember && _c.sentQuota) revert AlreadySentQuota();
            // require(_c.isMember && !_c.sentQuota, "Already sent quota");
        }
        unchecked {
            _p.bigInt.currentPool += unit;
        }
        _updateContributor(_msgSender(), unit, false, true, true);
        safe.addUp(_c, _p.bigInt.unitId);
        if(_getUserCount(unit) == _p.lInt.quorum) {
            _p.lInt.stage = Common.Stage.GET;
            _resetUserCount(unit);
            _setTurnTime(_p.addrs.admin, unit, Utils._now());
        } 
        _setPool(_p, unit, Common.Branch.CURRENT);
        _createAnalytics(unit, 0, false, false, true, false);
        emit NewContributorAdded(_getPool(unit, Common.Branch.CURRENT));
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
        Common.Contributor memory defaulter
    ) internal  {
        Common.Pool memory _p = _getPool(unit, Common.Branch.CURRENT);
        Common.Contributor memory _c = _getProfile(contributor, unit);
        if(_p.lInt.stage != Common.Stage.PAYBACK) revert PaybackModeNotActivated();
        if(_c.loan == 0) revert NoDebtFound();
        uint debt = _getCurrentDebt(unit, contributor);
        _createAnalytics(debt, _c.colBals, false, _p.lInt.router == Common.Router.PERMISSIONLESS, true, false);
        unchecked {
            _c.interestPaid = debt - _c.loan;
        }
        _c.loan = 0;
        _c.colBals = 0;
        Bank safe = _getSafe(unit, address(0), _p.addrs.asset);
        uint256 attestedInitialBal = IERC20(_p.addrs.asset).balanceOf(address(safe));
        _checkAndWithdrawToken(_p.addrs.asset, debt, contributor, address(this), address(safe));
        bool allGF = _p.lInt.allGH == _p.lInt.quorum;
        if(!allGF){
            unchecked {
                _p.bigInt.currentPool = _p.bigInt.unit * _p.lInt.quorum;
            }
            _p.lInt.stage = Common.Stage.GET;
            _setTurnTime(address(0), unit, Utils._now());
            _setPool(_p, unit, Common.Branch.CURRENT);
        } else {
            _p.lInt.stage = Common.Stage.ENDED;
            _shufflePool(unit, _p);
        }
        safe.payback(_c,  _p.addrs.asset,  debt, attestedInitialBal, allGF,  isSwapped, defaulter, _p.bigInt.unitId);
        _addContributor(unit, _c);
    }

    /**
        @dev Removes a pool i.e Newly created pool with only one contributor.
        The creator of a pool can cancel it only if no one has join the pool.
        @param unit : Unit contribution.
    */
    function removeLiquidity(uint unit) 
        external
        
        returns(bool)
    {
        Common.Pool memory _p = _getPool(unit, Common.Branch.CURRENT);
        address creator = _msgSender();
        if(creator != _p.addrs.admin) revert OnlyCreatorIsAllowed();
    
        if(_p.lInt.router == Common.Router.PERMISSIONLESS) {
            if(_getUserCount(unit) > 1) revert CancellationNotAllowed();
        } else {
            if(_p.bigInt.currentPool > _p.bigInt.unit) revert CancellationNotAllowed();
        }
        _p.lInt.stage = Common.Stage.CANCELED;
        _shufflePool(unit, _p);
        Bank safe = _getSafe(unit, address(0), collateralToken);
        safe.cancel(creator, _p.addrs.asset, unit, _p.bigInt.unitId);
        _createAnalytics(unit, 0, false, _p.lInt.router == Common.Router.PERMISSIONLESS, false, false);

        emit Cancellation(unit);
        return true;
    }

    /**
     * @dev Return struct object with data if current beneficiary has defaulted otherwise an empty struct is returned.
     * @param unit: Unit contribution
     */
    function _enquireLiquidation(uint256 unit) internal view 
        returns (Common.Contributor memory _liq, bool defaulted, uint currentDebt, uint slot, address defaulter) 
    {
        Common.Pool memory _p = _getPool(unit, Common.Branch.CURRENT);
        Common.Contributor memory _c = _getProfile(_p.addrs.beneficiary, unit);
        
        (_liq, defaulted, currentDebt, slot, defaulter)
        = 
            Utils._now() <= _c.paybackTime? 
            (_liq, false, uint256(0), 0, address(0)) 
                : 
                ( _liq, true, _getCurrentDebt(unit, _c.id), _getSlot(_c.id, unit), _c.id);
    }

    /**
     * @dev Check if the last beneficiary has defaulted in payment
     */
    function enquireLiquidation(uint256 unit) external view  returns (Common.Contributor memory, bool, uint, uint, address) {
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
            pastRecords,
            makerRate,
            safeCount,
            getSupportedAssets()
        );
    }

}
