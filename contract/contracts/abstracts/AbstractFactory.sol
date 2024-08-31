// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { FactoryLib, Data, Def } from "../libraries/FactoryLib.sol";
import { FuncHandler } from "../peripherals/FuncHandler.sol";
import { Utils } from "../libraries/Utils.sol";
import { IFactory } from "../apis/IFactory.sol";
import { IAssetClass } from "../apis/IAssetClass.sol";
import { ISmartStrategyAdmin } from "../apis/ISmartStrategyAdmin.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";

/**@title Abstract Router Contract
 * This is not deployable since marked abstract.
*/

abstract contract AbstractFactory is
    IFactory,
    FuncHandler,
    Pausable,
    Ownable
{
    using Utils for bool;
    using FactoryLib for Data;

    Data private data;

    // Creation fee
    uint public creationFee;

    // Minimum amount that can be contributed
    uint public minContribution;

    ISmartStrategyAdmin public strategyAdmin;

    /**
     * @dev Only supported assets are allowed.
     * Note: Asset must be supported by the asset contract.
     * @param _asset : Input asset contract address
     */
    modifier onlySupportedAsset(address _asset) {
        if (!IAssetClass(data.pData.assetAdmin).isSupportedAsset(_asset)) {
            revert IAssetClass.UnSupportedAsset(_asset);
        }
        _;
    }

    constructor(
        uint16 makerRate,
        uint _minContribution,
        address _token,
        address _feeTo,
        address _assetAdmin,
        address _strategyAdmin,
        address _trustee
    ) Ownable(_msgSender()) {
        _RouterInitSetUp(makerRate, _minContribution, 1e17 wei, _token, _feeTo, _assetAdmin, _strategyAdmin,_trustee);
    }

    /** @dev Can be used to perform upgrade by simply resetting the state variables.
     * @notice The new contracts must be compaitble with the previous interfaces
     *
     * @param _token : Token contract
     * @param _minContribution : Minimum contribution amount.
     * @param _feeTo : Account to receive fees.
     * @param _assetAdmin : Asset admin contract.
     * @param _strategyAdmin : Strategy admin contract.
     */
    function performSetUp(
        uint16 makerRate,
        uint _minContribution,
        uint _bandCreationFee,
        address _token,
        address _feeTo,
        address _assetAdmin,
        address _strategyAdmin,
        address _trustee
    ) public onlyOwner {
        _RouterInitSetUp(makerRate, _minContribution, _bandCreationFee, _token, _feeTo, _assetAdmin, _strategyAdmin,_trustee);
    }

    function _RouterInitSetUp(
        uint16 makerRate,
        uint _minContribution,
        uint _bandCreationFee,
        address _token,
        address _feeTo,
        address _assetAdmin,
        address _strategyAdmin,
        address _trustee
    ) private {
        data.pData.token = _token;
        data.pData.feeTo = _feeTo;
        minContribution = _minContribution;
        data.pData = ContractData(_feeTo, _token, _assetAdmin, makerRate);
        strategyAdmin = ISmartStrategyAdmin(_strategyAdmin);
        creationFee = _bandCreationFee;
        data.trustee = _trustee;
    }

    /**
     * @dev Get strategy
     * @param user : User account
     * @notice If there is no associated strategy to user, we will deploy a new instance 
     * for them. 
     */
    function _getStrategy(address user) internal returns (address _smartStrategy) {
        _smartStrategy = ISmartStrategyAdmin(strategyAdmin).getStrategy(user);
        if(_smartStrategy == address(0)) {
            _smartStrategy = ISmartStrategyAdmin(strategyAdmin).createStrategy(user);
        }
    }

    /**
    @dev Launche a new pool. Based on router, it could be permissioned or permissionkless.
      @param quorum - Required number of participants to form a band. 
      @param durationInHours - The maximum time limit (from when the turn time begins) with which a participant
                                will take custody of the loan before repayment.
      @param colCoverageRatio - Collateral factor - determinant of the amount of collateral to require of gFer.
                                This is expressed as a multiple index of total loanable amount.
      @param amount - Unit contribution.
      @param asset - address of the ERC20 standard asset to use.
      Note: asset must be supported by digesu.
  */
    function _createPool(
        uint8 quorum,
        uint8 durationInHours,
        uint16 colCoverageRatio,
        uint amount,
        address asset,
        address[] memory participants,
        Router _router
    )
        internal 
        whenNotPaused
        onlySupportedAsset(asset)
        returns (uint)
    {
        bool isPermissionless = _router == Router.PERMISSIONLESS;
        isPermissionless? require(quorum > 0, "Router: Quorum is invalid") : require(participants.length > 1, "Min of 2 members");
        CreatePoolReturnValueParam memory crp = !isPermissionless ? data
            .createPermissionedPool(
               CreatePermissionedPoolInputParam(
                 CreatePoolParam(
                    quorum,
                    durationInHours,
                    colCoverageRatio,
                    amount,
                    participants,
                    asset
                ),
                _getStrategy,
                _unlockFunction
               )
            ) : data.createPermissionlessPool(CreatePoolParam(quorum, durationInHours, colCoverageRatio, amount, participants, asset ), _getStrategy, _unlockFunction);

        emit BandCreated(crp.poolId, crp.pool, crp.info, crp.pos);
        return crp.poolId;
    }

    function currentPoolId() external view returns(uint) {
        return data._getPoolCount();
    }

    /**
    @dev Updates minimum amount contribution amount
      Note: Only Owner function.
    @param newAmount : Minimum contribution amount
  */
    function updateMinContributionAmount(uint256 newAmount) public onlyOwner {
        minContribution = newAmount;
    }

    /**@dev Add new member.
      @param poolId : Band index.
      @param isPermissioned : Whether pool is permissioned or not
   */
    function _joinBand(
        uint poolId,
        bool isPermissioned
    )
        internal
        virtual
        returns(bool)
    {
        (, StrategyInfo memory info) = data.addToBand(
            AddTobandParam(
                poolId,
                isPermissioned,
                _getStrategy,
                _lockFunction,
                _unlockFunction
            )
        );
        emit NewMemberAdded(poolId, info);

        return true;
    }

    /**@dev Members of a pool can pick up the contributed fund when certain coditions are met.
      @param poolId : Band's Id which caller belong to.

  */
    function getFinance(
        uint poolId
    )
        external
        payable
        whenNotPaused
        checkFunctionPass(poolId, FuncTag.GET)
        returns (bool)
    {
        StrategyInfo memory info = data.getFinance(poolId, _lockFunction, _unlockFunction, _getStrategy, _getPriceInUSD);
        emit GetFinanced(poolId, info);

        return true;
    }

    /**
    @dev Utility to payback borrowed fund.
      @param poolId : Pool number.
     See FactoryLib._payback().
   */
    function payback(
        uint poolId
    )
        external
        payable
        whenNotPaused
        checkFunctionPass(poolId, FuncTag.PAYBACK)
        returns (bool)
    {
        address strategy = _getStrategy(_msgSender());
        StrategyInfo memory info = FactoryLib._getStrategyInfo(
            data.strategies,
            poolId,
            FactoryLib._getPosition(data.positions, strategy, poolId)
        );
        info = data.payback(
           PaybackParam(
             poolId,
            strategy,
            strategy,
            info,
            _lockFunction,
            _unlockFunction
           )
        );

        emit Payback(poolId, info);
        return true;
    }

    /**
  @dev Liquidate defaulter.
    Note: The expected repayment time for last paid participant must have passed.
    See FactoryLib.liquidate() for more details.
  */
    function liquidate(
        uint poolId
    ) external payable whenNotPaused returns (bool) {
        Def memory _d = FactoryLib._def();
        StrategyInfo memory info = data.liquidate(
          LiquidateParam(
            poolId,
            _d.f,
            _lockFunction,
            _unlockFunction,
            _getStrategy
          )
        );

        emit Liquidated(poolId, info);

        return true;
    }

    /**
     * @dev See FactoryLib.enquireLiquidation
     */
    function enquireLiquidation(
        uint poolId
    ) external view returns (Liquidation memory) {
        (Liquidation memory _liquidated,) = data.enquireLiquidation(poolId);
        return _liquidated;
    }

    ///@dev Pauses contract
    function pause() public onlyOwner {
        _pause();
    }

    ///@dev Unpauses contract
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Set state variables.
     * @param token : Platform token.
     * @param assetAdmin : AssetAdmin contract.
     * @param makerRate : fee in %.
     */
    function setVariables(
        address token,
        address trustee,
        address assetAdmin,
        uint16 makerRate,
        uint256 _creationFee
    ) public onlyOwner {
        data.setContractData(token, trustee, assetAdmin, makerRate);
        if(_creationFee > 0) {
            creationFee = _creationFee;
        }
    }

    /**
     * @dev See FactoryLib._cancelBand()
     */
    function removeBand(
        uint poolId
    ) external payable whenNotPaused returns (bool) {
        Def memory _d = FactoryLib._def();
        data.cancelBand(poolId, _d.f, _getStrategy);

        emit Cancellation(poolId);

        return true;
    }

    /**
     * @dev Return total pool created to date
     */
    function totalPool() public view returns (uint) {
        return data._getPoolCount();
    }

    function getPoolData(uint poolId) external view returns(Pool memory) {
        return data._fetchPoolData(poolId);
    }

    /**
     * @dev Get price of SIMT in USD.
     * @notice from price oracle
     */
    function _getPriceInUSD() internal pure returns (uint _price) {
        _price = 50000000000; // ================================================> We use oracle here
    }
}