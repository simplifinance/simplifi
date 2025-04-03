// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

library ErrorLib {
    error ErrorOccurred(string errorMsg);

    /**
     * @dev Reverts any operation.
     * @param _error : Error struct
     */
    function _throw(string memory _error) internal {
        if(_error.errorMessage != ""){
            revert ErrorOccurred(_error.errorMessage);
        }
    }

}