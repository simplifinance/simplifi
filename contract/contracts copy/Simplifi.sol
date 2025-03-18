// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Common } from "./apis/Common.sol";
import { IERC20 } from "./apis/IERC20.sol";
import { Utils } from "./libraries/Utils.sol";
import { CreatePool } from "./peripherals/CreatePool.sol";
import { Oracle } from "./peripherals/Oracle.sol";
import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";

contract Simplifi is CreatePool, Oracle {
    using SafeMath for uint256;
    using Utils for *;

    error NoDebtFound();
    error SafeBalanceDepleted();
    error GettingFinanceNotReady();
    error InsufficientCollateral();
    error TurnTimeHasNotPassed();
    error PoolBalanceNotTally();
    error PaybackModeNotActivated();

    constructor(
        address controller, 
        address newAgent, 
        IERC20 _token
    ) 
        CreatePool(controller, newAgent, _token)
    {}

    function createPermissionlessPool(
        address newSafe, 
        address[] memory users, 
        uint256 unit,
        uint8 quorum,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage
    ) public returns(bool) {
        _createPool(
            newSafe, 
            users, 
            unit,
            quorum,
            intRate,
            durationInHours,
            colCoverage,
            Common.Router.PERMISSIONLESS
        );
        return true;
    }

    function createPermissionedPool(
        address newSafe, 
        address[] memory users, 
        uint256 unit,
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage
    ) public returns(bool) {
        _createPool(
            newSafe, 
            users, 
            unit,
            uint8(users.length),
            intRate,
            durationInHours,
            colCoverage,
            Common.Router.PERMISSIONED
        );
        return true;
    }

    function getFinance(uint256 unit, address user) public returns(bool) {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        Common.Contributor memory _c = _getExpected(unit);
        uint256 safeBalance = _getSafe(unit).id.balance;
        if(Utils._now() > _c.turnTime + 1 hours){
            if(user != _c.id) {
                _c = _swapFullProfile(unit, user, _c);
            }
        } else {
            if(user != _c.id) revert TurnTimeHasNotPassed();
        }
        if(_p.lInt.stage != Common.Stage.GET) revert GettingFinanceNotReady();
        if(IERC20(_getToken()).balanceOf(_getSafe(unit).id) < _p.bigInt.currentPool) revert TokenBalanceInSafeNotTally();
        if(_p.bigInt.unit.mul(_p.lInt.quorum) < _p.bigInt.currentPool) revert PoolBalanceNotTally();
        _onlyContributor(_c.id, unit);
        uint fee = _p.bigInt.currentPool.computeFee(uint16(makerRate));
        _c.colBals = _getCollateralQuote(unit);
        if(safeBalance < _c.colBals) revert InsufficientCollateral();
        _c.loan = _p.bigInt.currentPool.sub(fee);
        _p.beneficiary = _c.id;
        _p.bigInt.currentPool = 0;
        _p.lInt.stage = Common.Stage.PAYBACK;
        _addContributor(unit, _c);
        _setPool(_p, unit, Common.UnitStatus.CURRENT);
        _incrementUserCount(unit);
        return true;
    }

    function payback(uint256 unit, address user) public returns(bool) {
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        Common.Contributor memory _c = _getProfile(user, unit);
        if(_p.lInt.stage != Common.Stage.PAYBACK) revert PaybackModeNotActivated();
        uint debt = _getCurrentDebt(unit, user);
        if(debt == 0) revert NoDebtFound();
        _c.loan = 0;
        bool allGF = _getUserCount(unit) == _p.lInt.quorum;
        if(!allGF){
            _p.bigInt.currentPool = _p.bigInt.unit.mul(_p.lInt.quorum);
            if(IERC20(_getToken()).balanceOf(_getSafe(unit).id) < _p.bigInt.currentPool) revert SafeBalanceDepleted();
            _p.lInt.stage = Common.Stage.GET;
            _setTurnTime(address(0), unit, Utils._now());
            _setPool(_p, unit, Common.UnitStatus.CURRENT);
        } else {
            _p.lInt.stage = Common.Stage.ENDED;
            _setPool(_p, unit, Common.UnitStatus.RECORD);
            _removePool(unit);
        }
        _addContributor(unit, _c);
        return true;
    }

    /**@dev Return accrued debt for user up to this moment.
     * @param unit : Contribution amount.
     * @param user : Contributor.
     * @notice This is the total accrued debt between the date user was paid and now.
     */
    function _getCurrentDebt(uint256 unit, address user) 
        internal 
        view returns(uint debt) 
    {
        uint intPerSec = _getPool(unit, Common.UnitStatus.CURRENT).interest.intPerSec;
        Common.Contributor memory _c = _getProfile(user, unit);
        debt = _c.loan.add(intPerSec.mul(uint(Utils._now()).sub(_c.turnTime)));
    } 

    /**@dev Return accrued debt for user up to this moment.
     * @param unit : Contribution amount.
     * @param user : Contributor.
     * @notice This is the total accrued debt between the date user was paid and now.
     */
    function getCurrentDebt(uint256 unit, address user) 
        public 
        view returns(uint debt) 
    {
        return _getCurrentDebt(unit, user);
    } 
    
    function _getCollateralQuote(uint256 unit) internal view returns(uint quote){
        Common.Pool memory _p = _getPool(unit, Common.UnitStatus.CURRENT);
        quote = Common.Price(_getDummyPrice(), 18).computeCollateral(uint24(_p.lInt.colCoverage), _p.bigInt.currentPool);
    }

    function getCollateralQuote(uint256 unit) public view returns(uint quote){
       return _getCollateralQuote(unit);
    }

    /**
     * @dev Check if slot is available in the pool
     * @param unit : Unit contribution
     */
    function isPoolVacant(uint256 unit) public view returns(bool) {
        return _getUserCount(unit) < _getPool(unit, Common.UnitStatus.CURRENT).lInt.quorum;
    }
}
