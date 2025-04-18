// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { ErrorLib } from "../libraries/ErrorLib.sol";
import { Utils } from "../libraries/Utils.sol";
import { Pool, IRoleBase, ISupportedAsset, IERC20, IPoint, ISafeFactory } from "./Pool.sol";

/** 
 * 
 * @title FeeToAndRate
 * @author : Simplifi. Written by Isaac Jesse a.k.a Bobeu https://github.com/bobeu
 * @notice : Non-deployable contract for updating and retrieving the fee receiver account and the platform rate.
 * It should be implemented by the child contract.
 */
abstract contract FeeToAndRate is Pool {
    using ErrorLib for *;

    // Fee recipient
    address public feeTo;

    // Platform fee (in %)
    uint public makerRate;

    /**
     * =================== Constructor ===============
     * @param _roleManager : Role manager contract
     * @param _feeTo : Fee recipient
     * @param _makerRate : Platform fee
     * 
     */
    constructor(
        address _feeTo, 
        uint16 _makerRate,
        address _diaOracleAddress, 
        IRoleBase _roleManager, 
        ISupportedAsset _assetManager, 
        IERC20 _baseAsset,
        IPoint _pointFactory,
        ISafeFactory _safeFactory
    ) Pool(_diaOracleAddress, _assetManager, _roleManager, _baseAsset, _pointFactory, _safeFactory) {
        if(_feeTo == feeTo) '_feeTo is empty'._throw();
        if(_makerRate > Utils._getBase()) 'Invalid maker rate'._throw();
        feeTo = _feeTo;
        makerRate = _makerRate;
    }

    /**
     * @dev Set fee or maker rate. The status of the value parsed determines which to update.
     * @param _feeTo : Fee receiving account. 
     * @param _makerRate : Platform fee (in %)
     * @notice : For detailed doc on setting maker rate, see Utils.sol._getPercentage()
     */
    function setFeeOrMakerRate(
        address _feeTo,
        uint16 _makerRate
    ) public onlyRoleBearer returns(bool) {
        if(_feeTo != feeTo && _feeTo != address(0)) feeTo = _feeTo;
        if(_makerRate > 0 && _makerRate < Utils._getBase()) makerRate = _makerRate;
        return true;
    }
    
}