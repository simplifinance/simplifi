// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { FactoryLib, Data, Def } from "../libraries/FactoryLib.sol";
import { FuncHandler } from "../peripherals/FuncHandler.sol";
import { Utils } from "../libraries/Utils.sol";
import { IFactory } from "../apis/IFactory.sol";
import { IAssetClass } from "../apis/IAssetClass.sol";
import { ISmartStrategyAdmin } from "../apis/ISmartStrategyAdmin.sol";
import { Ownable } from "../implementations/Ownable.sol";
import { Pausable } from "../implementations/Pausable.sol";

/**@title Abstract Factory contract
 * Non deployable.
*/

abstract contract AbstractFactory is
    IFactory,
    FuncHandler,
    Pausable
{
    using Utils for bool;
    using FactoryLib for Data;

    Data private data;

    // Creation fee
    uint public creationFee;

    // Minimum amount that can be contributed
    uint public minContribution;

    /**
     * @dev Only owner.
     * @notice Be sure ownerShipManager contract is updated.
    */
    modifier onlyOwner {
        address owMgr = data.pData.ownershipManager;
        if(owMgr == address(0)) revert OwnershipManagerIsNotSet();
        require(IOwnable(data.pData.ownershipManager).isOwner(_msgSender()), "ABFactory: Not permited");
        _;
    }

    /**
     * @dev Only supported assets are allowed.
     * Note: Asset must be supported by the AssetClass contract.
     * @param _asset : Input asset contract address
     */
    modifier onlySupportedAsset(address _asset) {
        if (!IAssetClass(data.pData.assetClass).isSupportedAsset(_asset)) {
            revert IAssetClass.UnSupportedAsset(_asset);
        }
        _;
    }
    
    /**
     * See _setUp() for doc
     */
    constructor(
        uint16 serviceRate,
        uint minContribution,
        uint setUpFee,
        address feeTo,
        address assetClass,
        address strategyManager,
        address strategyManager,
        address ownerShipManager
    ) {
        _setUp(serviceRate, _minContribution, 1e17 wei, _token, _feeTo, _assetClass, _strategyManager,_trustee);
    }

    /** @dev See _setUp() for doc.
     */
    function performSetUp(
        uint16 serviceRate,
        uint minContribution,
        uint setUpFee,
        address feeTo,
        address assetClass,
        address strategyManager,
        address ownershipManager,
    ) public onlyOwner {
        _setUp(serviceRate, minContribution, setUpFee, feeTo, assetClass, strategyManager, ownershipManager);
    }

    /**
     * @dev Can be used to initialize and reinitialized state variables.
     * @notice Only address with owner role can call. Check Ownable.sol to see 
     * how we manage ownership (different from OZ pattern). 
     * @param serviceRate : Platform fee
     * @param minContribution : Minimum acceptable unit in liquidity pool.
     * @param setUpFee : Amount charged for setting up a liquidity pool.
     * @param feeTo : Fee recipient.
     * @param assetClass : Asset manager contract.
     * @param strategyManager : Strategy manager contract.
     * @param ownerShipManager : Ownership Manager contract.
     */
    function _setUp(
        uint16 serviceRate,
        uint minContribution,
        uint setUpFee,
        address feeTo,
        address assetClass,
        address strategyManager,
        address ownerShipManager
    ) private {
        minContribution = minContribution;
        data.pData = ContractData(feeTo, assetClass, serviceRate, strategyManager, ownerShipManager);
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
        onlySupportedAsset(asset)
        returns (uint)
    {
        bool isPermissionless = router == Router.PERMISSIONLESS;
        isPermissionless? require(quorum > 0, "Router: Quorum is invalid") : require(contributors.length > 1, "Min of 2 members");
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
        CreatePermissionedPoolParam memory cpi = ;
        CreatePoolReturnValue memory crp = !isPermissionless ? data
            .createPermissionedPool(
                CreatePermissionedPoolParam(
                    cpp, 
                    _unlockFunction
                )
            ) : data.createPermissionlessPool(cpp, _unlockFunction);
        emit BandCreated(crp);
        return crp.epochId;
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
    }

    /**
        *   @dev Updates minimum liquidity of a pool.
        *   Note: Only Owner function.
        *   @param minLiquidity : Minimum contribution.
  */
    function setMinimumLiquidityUnit(
        uint256 minLiquidity
    ) 
        public 
        onlyOwner 
    {
        data.pData.minContribution = minLiquidity;
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
                    isPermissioned,
                    _lockFunction,
                    _unlockFunction
                )
            )
        );
        return true;
    }

    /**@dev Providers borrow from their pool provided the citeria are met.
      @param epochId : Epoh Id user wants to borrow from. 
      @notice Users can be members of multiple epoches. This enlarges the
      volume of funds they can access. 

      - This is a payable function since borrowers are required to stake XFI
      before they can access funds in epoches.
      - The contract must be in a usable state i.e not paused.
      - For the selected epoch, the getFinance() must already be unlocked. Unlocking 
      is automated soon as the required quorum for the epoch is achieved i.e the 
      numbers of providers equals the set quorum.

  */
    function getFinance(
        uint epochId,
        uin16 daysOfUseInHr
    )
        external
        payable
        whenNotPaused
        checkFunctionPass(epochId, FuncTag.GET)
        returns (bool)
    {
        emit GetFinanced(
            data.getFinance(
                epochId, 
                msg.value,
                daysOfUseInHr,
                _lockFunction, 
                _unlockFunction, 
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
        checkFunctionPass(epochId, FuncTag.PAYBACK)
        returns (bool)
    {
        emit Payback(
            data.payback(
                PaybackParam(
                    epochId,
                    _msgSender(),
                    _lockFunction,
                    _unlockFunction
                )
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
        returns (bool) 
    {
        emit Liquidated(
            data.liquidate(
                LiquidateParam(
                    epochId,
                    _d.f,
                    _lockFunction,
                    _unlockFunction
                )
            )
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
        returns (Liquidation memory, bool) 
    {
        return data.enquireLiquidation(epochId);
    }

    /**
     * @dev Set state variables.
     * @param token : Platform token.
     * @param assetClass : AssetAdmin contract.
     * @param serviceRate : fee in %.
     * - Only-owner function.
     */
    function setContractData(
        address token,
        address trustee,
        address assetClass,
        uint16 serviceRate,
        uint256 _creationFee
    ) public {
        if(creationFee == 0) {
            creationFee = _creationFee;
        }
        return data.setContractData(token, trustee, assetClass, serviceRate);
    }

    /**
     * @dev See FactoryLib._cancelBand()
     */
    function removePermissionedPool(
        uint epochId
    ) 
        external 
        whenNotPaused 
        returns (bool)
    {
        data.cancelBand(epochId, FactoryLib._def().f);
        emit Cancellation(epochId);

        return true;
    }

    /**
     * @dev See FactoryLib._cancelBand()
     */
    function removePermissionLessPool(
        uint epochId
    ) 
        external 
        whenNotPaused 
        returns (bool)
    {
        data.cancelBand(epochId, FactoryLib._def().t);

        emit Cancellation(epochId);

        return true;
    }

    /**
     * @dev Return total pool created to date
     */
    function totalPool() 
        public 
        view returns (uint) 
    {
        return data._getPoolCount();
    }

    function getPoolData(
        uint epochId
    ) 
        external 
        view 
        returns(Pool memory) 
    {
        return data._fetchPoolData(epochId);
    }

    /**
     * @dev Get price of SIMT in USD.
     * @notice from price oracle
     */
    function _getXFIPriceInUSD() 
        internal 
        pure 
        returns (uint _price) 
    {
        _price = 50000000000; // ================================================> We use oracle here
    }
}