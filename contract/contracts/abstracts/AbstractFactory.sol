// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

// import "hardhat/console.sol";
import { FactoryLibV2, Data } from "../libraries/FactoryLibV2.sol";
import { Pausable } from "../abstracts/Pausable.sol";
import { IFactory } from "../apis/IFactory.sol";
import { IAssetClass } from "../apis/IAssetClass.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**@title Abstract Factory contract
 * Non deployable.
*/

abstract contract AbstractFactory is
    IFactory,
    ReentrancyGuard,
    Pausable
{
    using FactoryLibV2 for Data;

    // Storage of type FactoryLibV2.Data
    Data private data;

    // Minimum amount that can be contributed
    uint public minContribution;

    // Frontend analytics
    Analytics public analytics;

    /**
     * @dev Only supported assets are allowed.
     * Note: Asset must be supported by the AssetClass contract.
     * @param _asset : Input asset contract address
     */
    modifier onlySupportedAsset(address _asset) {
        if (!IAssetClass(data.pData.assetAdmin).isSupportedAsset(_asset)) {
            revert IAssetClass.UnSupportedAsset(_asset);
        }
        _;
    }

    ///@dev Unit contribution must have been initialized before they can be interacted with.
    modifier onlyInitialized(uint256 unit,bool secondCheck) {
        FactoryLibV2._isInitialized(data.units, unit, secondCheck);
        _;
    }

    ///@dev Unit contribution must not be less than the minimum contribution.
    modifier isMinimumContribution(uint256 unit) {
        if(unit < minContribution) revert AmountLowerThanMinimumContribution();
        _;
    }
    
    /**
     * See _setUp() for doc
     */
    constructor(
        uint16 serviceRate,
        uint _minContribution,
        address feeTo,
        address assetClass,
        address strategyManager,
        address _ownershipManager
    ) Pausable(_ownershipManager) {
        _setUp(
            serviceRate, 
            _minContribution, 
            feeTo, 
            assetClass, 
            strategyManager
        );
    }

    ///@dev Fallback
    receive() external payable {
        if(msg.value > 15e14 wei) {
            (bool success,) = data.pData.feeTo.call{value:msg.value}('');
            require(success,'Reverted');
        }
    }

    /** @dev See _setUp() for doc.
     */
    function performSetUp(
        uint16 serviceRate,
        uint _minContribution,
        address feeTo,
        address assetClass,
        address strategyManager
    ) public onlyOwner("Factory - performSetUp not permitted") {
        _setUp(
            serviceRate, 
            _minContribution, 
            feeTo, 
            assetClass, 
            strategyManager
        );
    }

    /**
     * @dev Can be used to initialize and reinitialized state variables.
     * @notice Only address with owner role can call. Check Ownable.sol to see 
     * how we manage ownership (different from OZ pattern). 
     * @param serviceRate : Platform fee
     * @param _minContribution : Minimum acceptable unit in liquidity pool.
     * @param feeTo : Fee recipient.
     * @param assetAdmin : Asset manager contract.
     * @param bankFactory : Strategy manager contract.
     */
    function _setUp(
        uint16 serviceRate,
        uint _minContribution,
        address feeTo,
        address assetAdmin,
        address bankFactory
    ) private {
        minContribution = _minContribution;
        data.setContractData(assetAdmin, feeTo, serviceRate, bankFactory);
    }

    /**
    @dev Launch a liquidity pool. Based on router, it could be permissioned or permissionless.
      @param intRate : Rate of interest to charge on loans.
      @param quorum: The Required number of contributors to form a band. 
      @param durationInHours: The maximum time limit (from when turn time begins) with which a contributor
                            will take custody of the loan before repayment. Should be specified in hours.
      @param colCoverage - Collateral factor - Collateral determinant for contributors to borrow.
                            This is expressed as a multiplier index in the total loanable amount.
      @param unitLiquidity - Unit contribution.
      @param asset - Liquidity asset. This will often be an ERC20 compatible asset.
      @param contributors : Array contributors addresses
      @param router : We use this to determine which pool to launch. Router can either be permissioned
                    or permissionless.
        - asset must be supported by AssetClass.sol
    */
    function _createPool(
        uint16 intRate,
        uint8 quorum,
        uint16 durationInHours,
        uint24 colCoverage,
        uint unitLiquidity,
        address asset,
        address[] memory contributors,
        Router router
    )
        internal 
        whenNotPaused
        onlySupportedAsset(asset)
        returns (uint)
    {
        bool isPermissionless = router == Router.PERMISSIONLESS;
        // revert DD(contributors);
        isPermissionless? require(quorum > 1, "Router: Quorum is invalid") : require(contributors.length > 1, "Min of 2 members");
        CreatePoolParam memory cpp = CreatePoolParam(intRate, quorum, durationInHours, colCoverage, unitLiquidity, contributors, asset);
        CreatePoolReturnValue memory crp = !isPermissionless ? data
            .createPermissionedPool(cpp)
                : data.createPermissionlessPool(cpp);
        Analytics memory alt = analytics;
        analytics = Analytics(
            alt.tvlInXFI, 
            alt.tvlInUsd + unitLiquidity, 
            isPermissionless? alt.totalPermissioned : alt.totalPermissioned + 1,
            isPermissionless? alt.totalPermissionless + 1 : alt.totalPermissionless
        );
        
        emit BandCreated(crp);
        return crp.pool.uint256s.unit;
    } 

    /** @dev Return current epoch. 
     * This is also total epoches generated to date 
    */
    function getEpoches() 
        external 
        view 
        returns(uint)
    {
        return data.getEpoches();
    }

    
  ///@dev Returns epoches
  function getRecordEpoches() external view returns(uint) {
    return data.getRecordEpoches();
  }

    /**
        *   @dev Updates minimum liquidity of a pool.
        *   Note: Only Owner function.
        *   @param minLiquidity : Minimum contribution.
  */
    function setMinimumLiquidityPerProvider(
        uint256 minLiquidity
    ) 
        public 
        onlyOwner("Factory - setMinimumLiquidityPerProvider not permitted")
    {
        minContribution = minLiquidity;
    }

    /**@dev Add contributor.
      @param unit : Contribution amount.
      @param isPermissioned : Whether pool is permissioned or not
   */
    function _joinEpoch(
        uint256 unit,
        bool isPermissioned
    )
        internal
        returns(bool)
    {
        CommonEventData memory ced =  data.addToBand(AddTobandParam(unit, isPermissioned));
        emit NewMemberAdded(ced);
        unchecked {
            analytics.tvlInUsd += ced.pool.uint256s.unit;
        }
        return true;
    }

    /** @dev Providers borrow from their pool provided the citeria are met.
        @param unit : Epoh Id user wants to borrow from. 
        @notice Users can be members of multiple epoches. This enlarges the
        volume of funds they can access. 

        - This is a payable function since borrowers are required to stake XFI
        before they can access funds in epoches.
        - The contract must be in a usable state i.e not paused.
        - For the selected epoch, the getFinance() must already be unlocked. Unlocking 
        is automated soon as the required quorum for the epoch is achieved i.e the 
        numbers of providers equals the set quorum.
        @param daysOfUseInHr : The time in hours the borrower wishes to retain the loan
        before paying back.
  */
    function getFinance(
        uint256 unit,
        uint8 daysOfUseInHr
    )
        external
        payable
        whenNotPaused
        onlyInitialized(unit, true)
        returns (bool)
    {
        (CommonEventData memory ced) = data.getFinance(unit, msg.value, daysOfUseInHr, _getXFIPriceInUSD);
        emit GetFinanced(ced);
        Analytics memory atl = analytics;
        unchecked {
            atl.tvlInXFI += msg.value;
            atl.tvlInUsd -= ced.pool.uint256s.currentPool;
        }
        analytics = atl;
        return true;
    }

    /**
    @dev Return borrowed fund.
      @param unit : Contribution
     See FactoryLib.payback().
   */
    function payback(
        uint256 unit
    )
        external
        whenNotPaused
        onlyInitialized(unit, true)
        returns (bool)
    {
        CommonEventData memory ced = data.payback(PaybackParam(unit, _msgSender()));
        unchecked {
            analytics.tvlInUsd += ced.debtBal;
            analytics.tvlInXFI -= ced.colBal;
        }
        emit Payback(ced);
        return true;
    }

    /**
  @dev Liquidate defaulter.
    Note: The expected repayment time for last paid contributor must have passed.
    See FactoryLib.liquidate() for more details.
    @param unit : Epoch Id
  */
    function liquidate(uint256 unit) 
        external 
        whenNotPaused 
        onlyInitialized(unit, true)
        returns (bool) 
    {
        CommonEventData memory ced = data.liquidate(unit);
        emit Payback(ced);
        Analytics memory atl = analytics;
        unchecked {
            atl.tvlInXFI -= ced.colBal;
            atl.tvlInUsd += ced.debtBal;
        }
        analytics = atl;
        return true;
    }

    /**
     * @dev See FactoryLib.enquireLiquidation
     */
    function enquireLiquidation(uint256 unit) 
        external
        view 
        onlyInitialized(unit, true)
        returns (Contributor memory, bool, uint, Slot memory, address)
    {
        return data._enquireLiquidation(unit);
    }

    /**
     * @dev Returns collaterl quote for the epoch.
     * @param unit : EpochId
     * @return collateral Collateral
     * @return colCoverage Collateral coverage
     */
    function getCollaterlQuote(
        uint256 unit
    )
        external
        view
        onlyInitialized(unit, true)
        returns(uint collateral, uint24 colCoverage)
    {
        Pool memory _p = data._getCurrentPool(unit).data;
        unchecked {
            (collateral, colCoverage) = (FactoryLibV2._computeCollateral(
                _p.uint256s.unit * _p.uints.quorum,
                0,
                uint24(_p.uints.colCoverage),
                _getXFIPriceInUSD()
            ), uint24(_p.uints.colCoverage));
        }
        return (collateral, colCoverage);

    }

    /**
     * Returns the current debt of target user.
     * @param unit : Epoch Id
     * @param target : Target user.
     */
    function getCurrentDebt(
        uint256 unit,
        address target
    ) 
        external
        view 
        onlyInitialized(unit, true)
        returns (uint256) 
    {
        return data._getCurrentDebt(unit, target).debt;
    }

    /**
     * @dev Returns the profile of user
     * @param unit : unit contribution
     * @param user : User
     */
    function getProfile(
        uint256 unit,
        address user
    )
        external
        view
        onlyInitialized(unit, false)
        returns(Contributor memory) 
    {
        return data.getProfile(user, unit);
    }

    /**
     * @dev Set state variables.
     * @param feeTo : Fee receiver.
     * @param assetAdmin : AssetAdmin contract.
     * @param serviceRate : fee in %.
     * - Only-owner function.
     */
    function setContractData(
        address feeTo,
        address assetAdmin,
        uint16 serviceRate,
        address bankFactory
    ) 
        public
        onlyOwner("Factory - setContractData not permitted")
        returns(bool)
    {
        return data.setContractData(assetAdmin, feeTo, serviceRate, bankFactory);
    }

    /**
     * @dev Returns both ERC20 and Native balances locked in an epoch
     * @param unit : Epoch Id
     */
    function getBalances(
        uint256 unit
    )   
        external
        view
        onlyInitialized(unit, false)
        returns(Balances memory)
    {
        return data._getBalancesInBank(unit);
    }

    function getStatus(uint256 unit) external view returns(Unit memory _unit) {
        _unit = data.units[unit];
        return _unit;
    }

    /**
     * @dev See FactoryLib._cancelBand()
     */
    function _removeLiquidityPool(
        uint256 unit,
        bool isPermissionLess
    ) 
        internal
        whenNotPaused 
        onlyInitialized(unit, true)
        returns (bool)
    {
        analytics.tvlInUsd -= data.removeLiquidity(unit, isPermissionLess).data.uint256s.unit; 
        emit Cancellation(unit);

        return true;
    }

    /**
     * @dev Returns a single pool for 'unit'
     * @param unitId : Contribution Id.
     */
    function getPoolData(
        uint unitId
    ) 
        external 
        view 
        returns(Pool memory) 
    {
        return data.getData(unitId);
    }

    /// @dev Return past pools using unitId. @notice The correct unitId must be parsed.
    function getRecord(uint uId) external view returns(Pool memory pool) {
        pool = data.getRecord(uId);
        return pool;
    }

    function getPoint(address user) external view returns(Point memory point) {
        point = data.getPoints(user);
        return point;
    }

    function getSlot(address user, uint256 unit) 
        external 
        view 
        onlyInitialized(unit, false)
        returns(Slot memory) 
    {
        return data.getSlot(user, unit);
    }

    function getFactoryData()
        public
        view
        returns(ViewFactoryData memory)
    {
        return ViewFactoryData(analytics, data.pData, data.getEpoches(), data.getRecordEpoches());
    }
    
    /**
     * @dev Get price of SIMT in USD.
     * @notice from price oracle
     * Assuming the price of XFI is 10$
     */
    function _getXFIPriceInUSD() 
        internal 
        pure 
        returns (uint _price) 
    {
        _price = 10000000000000000000; // ================================================> We use oracle here
    }
}