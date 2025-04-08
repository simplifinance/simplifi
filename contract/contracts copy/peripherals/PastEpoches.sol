// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";
import { Counters } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol";

abstract contracts PastEpoches {
    using Counters for Counters.Counter;

    // Past/completed pools
    Counters.Counter private pastEpoches;

    // Every unit contribution owns a slot in a pool
    Counters.Counter private cSlots;

    // Mapping of recordIds to past pools
    mapping(uint recordId => Common.Pool pastPools) private records; 

    // Return past pool counter
    function _getPastEpoches() internal view returns(uint recordId) {
        recordId = pastEpoches.current();
    }

    // Generate and return recordId
    function _generateRecordId() internal returns(uint rId) {
        pastEpoches.increment();
        rId = _getPastEpoches();
    }

    /// @dev Add a completed pool to history 
    function _setRecord(uint recordId, Common.Pool memory pool) internal {
        records[recordId] = pool;
    }

    /**
     * @dev Return past pool at recordId 
     * @param recordId : Record Id
     */
    function _getPastPool(uint recordId) internal returns(Common.Pool memory result) {
        result = records[recordId];
        return result;
    }

}