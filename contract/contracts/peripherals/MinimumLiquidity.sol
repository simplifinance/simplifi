// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { OnlyRoleBase, IRoleBase } from "./OnlyRoleBase.sol";
import { ErrorLib } from "../libraries/ErrorLib.sol";

abstract contract MinimumLiquidity is OnlyRoleBase {
    using ErrorLib for *;

    // Minimum liquidity a provider can make
    uint public minimumLiquidity;

    // ============= Constructor ================
    constructor(IRoleBase _roleManager) OnlyRoleBase(_roleManager){
        if(address(_roleManager) == address(0)) '_roleManager is zero'._throw();
    }

    /**
     * @dev Set minimum liquidity. 
     * @param _minLiquidity : Minimum liquidity
     * @notice Only accounts with rolebearer access are allowed
     */
    function setMinimumLiquidity(uint _minLiquidity) public onlyRoleBearer {
        if(_minLiquidity == minimumLiquidity) 'Param is same'._throw();
        minimumLiquidity = _minLiquidity;
    }
}