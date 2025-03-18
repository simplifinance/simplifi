// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";

abstract contract Point {

    // Mapping of unit contributors to Point struct
    mapping (address => Common.Point) private points;

    /**
     * @dev Returns the point
     * @param user : Contributor
    */
    function _getPoint(address user) internal view returns(Common.Point memory point){
        point = points[user];
    }

    /**
     * @dev Returns the point
     * See _getPoint
    */
    function getPoint(address user) public view returns(Common.Point memory){
        return _getPoint(user);
    }

    /**
     * @dev Returns the point information
     * @param user : Unit contribution
     * @param contributor : Point earned as contributor;
     * @param creator : Point earned as a creator
    */
    function _setPoint(address user, uint contributor, uint creator) internal virtual {
        if(contributor > 0) points[user].contributor += contributor;
        if(creator > 0) points[user].creator += creator;
    }
}