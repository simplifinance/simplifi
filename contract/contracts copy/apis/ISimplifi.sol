// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface ISimplifi {
    error InvalidSafe();
    error PoolIsTaken();
    error AddressMustBeArrayOfOneAddress();
    error CollaterlCoverageTooLow();
    error DurationExceed720HoursOrIsZero();
    error UserArrayExceedOne();
    error AddingUserEnded();
    error TokenBalanceInSafeNotTally();
    error MinimumParticipantIsTwo();

    function getProfile(
        uint256 unit,
        address user
    )
        external
        view
        returns(Common.Contributor memory);

    function getUserCount(uint256 unit) external view returns(uint);
    function getPoint(address user) external view returns(Common.Point memory);
    function getPool(uint256 unit, uint8 status) external view returns(Common.Pool memory);
    function getRecordId() external view returns(uint);
    function isPoolAvailable(uint256 unit) external view returns(bool);
}