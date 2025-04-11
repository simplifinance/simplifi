// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { ErrorLib } from "../libraries/ErrorLib.sol";
import { ERC20Manager, IRoleBase, IERC20, ISupportedAsset, ISafeFactory } from "./ERC20Manager.sol";

abstract contract MinimumLiquidity is ERC20Manager {
    using ErrorLib for *;

    // Minimum liquidity a provider can make
    uint public minimumLiquidity;

    // ============= Constructor ================
    constructor(
        ISupportedAsset _assetManager,
        IERC20 _baseAsset, 
        IRoleBase _roleManager,
        ISafeFactory _safeFactory
    ) ERC20Manager(_assetManager, _baseAsset, _roleManager, _safeFactory){
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