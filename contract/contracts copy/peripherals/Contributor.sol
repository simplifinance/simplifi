// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { Epoches, Common } from "./Epoches.sol";
import { Slots } from "./Slots.sol" ;
import { ErrorLib } from "../libraries/ErrorLib.sol";
import { Price } from "./Price.sol";

abstract contract Contributor is Epoches, Slots, Price {
    using ErrorLib for string;

    /**
     * @dev Mapping of recordId to contributors
     * @notice We used record Id to index the contributors in a pool while a unit contribution
     * van have multiple records, it makes sense to track contributors in each pool with their record Id
    */
    mapping(uint96 recordId => Common.Contributor[]) private contributors;

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

    function _setProviders(Common.Provider[] memory providers, address user, uint unit) internal {
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


    uint32 paybackTime;
        uint32 turnStartTime;
        uint32 getFinanceTime;
        uint loan;
        uint colBals;
        address id;
        bool sentQuota;
        // uint interestPaid;
        Providers[] providers;
        
    function _completeGetFinance(Common.Pool memory pool) internal returns(Common.Pool memory pool, Common.Contributor memory profile) {
        (uint colBal,) = getCollateralQuote(unit);
        pool.addrs.lastPaid = _msgSender();
        pool.low.selector ++;
        uint slot = _getSlot(pool.addrs.lastPaid, pool.big.unit).value;
        contributors[pool.big.recordId][slot].paybackTime = _now() + pool.low.duration;
        contributors[pool.big.recordId][slot].colBals = colBal;

        // computedCol = _computeCollateral(arg.pool.bigInt.currentPool, uint24(arg.pool.lInt.colCoverage), arg.colPriceInDecimals, IERC20(self.pData.collateralToken).decimals());
        arg.pool.addrs.lastPaid = caller;
        arg.pool.lInt.selector ++;
        // console.log("ComputedCol", computedCol);
        _validateAndWithdrawAllowance(caller, address(self.pData.collateralToken), computedCol, arg.pool.addrs.bank);
        Common.Contributor memory cData = Common.Contributor({
        durOfChoice: arg.durOfChoice, 
        interestPaid: 0,
        // expInterest: arg.pool.bigInt.currentPool.computeInterestsBasedOnDuration(uint16(arg.pool.lInt.intRate), uint24(arg.pool.lInt.duration) ,arg.durOfChoice).intPerChoiceOfDur,
        paybackTime: _now().add(arg.durOfChoice),
        turnStartTime: cbt.turnStartTime,
        getFinanceTime: cbt.getFinanceTime,
        loan: IBank(arg.pool.addrs.bank).getFinance(caller, arg.pool.addrs.asset, arg.pool.bigInt.currentPool, arg.fee, computedCol, arg.pool.bigInt.recordId),
        colBals: computedCol,
        id: caller,
        sentQuota: cbt.sentQuota
        });
        _updateUserData(
        self,
        Common.UpdateUserParam(
            cData,
            _getSlot(self.slots, caller, arg.unit),
            arg.pool.lInt.cSlot,
            arg.unit,
            caller
        )
        );
        arg.pool.stage = Common.Stage.PAYBACK;
        arg.pool.bigInt.currentPool = _defaults().zero;
        _p = arg.pool;

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
    function getCollateralQuote(uint256 unit)
        public
        view
        _onlyContributor(msg.sender, unit) 
        // onlyInitialized(unit, true)
        returns(uint collateral, uint24 colCoverage)
    {
        Common.Pool memory pool = _getPool(unit);
        unchecked {
            (collateral, colCoverage) = collateral = (Common.Price(
                    _getCollateralTokenPrice(), 
                    diaOracleAddress == address(0)? 18 : 8
                ).computeCollateral(
                    uint24(pool.low.colCoverage), 
                    pool.big.unit * pool.low.quorum
                ),
                uint24(pool.low.colCoverage)
            );
        }
        return (collateral, colCoverage);
    }

    /**
     * Returns the current debt of target user.
     * @param unit : Unit contribution
     * @param target : Target user.
     */
    function getCurrentDebt(
        uint256 unit,
        address target
    ) 
        external
        view 
        // onlyInitialized(unit, true)
        returns (uint256 debt) 
    {
        Common.Provider[] memory profile = _getContributor(target, unit);
        debt = profile.loan;
        if(profile.providers.length > 0) {
            unchecked {
                for(uint i = 0; i < profile.providers.length; i++){
                    debt += profile.providers[i].accruals;
                }
            }
        }
        
        return debt;
    }

    function _now() internal view returns(uint32 time) {
        time = uint32(block.timestamp);
    }

    // /**
    //  * @dev Returns contributor's profile in a pool.
    //  * @param unit : unit contribution
    //  * @param user : User
    //  */
    // function getProfile(
    //     uint256 unit,
    //     address user
    // )
    //     external
    //     view
    //     onlyInitialized(unit, false)
    //     returns(Contributor memory) 
    // {
    //     return _getProfile(user, unit);
    // }

    // /**
    //  * @dev Return the current number of contributors in a pool
    //  * @param unit : Unit contribution.
    //  */
    // function getUserCount(uint256 unit) external view returns(uint _count) {
    //     _count = userCounts[unit];
    // }
}