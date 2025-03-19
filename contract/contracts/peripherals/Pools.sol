// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";
import { Oracle } from "./Oracle.sol";
import { Utils } from "../libraries/Utils.sol";

abstract contract Pools is Oracle {
    using Utils for *;
    
    // Total past pools
    uint public pastRecords;

    // Total current pools
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

    // Only valid pool
    modifier isValidUnitContribution(uint unit) {
        require(_getPool(unit, Common.Branch.CURRENT).lInt.status == Common.Status.TAKEN, "Invalid pool");
        _;
    }

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
    function _shufflePool(uint256 unit, Common.Pool memory current) internal virtual {
        assert(unit > 0);
        Common.Pool memory empty = pools[0][Common.Branch.CURRENT];
        pools[unit][Common.Branch.CURRENT] = empty;
        pools[current.bigInt.recordId][Common.Branch.RECORD] = current;
    }

    /**
     * @dev Get pool from storage
     * @param unit : Unit contribution
     */
    function _getPool(uint256 unit, Common.Branch branch) internal view returns(Common.Pool memory) {
        return pools[unit][branch];
    }

    /**
     * @dev Get pool from storage
     * @param unit : Unit contribution
     */
    function isPoolAvailable(uint256 unit) external view returns(bool) {
        return pools[unit][Common.Branch.CURRENT].lInt.status == Common.Status.AVAILABLE;
    }

    // Generate record Id
    function _generateRecordId() internal returns(uint rId) {
        rId = pastRecords;
        pastRecords ++;
    }

    // Generate new current Id
    function _generateCurrentId() internal returns(uint pid) {
        pid = currentPools;
        pastRecords ++;
    }

    // Return total past pools
    function getRecordId() external view returns(uint) {
        return pastRecords;
    }

    // Return total current pools
    function getCurrentId() external view returns(uint) {
        return currentPools;
    }

    /**
     * @dev Get pool from storage
     * @param unit : Unit contribution
     */
    function getCurrentPoolData(uint256 unit) external view returns(Common.Pool memory) {
        return _getPool(unit, Common.Branch.CURRENT);
    }

    /**
     * @dev Get past pools from storage
     * @param unit : Unit contribution
     */
    function getPastPoolData(uint256 unit) external view returns(Common.Pool memory) {
        return _getPool(unit, Common.Branch.RECORD);
    }

    /**
     * @dev Return the amount of collateral required to get finance in a pool
     * @param unit : Unit contribution
     */
    function _getCollateralQuote(uint256 unit) internal view returns(uint quote){
        Common.Pool memory _p = _getPool(unit, Common.Branch.CURRENT);
        quote = Common.Price(_getDummyPrice(), 18).computeCollateral(uint24(_p.lInt.colCoverage), _p.bigInt.currentPool);
    }

    function getCollateralQuote(uint256 unit) external view returns(uint quote){
       return _getCollateralQuote(unit);
    }
    
}