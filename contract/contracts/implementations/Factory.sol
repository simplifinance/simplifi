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
     * @param feeTo : Account to receive fees.
     * @param assetClass : Asset manager contract.
     * @param bankFactory : BankFactory contract.
     * @param ownerShipManager : Accessibility manager contract
     */
    constructor(
        uint16 serviceRate,
        uint minContribution,
        address feeTo,
        address assetClass,
        address bankFactory,
        address ownerShipManager,
        address diaOracleAddress
    )
        AbstractFactory(
            serviceRate,
            minContribution,
            feeTo,
            assetClass,
            bankFactory,
            ownerShipManager,
            diaOracleAddress
        )
    {}

    /**@dev Create permissioned pool
        See AbstractFactory.sol 
     */
    function createPermissionedPool(
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        uint unitLiquidity,
        address asset,
        address[] memory contributors
    ) external returns (bool) {
        Router router = Router.PERMISSIONED;
        uint quorum = contributors.length;
        routers[
            _createPool(
                intRate,
                uint8(quorum),
                durationInHours,
                colCoverage,
                unitLiquidity,
                asset,
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
        address asset
    ) external returns (bool) {
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
                asset,
                contributors,
                _router
            )
        ] = _router;
        return true;
    }

    /**
     * @dev Remove liquidity pool
     * @param unit : Epoch/Poool id
     */
    function removeLiquidityPool(uint256 unit) external returns (bool) {
        _removeLiquidityPool(unit, routers[unit] == Router.PERMISSIONLESS);
        return true;
    }

    /**@dev See AbstractFactory.sol */
    function joinAPool(uint256 unit) 
        external 
        whenNotPaused
        onlyInitialized(unit, true)
        returns(bool) 
    {
        return _joinEpoch(unit, routers[unit] == Router.PERMISSIONED);
    }

    /**@dev Return the router for an unit.
     */
    function getRouter(uint256 unit) external view returns (string memory) {
        return
            routers[unit] == Router.PERMISSIONLESS
                ? "PERMISSIONLESS"
                : "PERMISSIONED";
    }

}