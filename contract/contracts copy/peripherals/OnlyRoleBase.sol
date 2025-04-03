// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IRoleBase } from "../apis/IRoleBase.sol";

/**
 * @title MsgSender 
 * @author Simplifi (Bobeu)
 * @notice Non-deployable contract simply returning the calling account.
 */
abstract contract MsgSender {
    function _msgSender() internal view virtual returns(address sender) {
        sender = msg.sender;
    }
}

abstract contract OnlyRoleBase is MsgSender {
    error ManagerAddressIsZero();
    error NotPermittedToCall();

    IRoleBase public roleManager;

    constructor(IRoleBase _roleManager)
    {
        _setRoleManager(_roleManager);
    }

    /**
     * @notice Caller must have owner role before execeution can proceed.
     * The 'errorMessage' argument can be used to return error specific to 
     * a context e.g function call. 
     */
    modifier onlyRoleBearer {
        IRoleBase mgr = roleManager;
        if(address(mgr) == address(0)) revert ManagerAddressIsZero();
        if(!IRoleBase(mgr).hasRole(_msgSender())) revert NotPermittedToCall();
        _;
    }

    function _setRoleManager(
        IRoleBase newManager
    )
        private
    {
        roleManager = newManager;
    }

    /**
     * Set Role manager
     * @param newManager : New manager address
     */
    function setRoleManager(
        address newManager
    )
        public
        onlyRoleBearer
        returns(bool)
    {
        _setRoleManager(IRoleBase(newManager));
        return true;
    }
}