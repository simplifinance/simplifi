// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { AbstractFactory } from "../abstracts/AbstractFactory.sol";

/** @title Factory : Main contract
 *  @author Simplifinance - (Bobeu) 
 *  @notice 
 *  A multi p2p lending and borrowing structure where liquidity providers are borrowers. We bring together users form different 
 * parts of the world to form a liquidity synergy, where the pooled fund moved round them from the first to the last on the list
 * in form of borrowed fund.The permissionless model allows users to create liquidity pool for anyone to participate while the 
 * permissioned structure restricts participation only to the known members known as band.
*/

contract Factory is AbstractFactory {
    mapping(uint => Router) public routers;

  /** @dev Initializes state variables.
    * @param serviceRate : Platform fee in %
    * @param minContribution : Minimum contribution amount.
    * @param setUpFee : Amount to charge for setting a liquidity pool.
    * @param feeTo : Account to receive fees.
    * @param assetClass : Asset manager contract.
    * @param strategyManager : Strategy manager contract.
    * @param ownerShipManager : Accessibility manager contract
    */
    constructor(
        uint16 serviceRate,
        uint minContribution,
        uint setUpFee,
        address feeTo,
        address assetClass,
        address strategyManager,
        address ownerShipManager
    ) AbstractFactory(
        serviceRate,
        minContribution,
        setUpFee,
        feeTo,
        assetClass,
        strategyManager,
        ownerShipManager
    ) { }

    /**@dev Create permissioned pool
        See AbstractFactory.sol 
     */
    function createPermissionedPool(
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        uint unitLiquidity,
        address liquidAsset,
        address[] memory contributors
    ) 
        external 
        returns(bool) 
    {
        Router router = Router.PERMISSIONED;
        uint quorum = contributors.length;
        routers[
            _createPool(
                intRate,
                uint8(quorum),
                durationInHours,
                colCoverage,
                unitLiquidity,
                liquidAsset,
                contributors,
                router
            )
        ] = router;
        return true;
    }

    /**@dev Create permissionless
        See AbstractFactory.sol
    */
    function createPermissionlessPool(
        uint16 intRate,
        uint8 quorum,
        uint16 durationInHours,
        uint24 colCoverage,
        uint unitLiquidity,
        address liquidAsset
    ) 
        external 
        returns(bool) 
    {
        Router _router = Router.PERMISSIONLESS;
        address[] memory contributors = new address[](1);
        contributors[0] = _msgSender();
        routers[
            _createPool(
                intRate,
                quorum,
                durationInHours,
                colCoverage,
                unitLiquidity,
                liquidAsset,
                contributors,
                _router
            )
        ] = _router;
        return true;
    }

    /**
     * @dev Remove liquidity pool
     * @param epochId : Epoch/Poool id
     */
    function removeLiquidityPool(
        uint epochId
    )
        external
        validateEpochId(epochId)
        returns(bool)
    {
        _removeLiquidityPool(epochId, routers[epochId] == Router.PERMISSIONLESS);
        return true;
    }
    
    /**@dev See AbstractFactory.sol */
    function joinAPool(
        uint epochId
    ) 
        external 
        whenNotPaused
        validateEpochId(epochId)
        checkFunctionPass(epochId, FuncTag.JOIN) 
        returns(bool) 
    {
        return _joinEpoch(epochId, routers[epochId] == Router.PERMISSIONED);
    }

    /**@dev Return the router for an epochId. 
    */
    function getRouter(
        uint epochId
    ) 
        external 
        view 
        validateEpochId(epochId)
        returns(string memory) 
    {
        return routers[epochId] == Router.PERMISSIONLESS ? "PERMISSIONLESS" : "PERMISSIONED";
    }

}