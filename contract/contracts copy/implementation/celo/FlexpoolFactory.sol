// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Utils } from "./libraries/Utils.sol";
import { Pool, IERC20, Common, IPoint, ErrorLib } from "../../peripherals/Pool.sol";
import { FeeToAndRate, IRoleBase } from "../../peripherals/FeeToAndRate.sol";
import { IFactory } from '../../apis/IFactory.sol';

contract FlexpoolFactory is IFactory, Pool, FeeToAndRate {
    using Utils for uint;
    using ErrorLib for string;

    Common.Analytics public analytics;

    constructor(
        address _assetManager, 
        IERC20 _baseAsset,
        IPoint _pointFactory,
        IRoleBase _roleManager, 
        address _feeTo, 
        uint16 _makerRate
    ) 
        Pool(_assetManager, _baseAsset, _pointFactory)
        FeeToAndRate(_roleManager, _feeTo, _makerRate)
    {}

    function createPool(
        address[] memory users, 
        uint256 unit,
        uint8 maxQuorum,
        uint16 durationInHours,
        uint24 colCoverage,
        bool isPermissionless,
        IERC20 colAsset
    ) public returns(bool) {
        Common.Pool memory pool = _createPool(users, unit, maxQuorum, durationInHours, colCoverage, isPermissionless? Common.Router.PERMISSIONLESS : Common.Router.PERMISSIONED, colAsset);
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
        Common.Pool memory pool;
        if(isPoolAvailable(unit)){
            pool = _getPool(unit);
            pool = _joinAPool(unit, user, pool);
            emit Common.NewContributorAdded(pool);
        } else {
            address[] memory users = [borrower];
            pool = _createPool(users, unit, 2, 72, 120, Common.Router.PERMISSIONLESS);
            _awardPoint(users[0], 0, 5);
            emit Common.PoolCreated(pool);
        }
        _setProviders(providers, borrower, unit, pool.big.recordId);
        _recordAnalytics(unit, 0, Common.Stage.JOIN, true);

        return true;
    }

    function contribute(uint unit) public returns(bool) {
        Common.Pool memory pool = _getPool(unit);
        pool = _joinAPool(unit, user, pool);
        _recordAnalytics(unit, 0, Common.Stage.JOIN, pool.router == Common.Router.PERMISSIONLESS);
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

    /**
     * @dev Get finance
     * @param unit : Unit contribution
     * @return bool : Success or Failure
     * @notice : To get finance, the unit contribution must be active. In the event the expected contributor failed to 
     * call, we swap their profile for the current msg.sender provided the grace period of 1hr has passed.
     */
    function getFinance(uint256 unit) public returns(bool) {
        (uint collateral,) = _getCollateralQuote(unit);
        Common.Pool memory pool = _getPool(unit);
        Common.Contributor memory profile = _getExpected(unit, pool.low.selector);
        if(pool.stage != Common.Stage.GET) 'Borrow not ready'._throw();
        if(pool.low.allGh == pool.low.maxQuorum) 'Epoch ended'._throw();
        unchecked {
            if(pool.big.currentPool < (pool.big.unit * pool.low.maxQuorum)) 'Pool fund incomplete'._throw();
            if(_now() > profile.turnStartTime + 1 hours){
                if(_msgSender() != profile.id) {
                    profile = _swapContributors(unit, _msgSender(), _getSlot(_msgSender(), unit), profile);
                }
            } else {
                if(_msgSender() != profile.id) 'TurnTime has not pass'._throw();
            }
            pool.low.allGh += 1;
            pool.addrs.lastPaid = profile.id;
        }
        _recordAnalytics(pool.big.currentPool, collateral, Common.Stage.GET, pool.router == Common.Router.PERMISSIONLESS);
        (, uint _) = _checkAndWithdrawAllowance(IERC20(pool.addrs.colAsset), profile.id, pool.addrs.safe, collateral);
        if(!ISafe(pool.addrs.safe).getFinance(profile.id, baseAsset, pool.big.currentPool, pool.big.currentPool.computeFee(makerRate), collateral, pool.big.recordId)) 'Safe call failed'._throw();
        pool = _completeGetFinance(pool, collateral);
        _setPool(pool.big.unitId, pool);

        emit Common.GetFinanced(pool);

        return true;
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
