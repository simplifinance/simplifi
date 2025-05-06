// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IRoleBase } from "../interfaces/IRoleBase.sol";
import { ErrorLib } from "../libraries/ErrorLib.sol";

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
    using ErrorLib for *;

    // Role manager address
    IRoleBase public roleManager;

    // ============= constructor ============
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
        _onlyRoleBearer();
        _;
    }

    // Allow only account with role access
    function _onlyRoleBearer() internal view {
        IRoleBase mgr = roleManager;
        if(address(mgr) == address(0)) 'Manager is zero'._throw();
        if(!_hasRole(_msgSender())) 'Access denied'._throw();
    }

    function _hasRole(address target) internal view returns(bool result) {
        result = IRoleBase(roleManager).hasRole(target);
    }  

    /// @dev Set role manager
    function _setRoleManager(IRoleBase newManager) private{
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