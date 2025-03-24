// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";
import { Oracle } from "./Oracle.sol";
import { Utils } from "../libraries/Utils.sol";
import { Point } from "./Point.sol";
import { RatesAndFeeTo, IOwnerShip } from "./RatesAndFeeTo.sol";

abstract contract Pools is Oracle, Point, RatesAndFeeTo {
    using Utils for *;
    
    // Total past pools
    uint public pastRecords;

    // Total current pools
    uint public currentPools;

    // Mapping of unit to userCount
    mapping (uint256 => uint) public userCounts;

    // /**
    //  * Mapping of unit contribution pool variants
    //  * Variation of pools is tracked in Common.Branch which can be either RECORD or CURRENT
    //  * We use one storage reference 'pool' to hold both the current and past pools except that it
    //  * branched off using Branch and different uint256 key.
    //  *      To get current Pool, use pools[unit][Common.Branch.CURRENT];
    //  *      To get past Pool, use pools[recordId][Common.Branch.RECORD]; This is beacuse a unit contribution can have 
    //  *          multiple records while current maintains only one data reference.
    //  * @notice We preserve slot 0 in Branch.CURRENT to easily replace a completed pool with an empty 
    //  * one. This is easier and efficient for us than deleting an entire pool. 
    //  */
    // mapping (uint256 => mapping( Common.Branch => Common.Pool)) private pools; 

    // Only valid pool
    modifier isValidUnitContribution(uint unit) {
        require(_getPool(unit, Common.Branch.CURRENT).lInt.status == Common.Status.TAKEN, "Invalid pool");
        _;
    }

    constructor(
        IOwnerShip _ownershipManager,
        uint16 _makerRate,
        address _feeTo
    ) RatesAndFeeTo(_ownershipManager, _makerRate, _feeTo) {}

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
     * @param recordIdOrUnit : Unit contribution
     */
    function _getPool(uint256 recordIdOrUnit, Common.Branch branch) internal view returns(Common.Pool memory) {
        return pools[recordIdOrUnit][branch];
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
    function _getUnitId(bool get) internal returns(uint pid) {
        if(!get) {
            pid = currentPools;
            currentPools ++;
        } else{
            pid = currentPools - 1;
        }
    }

    // Return total past pools
    function getPastEpoches() external view returns(uint) {
        return pastRecords;
    }

    // Return total current pools
    function getCurrentEpoches() external view returns(uint) {
        return currentPools;
    }

    /**
     * @dev Get pool from storage
     * @param unit : Unit contribution
     */
    function getCurrentPool(uint256 unit) external view returns(Common.Pool memory pool, Common.Contributor[] memory contributors, uint _userCount) {
        pool = _getPool(unit, Common.Branch.CURRENT);
        contributors = _getSafe(unit).getContributors(pool.bigInt.unitId);
        _userCount = userCounts[unit]; 
        return (pool, contributors, _userCount);
    }

    /**
     * @dev Get past pools from storage
     * @param recordId : Record ID
     */
    function getRecord(uint256 recordId) external view returns(Common.Pool memory) {
        return _getPool(recordId, Common.Branch.RECORD);
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

    function _getUserCount(uint256 unit) internal view returns(uint _count) {
        _count = userCounts[unit];
    }
    
}