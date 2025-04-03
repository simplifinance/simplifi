// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";

abstract contract Pools {
    // Past/completed pools
    uint public pastRecords;

    // Current/ongoing pools
    uint public currentPools;

    /**
     * Mapping of unit contribution pool variants
     * Variation of pools is tracked in Common.Branch which can be either RECORD or CURRENT
     * We use one storage reference 'pool' to hold both the current and past pools except that it
     * branched off using Branch 
     * @notice We preserve slot 0 in Branch.CURRENT to easily replace a completed pool with an empty 
     * one. This is easier and efficient for us than deleting an entire pool. 
     */
    mapping (uint256 => mapping( Common.Branch => Common.Pool)) private pools; 

    /**
     * @dev Add pool to storage
     * @param pool : A new pool that just ended
     * @param unit : Unit contribution.
     * @notice unit must not be the reserve slot.
     */
    function _setPool(Common.Pool memory pool, uint256 unit, Common.Branch status) internal virtual {
        assert(unit > 0);
        pools[unit][status] = pool;
    }

    /**
     * @dev Remove pool from storage
     * @param unit : Unit contribution
     * @notice unit must not be the reserve slot.
     */
    function _removePool(uint256 unit) internal virtual {
        assert(unit > 0);
        delete pools[unit][Common.Branch.CURRENT];
    }

    /**
     * @dev Get pool from storage
     * @param unit : Unit contribution
     */
    function _getPool(uint256 unit, Common.Branch status) internal view returns(Common.Pool memory) {
        return pools[unit][status];
    }

    /**
     * @dev Get pool from storage
     * @param unit : Unit contribution
     */
    function isPoolAvailable(uint256 unit) public view returns(bool) {
        return pools[unit][Common.Branch.CURRENT].lInt.status == Common.Status.AVAILABLE;
    }

    // Generate a new record Id
    function _generateRecordId() internal returns(uint rId) {
        pastRecords ++;
        rId = pastRecords;
    }

    // Generate new current pool is
    function _generateCurrentId() internal returns(uint cpl) {
        currentPools ++;
        cpl = currentPools;
    }

    // Return total past pools
    function getRecordId() external view returns(uint) {
        return pastRecords;
    }

    // Return total past pools
    function getCurrentPool() external view returns(uint) {
        return currentPools;
    }
}