// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface IFactory {
    function getProfile(
        uint256 unit,
        address user
    )
        external
        view
        returns(Contributor memory);

    function getUserCount(uint256 unit) external view returns(uint);
    function getPoint(address user) public view returns(Common.Point memory);
    function joinViaProvider(Common.Provider[] memory provider, address borrower, uint unit) external returns(bool);
}