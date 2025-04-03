// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IERC20 } from "../apis/IERC20.sol";

abstract contract TokenInUse {
    error InvalidTokenAddress();
    error TokenAddressIsTheSame();

    IERC20 public token;

    constructor(IERC20 _token) {
        token = _token;
    }

    function _replaceToken(IERC20 newToken) internal virtual {
        if(address(newToken) == address(0)) revert InvalidTokenAddress();
        if(newToken == token) revert TokenAddressIsTheSame();
        token = newToken;
    }

    function _getToken() internal view returns(IERC20 _token) {
        _token = token;
    }

}