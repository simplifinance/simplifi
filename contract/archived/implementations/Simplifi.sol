// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { CreatePool, Bank, IERC20, Utils, Common, IOwnerShip } from "../peripherals/CreatePool.sol";
import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";

contract Simplifi is CreatePool {
    using SafeMath for uint256;
    using Utils for *;

    mapping(uint => Common.Router) public routers;

    constructor(
        IERC20 _collateralToken,
        IERC20 _supportedAsset,
        IOwnerShip _ownershipMgr,
        address _feeTo,
        uint16 _makerRate
    ) CreatePool(_collateralToken, _supportedAsset, _ownershipMgr, _feeTo, _makerRate) {}

    /**
     * @dev Create new permissionless pool
     * @param asset : Asset required as contribution base
     * @param unit : Unit contribution
     * @param quorum : Max number of allowed contributors
     * @param intRate : Interest rate percent
     * @param durationInHours : Duration in hours
     * @param colCoverage : Collateral index or coverage
     */
    function createPermissionlessPool(
        uint256 unit,
        uint8 quorum,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        IERC20 asset
    ) external returns (bool) {
        Common.Router router = Common.Router.PERMISSIONLESS;
        address[] memory contributors = new address[](1);
        contributors[0] = _msgSender();
        _createPool(
            asset,
            contributors,
            unit,
            quorum,
            intRate,
            durationInHours,
            colCoverage,
            router
        );
        routers[unit] = router;
        return true;
    }

    /**
     * @dev Create new permissioned pool
     * @param asset : Asset required as contribution base
     * @param contributors : List of contributors
     * @param unit : Unit contribution
     * @param intRate : Interest rate percent
     * @param durationInHours : Duration in hours
     * @param colCoverage : Collateral index or coverage
     */
    function createPermissionedPool(
        IERC20 asset,
        address[] memory contributors,
        uint256 unit,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage
    ) external returns (bool) {
        Common.Router router = Common.Router.PERMISSIONED;
        uint8 quorum = uint8(contributors.length);
        _createPool(
            asset,
            contributors,
            unit,
            quorum,
            intRate,
            durationInHours,
            colCoverage,
            router
        );
        routers[unit] = router;
        return true;
    }

    /**
     * @dev Get finance
     * @param unit : Unit contribution
     * @param preferredDuration : User's preferred duration
     * @notice From the time the turnTime started, contributors have 1 hour grace. If the grace period elapses, and
     * anyone other than the expected user called, their profiles are swapped and the one who is ready is prioritized.
     * This is one way a contributor can be removed from a pool without notice.
     */
    function getFinance(
        uint256 unit,
        uint16 preferredDuration
    ) external isValidUnitContribution(unit) returns (bool) {
        Common.Pool memory _p = _getPool(unit, Common.Branch.CURRENT);
        Common.Contributor memory _c = _getExpected(unit);
        (bool isSwapped, address newUser) = (false, _c.id);
        Bank safe = _getSafe(unit, address(0), collateralToken);
        if (_p.lInt.stage != Common.Stage.GET) revert GettingFinanceNotReady();
        assert(_p.bigInt.currentPool == _p.bigInt.unit.mul(_p.lInt.quorum));
        if (Utils._now() > _c.turnStartTime + 1 hours) {
            if (_msgSender() != _c.id) {
                _onlyContributor(_msgSender(), unit);
                (isSwapped, newUser) = (true, newUser);
                _c = _swapFullProfile(unit, _msgSender(), _c);
            }
        } else {
            if (_msgSender() != _c.id) revert TurnTimeHasNotPassed();
        }
        _c.colBals = _getCollateralQuote(unit);
        _checkAndWithdrawToken(collateralToken, _c.colBals, _c.id, address(this), address(safe)); // Withdraws collateral and forward it to the safe
        _createAnalytics(_p.bigInt.currentPool, _c.colBals, false, _p.lInt.router == Common.Router.PERMISSIONLESS, false, true);
        safe.getFinance(_c, _p.addrs.asset, _p.bigInt.currentPool, _p.bigInt.currentPool.computeFee(uint16(makerRate)), _c.colBals, _p.bigInt.unitId, isSwapped, _getProfile(newUser, _p.bigInt.unit));
        _p.addrs.beneficiary = _c.id;
        _p.bigInt.currentPool = 0;
        _p.lInt.stage = Common.Stage.PAYBACK;
        _p.lInt.allGH ++;
        unchecked {
            _addContributor(
                unit,
                Common.Contributor(
                    _c.isMember,
                    _c.turnStartTime,
                    Utils._now(),
                    Utils._now() + (preferredDuration * 1 hours),
                    _p.bigInt.currentPool,
                    _c.colBals,
                    _c.id,
                    _c.sentQuota,
                    _c.interestPaid,
                    preferredDuration * 1 hours
                )
            );
        }
        _incrementUserCount(unit);
        _setPool(_p, unit, Common.Branch.CURRENT);

        emit GetFinance(_getPool(unit, Common.Branch.CURRENT));
        return true;
    }

    /**
     * @dev Payback
     * @param unit : Unit contribution
     */
    function payback(
        uint256 unit
    ) external isValidUnitContribution(unit) returns (bool) {
        Common.Contributor memory empty;
        _payback(unit, _msgSender(), false, empty);

        emit Payback(_getPool(unit, Common.Branch.CURRENT));
        return true;
    }

    /**
        @dev Liquidates a borrower if they have defaulted in repaying their loan.
        - If the current beneficiary defaulted, they're liquidated.
        - Their collateral balances is forwarded to the liquidator.
        - Liquidator must not be a participant in pool.
        @param unit : Unit contribution.
    */
    function liquidate(uint256 unit) external returns (bool) {
        (
            Common.Contributor memory _liq,
            bool defaulted,
            ,
            uint slot,
            address defaulter
        ) = _enquireLiquidation(unit);
        if (!defaulted) revert CurrentBeneficiaryIsNotADefaulter();
        address liquidator = _msgSender();
        _onlyNonContributor(liquidator, unit);
        _liq.id = liquidator;
        _updateProfile(unit, _liq, slot);
        _deleteSlot(defaulter, unit);
        Common.Pool memory _p = _getPool(unit, Common.Branch.CURRENT);
        _p.addrs.beneficiary = liquidator;
        _setPool(_p, unit, Common.Branch.CURRENT);
        _payback(unit, liquidator, true, _liq);

        emit Liquidated(_getPool(unit, Common.Branch.CURRENT));
        return true;
    }

    // /**
    //  * @dev Check if slot is available in the pool
    //  * @param unit : Unit contribution
    //  */
    // function isPoolVacant(
    //     uint256 unit
    // ) public view isValidUnitContribution(unit) returns (bool) {
    //     return
    //         _getUserCount(unit) <
    //         _getPool(unit, Common.Branch.CURRENT).lInt.quorum;
    // }

}
