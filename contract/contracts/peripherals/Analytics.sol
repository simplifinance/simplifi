// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol"; 

abstract contract Analytics {
    Common.Analytics public analytics;

    uint public makerRate;

    constructor(uint _makerRate) {
        makerRate = _makerRate;
    }

    /**@dev Add or adjust analytic data. These data are for view only
     * @param tvlInBaseCurrency : Amount to add or remove from value locked in BaseCurrency i.e asset used for contribution
     * @param tvlInCollateral : Amount to add or remove from value locked in Collateral token
     * @param isNewPool : Whether the action is to create new pool or not.
     * @param isPermissionless : Whether the new pool is permissionless or not.
     * @param addBase : Whether to add the base currency or not.
     * @param addCol : Whether to add collateral tvl or not.
     */
    function _createAnalytics(
        uint tvlInBaseCurrency, 
        uint tvlInCollateral,
        bool isNewPool,
        bool isPermissionless,
        bool addBase,
        bool addCol
    ) internal {
        Common.Analytics memory ana = analytics;
        if(isNewPool) {
            if(isPermissionless) ana.totalPermissionless += 1;
            else ana.totalPermissioned += 1;
        }
        if(tvlInBaseCurrency > 0) {
            unchecked {
                if(addBase) ana.tvlInBaseCurrency += tvlInBaseCurrency;
                else {
                    assert(ana.tvlInBaseCurrency >= tvlInBaseCurrency);
                    ana.tvlInBaseCurrency -= tvlInBaseCurrency;
                }
            }
        }

        if(tvlInCollateral > 0) {
            unchecked {
                if(addCol) ana.tvlInCollateral += tvlInCollateral;
                else {
                    assert(ana.tvlInCollateral >= tvlInCollateral);
                    ana.tvlInCollateral -= tvlInCollateral;
                }
            }
        }
        analytics = ana; 
    }
}