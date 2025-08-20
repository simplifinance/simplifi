// Sources flattened with hardhat v2.22.17 https://hardhat.org

// SPDX-License-Identifier: MIT

// File contracts/interfaces/IRoleBase.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.28;

/**
 * @title IRoleBase 
 * Interface of the OwnerShip contract
 * @author Simplifi (Bobeu)
 */
interface IRoleBase {
    function setRole(
        address[] memory newRoleTos
    ) 
        external
        returns(bool);

    function removeRole(
        address target
    ) 
        external
        returns(bool);

    function renounceRole() 
        external
        returns(bool);

    function getRoleBearer(
        uint ownerId
    ) 
        external 
        view 
        returns(address);

    function hasRole(
        address target
    )
        external
        view 
        returns(bool);
}


// File contracts/peripherals/OnlyRoleBase.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.28;
/**
 * @title MsgSender 
 * @author Simplifi (Bobeu)
 * @notice Non-deployable contract simply returning the calling account.
 * ERROR CODE
 * ==========
 * R1 - Role manager is zero address
 * R2 - User is not permitted
 */
abstract contract MsgSender {
    function _msgSender() internal view virtual returns(address sender) {
        sender = msg.sender;
    }
}

abstract contract OnlyRoleBase is MsgSender {
    // Role manager address
    IRoleBase private roleManager;

    // ============= constructor ============
    constructor(address _roleManager)
    {
        require(_roleManager != address(0), 'R1');
        roleManager = IRoleBase(_roleManager);
    }

    /**
     * @notice Caller must have owner role before execeution can proceed.
     * The 'errorMessage' argument can be used to return error specific to 
     * a context e.g function call. 
     */
    modifier onlyRoleBearer {
        require(_hasRole(_msgSender()), 'R2');
        _;
    }

    function _hasRole(address target) internal view returns(bool result) {
        result = roleManager.hasRole(target);
    }
    
    function getRoleManager() public view returns(address) {
        return address(roleManager);
    }

}


// File contracts/standalone/RoleManager.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.28;
/**
 * @title RoleManager contract cuts across all Simplifi's contracts. Multiple accounts can be given role right to interact with 
 * ecosystem's smart contracts. It is a standalone contract for managing role in Simplifi protocol
 * @author Simplifinance Code written by Isaac Jesse (a.k.a Bobeu) Github: https://github.com/bobeu
 * @notice Accounts with role access cannot access users'fund. Users'funds are isolated from the main contract. Funds are 
 * managed in a special safe called Bank. Each of the pools operates a unique and reusable safe.
 */
contract RoleManager is IRoleBase, MsgSender{
    /**
     * @notice Number of roles.
     */
    uint public roleCount;

    /**
     * @notice Addresses with role permission.
     */
    
    mapping (address => bool) private _hasRole;
 
    /**
     * @notice Mapping of roleCount to addresses.
     * A valid id will return a mapped owner.
     */
    mapping (uint => address) public roles;

    /**
     * @dev Only account with role is allowed.
     */
    modifier onlyRoleBase {
        require(_hasRole[_msgSender()], "Caller has no role");
        _;
    }

    constructor() {
        _setRole(_msgSender(), true);
    }

    /**
     * @dev Returns role bearer.
     */
    function _getRoleBearer(uint ownerId) 
        internal 
        view 
        returns(address _owner) 
    {
        _owner = roles[ownerId];
    }

    /**
     * @dev Add or remove target address as owner.
     * @param target: Target address.
     * @notice 'target' parameter must not be empty.
     */
    function _setRole(
        address target,
        bool add
    ) 
        private 
    {
        require(target != address(0), "RoleBase: 'target' parameter is empty");
        add? (_hasRole[target] = true, roleCount ++) : (_hasRole[target] = false, roleCount --);
    }

    /**
     * @dev Add a new owner address
     * @param roleBearers: New roles
     * @notice Only address with owner permission can add another owner.
     */
    function setRole(
        address[] memory roleBearers
    ) 
        external
        onlyRoleBase
        returns(bool) 
    {
        bool rt = true;
        for(uint r = 0; r < roleBearers.length; r++) {
            _setRole(roleBearers[r], rt);
        }
        return rt;
    }

    /**
     * @dev Remove an address as owner.
     * @param target: Target address
     * @notice Only address with owner permission can remove another owner.
     */
    function removeRole(
        address target
    ) 
        external
        onlyRoleBase
        returns(bool) 
    {
        _setRole(target, false);
        return true;
    }
    /**
     * @dev An owner can renounce their role. This however will not leave the
     * contract empty without an owner. There must be at least one owner left.
     * @notice Only address with owner permission can renounce role.
     */
    function renounceRole() 
        external
        onlyRoleBase
        returns(bool) 
    {
        require(roleCount > 1, "At least 2 roles is required to leave"); 
        _setRole(_msgSender(), false);
        return true;
    }

    /**
     * @dev Returns role bearer.
     * Can be called externally by contracts.
     * @param roleId : Role Id. 
     */
    function getRoleBearer(
        uint roleId
    ) 
        external 
        view 
        returns(address) 
    {
        return _getRoleBearer(roleId);
    }

    /**
     * @dev Check if target is an role.
     * @param target : Target address.
     */
    function hasRole(
        address target
    )
        external
        view 
        returns(bool) 
    {
        return _hasRole[target];
    }
}
