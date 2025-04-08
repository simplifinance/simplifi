// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Pool, Common, ErrorLib, Utils } from "../../peripherals/Pool.sol";
import { FeeToAndRate, IRoleBase } from "../../peripherals/FeeToAndRate.sol";
import { IFactory } from '../../apis/IFactory.sol';
import { IERC20 } from "../../apis/IERC20.sol";
import { IPoint } from "../../apis/IPoint.sol";

/**
    * @title FlexpoolFactory
    * @author Simplifi (Bobeu)
    * @notice Deployable FlexpoolFactory contract that enables peer-funding. Participants of each pool are referred to 
    * contributors. There is no limit to the amount that can be contributed except for zer0 value. Users can single-handedly run
    * a pool (where anyone is free to participate) or collectively with friends and family or peer operate a permissioned pool 
    * where participation is restricted to the preset members only.
    * Users can use providers strategy to finance their quota if they can't afford the unit contribution. They can select multiple
    * providers if the provider balance cannot the amount they wish to borrow. If this is the case, the selected providers are 
    * entitled to earn interest on the amount they provide.
    * When paying back, the contributor will repay the full loan with interest but halved for other contributors.  
*/
contract FlexpoolFactory is IFactory, Pool, FeeToAndRate {
    using Utils for uint;
    using ErrorLib for *;

    // Analytics
    Common.Analytics public analytics;

    /**
     * ================ Constructor ==============
     * @param _roleManager : Role manager contract
     * @param _pointFactory : Point Factory contract
     * @param _assetManager : Asset manager contract
     * @param _baseAsset : ERC20 compatible asset to use as base contribution
     * @param _feeTo: Fee receiver
     * @param _pointFactory : Platform fee
    */
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

    /**
        * @dev Create a pool internally
        * @param users : List of participating accounts
        * @param unit : Unit contribution
        * @param maxQuorum : Maximum number of contributors that can participate
        * @param durationInHours : Maximum duration in hours each borrower can retain the loan
        * @param colCoverage : Ration of collateral coverage or index required as cover for loan
        * @param isPermissionless : Whether to create a permissionless or permissioned pool.
        * @param colAsset : An ERC20-compatible asset to use as collateral currency 
    */
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
            _setPool(pool.big.unitId, pool);
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

    /**
     * @dev Add a contributor to a poool
     * @param : Unit contribution
     */
    function contribute(uint unit) public returns(bool) {
        Common.Pool memory pool = _getPool(unit);
        pool = _joinAPool(unit, user, pool);
        _recordAnalytics(unit, 0, Common.Stage.JOIN, pool.router == Common.Router.PERMISSIONLESS);
        emit Common.NewContributorAdded(pool);

        return true;
    }
    
    /**
     * @dev Edit pool information
     * @param unit : Unit contribution
     * @param maxQuorum : Number of expected participants
     * @param durationInHours : Number of time in hours each contributor can retain the loan
     * @param colCoverage : Collateral coverage or ratio.
     */
    function editPool(
        uint256 unit,
        uint8 maxQuorum,
        uint16 durationInHours,
        uint24 colCoverage
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
        (, uint) = _checkAndWithdrawAllowance(IERC20(pool.addrs.colAsset), profile.id, pool.addrs.safe, collateral);
        if(!ISafe(pool.addrs.safe).getFinance(profile.id, baseAsset, pool.big.currentPool, pool.big.currentPool.computeFee(makerRate), collateral, pool.big.recordId)) 'Safe call failed'._throw();
        pool = _completeGetFinance(pool, collateral);
        _setPool(pool.big.unitId, pool);

        emit Common.GetFinanced(pool);

        return true;
    }

    /**
     * @dev Payback. For detailed documentation, see _payback
     * @param unit : Unit contribution
     */
    function payback(uint256 unit) public returns(bool) {
        (Common.Pool memory pool, uint debt, uint collateral) = _payback(unit, _msgSender(), false, address(0));
        _recordAnalytics(debt, collateral, Common.Stage.PAYBACK, pool.router == Common.Router.PERMISSIONLESS);
        emit Common.Payback(pool);

        return true;
    }

    /**
        @dev Liquidates a borrower if they have defaulted in repaying their loan.
        - If the current beneficiary defaults, they're liquidated.
        - Their collateral balances is forwarded to the liquidator. Liquidator also takes the full 
            responsibilities of the providers if any.
        - Liquidator must not be a participant in pool at `unitId. We use this 
            to avoid fatal error in storage.
        @param unit : Unit contribution.
    */
    function liquidate(uint256 unit) public returns(bool) {
        (Common.Contributor memory profile, bool defaulted, Common.Slot memory slot) = _enquireLiquidation(unit);
        if(!defaulted) 'Not defaulted'._throw();
        address liquidator = _msgSender() ;
        pool = _getPool(unit);
        _onlyNonContributor(liquidator, unit);
        _changeContributorAddress(liquidator, pool.big.recordId, slot.value);
        _setSlot(liquidator, unit, slot, false);
        _setSlot(profile.id, unit, slot, true);
        pool.addrs.lastPaid = liquidator;
        return payback(unit);
    }

    /**
        @dev Cancels a pool. Only pool with one contributor can be close.
        @param unit : Unit contribution.
        @param isPermissionLess : Whether band is public or not.

        @notice : Only the creator of a pool can close it provided the number of contributors does not exceed one.
    */
    function closePool(uint256 unit, bool isPermissionLess) public _onlyIfUnitIsActive(unit) returns(bool){
        Common.Pool memory pool = _getPool(unit);
        address creator = _msgSender();
        if(creator != pool.addrs.admin) 'Only Admin can close pool'._throw();
        bool isPermissionLess = pool.router == Common.Router.PERMISSIONLESS;
        if(isPermissionLess) {
            if(pool.low.userCount > 1) 'Cancellation disabled'._throw();
        } else {
            if(pool.big.currentPool > pool.big.unit) 'Cancellation disabled'._throw();
        }
        pool.stage = Common.Stage.CANCELED;
        _shufflePool(pool);
        _recordAnalytics(pool.big.unit, 0, Common.Stage.CANCELED, isPermissionLess);
        if(!ISafe(pool.addrs.safe).cancel(creator, baseAsset, pool.big.unit, pool.big.recordId)) 'Safe call failed'._throw();

        emit Common.Cancellation(unit);
    }
    
    /**
     * @dev Record snapshot balances of base asset and collateral asset at any point in time
     * @param baseValue : Value of baseAsset e.g Amount of cUSD contributed
     * @param collateral : Collateral value going out or coming in.
     * @param flag : For determining the type of operation to perform.
     * @param isPermissionless : Whether the pool is permissioned or permissionless 
     */
    function _recordAnalytics(uint baseValue, uint collateral, Common.Stage flag, bool isPermissionless) internal {
        Analytics memory alt = analytics;
        unchecked {
            if(flag == Common.Stage.JOIN) {
                alt.tvlBase += unit;
                isPermissionless? alt.totalPermissionless += 1 : alt.totalPermissioned += 1;
            } else if(flag == Common.Stage.GET) {
                if(alt.tvlBase >= baseValue) alt.tvlBase -= baseValue;
                alt.tvlCollateral += collateral;
            } else if(flag == Common.Stage.PAYBACK) {
                if(alt.tvlCollateral >= collateral) alt.tvlCollateral -= collateral;
                alt.tvlBase += baseValue;
            } else {
                // otherwise, it will be canceled pool
                if(alt.tvlBase >= baseValue) alt.tvlBase -= baseValue;
            }
        }
        analytics = alt;
    }

    /**@dev Return contract data */
    function getFactoryData() public view returns(Common.ViewFactoryData memory data) {
        data.analytics = analytics;
        data.makerRate = makerRate;
        data.currentEpoches = _getEpoches();
        data.recordEpoched = _getPastEpoches();
        return data;
    } 

}
