// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";
import { ISimplifi } from "../apis/ISimplifi.sol";

abstract contract Contributor is ISimplifi {
    error OnlyContributorIsAllowed();
    error OnlyNonContributorIsAllowed();

    //Mapping of unit to position to contributors
    mapping (uint256 => mapping(uint => Common.Contributor)) private contributors;

    // Mapping of unit to userCount
    mapping (uint256 => uint) public userCounts;

    // Mapping of user to unit to position
    mapping (address => mapping(uint256 => uint)) private positions;

    /**
     * @dev Only contributor in a pool is allowed
     * @param user : Target
     * @param unit : Unit Contribution
    */
    function _onlyContributor(address user, uint256 unit) internal view {
        if(!_getProfile(user, unit).isMember) revert OnlyContributorIsAllowed();
    }

    /**
     * @dev Only Non contributor in a pool is allowed
     * @param user : Target
     * @param unit : Unit Contribution
     */
    function _onlyNonContributor(address user, uint256 unit) internal view {
        if(_getProfile(user, unit).isMember) revert OnlyNonContributorIsAllowed();
    }

    /**
     * @dev returns user's profile status in a pool
     * @param user : Target address
     * @param unit : Unit contribution
     */
    function _getProfile(address user, uint256 unit) internal view returns(Common.Contributor memory _profile) {
        uint pos = positions[user][unit];
        _profile = contributors[unit][pos];
    }

    /**
     * @dev returns user's profile status in a pool
     * @param unit : Unit contribution
     */
    function _getExpected(uint256 unit) internal view returns(Common.Contributor memory _isMember) {
        uint pos = userCounts[unit];
        _isMember = contributors[unit][pos];
    }

    /**
     * @dev Set user's time to get finance
     * @param user : Target address
     * @param unit : Unit contribution
     * @param date : Date/timestamp
     * @notice If 'user' is zero address, we generate a new slot otherwise fetch existing slot
     */ 
    function _setTurnTime(address user, uint256 unit, uint64 date) internal {
        uint pos;
        if(user == address(0)){
            pos = userCounts[unit];
        } else {
            pos = positions[user][unit];
        }
        contributors[unit][pos].turnTime = date;
    }

    /**
     * @dev Add a new conntributor
     * @param newProfile : Target profile
     * @param unit : Unit contribution
     */
    function _addContributor(uint256 unit, Common.Contributor memory newProfile) internal {
        uint pos = userCounts[unit];
        userCounts[unit] = pos + 1;
        contributors[unit][pos] = newProfile;
        positions[newProfile.id][unit] = pos;
    }

    function _incrementUserCount(uint256 unit) internal {
        userCounts[unit] += 1;
    }

    /**
     * @dev returns user's contributorship status in a pool
     * @param user : Target address
     * @param unit : Unit contribution
     */
    function _removeContributor(address user, uint256 unit) internal {
        uint pos = positions[user][unit];
        delete contributors[unit][pos];
        delete positions[user][unit];
    }

    function _getUserCount(uint256 unit) internal view returns(uint _count) {
        _count = userCounts[unit];
    }

    function _resetUserCount(uint256 unit) internal {
        userCounts[unit] = 0;
    }

    function _swapFullProfile(
        uint256 unit,
        address actCaller,
        Common.Contributor memory expcData
    )
        internal
        returns(Common.Contributor memory aCData) 
    {
        uint aSlot = positions[actCaller][unit];
        uint eSlot = positions[expcData.id][unit];
        aCData = contributors[unit][aSlot];
        aCData.turnTime = expcData.turnTime;
        expcData.turnTime = 0;
        contributors[unit][eSlot] = aCData;
        contributors[unit][aSlot] = expcData;
        positions[actCaller][unit] = eSlot;
        positions[expcData.id][unit] = aSlot;
        contributors[unit][aSlot].turnTime = expcData.turnTime;
    }

    /** PUBLIC/EXTERNAL FUNCTIONS */

    /**
     * @dev Returns contributor's profile in a pool.
     * @param unit : unit contribution
     * @param user : User
     */
    function getProfile(
        uint256 unit,
        address user
    )
        external
        view
        onlyInitialized(unit, false)
        returns(Contributor memory) 
    {
        return _getProfile(user, unit);
    }

    /**
     * @dev Return the current number of contributors in a pool
     * @param unit : Unit contribution.
     */
    function getUserCount(uint256 unit) external view returns(uint _count) {
        _count = userCounts[unit];
    }
}