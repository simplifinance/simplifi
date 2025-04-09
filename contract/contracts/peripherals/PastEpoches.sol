// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";
import { Counters } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol";

abstract contract PastEpoches {
    using Counters for Counters.Counter;

    // Past/completed pools
    Counters.Counter private pastEpoches;

    // Every unit contribution owns a slot in a pool
    Counters.Counter private cSlots;

    // Mapping of recordIds to past pools
    mapping(uint96 recordId => Common.Pool pastPools) private records; 

    // Return past pool counter
    function _getPastEpoches() internal view returns(uint96 recordId) {
        recordId = uint96(pastEpoches.current()); 
    }

    // Generate and return recordId
    function _generateRecordId() internal returns(uint96 rId) {
        pastEpoches.increment();
        rId = _getPastEpoches();
    }

    /// @dev Add a completed pool to history 
    function _setRecord(uint96 recordId, Common.Pool memory pool) internal {
        records[recordId] = pool;
    }

    /**
     * @dev Return past pool at recordId 
     * @param recordId : Record Id
     */
    function _getPastPool(uint96 recordId) internal view returns(Common.Pool memory result) {
        result = records[recordId];
        return result;
    }

}