// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Contributor, Common, ErrorLib, Utils } from "./Contributor.sol";
import { Safe, ISafe } from "./Safe.sol";

contract Pool is Safe, Contributor {
    using Utils for *;
    using ErrorLib for string;

    // ================ Constructor ==============
    constructor(
        address _diaOracleAddress, 
        address _assetManager, 
        IRoleBase _roleManager,
        IERC20 _baseAsset,
        IPoint _pointFactory
    ) 
        Contributor(_diaOracleAddress, _assetManager, _roleManager, _baseAsset, _pointFactory)
    {}

    /**
     * @dev Create a pool internally
     * @param user : Account that initiate this transaction i.e trx.origin
     * @param unit : Unit contribution
     * @param maxQuorum : Maximum number of contributors that can participate
     * @param durationInHours : Maximum duration in hours each borrower can retain the loan
     * @param colCoverage : Ration of collateral coverage or index required as cover for loan
     * @param router 
     */
    function _createPool(
        address[] memory users, 
        uint unit,
        uint8 maxQuorum,
        uint16 durationInHours,
        uint24 colCoverage,
        Common.Router router,
        IERC20 colAsset
    ) internal _onlyIfUnitIsNotActive(unit)  onlySupportedAsset(colAsset) returns(Common.Pool memory pool) {
        if(durationInHours == 0 || durationInHours > 720) 'Invalid duration'._throw();
        if(router == Common.Router.PERMISSIONLESS){
            if(users.length > 1) 'List exceed 1 for router1'._throw();
        } else {
            if(users.length < 2) 'List too low for router2'._throw();
        }
        (uint96 unitId, uint96 recordId) = _generateIds(unit);
        pool = _updatePool(unitId, Common.UpdatePoolData(unit, unitId, recordId, maxQuorum, colCoverage, colAsset, durationInHours, user));
        pool = _addUserToPool(unit, users, pool);
        _setPool(unitId,  pool);
        _completeAddUser(user[0], pool);
    }

    function _addUserToPool(
        uint256 unit, 
        address[] memory users
        Common.Pool memory pool
    ) internal returns(Common.Pool memory _pool) {
        _pool = pool;
        for(uint i = 0; i < users.length; i++) {
            (Common.Contributor memory profile, uint8 slot);
            if(i == 0) (profile, slot) = _initializeContributor(_pool, unit, user[i], true, true, true);
            else (profile, slot) = _initializeContributor(_pool, unit, user[i], false, true, false);
            _setContributor(profile, _pool.big.recordId, slot, false);
        }
        unchecked {
            _pool.big.currentPool += unit;
            _pool.low.userCount += 1;
        }
    }

    function _joinAPool(
        uint256 unit, 
        address user
        Common.Pool memory pool
    ) internal _onlyIfUnitIsActive(unit) returns(Common.Pool memory _pool) {
        _pool = pool;
        if(pool.stage != Common.Stage.JOIN) 'Invalid stage'._throw();
        (Common.Contributor memory profile, uint8 slot);
        if(_pool.router == Common.Router.PERMISSIONED) {
            _onlyContributor(user, unit);
            (profile, slot) = _getContributor(user, unit);
            profile.sentQuota = true;
        } else {
            _onlyNonContributor(user, unit);
            (profile, slot) = _initializeContributor(_pool, unit, user[i], false, true, true);
        }
        _setContributor(profile, _pool.big.recordId, slot, false);
        unchecked {
            _pool.big.currentPool += unit;
            _pool.low.userCount += 1;
            if(_isPoolFilled(_pool, _pool.router == Common.Router.PERMISSIONED)) {
                _setTurnStartTime(address(0), unit, _pool.big.recordId, _now());
                _pool.stage = Common.Stage.GET;
                _pool.status = Common.Status.AVAILABLE; 
            }
        }
        // _setPool(pool.big.unitId, pool);
    }
    
    function _completeAddUser(address user, Common.Pool memory pool) internal {
        (, uint _) = _checkAndWithdrawAllowance(IERC20(baseAsset), user, pool.addrs.safe, pool.big.unit);
        if(!ISafe(pool.addrs.safe).addUp(user, pool.big.recordId)) 'Add user failed'._throw();
    }

    /**
     * @dev Update pool with relevant data
     * @param data : Function argument of type Common.UpdatePoolData
     */
    function _updatePool(Common.UpdatePoolData memory data) internal returns(Common.Pool memory pool) {
        pool.low = Common.Low(data.maxQuorum, 0, data.colCoverage, data.durationInHours * 1 hours, 0, 1);
        pool.big = Common.Big(data.unit, data.unit, data.recordId, data.unitId);
        pool.addrs = Common.Address(data.colAsset, address(0), _getSafe(data.unit), data.admin);
        pool.router = data.router;
        pool.status = Common.Status.TAKEN;
        pool.stage = Common.Stage.JOIN;
    }

    /**
     * @dev Returns amount of collateral required in a pool.
     * @param unit : EpochId
     * @return collateral Collateral
     * @return colCoverage Collateral coverage
     */
    function getCollateralQuote(uint256 unit) public view returns(uint collateral, uint24 colCoverage)
    {
       return _getCollateralQuote(unit);
    }

    /**
     * Returns the current debt of target user.
     * @param unit : Unit contribution
     * @param target : Target user.
     */
    function getCurrentDebt(uint256 unit, address target) public view returns(uint256 debt) 
    {
       return _getCurrentDebt(unit, target);
    }
    
}
