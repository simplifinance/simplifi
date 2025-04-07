// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";
import { ISafeFactory } from "../apis/ISafeFactory.sol";

/**
 * @title : Safe storage contract
 * @author : Simplifi. Written by Isaac Jesse, a.k.a Bobeu https://github.com/bobeu
 * @notice : Safe is non-deployeable consumed by the FlexpoolFactory contract for managing contributors funds.
 *          We employed this strategy to achieve high security and users confidence while interacting with the protocol.
 *          The strategy utilizes the SafeGlobal protocol on the frontend to deploy a new Safe account for every unique 
 *          contribution unit.
 */
abstract contract SafeManager {

    // Safe factory contract
    ISafeFactory public immutable safeFactory;

    // Mapping of unit contribution to Safe struct
    mapping (uint256 => Common.Safe) private safes;

    /**
        * @dev Checks, validate and return safe for the target address.
        * @param unit : Unit contribution.
    */
    function _getSafe(uint256 unit) internal returns(address safe) {
        safe = ISafeactory(safeFactory).pingSafe(unit);
        assert(safe != address(0));
    }
}