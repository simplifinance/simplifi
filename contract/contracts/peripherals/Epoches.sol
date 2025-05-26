// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

/**
 * ERROR CODE
 * 1 - Unit is active
 * 2 - Unit is inactive
 */
import { PastEpoches, Common, Counters } from "./PastEpoches.sol";

abstract contract Epoches is PastEpoches {
    using Counters for Counters.Counter;

    // Past/completed pools
    Counters.Counter private epoches;

    // Mapping of unitId to current Pool
    mapping(uint96 => Common.Pool) private pools; 

    /**
     * @dev Mapping of unit contribution to unitId
     * For every unit amount of contribution, there is a corresponding index for retrieving data from the storage.
     */
    mapping(uint256 => uint96) private indexes; 

    /**
     * @dev Verify that the contribution unit is not active. 
     * @notice When unit is not active, it can be relaunched. 
    */
    modifier _checkUnitStatus(uint unit, bool value){
        require(value? _isUnitActive(unit) : !_isUnitActive(unit), '1');
        _;
    }

    /**
        * @dev Ensure that unit contribution is active.
        * Every unit contribution has a corresponding and unique id called unitId.
        * When a unitId equals zero mean it is not active
    */
    function _isUnitActive(uint unit) internal view returns(bool result){
        result = pools[_getUnitId(unit)].status == Common.Status.TAKEN;
    }

    function _getUnitId(uint unit) internal view returns(uint96 _unitId) {
        _unitId = indexes[unit];
    }
    
    /**
     * @dev Return record Id in a pool with unit contribution
     * @param unit : Unit contribution
    */
    function _getRecordId(uint unit) internal view returns(uint96 _recordId) {
        _recordId = _getPool(unit).big.recordId;
    }

    // Generate unit Id and record Id
    function _generateIds(uint unit) internal returns(uint96 unitId, uint96 recordId) {
        epoches.increment();
        unitId = uint96(epoches.current());
        indexes[unit] = unitId;
        recordId = _generateRecordId();
    }

    /**
     * @dev Fetch current pool with unit contribution
     * @param unit : Unit contribution
     */
    function _getPool(uint unit) internal view returns(Common.Pool memory result) {
        result = _getPoolWithUnitId(_getUnitId(unit));
    }

    /**
     * @dev Fetch Current pool with unitId
     * @param unitId : Unit Id
     */
    function _getPoolWithUnitId(uint96 unitId) internal view returns(Common.Pool memory result){
        result = pools[unitId];
    }

    // Return past pool counter
    function _getEpoches() internal view returns(uint96 _epoches) {
        _epoches = uint96(epoches.current());
    }

    /// @dev Update pool in storage 
    function _setPool(uint96 unitId, Common.Pool memory pool) internal {
        pools[unitId] = pool;
    }

    /**
     * @dev Shuffle pools i.e move the current pool to history and reset it 
     * @param pool : Current pool
     */ 
    function _shufflePool(Common.Pool memory pool) internal {
        Common.Pool memory empty = pools[0];
        _setPool(pool.big.unitId, empty);
        _setRecord(pool.big.recordId, pool);
    }

    /**@dev Check if pool is filled
        * @dev Msg.sender must not be a member of the band at epoch Id before now.
        * @param pool: Pool struct (Location: Memory)
        * @notice : Be sure to wrap this function in an uncheck block
    */
    function _isPoolFilled(Common.Pool memory pool, bool isPermissioned) 
        internal 
        pure
        returns(bool filled) 
    {
        unchecked {
            filled = !isPermissioned? pool.low.userCount == pool.low.maxQuorum : pool.big.currentPool == (pool.big.unit * pool.low.maxQuorum);
        }
    }

    /**@dev Sets new last paid */
    function _setLastPaid(address to, uint unit) internal {
        pools[_getPool(unit).big.unitId].addrs.lastPaid = to;
    }


}