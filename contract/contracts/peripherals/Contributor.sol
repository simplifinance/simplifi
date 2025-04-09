// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Epoches, Common } from "./Epoches.sol";
import { Slots } from "./Slots.sol" ;
import { Utils } from "../libraries/Utils.sol";
import { AwardPoint, IRoleBase, IERC20, ErrorLib, IPoint, ISupportedAsset } from "./AwardPoint.sol";
import { ISafe } from "../apis/ISafe.sol";

abstract contract Contributor is Epoches, Slots, AwardPoint {
    using ErrorLib for *;
    using Utils for *;

    /**
     * @dev Mapping of recordId to contributors
     * @notice We used record Id to index the contributors in a pool while a unit contribution
     * van have multiple records, it makes sense to track contributors in each pool with their record Id
    */
    mapping(uint96 recordId => Common.Contributor[]) private contributors;

    /**
     * @dev Mapping of record ids to contributors to array of providers
     * @notice Each contributor can maintain a list of providers they borrow from
     */
    mapping(uint96 recordId => mapping(address contributors => Common.Provider[])) private unitProviders;

    // ============= constructor ============
    constructor(
        address _diaOracleAddress, 
        ISupportedAsset _assetManager, 
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
    function _onlyContributor(address target, uint256 unit, bool pass) internal view {
        if(!pass){
            if(!_getSlot(target, unit).isMember) 'Not a member'._throw();
        }
    }

    /**
     * @dev Only Non contributor in a pool is allowed
     * @param target : Target
     * @param unit : Unit Contribution
     */
    function _onlyNonContributor(address target, uint256 unit) internal view {
        if(_getSlot(target, unit).isMember) 'Member not allowed'._throw();
    }

    /**
     * @dev returns target's profile status in a pool
     * @param target : Target account
     * @param unit : Unit contribution
     */
    function _getContributor(
        address target, 
        uint unit
    ) internal view returns(Common.ContributorReturnValue memory result) {
        uint96 recordId = _getRecordId(unit);
        result.slot = uint8(_getSlot(target, unit).value);
        result.profile = contributors[recordId][result.slot];
        result.providers = unitProviders[recordId][target];
    }

    /**
     * @dev Return providers associated with the target account
     * @param target : Target account
     * @param recordId : Record id
     */
    function _getContributorProviders(address target, uint96 recordId) internal view returns(Common.Provider[] memory result){
        result = unitProviders[recordId][target];
    }

    /**
     * @dev returns user's profile status in a pool
     * @param unit : Unit contribution
     */
    function _getExpected(uint256 unit, uint8 selector) internal view returns(Common.Contributor memory _expected) {
        _expected = contributors[_getRecordId(unit)][selector];
    }

    /**
     * @dev Update the provider list of a contributor
     * @param providers : List of providers
     * @param user : Target user
     * @param recordId : Record Id
     */
    function _setProviders(
        Common.Provider[] memory providers, 
        address user, 
        uint96 recordId
    ) internal {
        for(uint i = 0; i < providers.length; i++){
            unitProviders[recordId][user].push(providers[i]);
        }
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
            user = _getExpected(unit, uint8(position)).id;
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
    ) internal returns(Common.ContributorReturnValue memory data) {
        data.slot = uint8(contributors[pool.big.recordId].length);
        _createSlot(target, unit, data.slot, isAdmin, isMember);
        contributors[pool.big.recordId].push(); 
        data.profile.id = target;
        data.profile.sentQuota = sentQuota;
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
     * @param actual : Actual calling account
     * @param expectedSlot : Slot of expected calling account
     * @param expectedData : Data of expected calling account
     */
    function _swapContributors(
        uint256 unit,
        address actual,
        Common.Slot memory expectedSlot,
        Common.Contributor memory expectedData
    )
        internal
        returns(Common.Contributor memory actualData) 
    {
        _onlyContributor(actual, unit, false);
        uint96 recordId = _getRecordId(unit);
        Common.Slot memory actualSlot = _getSlot(actual, unit);
        actualData = _getContributor(actual, unit).profile;
        _setSlot(actual, unit, expectedSlot, false);
        _setSlot(expectedData.id, unit, actualSlot, false);
        actualData.id = expectedData.id;
        expectedData.id = actual;
        _setContributor(expectedData, recordId, uint8(expectedSlot.value), false);
        _setContributor(actualData, recordId, uint8(actualSlot.value), false);
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
        Common.Provider[] memory providers = unitProviders[_pool.big.recordId][_pool.addrs.lastPaid];
        for(uint i = 0; i < providers.length; i++){
            unitProviders[_pool.big.recordId][_pool.addrs.lastPaid][i].earnStartDate = _now();
            unitProviders[_pool.big.recordId][_pool.addrs.lastPaid][i].accruals = providers[i].amount.computeInterestsBasedOnDuration(uint16(providers[i].rate), _pool.low.duration);
        }
        _pool.big.currentPool = 0;
        _pool.stage = Common.Stage.PAYBACK;
    }

    /**
     * @dev Payback loan
     * @param unit : Unit contribution
     * @param user : Contributor
     * @param isSwapped : Whether there was swapping or not. Often swapping will happen when a contributor defaults
     * @param defaulted : The defaulted account
     */
    function _payback(
        uint unit, 
        address user,
        bool isSwapped,
        address defaulted
    ) 
        internal 
        returns(Common.Pool memory pool, uint debt, uint collateral)
    {
        debt = _getCurrentDebt(unit, user, false);
        if(debt == 0) 'No debt found'._throw();
        pool = _getPool(unit); 
        uint slot = _getSlot(user, unit).value;
        contributors[pool.big.recordId][slot].loan = 0;
        contributors[pool.big.recordId][slot].colBals = 0;
        contributors[pool.big.recordId][slot].paybackTime = _now();
        contributors[pool.big.recordId][pool.low.selector].turnStartTime = _now();
        if(awardPoint) _awardPoint(user, 2, 0, false);
        if(pool.low.maxQuorum == pool.low.allGh){
            pool.stage = Common.Stage.ENDED;
            _shufflePool(pool);
        } else {
            pool.stage = Common.Stage.GET;
            unchecked {
                pool.big.currentPool = pool.big.unit * pool.low.maxQuorum;
            }
        }
        uint attestedInitialBal = IERC20(baseAsset).balanceOf(pool.addrs.safe);
        _checkAndWithdrawAllowance(IERC20(baseAsset), user, pool.addrs.safe, debt);
        collateral = ISafe(pool.addrs.safe).payback(
            Common.Payback_Safe(user, baseAsset, debt, attestedInitialBal, pool.low.maxQuorum == pool.low.allGh, contributors[pool.big.recordId], isSwapped, defaulted, pool.big.recordId, pool.addrs.colAsset),
            unit
        );
    }


    /**
     * @dev Return past pools using unitId. 
     * @notice The correct unitId must be parsed. 
     * @param recordId: Record Id
     * @notice The record id can be obtained by iterating over the past epoches. Using the record Id
     * associated with the current pool will return empty pool but may not return empty contributors.
     */
    function getPoolRecord(uint96 recordId) public view returns(Common.ReadDataReturnValue memory result) {
        result.cData = contributors[recordId];
        result.pool = _getPastPool(recordId);
        return result;
    }

    /**
     * @dev Return past pools using unitId. 
     * @notice The correct unitId must be parsed. 
     * @param unit: UnitId 
     */
    function getPoolData(uint unit) public view returns(Common.ReadDataReturnValue memory result) {
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
        returns(Common.Contributor memory result) 
    {
        result = _getContributor(target, unit).profile;
        return result; 
    }

    function _changeContributorAddress(address newAddr, uint96 recordId, uint slot) internal {
        contributors[recordId][slot].id = newAddr;
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
        _onlyIfUnitIsActive(unit)
        returns(uint collateral, uint24 colCoverage)
    {
        _onlyContributor(_msgSender(), unit, false);
        Common.Pool memory pool = _getPool(unit);
        unchecked {
            (collateral, colCoverage) = (Common.Price(
                    _getCollateralTokenPrice(pool.addrs.colAsset), 
                    diaOracleAddress == address(0)? 18 : 8
                ).computeCollateral(
                    uint24(pool.low.colCoverage), 
                    pool.big.unit * pool.low.maxQuorum
                ),
                uint24(pool.low.colCoverage)
            );
        }
    }

    /**
     * Returns the current debt of target user.
     * @param unit : Unit contribution
     * @param target : Target user.
     * @notice For every contributor that provide liquidity through providers, they are required to 
     * pay interest in proportion to the providers' rate. Every other contributors in the same pool 
     * will pay interest to the same set of providers but the interest will be halved.
     */
    function _getCurrentDebt(
        uint256 unit,
        address target,
        bool pass
    ) 
        internal
        view 
        _onlyIfUnitIsActive(unit)
        returns (uint256 debt) 
    {
        _onlyContributor(target, unit, pass);
        Common.Pool memory pool = _getPool(unit);
        Common.Contributor[] memory profiles = contributors[pool.big.recordId];
        if(debt > 0){
            for(uint i = 0; i < profiles.length; i++){
                Common.ContributorReturnValue memory data = _getContributor(target, unit);
                if(data.providers.length > 0) {
                    unchecked { 
                        for(uint j = 0; j < data.providers.length; j++){
                            Common.Provider memory provider = data.providers[j];
                            if(_now() > provider.earnStartDate) {
                                if(data.profile.id == target) {
                                    debt += data.profile.loan;
                                    debt += provider.accruals.intPerSec * (_now() - provider.earnStartDate);
                                }
                                else debt += (provider.accruals.intPerSec / 2) * (_now() - provider.earnStartDate);
                            }
                        }
                    }
                }
            }
        }
    }

      /**
   * @dev Return struct object with data if current beneficiary has defaulted otherwise an empty struct is returned.
   * @param unit: Unit contribution
   */
    function _enquireLiquidation(uint256 unit) 
        internal 
        view 
        returns (Common.Contributor memory profile, bool defaulted, Common.Slot memory slot) 
    {
        Common.Pool memory pool = _getPool(unit);
        profile = _getContributor(pool.addrs.lastPaid, unit).profile;
        (profile, defaulted, slot) = _now() <= profile.paybackTime? (profile, false, slot) : (profile, true, _getSlot(profile.id, unit));
    }

    function _now() internal view returns(uint32 time) {
        time = uint32(block.timestamp);
    }
    
}