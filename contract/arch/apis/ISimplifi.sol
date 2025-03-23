// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Common } from "./Common.sol";
import { IERC20 } from "./IERC20.sol";

interface ISimplifi {
    error UnSupportedAsset(address);
    error AssetIsSupported();
    error InvalidTokenAddress();
    error TokenAddressIsTheSame();
    error TokenIsAddressZero();
    error OwnershipManagerIsZeroAddress();
    error AssetIsNotListed();
    error InsufficientAllowance();
    error TransferFromFailed();
    error PoolIsTaken();
    error CollaterlCoverageTooLow();
    error DurationExceed720HoursOrIsZero();
    error AddingUserEnded();
    error MinimumParticipantIsTwo();
    error NoDebtFound();
    error GettingFinanceNotReady();
    error TurnTimeHasNotPassed();
    error PaybackModeNotActivated();
    error OnlyCreatorIsAllowed();
    error CancellationNotAllowed();
    error CurrentBeneficiaryIsNotADefaulter();
    error OnlyContributorIsAllowed();
    error OnlyNonContributorIsAllowed(); 
    error AlreadySentQuota();
    error UserExist();
 
    event PoolCreated(Common.Pool);
    event NewContributorAdded(Common.Pool);
    event GetFinance(Common.Pool);
    event Payback(Common.Pool);
    event Liquidated(Common.Pool);
    event Cancellation(uint unit);
  
    // function isSupportedAsset(address _asset) external view returns(bool);
    function getProfile( uint256 unit, address user) external view returns(Common.Contributor memory);
    function getUserCount(uint256 unit) external view returns(uint);
    function getPoint(address user) external view returns(Common.Point memory);
    function getCurrentPool(uint256 unit) external view returns(Common.Pool memory pool, Common.Contributor[] memory contributors, uint userCount);
    function getRecord(uint256 recordId) external view returns(Common.Pool memory);
    function getPastEpoches() external view returns(uint);
    function getCurrentEpoches() external view returns(uint);
    // function isPoolAvailable(uint256 unit) external view returns(bool);
    function getCollateralQuote(uint256 unit) external view returns(uint256);
    function payback(uint256 unit) external returns(bool);
    function joinAPool(uint256 unit) external returns(bool);
    function removeLiquidity(uint unit) external returns(bool);
    function getFinance(uint256 unit, uint16 preferredDuration) external returns(bool);
    function liquidate(uint256 unit) external returns(bool);
    function enquireLiquidation(uint256 unit) external view returns(Common.Contributor memory _liq, bool defaulted, uint currentDebt, uint slot, address);
    function createPermissionlessPool(
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