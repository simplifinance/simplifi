// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// import { Common } from "./apis/Common.sol";
// import { IERC20 } from "./apis/IERC20.sol";
// import { Utils } from "./libraries/Utils.sol";
import { CreatePool, Bank, IERC20, Utils, Common } from "./peripherals/CreatePool.sol";
import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";

contract Simplifi is CreatePool {
    using SafeMath for uint256;
    using Utils for *;

    mapping(uint => Router) public routers;

    constructor(
        IERC20 _collateralToken,
        IERC20 _supportedAsset,
        IOwnerShip _ownershipMgr,
        address _feeTo
    ) 
        CreatePool(_collateralToken, _supportedAsset, _ownershipMgr, _feeTo)
    {}

    /**
     * @dev Create new permissionless pool
     * @param asset : Asset required as contribution base
     * @param contributors : List of contributors 
     * @param unit : Unit contribution
     * @param quorum : Max number of allowed contributors
     * @param intRate : Interest rate percent
     * @param durationInHours : Duration in hours
     * @param colCoverage : Collateral index or coverage
     */
    function createPermissionlessPool(
        address[] memory contributors, 
        uint256 unit,
        uint8 quorum,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        IERC20 asset
    ) external returns(bool) {
        Router router = Router.PERMISSIONLESS;
        _createPool( asset,  contributors,  unit, quorum, intRate, durationInHours, colCoverage, router);
        routers[unit] = router;
        return true;
    }

    /**
     * @dev Create new permissioned pool
     * @param asset : Asset required as contribution base 
     * @param contributors : List of contributors 
     * @param unit : Unit contribution
     * @param quorum : Max number of allowed contributors
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
    ) external returns(bool) {
        Router router = Router.PERMISSIONLESS;
        uint8 quorum = uint8(contributors.length);
        _createPool( asset,  contributors,  unit, quorum, intRate, durationInHours, colCoverage, router);
        routers[unit] = router;
        return true;
    }

    /**
     * @dev Get finance
     * @param unit : Unit contribution
     * @notice From the time the turnTime started, contributors have 1 hour grace. If the grace period elapses, and 
     * anyone other than the expected user called, their profiles are swapped and the one who is ready is prioritized.
     * This is one way a contributor can be removed from a pool without notice.  
     */
    function getFinance(uint256 unit) external isValidUnitContribution(unit) returns(bool) {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        Common.Contributor memory _c = _getExpected(unit);
        (bool isSwapped, address newUser) = (false, _c.id);
        Bank safe = _getSafe(unit, address(0), _collateralToken);
        if(_p.lInt.stage != Common.Stage.GET) revert GettingFinanceNotReady();
        assert(_p.bigInt.currentPool == _p.bigInt.unit.mul(_p.lInt.quorum));
        if(Utils._now() > _c.turnTime + 1 hours){
            if(_msgSender() != _c.id) {
                _onlyContributor(_msgSender(), unit);
                (isSwapped, newUser) = (true, newUser);
                _c = _swapFullProfile(unit, _msgSender(), _c);
            }
        } else {
            if(_msgSender() != _c.id) revert TurnTimeHasNotPassed();
        }
        _c.colBals = _getCollateralQuote(unit);
        _checkAndWithdrawToken(collateralToken, _c.colBals, _c.id, address(this), address(safe)); // Withdraws collateral and forward it to the safe
        safe.getFinance(_c.id, _p.addrs.asset, _p.bigInt.currentPool, _p.bigInt.currentPool.computeFee(uint16(makerRate)), _c.colBals, _p.bigInt.unitId, isSwapped, newUser);
        _p.beneficiary = _c.id;
        _p.bigInt.currentPool = 0;
        _p.lInt.stage = Common.Stage.PAYBACK;
        unchecked {
            _addContributor(
                unit, 
                Common.Contributor(
                    _c.isMember,
                    _c.turnStartTime,
                    Utils._now(),
                    Utils._now() + (durationInHours * 1 hours),
                    _p.bigInt.currentPool,
                    _c.colBals,
                    _c.id,
                    _c.sentQuota
                )
            );
        }
        _incrementUserCount(unit);
        _setPool(_p, unit, Common.UnitStatus.CURRENT);

        emit GetFinance(_getPool(unit, Common.Branch.CURRENT));
        return true;
    }

    /**
     * @dev Payback
     * @param unit : Unit contribution
    */
    function payback(uint256 unit) external isValidUnitContribution(unit) returns(bool) {
        _payback(unit, _msgSender(), false, address(0));

        emit Payback(_getPool(unit, Common.Branch.CURRENT));
    }

    /**
        @dev Liquidates a borrower if they have defaulted in repaying their loan.
        - If the current beneficiary defaulted, they're liquidated.
        - Their collateral balances is forwarded to the liquidator.
        - Liquidator must not be a participant in pool.
        @param unit : Unit contribution.
    */
    function liquidate(uint256 unit) 
        external
        returns(bool)
    {
        (Common.Contributor memory _liq, bool defaulted, uint currentDebt, uint slot, address defaulter) = _enquireLiquidation(unit);
        if(!defaulted) revert CurrentBeneficiaryIsNotADefaulter();
        address liquidator = _msgSender();
        _onlyNonContributor(liquidator, unit);
        _liq.id = liquidator;
        _updateProfile(unit, _liq, slot);
        _deleteSlot(defaulter, unit);
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        _p.addrs.beneficiary = liquidator;
        _setPool(_p, unit, Common.UnitStatus.CURRENT);
        _payback(unit, liquidator, true, defaulter);

        emit Liquidated(_getPool(unit, Common.UnitStatus.CURRENT));
    }

    /**
     * @dev Check if slot is available in the pool
     * @param unit : Unit contribution
     */
    function isPoolVacant(uint256 unit) public view isValidUnitContribution(unit) returns(bool) {
        return _getUserCount(unit) < _getPool(unit, Common.UnitStatus.CURRENT).lInt.quorum;
    }
}
