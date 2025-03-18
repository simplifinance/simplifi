// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../apis/Common.sol";
import { IERC20 } from "../apis/IERC20.sol";
import { Bank } from "../implementations/strategies/Bank.sol";
import { OnlyOwner } from "../abstracts/OnlyOwner.sol";

abstract contract Safe is OnlyOwner {
    // Total created safe 
    uint public safeCount;

    /**
     * @dev Mapping of unit to safe.
     * Each unit of contribution operates a unique safe. Safes are reusable.
     */
    mapping(uint256 => Bank) private safes;

    constructor (address _ownershipManager) OnlyOwner(_ownershipManager) {}
    
    /**
        * @dev Create a new safe.
        * @notice 'unit' should not own a bank before now.
        * @param unit : Amount
    */
    function _checkAndCreateSafe(uint256 unit, address _feeTo, IERC20 _collateralToken) 
        internal 
        returns(Bank _safe) 
    {
        _safe = safes[unit];
        if(address(_safe) == address(0)) {
            safeCount ++;
            _safe = new Bank(ownershipManager, _feeTo, _collateralToken);
            safes[unit] = _safe;
        }
    }

}