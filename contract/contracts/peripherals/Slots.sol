// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../interfaces/Common.sol";

abstract contract Slots {
    // Every contributor owns a slot in each unit contribution
    mapping(address contributor => mapping(uint256 unitContribution => Common.Slot)) slots;

    /**
        * @dev Create a new slot for target account
        * @param target : Target account
        * @param unit : Unit contribution
        * @param position : User's position in the list of contributors
        * @param isAdmin : Whether target is an admin or not
        * @param isMember : Whether target is a member or not
     */
    function _createSlot(
        address target, 
        uint unit,
        uint8 position,
        bool isAdmin,
        bool isMember
    ) internal {
        _setSlot(
            target,
            unit, 
            Common.Slot(position, isMember, isAdmin),
            false
        );
    }

    /**
     * @dev Set a new slot for the target
     * @param target : Target account
     * @param unit : unit contribution
     * @param slot : Slot
     */
    function _setSlot( address target, uint unit, Common.Slot memory slot, bool setEmpty) internal {
        Common.Slot memory empty;
        slots[target][unit] = setEmpty? empty : slot;
    }

    /**
        * @dev Returns the slot for target account
        * @param target : Target account
        * @param unit : Unit contribution
    */
    function _getSlot(
        address target, 
        uint unit
    ) internal view returns(Common.Slot memory slot) {
        slot = slots[target][unit];
    }

    // For detailed doc, see _getSlot
    function getSlot(address target, uint unit) 
        external 
        view 
        // onlyInitialized(unit, false)
        returns(Common.Slot memory) 
    {
        return _getSlot(target, unit);
    }
}
