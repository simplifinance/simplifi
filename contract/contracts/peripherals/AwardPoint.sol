// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IPoint } from "../interfaces/IPoint.sol";
import { Common } from "../interfaces/Common.sol";
import { Price, IRoleBase, ErrorLib, IERC20, ISupportedAsset, ISafeFactory } from './Price.sol';

abstract contract AwardPoint is Price {
    using ErrorLib for *;

    // Whether to award point to users or not
    bool public awardPoint;

    // Point factory address
    IPoint public immutable pointFactory;

    /**
     * ================ Constructor ==============
     * @param _roleManager : Role manager contract
     * @param _pointFactory : Point Factory contract
     */
    constructor(
        IRoleBase _roleManager, 
        IPoint _pointFactory,
        IERC20 _baseAsset,
        address _diaOracleAddress, 
        ISupportedAsset _assetManager,
        ISafeFactory _safeFactory
    ) 
        Price(_diaOracleAddress, _assetManager, _roleManager, _baseAsset, _safeFactory)
    {
        if(address(_pointFactory) == address(0)) 'IPointFactory is zero'._throw();
        awardPoint = true;
        pointFactory = _pointFactory;
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

}