// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { FeeToAndRate, IRoleBase, ErrorLib, Utils, ISupportedAsset, ISafeFactory } from "../peripherals/FeeToAndRate.sol";
import { IFactory, Common } from '../interfaces/IFactory.sol';
import { IERC20 } from "../interfaces/IERC20.sol";
import { IPoint } from "../interfaces/IPoint.sol";
import { ISafe } from "../interfaces/ISafe.sol";

/**
    * @title FlexpoolFactory
    * @author Simplifi (Bobeu)
    * @notice FlexpoolFactory enables peer-funding magic. Participants of each pool are referred to 
    * contributors. There is no limit to the amount that can be contributed except for zer0 value. Users can single-handedly run
    * a pool (where anyone is free to participate) or collectively with friends and family or peer operate a permissioned pool 
    * where participation is restricted to the preset members only.
    * Users can use providers strategy to finance their quota if they can't afford the unit contribution. They can select multiple
    * providers if the provider balance cannot the amount they wish to borrow. If this is the case, the selected providers are 
    * entitled to earn interest on the amount they provide.
    * When paying back, the contributor will repay the full loan with interest but halved for other contributors.  
*/
contract FlexpoolFactory is IFactory, FeeToAndRate {
    using Utils for *;
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
     * @param networkSelector : number flag to set the connected network
    */
    constructor(
        address _feeTo, 
        uint16 _makerRate,
        uint8 networkSelector, 
        IRoleBase _roleManager, 
        ISupportedAsset _assetManager, 
        IERC20 _baseAsset,
        IPoint _pointFactory,
        ISafeFactory _safeFactory
    ) 
        FeeToAndRate(_feeTo, _makerRate, networkSelector, _roleManager, _assetManager, _baseAsset, _pointFactory, _safeFactory)
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
        * @notice users list should be a list of participating accounts if it is permissioned including the
        * creator being the first on the list. But the list can be empty if it is permissionless.
    */
    function createPool( 
        address[] calldata users,
        uint unit,
        uint8 maxQuorum,
        uint16 durationInHours,
        uint24 colCoverage,
        bool isPermissionless,
        IERC20 colAsset
    ) public whenNotPaused returns(bool) {
        Common.Pool memory pool = _createPool(users, _msgSender(), unit, maxQuorum, durationInHours, colCoverage, isPermissionless? Common.Router.PERMISSIONLESS : Common.Router.PERMISSIONED, colAsset);
        _awardPoint(users[0], 0, 5, false);
        _recordAnalytics(unit, 0, Common.Stage.JOIN, isPermissionless, true);
        emit Common.PoolCreated(pool);
      
        return true;
    }

    /**
     * @dev launch a default permissionless pool
     * @param user : Target user
     * @param unit : Unit contribution
     * @param initialPool : An Initialized pool. Can be an empty pool
     */
    function _launchDefault(address user, uint unit) internal returns(Common.Pool memory initialPool) {
        address[] memory users = new address[](1);
        users[0] = user;
        IERC20 defaultColAsset = IERC20(ISupportedAsset(assetManager).getDefaultSupportedCollateralAsset());
        initialPool = _createPool(users, user, unit, 2, 72, 120, Common.Router.PERMISSIONLESS, defaultColAsset);
        _awardPoint(users[0], 0, 5, false);
        _recordAnalytics(unit, 0, Common.Stage.JOIN, true, true);
        emit Common.PoolCreated(initialPool);
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
     * If an user is contributing via the provider, we ensure the privacy of permissioned group is preserved.
     */
    function contributeThroughProvider(
        Common.Provider[] memory providers, 
        address borrower, 
        uint unit
    ) external onlyRoleBearer whenNotPaused returns(bool)
    {
        Common.Pool memory pool;
        bool isNewOrCancel = false;
        if(!isPoolAvailable(unit)){
            pool = _getPool(unit);
            pool = _joinAPool(unit, borrower, pool);
            _setPool(pool.big.unitId, pool);
            emit Common.NewContributorAdded(pool);
        } else {
            isNewOrCancel = true;
            pool = _launchDefault(borrower, unit);
        }
        _setProviders(providers, borrower, pool.big.recordId);
        _recordAnalytics(unit, 0, Common.Stage.JOIN, true, isNewOrCancel);

        return true;
    }

    /**
     * @dev Add a contributor to a poool
     * @param : Unit contribution
     */
    function contribute(uint unit) public whenNotPaused returns(bool) {
        Common.Pool memory pool = _getPool(unit);
        pool = _joinAPool(unit, _msgSender(), pool);
        _setPool(pool.big.unitId, pool);
        _recordAnalytics(unit, 0, Common.Stage.JOIN, pool.router == Common.Router.PERMISSIONLESS, false);
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
        whenNotPaused
        returns(bool) 
    {
        Common.Pool memory pool = _getPool(unit);
        uint32 duration;
        if(_msgSender() != pool.addrs.admin) 'Not Allowed'._throw();
        unchecked {
            duration = durationInHours * 1 hours;
        }
        if(pool.router == Common.Router.PERMISSIONLESS) {
            if(maxQuorum != pool.low.maxQuorum && maxQuorum > 2 && maxQuorum < type(uint8).max) pool.low.maxQuorum = maxQuorum;
        }
        if(durationInHours <= 720 && duration != pool.low.duration) pool.low.duration = duration;
        if(colCoverage != pool.low.colCoverage) pool.low.colCoverage = colCoverage;
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
    function getFinance(uint256 unit) public _onlyIfUnitIsActive(unit) whenNotPaused returns(bool) {
        _onlyContributor(_msgSender(), unit, false);
        Common.Pool memory pool = _getPool(unit);
        uint collateral = Common.Price(
            uint128(ISupportedAsset(assetManager).getPriceQuote(network, address(pool.addrs.colAsset))),
            network == Common.Network.CELO? 18 : 8
        ).computeCollateral(
            uint24(pool.low.colCoverage),
            pool.big.currentPool
        );
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
        }
        pool.addrs.lastPaid = profile.id;
        _recordAnalytics(pool.big.currentPool, collateral, Common.Stage.GET, pool.router == Common.Router.PERMISSIONLESS, false);
        _checkAndWithdrawAllowance(IERC20(pool.addrs.colAsset), profile.id, pool.addrs.safe, collateral);
        if(!ISafe(pool.addrs.safe).getFinance(profile.id, baseAsset, pool.big.currentPool, pool.big.currentPool.computeFee(uint16(makerRate)), collateral, pool.big.recordId)) 'Safe call failed'._throw();
        (pool, profile) = _completeGetFinance(pool, collateral, profile);
        _setContributor(profile, pool.big.recordId, uint8(_getSlot(pool.addrs.lastPaid, pool.big.unit).value), false);
        _setPool(pool.big.unitId, pool);

        emit Common.GetFinanced(pool);

        return true;
    }

    /**
     * @dev Payback. For detailed documentation, see _payback
     * @param unit : Unit contribution
     */
    function payback(uint unit) public whenNotPaused returns(bool) {
        (Common.Pool memory pool, uint debt, uint collateral) = _payback(unit, _msgSender(), false, address(0));
        _recordAnalytics(debt, collateral, Common.Stage.PAYBACK, pool.router == Common.Router.PERMISSIONLESS, false);
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
    function liquidate(uint256 unit) public whenNotPaused returns(bool) {
        (Common.Contributor memory _defaulter, bool isDefaulted, Common.Slot memory slot) = _enquireLiquidation(unit);
        if(!isDefaulted) 'Not defaulted'._throw();
        address liquidator = _msgSender() ;
        _onlyNonContributor(liquidator, unit);
        _replaceContributor(liquidator, _getPool(unit).big.recordId, slot, _defaulter.id, unit);
        assert(liquidator != _defaulter.id);
        _setLastPaid(liquidator, unit); 
        (Common.Pool memory pool, uint debt, uint collateral) = _payback(unit, liquidator, true, _defaulter.id);
        _recordAnalytics(debt, collateral, Common.Stage.PAYBACK, pool.router == Common.Router.PERMISSIONLESS, false);
        emit Common.Payback(pool);
        return true;
    }

    /**
        @dev Cancels a pool. Only pool with one contributor can be close.
        @param unit : Unit contribution.
        @notice : Only the creator of a pool can close it provided the number of contributors does not exceed one.
    */
    function closePool(uint256 unit) public whenNotPaused _onlyIfUnitIsActive(unit) returns(bool){
        Common.Pool memory pool = _getPool(unit);
        address creator = _msgSender();
        if(creator != pool.addrs.admin) 'Only Admin can close pool'._throw();
        bool isPermissionLess = pool.router == Common.Router.PERMISSIONLESS;
        if(isPermissionLess) {
            if(pool.low.userCount > 1) 'Cancellation disabled'._throw();
        } else {
            if(pool.big.currentPool > pool.big.unit) 'Cancellation disabled'._throw();
        }
        _awardPoint(creator, 0, 5, true);
        pool.stage = Common.Stage.CANCELED;
        _shufflePool(pool);
        _recordAnalytics(pool.big.unit, 0, Common.Stage.CANCELED, isPermissionLess, true);
        if(!ISafe(pool.addrs.safe).cancel(creator, baseAsset, pool.big.unit, pool.big.recordId)) 'Safe call failed'._throw();

        emit Common.Cancellation(unit);
        return true;
    }

    /**
        * @dev Return providers associated with the target account
        * @param target : Target account
        * @param recordId : Record id
    */
    function getContributorProviders(address target, uint96 recordId) external view returns(Common.Provider[] memory result){
        return  _getContributorProviders(target, recordId);
    }
    
    /**
     * @dev Record snapshot balances of base asset and collateral asset at any point in time
     * @param baseValue : Value of baseAsset e.g Amount of cUSD contributed
     * @param collateral : Collateral value going out or coming in.
     * @param flag : For determining the type of operation to perform.
     * @param isPermissionless : Whether the pool is permissioned or permissionless 
     */
    function _recordAnalytics(uint baseValue, uint collateral, Common.Stage flag, bool isPermissionless, bool isNewOrCancelled) internal {
        Analytics memory alt = analytics;
        unchecked { 
            if(flag == Common.Stage.JOIN) {
                alt.tvlBase += baseValue;
                if(isNewOrCancelled) isPermissionless? alt.totalPermissionless += 1 : alt.totalPermissioned += 1;
            } else if(flag == Common.Stage.GET) {
                if(alt.tvlBase >= baseValue) alt.tvlBase -= baseValue;
                alt.tvlCollateral += collateral;
            } else if(flag == Common.Stage.PAYBACK) {
                if(alt.tvlCollateral >= collateral) alt.tvlCollateral -= collateral;
                alt.tvlBase += baseValue;
            } else {
                if(isNewOrCancelled) {
                    if(isPermissionless) {
                        if(alt.totalPermissionless > 0) alt.totalPermissionless -= 1;
                    } else {
                        if(alt.totalPermissioned > 0) alt.totalPermissioned -= 1;
                    }
                }
                if(alt.tvlBase >= baseValue) alt.tvlBase -= baseValue;
            }
        }
        analytics = alt;
    }

    /**@dev Return contract data */
    function getFactoryData() public view returns(Common.ViewFactoryData memory data) {
        data.analytics = analytics;
        data.makerRate = uint16(makerRate);
        data.currentEpoches = _getEpoches();
        data.recordEpoches = _getPastEpoches();
        return data;
    } 

}
