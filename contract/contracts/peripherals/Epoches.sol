// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { PastEpoches, Common, Counters } from "./PastEpoches.sol";
import { ErrorLib } from "../libraries/ErrorLib.sol";

abstract contract Epoches is PastEpoches {
    using Counters for Counters.Counter;
    using ErrorLib for *;

    // Past/completed pools
    Counters.Counter private epoches;

    // Mapping of unitId to Pool
    mapping(uint unitId => Common.Pool currentPools) private pools; 

    /**
     * @dev Mapping of unit contribution to unitId
     * For every unit amount of contribution, there is a corresponding index for retrieving data from the storage.
     */
    mapping(uint256 unitContribution => uint unitId) private indexes; 

    /**
     * @dev Verify that the contribution unit is not active. 
     * @notice When unit is not active, it can be relaunched. 
     */
    modifier _onlyIfUnitIsNotActive(uint256 unit){
        if(_isUnitActive(unit)) 'Unit is active'._throw();
        _;
    }

    /**
     * @dev Verify that the contribution unit is 
     */
    modifier _onlyIfUnitIsActive(uint256 unit){
        if(!_isUnitActive(unit)) 'Unit is inActive'._throw();
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

    function _getUnitId(uint unit) internal view returns(uint _unitId) {
        _unitId = indexes[unit];
    }

    // Return record Id of a pool
    function _getRecordId(uint unit) internal view returns(uint96 _recordId) {
        _recordId = _getPool(unit).big.recordId;
    }

    // Generate unit Id and record Id
    function _generateIds(uint256 unit) internal returns(uint96 unitId, uint96 recordId) {
        epoches.increment();
        unitId = uint96(epoches.current());
        indexes[unit] = unitId;
        recordId = _generateRecordId();
    }

    function _getPool(uint256 unit) internal view returns(Common.Pool memory result) {
        result = pools[_getUnitId(unit)];
    }

    // Return past pool counter
    function _getEpoches() internal view returns(uint _ep) {
        _ep = epoches.current();
    }

    /// @dev Update pool in storage 
    function _setPool(uint unitId, Common.Pool memory pool) internal {
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
        uint expected = pool.big.unit * pool.low.maxQuorum;
        filled = !isPermissioned? pool.low.userCount == pool.low.maxQuorum : expected == pool.big.currentPool;
    }

}