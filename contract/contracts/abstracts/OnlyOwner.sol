// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { MsgSender, OwnerShip } from "../implementations/OwnerShip.sol";
import { IOwnerShip } from "../apis/IOwnerShip.sol";

abstract contract OnlyOwner is MsgSender {
    address public ownershipManager;

    constructor(
        address _ownershipManager
    )
    {
        _setOwnershipManager(_ownershipManager);
    }

    /**
     * @notice Caller must have owner role before execeution can proceed.
     * The 'errorMessage' argument can be used to return error specific to 
     * a context e.g function call. 
     * @param errorMessage : Custom error message
     */
    modifier onlyOwner(string memory errorMessage) {
        address mgr = ownershipManager;
        require(IOwnerShip(mgr).isOwner(_msgSender()), errorMessage);
        _;
    }

    function _setOwnershipManager(
        address newManager
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
        onlyOwner("OnlyOwner: Not permitted")
        returns(bool)
    {
        _setOwnershipManager(newManager);
        return true;
    }
}