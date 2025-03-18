// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { AbstractFactory } from "../abstracts/AbstractFactory.sol";

/** @title Factory
 *  @author Simplifinance - Written by Isaac J (https://github.com/bobeu) 
 * A protocol for short-term lending and borrowing services through a peer-funding mechanism, with an auto-AI yield dashboard. This is a structure where liquidity providers are also the borrowers.
 * Two currencies are used:
 *        - Native currency/Platform/Base currency e.g Celo, XFI, ETH, etc. This is the currency used as collateral.
 *        - Stable coin e.g cUSD, xUSD, USDT etc. This is the base currency use for contribution.
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