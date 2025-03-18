// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

abstract contract Oracle {

    // Dummy price for development purpose
    function _getDummyPrice() 
        internal 
        pure 
        returns (uint128 _price) 
    {
        return 10000000000000000000;
    }
}