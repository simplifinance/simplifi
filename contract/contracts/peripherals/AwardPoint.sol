// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IPoint, Common } from "../interfaces/IPoint.sol";
import { IPriceOracle } from "../interfaces/IPriceOracle.sol";
import { ErrorLib } from "../libraries/ErrorLib.sol";
import { ERC20Manager, IERC20, ISupportedAsset, IRoleBase, ISafeFactory } from "./ERC20Manager.sol";

abstract contract AwardPoint is ERC20Manager {
    using ErrorLib for *;

    // Whether to award point to users or not
    bool public awardPoint;

    // Point factory address
    IPoint public immutable pointFactory;

    IPriceOracle public immutable priceOracle;

    /**
     * ================ Constructor ==============
     * @param _roleManager : Role manager contract
     * @param _pointFactory : Point Factory contract
     */
    constructor(
        IRoleBase _roleManager, 
        IPoint _pointFactory,
        IERC20 _baseAsset,
        ISupportedAsset _assetManager, 
        ISafeFactory _safeFactory,
        IPriceOracle _priceOracle
    ) 
        ERC20Manager(_assetManager,  _baseAsset, _roleManager, _safeFactory)
    {
        if(address(_pointFactory) == address(0)) 'IPointFactory is zero'._throw();
        if(address(_priceOracle) == address(0)) 'IPriceOracle is zero'._throw();
        awardPoint = true;
        pointFactory = _pointFactory;
        priceOracle = _priceOracle;
    }

    ///@dev Award points for users
    function _awardPoint(address target, uint8 asMember, uint8 asAdmin, bool deduct) internal {
        bool done = deduct? IPoint(pointFactory).deductPoint(target, asMember, asAdmin, 0) : IPoint(pointFactory).setPoint(target, asMember, asAdmin, 0);
        if(!done) 'Reward failed'._throw();
    }

    /// @dev Activate reward
    function activateReward() public onlyRoleBearer returns(bool) {
        if(awardPoint) 'Is active'._throw();
        awardPoint = true;
        return true;
    }

    /// @dev Deactivate reward
    function deactivateReward() public onlyRoleBearer returns(bool) {
        if(!awardPoint) 'Is inActive'._throw();
        awardPoint = false;
        return true;
    }

    /**
     * @dev Get price quote from the oracle contract
     * @param key : Asset pair to get price for
     * @param network : Current connected network
     */
    function _getCollateralTokenPrice(string memory key, Common.Network network) internal returns(uint128 result) {
        result = IPriceOracle(priceOracle).getPriceQuote(key, network);
    }

}