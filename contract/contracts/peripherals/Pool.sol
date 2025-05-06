// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// import "hardhat/console.sol";
import { 
    Contributor, 
    Common, 
    ErrorLib, 
    Utils, 
    IRoleBase, 
    IERC20, 
    IPoint, 
    ISupportedAsset,
    ISafeFactory
} from "./Contributor.sol";
import { ISafe } from "../interfaces/ISafe.sol";

abstract contract Pool is Contributor {
    using Utils for *;
    using ErrorLib for *;

    // ================ Constructor ==============
    constructor(
        address _diaOracleAddress, 
        ISupportedAsset _assetManager, 
        IRoleBase _roleManager,
        IERC20 _baseAsset,
        IPoint _pointFactory,
        ISafeFactory _safeFactory
    ) 
        Contributor(_diaOracleAddress, _assetManager, _roleManager, _baseAsset, _pointFactory, _safeFactory)
    {}

    /**
     * @dev Create a pool internally
     * @param users : Participants
     * @param unit : Unit contribution
     * @param maxQuorum : Maximum number of contributors that can participate
     * @param durationInHours : Maximum duration in hours each borrower can retain the loan
     * @param colCoverage : Ration of collateral coverage or index required as cover for loan
     * @param router : Router : PERMISSIOLESS or PERMISSIONED
     */
    function _createPool(
        address[] memory users,
        address sender,
        uint unit,
        uint8 maxQuorum,
        uint16 durationInHours,
        uint24 colCoverage,
        Common.Router router,
        IERC20 colAsset
    ) internal _onlyIfUnitIsNotActive(unit) onlySupportedAsset(colAsset) returns(Common.Pool memory pool) {
        if(durationInHours == 0 || durationInHours > 720) 'Invalid duration'._throw();
        if(router == Common.Router.PERMISSIONLESS){
            if(users.length > 1 || users.length == 0) 'Expect 1 item in list'._throw();
            assert(users[0] == sender);
        } else {
            if(users.length < 2) 'List too low for router2'._throw();
            if(sender != users[0]) 'Sender not in list'._throw();
        }
        (uint96 unitId, uint96 recordId) = _generateIds(unit);
        pool = _updatePool(Common.UpdatePoolData(unit, unitId, recordId, maxQuorum, colCoverage, colAsset, durationInHours, users[0], router));  
        pool = _addUserToPool(unit, users, pool);
        _setPool(unitId,  pool);
        _completeAddUser(users[0], pool);
    }

    /**
     * @dev Add users to newly created pool
     * @param unit : Unit contribution
     * @param users : List of contributors to add
     * @param pool : Pool data. Must be an existing data relating to the unit contribution
     */
    function _addUserToPool(
        uint256 unit, 
        address[] memory users,
        Common.Pool memory pool
    ) internal returns(Common.Pool memory _pool) {
        for(uint i = 0; i < users.length; i++) {
            Common.ContributorReturnValue memory data;
            if(i == 0) data = _initializeContributor(pool, unit, users[i], true, true, true);
            else {
                if(users[0] == users[i]) 'Creator spotted twice'._throw();
                data = _initializeContributor(pool, unit, users[i], false, true, false);
            }
            _setContributor(data.profile, pool.big.recordId, uint8(data.slot.value), false);
        }
        _pool = pool;
    }

    /**
        * @dev Add user to existing pool
        * @param unit : Unit contribution
        * @param user : Contributors to add
        * @param pool : Pool data. Must be an existing data relating to the unit contribution
    */
    function _joinAPool(
        uint256 unit, 
        address user,
        Common.Pool memory pool
    ) internal _onlyIfUnitIsActive(unit) returns(Common.Pool memory _pool) {
        if(pool.stage != Common.Stage.JOIN) 'Invalid stage'._throw();
        Common.ContributorReturnValue memory data;
        unchecked {
            pool.big.currentPool += pool.big.unit;
            pool.low.userCount += 1;
        }
        if(pool.router == Common.Router.PERMISSIONED) {
            _onlyContributor(user, unit, false);
            data = _getContributor(user, unit);
            data.profile.sentQuota = true;
        } else {
            _onlyNonContributor(user, unit);
            data = _initializeContributor(pool, unit, user, false, true, true);
        }
        _setContributor(data.profile, pool.big.recordId, uint8(data.slot.value), false);
        if(_isPoolFilled(pool, pool.router == Common.Router.PERMISSIONED)) {
            _setTurnStartTime(address(0), unit, _now());
            pool.stage = Common.Stage.GET;
        }
        _pool = pool;
        _completeAddUser(user, pool);
    }
    
    /**
        * @dev Complete the add task.
        * @param user : Contributors to add
        * @param pool : Pool data. Must be an existing data relating to the unit contribution
    */
    function _completeAddUser(address user, Common.Pool memory pool) internal {
        _checkAndWithdrawAllowance(IERC20(baseAsset), user, pool.addrs.safe, pool.big.unit);
        if(!ISafe(pool.addrs.safe).addUp(user, pool.big.recordId)) 'Add user failed'._throw();
    }

    /**
     * @dev Update pool with relevant data
     * @param data : Function argument of type Common.UpdatePoolData
     */
    function _updatePool(Common.UpdatePoolData memory data) internal returns(Common.Pool memory pool) {
        unchecked {
            pool.low = Common.Low(data.maxQuorum, 0, data.colCoverage, uint32(uint(data.durationInHours) * 1 hours), 0, 1);
        }
        pool.big = Common.Big(data.unit, data.unit, data.recordId, data.unitId);
        pool.addrs = Common.Addresses(data.colAsset, address(0), _getSafe(data.unit), data.creator);
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
     */
    function getCurrentDebt(uint256 unit) public view returns(uint256 debt) 
    {
       (debt,) = _getCurrentDebt(unit);
       return debt;
    }

}
