// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IPoint } from "../apis/IPoint.sol";
import { Price, IRoleBase, ErrorLib, IERC20 } from './Price.sol';

abstract contract AwardPoint is Price {
    using ErrorLib for string;

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
        address _assetManager
    ) 
        Price(_diaOracleAddress, _assetManager, _roleManager, _baseAsset)
    {
        if(address(_pointFactory) == address(0)) 'IPointFactory is zero'._throw();
        awardPoint = true;
        pointFactory = _pointFactory;
    }

    ///@dev Award points for users
    function _awardPoint(address target, uint8 asMember, uint8 asAdmin, bool deduct) internal {
        (bool done, Common.Point memory point) = (false, Common.Point(asMember, asAdmin, 0));
        done = deduct? IPoint(pointFactory).deductPoint(user, point) : IPoint(pointFactory).setPoint(target, point);
        if(!done) 'Point award failed'._throw();
    }

    /// @dev Activate reward
    function activateReward() public onlyRoleBearer returns(bool) {
        if(awardPoint) 'Reward is active'._throw();
        awardPoint = true;
    }

    /// @dev Deactivate reward
    function deactivateReward() public onlyRoleBearer returns(bool) {
        if(!awardPoint) 'Reward is inActive'._throw();
        awardPoint = false;
    }

}