// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IOwnerShip } from "../apis/IOwnerShip.sol";
/**
 * @title MsgSender 
 * @author Simplifi (Bobeu)
 * @notice Non-deployable contract simply returning the calling account.
 */
abstract contract MsgSender {
    function _msgSender() internal view returns(address sender) {
        sender = msg.sender;
    }
}

/**
 * @title OwnerShip 
 * @author Simplifi (Bobeu)
 * @notice Standalone contract for managing ownership in Simplifi protocol.
 */
contract OwnerShip is IOwnerShip, MsgSender{
    /**
     * @notice Number of owners.
     */
    uint public ownersCount;

    /**
     * @notice Addresses with ownership permission.
     */
    
    mapping (address => bool) private _isOwner;

    /**
     * @notice Mapping of ownersCount to addresses.
     * A valid id will return a mapped owner.
     */
    mapping (uint => address) public owners;

    /**
     * @dev Only owner is allowed.
     */
    modifier onlyOwner {
        require(_isOwner[_msgSender()], "Oop! Caller is not recognized");
        _;
    }

    constructor() {
        _setOwner(_msgSender(), true);
    }

    /**
     * @dev Returns owner variable.
     */
    function _getOwner(uint ownerId) 
        internal 
        view 
        returns(address _owner) 
    {
        _owner = owners[ownerId];
    }

    /**
     * @dev Add or remove target address as owner.
     * @param target: Target address.
     * @notice 'target' parameter must not be empty.
     */
    function _setOwner(
        address target,
        bool add
    ) 
        private 
    {
        require(target != address(0), "Simplifi OwnerShip: 'target' parameter is empty");
        add? (_isOwner[target] = true, ownersCount ++) : (_isOwner[target] = false, ownersCount --);
    }

    /**
     * @dev Add a new owner address
     * @param newOwners: New owners
     * @notice Only address with owner permission can add another owner.
     */
    function setPermission(
        address[] memory newOwners
    ) 
        external
        onlyOwner
        returns(bool) 
    {
        bool rt = true;
        for(uint r = 0; r < newOwners.length; r++) {
            _setOwner(newOwners[r], rt);
        }
        return rt;
    }

    /**
     * @dev Remove an address as owner.
     * @param target: Target address
     * @notice Only address with owner permission can remove another owner.
     */
    function removeOwner(
        address target
    ) 
        external
        onlyOwner
        returns(bool) 
    {
        _setOwner(target, false);
        return true;
    }
    /**
     * @dev An owner can renounce their ownership. This however will not leave the
     * contract empty without an owner. There must be at least one owner left.
     * @notice Only address with owner permission can renounce ownership.
     */
    function renounceOwnerShip() 
        external
        onlyOwner
        returns(bool) 
    {
        require(ownersCount > 1, "At least 2 owners is required to leave"); 
        _setOwner(_msgSender(), false);
        return true;
    }

    /**
     * @dev Returns owner variable.
     * Can be called externally by contracts.
     * @param ownerId : Owner Id. 
     */
    function getOwner(
        uint ownerId
    ) 
        external 
        view 
        returns(address) 
    {
        return _getOwner(ownerId);
    }

    /**
     * @dev Check if target is an owner.
     * @param target : Target address.
     */
    function isOwner(
        address target
    )
        external
        view 
        returns(bool) 
    {
        return _isOwner[target];
    }
}