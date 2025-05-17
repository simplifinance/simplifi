// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IPoint } from "../interfaces/IPoint.sol";
import { ERC20Manager } from "./ERC20Manager.sol";

abstract contract AwardPoint is ERC20Manager {
    // Whether to award point to users or not
    bool public awardPoint;

    /**
     * ================ Constructor ==============
     */
    constructor(address _stateManager, address _roleManager) 
        ERC20Manager(_stateManager, _roleManager)
    { 
        awardPoint = true;
    }

    ///@dev Award points for users
    function _awardPoint(address target, uint8 asMember, uint8 asAdmin, bool deduct) internal {
        IPoint pointFactory = _getVariables().pointFactory;
        bool done = deduct? pointFactory.deductPoint(target, asMember, asAdmin, 0) : pointFactory.setPoint(target, asMember, asAdmin, 0);
        require(done); 
    }

    /// @dev Activate reward
    function toggleReward() public onlyRoleBearer returns(bool) {
        awardPoint? awardPoint = false : awardPoint = true;
        return true;
    }
 
}