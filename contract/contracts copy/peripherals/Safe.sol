// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";

/**
 * @title : Safe storage contract
 * @author : Simplifi. Written by Isaac Jesse, a.k.a Bobeu https://github.com/bobeu
 * @notice : Safe is non-deployeable consumed by the FlexpoolFactory contract for managing contributors funds.
 *          We employed this strategy to achieve high security and users confidence while interacting with the protocol.
 *          The strategy utilizes the SafeGlobal protocol on the frontend to deploy a new Safe account for every unique 
 *          contribution unit.
 */
abstract contract Safe {

    // Mapping of unit contribution to Safe struct
    mapping (uint256 => Common.Safe) private safes;

    /**
     * @dev Returns the safe information
     * @param unit : Unit contribution
    */
    function _getSafe(uint256 unit) public view returns(Common.Safe memory safe){
        safe = safes[unit];
    }

    // function _validateSafe(uint unit, address safe) internal {
    //     if(_getSafe(unit).id == address(0)) {

    //     }
    // }

    /**
     * @dev Returns the safe information
     * See _getSafe
    */
    function getSafe(uint256 unit) public view returns(Common.Safe memory){
        return _getSafe(unit);
    }

    /**
     * @dev Returns the safe information
     * @param unit : Unit contribution
     * @param safe : Safe Struct
    */
    function _setSafe(Common.Safe memory safe, uint256 unit) internal virtual {
        safes[unit] = safe;
    }
}