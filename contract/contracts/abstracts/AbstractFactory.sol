// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { FactoryLib, Data } from "../libraries/FactoryLib.sol";
import { FuncHandler } from "../peripherals/FuncHandler.sol";
import { IFactory } from "../apis/IFactory.sol";
import { IAssetClass } from "../apis/IAssetClass.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**@title Abstract Factory contract
 * Non deployable.
*/

abstract contract AbstractFactory is
    IFactory,
    FuncHandler,
    ReentrancyGuard
{
    using FactoryLib for Data;

    Data private data;

    // Creation fee
    uint public creationFee;

    // Minimum amount that can be contributed
    uint public minContribution;

    modifier validateEpochId(uint epochId) {
        data.verifyEpochId(epochId);
        _;
    }

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
    
    /**
     * See _setUp() for doc
     */
    constructor(
        uint16 serviceRate,
        uint _minContribution,
        uint setUpFee,
        address feeTo,
        address assetClass,
        address strategyManager,
        address _ownershipManager
    ) FuncHandler(_ownershipManager){
        _setUp(
            serviceRate, 
            _minContribution, 
            setUpFee, 
            feeTo, 
            assetClass, 
            strategyManager
        );
    }

    ///@dev Fallback
    receive() external payable {}

    /**
     * @dev Withdraws XFI balances of this contract if any. OnlyOwner function
     * @param value : Amount to withdraw
     */
    function withdrawXFI(
        uint value
    )
        public
        onlyOwner("Factory - withdrawXFI not permitted")
    {
        require(value > 0 && address(this).balance >= value, "Value is 0 || 0 balalnce");
        (bool success,) = data.pData.feeTo.call{value: value}('');
        require(success,"Withdrawal Failed");
    }


    /** @dev See _setUp() for doc.
     */
    function performSetUp(
        uint16 serviceRate,
        uint _minContribution,
        uint setUpFee,
        address feeTo,
        address assetClass,
        address strategyManager
    ) public onlyOwner("Factory - performSetUp not permitted") {
        _setUp(
            serviceRate, 
            _minContribution, 
            setUpFee, 
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
     * @param setUpFee : Amount charged for setting up a liquidity pool.
     * @param feeTo : Fee recipient.
     * @param assetClass : Asset manager contract.
     * @param strategyManager : Strategy manager contract.
     */
    function _setUp(
        uint16 serviceRate,
        uint _minContribution,
        uint setUpFee,
        address feeTo,
        address assetClass,
        address strategyManager
    ) private {
        minContribution = _minContribution;
        data.pData = ContractData(feeTo, assetClass, serviceRate, strategyManager);
        creationFee = setUpFee;
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
      @param liquidAsset - Liquidity asset. This will often be an ERC20 compatible asset.
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
        address liquidAsset,
        address[] memory contributors,
        Router router
    )
        internal 
        whenNotPaused
        onlySupportedAsset(liquidAsset)
        returns (uint)
    {
        bool isPermissionless = router == Router.PERMISSIONLESS;
        isPermissionless? require(quorum > 1, "Router: Quorum is invalid") : require(contributors.length > 1, "Min of 2 members");
        CreatePoolParam memory cpp = 
            CreatePoolParam(
                {
                    intRate: intRate,
                    quorum: quorum,
                    duration: durationInHours,
                    colCoverage: colCoverage, 
                    unitContribution: unitLiquidity,
                    members: contributors,
                    asset: liquidAsset
                }
            );
        CreatePoolReturnValue memory crp = !isPermissionless ? data
            .createPermissionedPool(cpp)
                : data.createPermissionlessPool(cpp);
        emit BandCreated(crp);
        return crp.pool.uint256s.epochId;
    } 

    /** @dev Return current epoch. 
     * This is also total epoches generated to date 
    */
    function epoches() 
        external 
        view 
        returns(uint)
    {
        return data._getEpoches();
        // return _epoches == 0? 0 : _epoches - 1;
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
      @param epochId : Epoch id.
      @param isPermissioned : Whether pool is permissioned or not
   */
    function _joinEpoch(
        uint epochId,
        bool isPermissioned
    )
        internal
        returns(bool)
    {
        emit NewMemberAdded(
            data.addToBand(
                AddTobandParam(
                    epochId,
                    isPermissioned
                )
            )
        );
        return true;
    }

    /** @dev Providers borrow from their pool provided the citeria are met.
        @param epochId : Epoh Id user wants to borrow from. 
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
        uint epochId,
        uint8 daysOfUseInHr
    )
        external
        payable
        whenNotPaused
        validateEpochId(epochId)
        returns (bool)
    {
        emit GetFinanced(
            data.getFinance(
                epochId, 
                msg.value,
                daysOfUseInHr,
                _getXFIPriceInUSD
            )
        );
        return true;
    }

    /**
    @dev Return borrowed fund.
      @param epochId : Pool number.
     See FactoryLib.payback().
   */
    function payback(
        uint epochId
    )
        external
        whenNotPaused
        validateEpochId(epochId)
        returns (bool)
    {
        emit Payback(
            data.payback(
                PaybackParam(
                    epochId,
                    _msgSender()
                ),
                _setPermit
            )
        );
        return true;
    }

    /**
  @dev Liquidate defaulter.
    Note: The expected repayment time for last paid contributor must have passed.
    See FactoryLib.liquidate() for more details.
    @param epochId : Epoch Id
  */
    function liquidate(
        uint epochId
    ) 
        external 
        whenNotPaused 
        validateEpochId(epochId)
        returns (bool) 
    {
        emit Liquidated(
            data.liquidate(epochId, _setPermit)
        );
        return true;
    }

    /**
     * @dev See FactoryLib.enquireLiquidation
     */
    function enquireLiquidation(
        uint epochId
    ) 
        external
        view 
        validateEpochId(epochId)
        returns (ContributorData memory, bool, uint) 
    {
        return data._enquireLiquidation(epochId);
    }

    /**
     * @dev Withdraws Collateral balance if any
     * @param epochId : Epoch Id
     */
    function withdrawCollateral(uint epochId)
        external
        validateEpochId(epochId)
        checkPermit(epochId, FuncTag.WITHDRAW)
        returns(bool)
    {
        data._withdrawCollateral(epochId);
        return true;
    }

    /**
     * @dev Returns collaterl quote for the epoch.
     * @param epochId : EpochId
     * @return collateral Collateral
     * @return colCoverage Collateral coverage
     */
    function getCollaterlQuote(
        uint epochId
    )
        external
        view
        validateEpochId(epochId)
        returns(uint collateral, uint24 colCoverage)
    {
        Pool memory pool = data._fetchPool(epochId);
        (collateral, colCoverage) = (FactoryLib._computeCollateral(
            pool.uint256s.currentPool,
            0,
            uint24(pool.uints.colCoverage),
            _getXFIPriceInUSD()
        ), uint24(pool.uints.colCoverage));
        return (collateral, colCoverage);

    }

    /**
     * Returns the current debt of target user.
     * @param epochId : Epoch Id
     * @param target : Target user.
     */
    function getCurrentDebt(
        uint epochId,
        address target
    ) 
        external
        view 
        validateEpochId(epochId)
        returns (uint) 
    {
        return data._getCurrentDebt(epochId, target).debt;
    }

    /**
     * @dev Returns the profile of user
     * @param epochId : Epoch Id
     * @param user : User
     */
    function getProfile(
        uint epochId,
        address user
    )
        external
        view
        validateEpochId(epochId)
        returns(ContributorData memory) 
    {
        return data.getProfile(user, epochId);
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
        uint256 _creationFee
    ) 
        public
        onlyOwner("Factory - setContractData not permitted")
        returns(bool)
    {
        if(creationFee == 0) {
            creationFee = _creationFee;
        }
        return data.setContractData(assetAdmin, feeTo, serviceRate);
    }

    /**
     * @dev Returns both ERC20 and Native balances locked in an epoch
     * @param epochId : Epoch Id
     */
    function getBalances(
        uint epochId
    )   
        external
        view
        validateEpochId(epochId)
        returns(Balances memory)
    {
        return data._getBalancesOfStrategy(epochId);
    }

    /**
     * @dev See FactoryLib._cancelBand()
     */
    function _removeLiquidityPool(
        uint epochId,
        bool isPermissionLess
    ) 
        internal 
        whenNotPaused 
        validateEpochId(epochId)
        returns (bool)
    {
        data.cancelBand(
            epochId, 
            isPermissionLess,
            _setPermit
        );
        emit Cancellation(epochId);

        return true;
    }

    /**
     * @dev Returns a single pool for 'epochId'
     * @param epochId : Epoch id.
     */
    function getPoolData(
        uint epochId
    ) 
        external 
        view 
        validateEpochId(epochId)
        returns(Pool memory) 
    {
        return data._fetchPool(epochId);
    }

    /**@dev Returns pool from all epoched array */
    function getPoolFromAllEpoches() 
        public
        view 
        returns(Pool[] memory pools) 
    {
        return data.fetchPools();
    }

    function getContractData()
        public
        view
        returns(ContractData memory result)
    {
        result = data.pData; 
    }
    
    /**
     * @dev Get price of SIMT in USD.
     * @notice from price oracle
     * Assuming the price of XFI is 0.5$
     */
    function _getXFIPriceInUSD() 
        internal 
        pure 
        returns (uint _price) 
    {
        _price = 9900000000000000000; // ================================================> We use oracle here
    }
}