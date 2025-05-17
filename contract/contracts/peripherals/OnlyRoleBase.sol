// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IRoleBase } from "../interfaces/IRoleBase.sol";

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
    // Role manager address
    IRoleBase public roleManager;

    // ============= constructor ============
    constructor(address _roleManager)
    {
        require(_roleManager != address(0));
        roleManager = IRoleBase(_roleManager);
    }

    /**
     * @notice Caller must have owner role before execeution can proceed.
     * The 'errorMessage' argument can be used to return error specific to 
     * a context e.g function call. 
     */
    modifier onlyRoleBearer {
        require(_hasRole(_msgSender()));
        _;
    }

    // // Allow only account with role access
    // function _onlyRoleBearer() internal view {
    //     _onlyRoleBearer();
    // }

    function _hasRole(address target) internal view returns(bool result) {
        result = roleManager.hasRole(target);
    }  

}