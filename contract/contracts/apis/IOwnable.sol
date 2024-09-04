// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

/**
 * @title IOwnable 
 * Interface of the Ownable contract
 * @author Simplifi (Bobeu)
 */
interface IOwnable {
    function addNewOwner(
        address newOwner
    ) 
        external
        returns(bool);

    function removeOwner(
        address target
    ) 
        external
        returns(bool);

    function renounceOwnerShip() 
        external
        returns(bool);

    function getOwner(
        uint ownerId
    ) 
        external 
        view 
        returns(address);

    function isOwner(
        address target
    )
        external
        view 
        returns(bool);
}