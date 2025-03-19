// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";

interface ISimplifi {
    error InvalidSafe();
    error PoolIsTaken();
    error AddressMustBeArrayOfOneAddress();
    error CollaterlCoverageTooLow();
    error DurationExceed720HoursOrIsZero();
    error AddingUserEnded();
    error TokenBalanceInSafeNotTally();
    error MinimumParticipantIsTwo();
    error AlreadyAMemeber();
    error NoDebtFound();
    error SafeBalanceDepleted();
    error GettingFinanceNotReady();
    error InsufficientCollateral();
    error TurnTimeHasNotPassed();
    error PoolBalanceNotTally();
    error PaybackModeNotActivated();
    error OnlyCreatorIsAllowed();
    error CancellationNotAllowed();
    error CurrentBeneficiaryIsNotADefaulter();

    event PoolCreated(Pool);
    event NewContributorAdded(Pool);
    event GetFinance(Pool);
    event Payback(Pool);
    event Liquidated(Pool);
    event Cancellation(uint unit);

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
    function getCollateralQuote(uint256 unit) public view returns(uint);
    function payback(uint256 unit) external returns(bool);
    function joinAPool(uint256 unit) external returns(bool);
    function removeLiquidity(uint unit) external returns(bool);
    function getFinance(uint256 unit) external returns(bool);
    function liquidate(uint256 unit) external returns(bool);
    function enquireLiquidation(uint256 unit) 
        external 
        view 
        returns(
            Common.Contributor memory _liq, 
            bool defaulted, 
            uint currentDebt, 
            uint slot, 
            address
        );

    function createPermissionlessPool(
        address[] memory contributors, 
        uint256 unit,
        uint8 quorum,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        IERC20 asset
    ) external returns(bool);

    function createPermissionedPool(
        IERC20 asset, 
        address[] memory contributors, 
        uint256 unit,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage
    ) external returns(bool);
    
}