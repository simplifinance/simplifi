// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { MsgSender, OwnerShip } from "../implementations/OwnerShip.sol";
import { IOwnerShip } from "../apis/IOwnerShip.sol";

abstract contract OnlyOwner is MsgSender {
    error ManagerAddressIsZero();
    error NotPermittedToCall();

    IOwnerShip public ownershipManager;

    constructor(IOwnerShip _ownershipManager)
    {
        _setOwnershipManager(_ownershipManager);
    }

    /**
     * @notice Caller must have owner role before execeution can proceed.
     * The 'errorMessage' argument can be used to return error specific to 
     * a context e.g function call. 
     */
    modifier onlyOwner {
        IOwnerShip mgr = ownershipManager;
        if(address(mgr) == address(0)) revert ManagerAddressIsZero();
        if(!IOwnerShip(mgr).isOwner(_msgSender())) revert NotPermittedToCall();
        _;
    }

    function _setOwnershipManager(
        IOwnerShip newManager
    )
        private
    {
        ownershipManager = newManager;
    }

    /**
     * Set Ownership manager
     * @param newManager : New manager address
     */
    function setOwnershipManager(
        address newManager
    )
        public
        onlyOwner
        returns(bool)
    {
        _setOwnershipManager(IOwnerShip(newManager));
        return true;
    }
}