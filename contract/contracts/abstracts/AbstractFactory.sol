// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

// import "hardhat/console.sol";
import { FactoryLibV3, Data } from "../libraries/FactoryLibV3.sol";
import { Pausable } from "./Pausable.sol";
import { IFactory } from "../apis/IFactory.sol";
import { IDIAOracleV2 } from "../apis/IDIAOracleV2.sol";
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
    using FactoryLibV3 for Data;

    // Storage of type FactoryLibV3.Data
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
        data._isInitialized(unit, secondCheck);
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
        address _ownershipManager,
        address _diaOracleAddress
    ) Pausable(_ownershipManager) {
        _setUp(
            serviceRate, 
            _minContribution, 
            feeTo, 
            assetClass, 
            strategyManager
        );
        diaOracleAddress = _diaOracleAddress;
    }

    ///@dev Fallback
    receive() external payable {
        if(msg.value > 15e14 wei) {
            (bool success,) = data.pData.feeTo.call{value:msg.value}('');
            if(!success) revert ();
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
    ) public onlyOwner {
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
        if(isPermissionless) {
            if(quorum <= 1) revert MinimumParticipantIsTwo();
        } else {
            if(contributors.length <= 1) revert MinimumParticipantIsTwo();
        }
        CreatePoolParam memory cpp = CreatePoolParam(intRate, quorum, durationInHours, colCoverage, unitLiquidity, contributors, asset);
        emit PoolCreated(
            !isPermissionless ? data
            .createPermissionedPool(cpp)
                : data.createPermissionlessPool(cpp)
        );
        Analytics memory alt = analytics;
        analytics = Analytics(
            alt.tvlInXFI, 
            alt.tvlInUsd + unitLiquidity, 
            isPermissionless? alt.totalPermissioned : alt.totalPermissioned + 1,
            isPermissionless? alt.totalPermissionless + 1 : alt.totalPermissionless
        );
        return unitLiquidity;
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
        onlyOwner
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
        unchecked {
            analytics.tvlInUsd += unit;
        }
        emit NewContributorAdded(
            data.addContributor(AddTobandParam(unit, isPermissioned))
        );
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
        (Pool memory _p, uint256 amtFinanced) = data.getFinance(unit, msg.value, daysOfUseInHr, diaOracleAddress == address(0)? 18 : 8, _getXFIPriceInUSD);
        Analytics memory atl = analytics;
        unchecked {
            atl.tvlInXFI += msg.value;
            atl.tvlInUsd -= amtFinanced;
        }
        analytics = atl;
        emit GetFinanced(_p);
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
        (uint amtPayBackInUSD, uint colWithdrawn, Pool memory _p) = data.payback(PaybackParam(unit, _msgSender()));
        unchecked {
            analytics.tvlInUsd += amtPayBackInUSD;
            analytics.tvlInXFI -= colWithdrawn;
        }
        emit Payback(_p);
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
        (uint amtPayBackInUSD, uint colWithdrawn, Pool memory _p) = data.liquidate(unit);
        emit Payback(_p);
        Analytics memory atl = analytics;
        unchecked {
            atl.tvlInXFI -= colWithdrawn;
            atl.tvlInUsd += amtPayBackInUSD;
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
            (collateral, colCoverage) = (FactoryLibV3._computeCollateral(
                _p.uint256s.unit * _p.uints.quorum,
                0,
                uint24(_p.uints.colCoverage),
                _getXFIPriceInUSD(),
                diaOracleAddress == address(0)? 18 : 8
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
        onlyOwner
        returns(bool)
    {
        return data.setContractData(assetAdmin, feeTo, serviceRate, bankFactory);
    }

    function setOracleAddress(address newOracleAddr) public onlyOwner {
        if(newOracleAddr == address(0)) revert OracleAddressIsZero();
        diaOracleAddress = newOracleAddr;
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

    function getStatus(uint256 unit) external view returns(string memory) {
        return data._getCurrentPool(unit).data.status == Status.AVAILABLE? 'AVAILABLE' : 'TAKEN';
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
        uint256 tvlInUsd = analytics.tvlInUsd;
        unchecked {
            if(tvlInUsd > unit) analytics.tvlInUsd = tvlInUsd - unit; 
        }
        data.removeLiquidity(unit, isPermissionLess);
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
        returns(ReadDataReturnValue memory) 
    {
        return data.getData(unitId);
    }

    /// @dev Return past pools using unitId. @notice The correct unitId must be parsed.
    function getRecord(uint rId) external view returns(ReadDataReturnValue memory) {
        return data.getRecord(rId);
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
     * @dev Get price of XFI in USD.
     * @notice from price oracle
     */
    function _getXFIPriceInUSD() 
        internal 
        view 
        returns (uint128 _price) 
    {
        if(diaOracleAddress != address(0)) {
            (uint128 price,) = IDIAOracleV2(diaOracleAddress).getValue('XFI/USD');
            _price = price;
        } else {
            _price = 10000000000000000000;
        }
    }

    address public diaOracleAddress;
}