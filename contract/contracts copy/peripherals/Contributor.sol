// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Epoches, Common } from "./Epoches.sol";
import { Slots } from "./Slots.sol" ;
import { Utils } from "../libraries/Utils.sol";
import { AwardPoint, IRoleBase, IERC20, ErrorLib } from "./AwardPoint.sol";
import { ISafe } from "../apis/ISafe.sol";

abstract contract Contributor is Epoches, Slots, AwardPoint {
    using ErrorLib for string;
    using Utils for uint;

    /**
     * @dev Mapping of recordId to contributors
     * @notice We used record Id to index the contributors in a pool while a unit contribution
     * van have multiple records, it makes sense to track contributors in each pool with their record Id
    */
    mapping(uint96 recordId => Common.Contributor[]) private contributors;

    // ============= constructor ============
    constructor(
        address _diaOracleAddress, 
        address _assetManager, 
        IRoleBase _roleManager,
        IERC20 _baseAsset,
        IPoint _pointFactory
    ) 
       AwardPoint(_roleManager, _pointFactory, _baseAsset, _diaOracleAddress, _assetManager)
    {}

    /**
     * @dev Only contributor in a pool is allowed
     * @param target : Target
     * @param unit : Unit Contribution
    */
    function _onlyContributor(address target, uint256 unit) internal view {
        if(!_getSlot(target, unit).isMember) 'Not a member'._throw();
        _;
    }

    /**
     * @dev Only Non contributor in a pool is allowed
     * @param target : Target
     * @param unit : Unit Contribution
     */
    function _onlyNonContributor(address target, uint256 unit) internal view {
        if(_getSlot(target, unit).isMember) 'Member not allowed'._throw();
        _;
    }

    // ============ constructor =================
    constructor(address _diaOracleAddress) Price(_diaOracleAddress) {}

    /**
     * @dev returns target's profile status in a pool
     * @param target : Target account
     * @param unit : Unit contribution
     */
    function _getContributor(
        address target, 
        uint unit
    ) internal view returns(Common.Contributor memory _profile, uint8 slot) {
        slot = _getSlot(target, unit).value;
        _profile = contributors[_getRecordId(unit)][slot];
    }

    /**
     * @dev returns user's profile status in a pool
     * @param unit : Unit contribution
     */
    function _getExpected(uint256 unit, uint8 selector) internal view returns(Common.Contributor memory _expected) {
        _expected = contributors[_getRecordId(unit)][selector];
    }

    function _setProviders(
        Common.Provider[] memory providers, 
        address user, 
        uint unit,
        uint recordId
    ) internal {
        contributors[recordId][_getSlot(user, unit).value].providers = providers;
        // for(uint i = 0; i < providers.length; i++) {
        //     contributors[recordId][slot].providers.push(providers[i]);
        // }
    } 

    /**
     * @dev Set user's time to get finance
     * @param user : Target address
     * @param unit : Unit contribution
     * @param date : Date/timestamp
     * @notice If 'user' is zero address, we generate a new slot otherwise fetch existing slot
     */ 
    function _setTurnStartTime(address user, uint256 unit, uint32 date) internal {
        uint position;
        if(user == address(0)){
            position = _getPool(unit).low.selector;
            user = _getExpected(unit, position);
        } else {
            position = _getSlot(user, unit).value;
        }
        contributors[_getRecordId(unit)][position].turnStartTime = date;
     }

    /**
     * @dev Add or update contributor to the list of contributors
     * @param profile : Target profile
     * @param position : The position of target user in the list
     * @param recordId : Unit Id
     */
    function _setContributor(Common.Contributor memory profile, uint96 recordId, uint8 position, bool setEmpty) internal {
        Common.Contributor memory empty;
        contributors[recordId][position] = setEmpty? empty : profile;
    }

    /**
     * @dev Add contributor data to storage
     * @param pool : Pool struct
     * @param unit : Unit contribution
     * @param target : Target user
     * @param isAdmin : Whether user is the creator or not
     * @param isMember : Whether user is a member or not
     * @param sentQuota : Whether user have sent their quota of the contribution or not
     */
    function _initializeContributor(
        Common.Pool memory pool,
        uint256 unit,
        address target,
        bool isAdmin,
        bool isMember,
        bool sentQuota            
    ) internal returns(Common.Contributor memory data, uint8 slot) {
        slot = uint8(contributors[pool.big.recordId].length);
        _createSlot(target, unit, position, isAdmin, isMember);
        contributors[pool.big.recordId].push(); 
        data.id = target;
        data.sentQuota = sentQuota;
        // _setContributor(data, pool.big.recordId, position, false);
        // pool.low.userCount ++;
        // _setPool(pool.big.unitId, pool);
    }

    /**
     * @dev Remove contributor from a pool
     * @param target : Target address
     * @param unit : Unit contribution
     * @notice Parsing true to _setSlot as the last argument with set the slot to empty
     */
    function _removeContributor(address target, uint256 unit) internal {
        Common.Slot memory slot = _getSlot(target, unit);
        _setSlot(target, unit, slot, true);
    }

    /**
     * @dev Swaps contributors data if the expected caller is not the same as the actual caller
     * and the grace period has elapsed.
     * @param unit : Unit contribution
     * @param actualCaller : Actual calling account
     * @param slotOfExpectedCaller : Slot of expected calling account
     * @param dataOfExpectedCaller : Data of expected calling account
     */
    function _swapContributors(
        uint256 unit,
        address actualCaller,
        Common.Slot memory slotOfExpectedCaller,
        Common.Contributor memory dataOfExpectedCaller
    )
        internal
        _onlyContributor(actualCaller, unit)
        returns(Common.Contributor memory dataOfActualCaller) 
    {
        uint96 recordId = _getRecordId(unit);
        Common.Slot memory slotOfActualCaller = _getSlot(actualCaller, unit);
        dataOfActualCaller = _getContributor(actualCaller, unit);
        _setSlot(actualCaller, unit, slotOfExpectedCaller, false);
        _setSlot(dataOfExpectedCaller.id, unit, slotOfActualCaller, false);
        dataOfActualCaller.id = dataOfExpectedCaller.id;
        dataOfExpectedCaller.id = actualCaller;
        _setContributor(dataOfExpectedCaller, recordId, slotOfExpectedCaller.value, false);
        _setContributor(dataOfActualCaller, recordId, slotOfActualCaller.value, false);
    }

    /**
     * @dev Complete the getFinance task
     * @param pool : Existing pool. Must not be an empty pool.
     * @param collateral : Expected collateral
     */
    function _completeGetFinance(Common.Pool memory pool, uint collateral) internal returns(Common.Pool memory _pool) {
        _pool = pool;
        _pool.low.selector ++;
        uint slot = _getSlot(_pool.addrs.lastPaid, _pool.big.unit).value;
        contributors[_pool.big.recordId][slot].paybackTime = _now() + _pool.low.duration;
        contributors[_pool.big.recordId][slot].colBals = collateral;
        Common.Provider memory providers = contributors[_pool.big.recordId][slot].providers;
        for(uint i = 0; i < providers.length; i++){
            contributors[_pool.big.recordId][slot].providers[i].earnStartDate = _now();
            contributors[_pool.big.recordId][slot].providers[i].accruals = providers[i].amount.computeInterestsBasedOnDuration(providers[i].rate, _pool.low.duration);
        }
        _pool.big.currentPool = 0;
        _pool.stage = Common.Stage.PAYBACK;
    }

    function _payback(
        uint unit, 
        address user,
        bool isSwapped,
        address defaulted
    ) 
        internal 
        returns(Common.Pool memory pool, Common.Provider memory providers, uint attestedInitialBal)
    {
        uint debt = _getCurrentDebt(unit, user);
        if(debt == 0) 'No debt found'._throw();
        pool = _getPool(unit); 
        uint slot = _getSlot(user, unit).value;
        Common.Contributor memory profile = _getContributor(user, unit);
        providers = profile.providers;
        contributors[pool.big.recordId][slot].loan = 0;
        contributors[pool.big.recordId][slot].colBals = 0;
        contributors[pool.big.recordId][slot].paybackTime = _now();
        if(awardPoint) _awardPoint(user, 2, 0, false);
        if(pool.low.maxQuorum == pool.low.allGh){
            pool.stage = Common.Stage.ENDED;
        } else {
            pool.stage = Common.Stage.GET;
            unchecked {
                pool.big.currentPool = pool.big.unit * pool.low.maxQuorum;
            }
        }
        attestedInitialBal = IERC20(baseAsset).balanceOf(pool.addrs.safe);
        (, uint _) = _checkAndWithdrawAllowance(IERC20(baseAsset), user, pool.addrs.safe, debt);
        if(!ISafe(pool.addrs.safe).payback(Common.Payback_Bank(user, baseAsset, debt, attestedInitialBal, pool.low.maxQuorum == pool.low.allGh, contributors[pool.big.recordId], _isSwapped, _defaulted, pool.big.recordId, colToken))) 'Call to Safe failed'._throw();
    }


    /**
     * @dev Return past pools using unitId. 
     * @notice The correct unitId must be parsed. 
     * @param unit: UnitId 
     * @param recordId: Record Id
     */
    function getRecord(uint unit) external view returns(Common.ReadDataReturnValue memory result) {
        uint96 recordId = _getPool(unit).big.recordId;
        result.cData = contributors[recordId];
        result.pool = _getPastPool(recordId);
        return result;
    }

    /**
     * @dev Return past pools using unitId. 
     * @notice The correct unitId must be parsed. 
     * @param unit: UnitId 
     */
    function getPoolData(uint unit) external view returns(Common.ReadDataReturnValue memory result) {
        result.cData = contributors[_getPool(unit).big.recordId];
        result.pool = _getPool(unit);
        return result;
    }

    
    /**
     * @dev Get pool from storage
     * @param unit : Unit contribution
     */
    function isPoolAvailable(uint256 unit) public view returns(bool) {
        return _getPool(unit).status == Common.Status.AVAILABLE;
    }

    /**
     * @dev Returns the profile of target
     * @param unit : unit contribution
     * @param target : User
     */
    function getProfile(
        uint256 unit,
        address target
    )
        external
        view
        // onlyInitialized(unit, false)
        returns(Common.Contributor memory) 
    {
        return _getContributor(target, unit);
    }

    /**
     * @dev Returns amount of collateral required in a pool.
     * @param unit : EpochId
     * @return collateral Collateral
     * @return colCoverage Collateral coverage
     */
    function _getCollateralQuote(uint256 unit)
        internal
        view
        _onlyContributor(_msgSender(), unit) 
        _onlyIfUnitIsActive(unit)
        returns(uint collateral, uint24 colCoverage)
    {
        Common.Pool memory pool = _getPool(unit);
        unchecked {
            (collateral, colCoverage) = collateral = (Common.Price(
                    _getCollateralTokenPrice(pool.addrs.colAsset), 
                    diaOracleAddress == address(0)? 18 : 8
                ).computeCollateral(
                    uint24(pool.low.colCoverage), 
                    pool.big.unit * pool.low.quorum
                ),
                uint24(pool.low.colCoverage)
            );
        }
    }

    /**
     * Returns the current debt of target user.
     * @param unit : Unit contribution
     * @param target : Target user.
     */
    function _getCurrentDebt(
        uint256 unit,
        address target
    ) 
        internal
        view 
        _onlyIfUnitIsActive(unit)
        _onlyContributor(target, unit)
        returns (uint256 debt) 
    {
        Common.Provider[] memory profile = _getContributor(target, unit);
        debt = profile.loan;
        if(profile.providers.length > 0) {
            unchecked {
                for(uint i = 0; i < profile.providers.length; i++){
                    Common.Provider memory provider = profile.providers[i];
                    if(_now() > provider.earnStartDate) {
                        debt += provider.accruals.intPerSec * (_now() - provider.earnStartDate);
                    }
                }
            }
        }
    }

    function _now() internal view returns(uint32 time) {
        time = uint32(block.timestamp);
    }

    
}