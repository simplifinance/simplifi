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
    mapping (address => mapping(uint256 => uint)) private slots;

    function _getSlot(address target, uint256 unit) internal view returns(uint slot) {
        slot = slots[target][unit];
    }
    
    function _deleteSlot(address target, uint256 unit) internal {
        delete slots[target][unit];
    }

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
        uint pos = _getSlot(user, unit);
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
     * @param turnStartTime : Time the turn for user starts to count
     * @notice If 'user' is zero address, we generate a new slot otherwise fetch existing slot
     */ 
    function _setTurnTime(address user, uint256 unit, uint64 turnStartTime) internal {
        uint pos;
        if(user == address(0)){
            pos = userCounts[unit];
        } else {
            pos = _getSlot(user, unit);
        }
        contributors[unit][pos].turnStartTime = turnStartTime;
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
        slots[newProfile.id][unit] = pos;
    }

    function _updateProfile(uint256 unit, Common.Contributor memory profile, uint slot) internal {
        contributors[unit][slot] = profile;
        slots[profile.id][unit] = slot;
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
        uint slot = _getSlot(user, unit);
        delete contributors[unit][slot];
        delete slots[user][unit];
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
        uint aSlot = _getSlot(actCaller, unit);
        uint eSlot = _getSlot(expcData.id, unit);
        aCData = contributors[unit][aSlot];
        aCData.turnStartTime = expcData.turnStartTime;
        expcData.turnStartTime = 0;
        contributors[unit][eSlot] = aCData;
        contributors[unit][aSlot] = expcData;
        slots[actCaller][unit] = eSlot;
        slots[expcData.id][unit] = aSlot;
        contributors[unit][aSlot].turnStartTime = expcData.turnStartTime;
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
        returns(Common.Contributor memory) 
    {
        return _getProfile(user, unit);
    }

    /**
     * @dev Return the current number of contributors in a pool
     * @param unit : Unit contribution.
     */
    function getUserCount(uint256 unit) external view returns(uint) {
        return _getUserCount(unit);
    }

    /**@dev Return accrued debt for user to date.
     * @param unit : Contribution amount.
     * @param user : Contributor.
     * @notice This is the total accrued debt between the date user was paid and current time.
     */
    function _getCurrentDebt(uint256 unit, address user) 
        internal 
        view returns(uint debt) 
    {
        uint intPerSec = _getPool(unit, Common.UnitStatus.CURRENT).interest.intPerSec;
        Common.Contributor memory _c = _getProfile(user, unit);
        unchecked {
            debt = _c.loan + (intPerSec * (Utils._now() - _c.getFinanceTime));
        }
    } 

    /**@dev Return accrued debt for user up to this moment.
     * @param unit : Contribution amount.
     * @param user : Contributor.
     * @notice This is the total accrued debt between the date user was paid and now.
     */
    function getCurrentDebt(uint256 unit, address user) 
        public 
        view returns(uint debt) 
    {
        return _getCurrentDebt(unit, user);
    } 
}