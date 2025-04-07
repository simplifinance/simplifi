// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Utils } from "./libraries/Utils.sol";
import { Pool, IERC20, Common, IPoint, ErrorLib } from "./peripherals/Pool.sol";
import { IFactory } from '../../apis/IFactory.sol';

contract FlexpoolFactory is IFactory, Pool {
    using Utils for *;
    using ErrorLib for string;

    Common.Analytics public analytics;

    constructor(
        address _assetManager, 
        IERC20 _baseAsset,
        IPoint _pointFactory
    ) 
        Pool(_assetManager, _baseAsset, _pointFactory)
    {}

    function createPool(
        address[] memory users, 
        uint256 unit,
        uint8 maxQuorum,
        uint16 durationInHours,
        uint24 colCoverage,
        bool isPermissionless
    ) public returns(bool) {
        Common.Pool memory pool = _createPool(users, unit, maxQuorum, durationInHours, colCoverage, isPermissionless? Common.Router.PERMISSIONLESS : Common.Router.PERMISSIONED);
        _awardPoint(users[0], 0, 5);
        _recordAnalytics(unit, 0, Common.Stage.JOIN, isPermissionless);
        emit Common.PoolCreated(pool);
      
        return true;
    }

    /**
     * @dev Contributors can join a pool through a provider is they wish to borrow to finance the unit contribution.
     *      If the unit is not taken, we add them to the pool otherwise a new pool will be launched.
     * @param providers : List of providers that lend to the borrower
     * @param borrower : Account address of the borrower
     * @param unit : Amount borrowed will automatically be the unit contribution
     * @notice By default, maxQuorum is set to 2 using this method. Users can immediately change the quorum
     * to desired value otherwise it will not be possible if another contributor joins to complete the quorum.
     * - durationInHrs is set to 72 hours by default.
     * - colCoverage is set to 120 by default.
     * Only accounts with the roleBearer are allowed i.e Ex. Providers contract
     */
    function contributeThroughProvider(
        Common.Provider[] memory providers, 
        address borrower, 
        uint unit
    ) external onlyRoleBearer returns(bool)
    {
        Common.Pool memory pool = _getPool(unit);
        if(isPoolAvailable(unit)){
            pool = _joinAPool(unit, user, pool);
            _setProviders(providers, borrower, unit);
            emit Common.NewContributorAdded(pool);
        } else {
            address[] memory users = [borrower];
            pool = _createPool(users, unit, 2, 72, 120, Common.Router.PERMISSIONLESS);
            _awardPoint(users[0], 0, 5);
            emit Common.PoolCreated(pool);
        }
        _recordAnalytics(unit, 0, Common.Stage.JOIN, true);

        return true;
    }

    function contribute(uint unit) public returns(bool) {
        Common.Pool memory pool = _getPool(unit);
        pool = _joinAPool(unit, user, pool);
        _recordAnalytics(unit, 0, Common.Stage.JOIN, true);
        emit Common.NewContributorAdded(pool);

        return true;
    }

    function editPool(
        uint256 unit,
        uint8 maxQuorum,
        uint16 durationInHours,
        uint24 colCoverage,
    ) 
        public 
        _onlyIfUnitIsActive(unit)
        returns(bool) 
    {
        Common.Pool memory pool = _getPool(unit);
        uint32 duration;
        if(_msgSender() != pool.addrs.admin) 'Not Allowed'._throw();
        unchecked {
            duration = durationInHours * 1 hours;
        }
        if(maxQuorum > pool.low.maxQuorum && maxQuorum < type(uint8).max) pool.low.maxQuorum = maxQuorum;
        if(durationInHours <= 720 && duration > pool.low.duration) pool.low.duration = duration;
        if(colCoverage > pool.low.colCoverage) pool.low.colCoverage = colCoverage;
        _setPool(pool.big.unitId, pool);

        emit Common.PoolEdited(pool);
        return true;
    }

    // function createPermissionedPool(
    //     address[] memory users, 
    //     uint256 unit,
    //     uint16 intRate,
    //     uint16 durationInHours,
    //     uint24 colCoverage
    // ) public returns(bool) {
    //     Common.Pool memory pool = _createPool(users, unit, users.length, durationInHours, colCoverage, Common.Router.PERMISSIONED);
    //     _awardPoint(users[0], 0, 5);
    //     _recordAnalytics(unit, 0, Common.Stage.JOIN, false);
    //     emit Common.PoolCreated(pool);
      
    //     return true;
    // }

    function getFinance(uint256 unit) public _onlyIfUnitIsActive(unit) returns(bool) {
        // _isValidUnit(self, unit);
        Common.Pool memory pool = _getPool(unit);
        Common.Contributor memory profile = _getExpected(unit, pool.low.selector);
        if(pool.stage != Common.Stage.GET) 'Borrow not ready'._throw();
        if(pool.low.allGh == pool.low.maxQuorum) 'Epoch ended'._throw();
        unchecked {
            pool.low.allGh += 1;
            if(pool.big.currentPool < (pool.big.unit * pool.low.maxQuorum)) 'Pool fund incomplete'._throw();
            if(_now() > profile.turnStartTime + 1 hours){
                if(_msgSender() != profile.id) {
                    // _onlyContributor(_msgSender(), unit);
                    profile = _swapContributors(unit, _msgSender(), _getSlot(_msgSender(), unit), profile);
                }
            } else {
                if(_msgSender() != profile.id) 'TurnTime has not pass'._throw();
            }
        }



        // Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        // Common.Contributor memory _c = _getExpected(unit);
        // uint256 safeBalance = _getSafe(unit).id.balance;
        // if(Utils._now() > _c.turnTime + 1 hours){
        //     if(user != _c.id) {
        //         _c = _swapFullProfile(unit, user, _c);
        //     }
        // } else {
        //     if(user != _c.id) revert TurnTimeHasNotPassed();
        // }
        // if(_p.lInt.stage != Common.Stage.GET) revert GettingFinanceNotReady();
        // if(IERC20(_getToken()).balanceOf(_getSafe(unit).id) < _p.bigInt.currentPool) revert TokenBalanceInSafeNotTally();
        // if(_p.bigInt.unit.mul(_p.lInt.quorum) < _p.bigInt.currentPool) revert PoolBalanceNotTally();
        // _onlyContributor(_c.id, unit);
        // uint fee = _p.bigInt.currentPool.computeFee(uint16(makerRate));
        // _c.colBals = _getCollateralQuote(unit);
        // if(safeBalance < _c.colBals) revert InsufficientCollateral();
        // _c.loan = _p.bigInt.currentPool.sub(fee);
        // _p.beneficiary = _c.id;
        // _p.bigInt.currentPool = 0;
        // _p.lInt.stage = Common.Stage.PAYBACK;
        // _addContributor(unit, _c);
        // _setPool(_p, unit, Common.UnitStatus.CURRENT);
        // _incrementUserCount(unit);
        // return true;
    }

    function payback(uint256 unit, address user) public returns(bool) {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        Common.Contributor memory _c = _getProfile(user, unit);
        if(_p.lInt.stage != Common.Stage.PAYBACK) revert PaybackModeNotActivated();
        uint debt = _getCurrentDebt(unit, user);
        if(debt == 0) revert NoDebtFound();
        _c.loan = 0;
        bool allGF = _getUserCount(unit) == _p.lInt.quorum;
        if(!allGF){
            _p.bigInt.currentPool = _p.bigInt.unit.mul(_p.lInt.quorum);
            if(IERC20(_getToken()).balanceOf(_getSafe(unit).id) < _p.bigInt.currentPool) revert SafeBalanceDepleted();
            _p.lInt.stage = Common.Stage.GET;
            _setTurnTime(address(0), unit, Utils._now());
            _setPool(_p, unit, Common.UnitStatus.CURRENT);
        } else {
            _p.lInt.stage = Common.Stage.ENDED;
            _setPool(_p, unit, Common.UnitStatus.RECORD);
            _removePool(unit);
        }
        _addContributor(unit, _c);
        return true;
    }

    /**@dev Return accrued debt for user up to this moment.
     * @param unit : Contribution amount.
     * @param user : Contributor.
     * @notice This is the total accrued debt between the date user was paid and now.
     */
    function _getCurrentDebt(uint256 unit, address user) 
        internal 
        view returns(uint debt) 
    {
        uint intPerSec = _getPool(unit, Common.UnitStatus.CURRENT).interest.intPerSec;
        Common.Contributor memory _c = _getProfile(user, unit);
        debt = _c.loan.add(intPerSec.mul(uint(Utils._now()).sub(_c.turnTime)));
    } 

    /**@dev Return accrued debt for user up to this moment.
     * @param unit : Contribution amount.
     * @param user : Contributor.
     * @notice This is the total accrued debt between the date user was paid and now.
     */
    function getCurrentDebt(uint256 unit, address user) 
        public 
        view returns(uint debt) 
    {
        return _getCurrentDebt(unit, user);
    } 
    
    function _getCollateralQuote(uint256 unit) internal view returns(uint quote){
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        quote = Common.Price(_getDummyPrice(), 18).computeCollateral(uint24(_p.lInt.colCoverage), _p.bigInt.currentPool);
    }

    function getCollateralQuote(uint256 unit) public view returns(uint quote){
       return _getCollateralQuote(unit);
    }

    /**
     * @dev Check if slot is available in the pool
     * @param unit : Unit contribution
     */
    function isPoolVacant(uint256 unit) public view returns(bool) {
        return _getUserCount(unit) < _getPool(unit, Common.UnitStatus.CURRENT).lInt.quorum;
    }






    function joinViaProvider(Common.Provider[] memory provider, address borrower, uint unit) external returns(bool) {
        
    }

    function _recordAnalytics(uint baseValue, uint collateral, Common.Stage flag, bool isPermissionless) internal {
        Analytics memory alt = analytics;
        unchecked {
            if(flag == Common.Stage.JOIN) {
                alt.tvlBase += unit;
                isPermissionless? alt.totalPermissionless += 1 : alt.totalPermissioned += 1;
            } else if(flag == Common.Stage.GET) {
                if(alt.tvlBase >= baseValue) alt.tvlBase -= baseValue;
                alt.tvlCollateral += collateral;
            } else if(flag == Common.Stage.PAY) {
                if(alt.tvlCollateral >= collateral) alt.tvlCollateral -= collateral;
                alt.tvlBase += baseValue;
            } else {
                // otherwise, it will be canceled pool
                if(alt.tvlBase >= baseValue) alt.tvlBase -= baseValue;
            }
        }
        analytics = alt;
    }
}
