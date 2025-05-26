// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "../interfaces/Common.sol";

abstract contract Slots {
    // Every contributor owns a slot in each unit contribution
    mapping(address contributor => mapping(uint96 recordId => Common.Slot)) slots;

    /**
        * @dev Create a new slot for target account
        * @param target : Target account
        * @param recordId : Unit contribution
        * @param position : User's position in the list of contributors
        * @param isAdmin : Whether target is an admin or not
        * @param isMember : Whether target is a member or not
     */
    function _createSlot(
        address target, 
        uint96 recordId,
        uint8 position,
        bool isAdmin,
        bool isMember
    ) internal {
        _setSlot(
            target,
            recordId, 
            Common.Slot(position, isMember, isAdmin),
            false
        );
    }

    /**
     * @dev Set a new slot for the target
     * @param target : Target account
     * @param recordId : recordId
     * @param slot : Slot
     */
    function _setSlot( address target, uint96 recordId, Common.Slot memory slot, bool setEmpty) internal {
        Common.Slot memory empty;
        slots[target][recordId] = setEmpty? empty : slot;
    }

    /**
        * @dev Returns the slot for target account
        * @param target : Target account
        * @param recordId : Unit
    */
    function _getSlot(
        address target, 
        uint96 recordId
    ) internal view returns(Common.Slot memory slot) {
        slot = slots[target][recordId];
    }

    // For detailed doc, see _getSlot
    function getSlot(address target, uint96 recordId) 
        external 
        view 
        // onlyInitialized(unit, false)
        returns(Common.Slot memory) 
    { 
        return _getSlot(target, recordId);
    }
}
