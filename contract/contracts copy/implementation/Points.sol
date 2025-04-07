// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IPoint, Common } from "../apis/Point.sol";
import { ErrorLib } from "../libraries/ErrorLib.sol";
import { OnlyRoleBase, IRoleBase } from "../peripherals/OnlyRoleBase.sol";

contract Points is IPoint, OnlyRoleBase {
    using ErrorLib for string;

    // All points
    Common.Point[] private points

    // Mapping of unit contributors to Initializer struct
    mapping(address users => Initializer) private initializer;

    constructor(IRoleBase _roleManager) OnlyRoleBase(_roleManager) {} 

    /**
     * @dev Returns the point
     * @param user : Contributor
    */
    function _getPoint(address user) internal view returns(Common.Point memory point){
        Initializer memory init = initializer[user];
        if(init.isRegistered) {
            point = points[init.location];
        }
        return point;
        // point = points[location];
    }

    /**
     * @dev Returns the point
     * See _getPoint
    */
    function getPoint(address user) external view returns(Common.Point memory){
        return _getPoint(user);
    }

    /**
     * @dev Register user to earn points
     * @notice Users automatically earn 5 points for signing up
     */
    function registerToEarnPoints() public {
        Initializer memory init = initializer[user];
        if(init.isRegistered) 'User is registered'._throw();
        init.isRegistered = true;
        init.location = points.length;
        initializer[user] = init;
        points.push( Common.Point(0, 0, 5));
        
    } 

    /**
     * @dev Update points for the target user if they are already initialized otherwise create a new spot for them. 
     * @param user : Unit contribution
     * @param _point : Point struct containing essential data;
    */
    function setPoint(address user, Common.Point memory _point) external view onlyRoleBearer returns(bool) {
        Initializer memory init = initializer[user];
        if(init.isRegistered) {
            unchecked {
                if(_point.contributor > 0) points[init.location].contributor += _point.contributor;
                if(_point.creator > 0) points[init.location].creator += _point.creator;
                if(_point.referrals > 0) points[init.location].referrals += _point.referrals;
            }
        }
        return true;
    }

    /**
     * @dev Update points for the target user if they are already initialized otherwise create a new spot for them. 
     * @param user : Unit contribution
     * @param _point : Point struct containing essential data;
    */
    function deductPoint(address user, Common.Point memory _point) external view onlyRoleBearer returns(bool) {
        Initializer memory init = initializer[user];
        if(init.isRegistered) {
            Common.Point memory _p = points[init.location];
            unchecked {
                if(_point.contributor > 0 && _p.contributor > _point.contributor) points[init.location].contributor -= _p.contributor;
                if(_point.creator > 0 && _p.creator > _point.creator) points[init.location].creator -= _p.creator;
                if(_point.referrals > 0 && _p.referrals > _point.referrals) points[init.location].referrals -= _p.referrals;
            }
        }
        return true;
    }

    // Retrieve the points array in storage
    function getPoints() public view returns(Common.Point[] memory _points) {
        _points = points;
        return _point;
    }
}