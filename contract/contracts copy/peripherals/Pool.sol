// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// import { Agent } from "./Agent.sol";
// import { Pools } from "./Pools.sol";
// import { Safe } from "./Safe.sol";
import { Contributor, Common, ErrorLib } from "./Contributor.sol";
// import { IERC20 } from "../apis/IERC20.sol";
// import { TokenInUse } from "./TokenInUse.sol";
// import { Point } from "./Point.sol";
// import { Utils } from "../libraries/Utils.sol";
import { ERC20Manager, IERC20 } from "./ERC20Manager.sol";
import { IPoint } from "../apis/IPoint.sol";
import { Safe, ISafe } from "./Safe.sol";

contract Pool is Safe, Contributor, ERC20Manager {
    using Utils for *;
    using ErrorLib for string;

    // Point factory address
    IPoint public immutable pointFactory;

    constructor(
        address _assetManager, 
        IERC20 _baseAsset,
        IPoint _pointFactory
    ) 
        ERC20Manager(_assetManager, _baseAsset)
    {
        pointFactory = _pointFactory;
    }

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
        Common.Router router
    ) internal _onlyIfUnitIsActive(unit) returns(Common.Pool memory pool) {
        if(durationInHours == 0 || durationInHours > 720) 'Invalid duration'._throw();
        if(router == Common.Router.PERMISSIONLESS){
            if(users.length > 1) 'List exceed 1 for router1'._throw();
        } else {
            if(users.length < 2) 'List too low for router2'._throw();
        }
        (uint96 unitId, uint96 recordId) = _generateIds(unit);
        pool = _updatePool(unitId, Common.UpdatePoolData(unit, unitId, recordId, maxQuorum, colCoverage, durationInHours, user));
        pool = _addUserToPool(unit, users, pool);
        _setPool(unitId,  pool);
        _completeAddUser(user[0], pool);
    }

    function _addUserToPool(
        uint256 unit, 
        address[] memory users
        Common.Pool memory pool
    ) internal _onlyIfUnitIsNotActive(unit) returns(Common.Pool memory _pool) {
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

    ///@dev Award points for users
    function _awardPoint(address target, uint8 asMember, uint8 asAdmin, bool deduct) internal {
        (bool done, Common.Point memory point) = (false, Common.Point(asMember, asAdmin, 0));
        done = deduct? IPoint(pointFactory).deductPoint(user, point) : IPoint(pointFactory).setPoint(target, point);
        if(!done) 'Point award failed'._throw();
    }

    /**
     * @dev Update pool with relevant data
     * @param data : Function argument of type Common.UpdatePoolData
     */
    function _updatePool(Common.UpdatePoolData memory data) internal returns(Common.Pool memory pool) {
        pool.low = Common.Low(data.maxQuorum, 0, data.colCoverage, data.durationInHours * 1 hours, 0, 1);
        pool.big = Common.Big(data.unit, data.unit, data.recordId, data.unitId);
        pool.addrs = Common.Address(address(0), _getSafe(data.unit), data.admin);
        pool.router = data.router;
        pool.status = Common.Status.TAKEN;
        pool.stage = Common.Stage.JOIN;
    }
    
}
