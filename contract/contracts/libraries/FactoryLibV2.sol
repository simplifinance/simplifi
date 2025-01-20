// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "hardhat/console.sol";
import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { Counters } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol";
import { IERC20 } from "../apis/IERC20.sol";
import { IBankFactory } from "../apis/IBankFactory.sol";
import { IBank } from "../apis/IBank.sol";
import { IFactory } from "../apis/IFactory.sol";
import { Common } from "../apis/Common.sol";
import { AssetClass } from "../implementations/AssetClass.sol";
import { Utils } from "../libraries/Utils.sol";

/**@dev
  * @param amountExist: Tracks unit contribution i.e values created in each permissionless communities
  * @param pools: Mapping of unitIds to Pool
  * @param pData: Public State variable stats
  * @param epoches : Total pool created to date
  * @param contributors : Mapping of unitIds to group of contributors
  * @param slots : Reverse map of contributors to unitId to slots on the list.
    
  @param indexes: Each amount is mapped to an index. These indexes are used to retrieve the corresponding Amount struct from the 'amount' storage
  * 
*/
struct Data {
  Counters.Counter epoches;

  Counters.Counter pastEpoches;

  IFactory.ContractData pData;

  mapping(uint256 => Common.Unit) units;

  mapping(uint256 => uint) indexes; // For every unit amount of contribution, there is a corresponding index for retrieving data from the storage.

  mapping(uint => Common.Pool) records; // Past transactions i.e Ended or Canceled pools 

  mapping(uint => Common.Pool) current; // Mapping of unitId to Pool
  
  mapping(address => Common.Point) points;

  mapping(address => mapping(uint256 => Common.Slot)) slots;
}

struct Def {
  bool t;
  bool f;
  uint8 zero;
  uint8 one;
  address zeroAddr;
}

library FactoryLibV2 {
  using Utils for *;
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  error APoolWithThisAmountExist();
  error InvalidContributionAmount();
  error IvalidSlot(uint slot);
  event AllGh(uint unitId, Common.Pool pool);

  /**
   * @dev Verifiy that status is already initialized
  */
  function _isInitialized(mapping(uint256 => Common.Unit) storage self, uint256 unit, bool secondCheck) internal view {
    Common.Unit memory uni = self[unit];
    if(!uni.isInitialized) revert InvalidContributionAmount();
    if(secondCheck){
      require(uni.status == Common.Status.TAKEN, 'Amount not initialized');
    }
  }

  /**
   * @dev Verifiy that unit contribution is not initialized, then intialize it.
  */
  function _initializeUnit(Data storage self, uint256 unit) internal returns(uint unitId) {
    Common.Unit memory uni = self.units[unit];
    if(!uni.isInitialized) {
      self.units[unit].isInitialized = true;
      self.epoches.increment();
      unitId = self.epoches.current();
      self.indexes[unit] = unitId;
    } else {
      if(uni.status == Common.Status.TAKEN) {
        revert APoolWithThisAmountExist();
      }
      unitId = _getIndex(self.indexes, unit);
    }
    _setUnitStatus(self.units, unit, Common.Status.TAKEN);
  }

  /// @dev Sets the status of unit contribution to TAKEN or AVAILABLE 
  function _setUnitStatus(mapping(uint256 => Common.Unit) storage self, uint256 unit, Common.Status status) internal {
    self[unit].status = status;
  }

  /**
   * @dev Return the index for a unit amount
  */
  function _getIndex(mapping(uint256 => uint) storage self, uint256 unit) internal view returns(uint index) {
    index = self[unit];
  }

  /**
   * @dev Return the corresponding index for a unit amount of contribution from storage
  */
  function _getCurrentPool(Data storage self, uint256 unit) internal view returns(Common.GetPoolResult memory result) {
    result.uId = _getIndex(self.indexes, unit);
    result.data = self.current[result.uId];
  }

  /**
   * @dev Check that user has given enough approval to spend from their balances
   * @param user : Caller.
   * @param assetInUse : ERC20 currency address to use as contribution base.
   * @param value : Contribution per user.
  */
  function _validateAllowance(
    address user, 
    address assetInUse, 
    uint value
  ) 
    internal 
    view 
  {
    require(IERC20(assetInUse).allowance(user, address(this)) >= value, "FactoryLib: Insufficient allowance");
  }

  ///@dev Increment the number of liquidity providers in a bank
  function _addUpToBank(address bank, address user) internal {
    IBank(bank).addUp(user);
  }

  /**
   * @dev Create a fresh pool
   * @param self: Storage of type `Data`
   * @param cpp: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @notice We first check that the duraetion given by the admin should not be zero.
   * Note: `.assertChained3` is simply making tripple boolean checks.
   */
  function _createPool(
    Data storage self,
    Common.CreatePoolParam memory cpp,
    address bank,
    address user,
    Common.Router router
  ) 
    private 
    returns(Common.Pool memory pool) 
  {
    Def memory _d = _defaults();
    uint unitId = _initializeUnit(self, cpp.unit);
    bool(cpp.colCoverage >= 100).assertTrue("Col coverage is too low");
    Utils.assertTrue_2(cpp.duration > _d.zero, cpp.duration <= 720, "Invalid duration"); // 720hrs = 30 days.
    _validateAllowance(user, cpp.asset, cpp.unit);
    _updatePoolSlot(self.current, cpp, bank, router, unitId);
    _withdrawAllowanceToBank(user, cpp.asset, cpp.unit, bank);
    _addUpToBank(bank, user);
    _awardPoint(self.points, user, _d.t);
    pool = _getCurrentPool(self, cpp.unit).data;
  }

  function _defaults()
    internal 
    pure 
    returns(Def memory) 
  {
    return Def(true, false, 0, 1, address(0));
  }

  ///@dev Returns current timestamp (unix).
  function _now() 
    internal 
    view returns (uint) 
  {
    return block.timestamp;
  }



  /**@notice Send contribution to bank
   * @param user : User/Caller address
   * @param assetInUse: ERC20 token { USD contract address }
   * @param unitContribution: Unit contribution
   * @param bank : Address to hold funds on behalf of the members. The factory generates 
   * a bank by querying StrategyManager. Every address that create a pool must operate a 
   * bank. This process is managed internally for users.  
   */
  function _withdrawAllowanceToBank(
    address user, 
    address assetInUse, 
    uint unitContribution, 
    address bank
  ) 
    private 
  {
    require(IERC20(assetInUse).transferFrom(user, bank, unitContribution), "FactoryLib: Transfer failed");
  }

  function _initializePool(
    mapping(uint => Common.Pool) storage self, 
    Common.CreatePoolParam memory cpp,
    Common.InterestReturn memory itr,
    address bank,
    uint uId,
    uint24 durInSec,
    Common.Router router
  ) internal {
    Def memory _d = _defaults();
    self[uId].uints = Common.Uints(cpp.quorum, _d.zero, cpp.colCoverage, durInSec, cpp.intRate);
    self[uId].uint256s = Common.Uint256s(itr.fullInterest, itr.intPerSec, cpp.unit, cpp.unit, uId);
    self[uId].addrs = Common.Addresses(cpp.asset, _d.zeroAddr, bank, cpp.members[0]);
    self[uId].router = router;
    self[uId].stage = Common.FuncTag.JOIN;
  }

  /*** @dev Update the storage with pool information
   * @param self: Storage of type `Data`
   * @param cpp: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @param uId: Unit Id ref/index in storage.
   * @param bank: Strategy contract.
   */
  function _updatePoolSlot(
    mapping(uint => Common.Pool) storage self,
    Common.CreatePoolParam memory cpp,
    address bank,
    Common.Router router,
    uint uId
  ) 
    private
  {
    uint24 durInSec = _convertDurationToSec(uint16(cpp.duration));
    Common.InterestReturn memory itr = cpp.unit.mul(cpp.quorum).computeInterestsBasedOnDuration(cpp.intRate, durInSec, durInSec);
    _initializePool(self, cpp, itr, bank, uId, durInSec, router);
  }

  /**@dev Create permissioned band
   * @param self: Storage of type `Data`.
   * @param cpp : Parameter struct
   * Note: Each of the addresses on the members array must an Account instance. Participants must already own an
   * account before now otherwise, execution will not pass.
   * - Admin cannot replicate themselves in a band.
   * - Each of the contributors must have created account before now.
   * - We assume admin should be address in first slot in the members array, so expression evaluates to `if not admin`.
   */
  function createPermissionedPool(
    Data storage self,
    Common.CreatePoolParam memory cpp
  ) 
    internal
    returns (Common.CreatePoolReturnValue memory cpr) 
  {
    Def memory _d = _defaults();
    address admin = cpp.members[0];
    address bank = _fetchAndValidateBank(cpp.unit, self.pData.bankFactory);
    for(uint i = _d.zero; i < cpp.members.length; i++) {
      if(i == _d.zero) {
        // console.log("Admin: ", admin);
        cpr.pool = _createPool(self, cpp, bank, admin, Common.Router.PERMISSIONED);
        cpr.cData = _addNewContributor(self, cpr.pool.uint256s.unitId, cpr.pool.uint256s.unit, admin, _d.t, _d.t, _d.t);
      } else {
        address contributor = cpp.members[i];
        // console.log("contributor: ", contributor);
        bool(contributor != admin).assertTrue("Admin spotted twice");
        _addNewContributor(self, cpr.pool.uint256s.unitId, cpr.pool.uint256s.unit, contributor, _d.f, _d.t, _d.f);
        cpr.pool = _getCurrentPool(self, cpr.pool.uint256s.unit).data; 
      } 
    }
  }

  /**
   * @dev Return bank for user
   * @param bankFactory: StrategyManager contract address
   * @param unit : Caller
   */
  function _getBank(
    address bankFactory, 
    uint256 unit
  ) 
    internal 
    view
    returns(address _bank) 
  {
    _bank = IBankFactory(bankFactory).getBank(unit);
  }

  /**
   * @dev Checks, validate and return bank for the target address.
   * @param unit : Unit contribution.
   * @param bankFactory : StrategyManager contract address.
   */
  function _fetchAndValidateBank(
    uint256 unit,
    address bankFactory
  ) 
    private 
    returns(address bank) 
  {
    bank = _getBank(bankFactory, unit);
    if(bank == address(0)) {
      bank = IBankFactory(bankFactory).createBank(unit);
    }
    assert(bank != address(0));
  }

    /**
   * @dev Add new member to the pool
   * Note: `target` is expected to be an instance of the `SmartBank`
   * @param self: Storage pointer
   * @param uId: Unit id
   * @param isAdmin: Whether bank is an admin or not.
   * @param isMember: Whether user is a member or not.
   */
  function _addNewContributor(
    Data storage self, 
    uint uId, 
    uint256 unit,
    address user,
    bool isAdmin,
    bool isMember,
    bool sentQuota                                                                                                                                                                              
  ) 
    private 
    returns(
      Common.Contributor memory cData
    )
  {
    self.current[uId].cData.push();
    uint8 position = uint8(self.current[uId].userCount.current());
    self.current[uId].userCount.increment();
    cData = _addContributor(
      self, 
      Common.Slot(position, isMember, isAdmin), 
      user, 
      unit, 
      uId, 
      sentQuota
    );
    // console.log("self.current[uId].cData: ", self.current[uId].cData.length); //3
  }

  /**@dev Push a new contributor to storage.
    @param self : Storage of type Common.Contributor array
    @param unit : Unit contribution
    @param uId : Unit ID
    @param slot : Slot struct
    @param user : Caller's address
    @param sentQuota : Whether this user has paid their contribution or not.
   */
  function _addContributor(
    Data storage self, 
    Common.Slot memory slot,
    address user,
    uint256 unit,
    uint uId,
    bool sentQuota
  ) 
    private 
    returns (Common.Contributor memory cData)
  {
    _updateSlot(self, uId, unit, slot, user);
    self.current[uId].cData[slot.value].sentQuota = sentQuota;
    cData = _getProfile(self, unit, user); 
  }

  /**@dev Update contributor's data
    @param self : Storage of type mapping
    @param up : Parameters
   */
  function _updateUserData(
    Data storage self, 
    Common.UpdateUserParam memory up
  )
    private 
  {
    self.current[up.uId].cData[up.slot.value] = up.cData;
    self.slots[up.user][up.unit] = up.slot;
  }

  /**
   * @dev Return the length of epochs i.e total epoch to date
   * @param self : Storage of type Data
   */
  function _getUnitId(Data storage self, uint256 unit) internal view returns(uint unitId) {
    unitId = self.indexes[unit];
  } 

  ///@dev Award points to user based on contribution
  function _awardPoint(mapping(address => Common.Point) storage self, address user, bool isCreate) internal {
    isCreate? self[user].creator += 5 : self[user].contributor += 2;
  }

  /**@dev Ruturn provider's info
    @param self : Storage of type Common.Contributor
   */
  function _getProfile(
    Data storage self,
    uint unit,
    address user
  ) 
    internal 
    view 
    returns(Common.Contributor memory cbt) 
  {
    Common.Slot memory slot = self.slots[user][unit];
    if(self.current[_getIndex(self.indexes, unit)].cData.length > 0){
      cbt = self.current[_getIndex(self.indexes, unit)].cData[slot.value];
    } else {
      cbt = Common.Contributor(0, 0, 0, 0, 0, 0, address(0), false);
    }
  }

  /**@dev Creates a new permissionless community i.e public
   * @param self: Storage of type `Data`
   * @param cpp: This is a data struct. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * Note: Only in private bands we mandated the selected contribution value does not exist.
   *       This is to ensure orderliness in the system, timeliness, and efficiency.
   */
  function createPermissionlessPool( 
    Data storage self, 
    Common.CreatePoolParam memory cpp
  )
    internal
    returns (Common.CreatePoolReturnValue memory cpr)
  {
    Def memory _d = _defaults();
    address admin = cpp.members[0];
    address bank = _fetchAndValidateBank(cpp.unit, self.pData.bankFactory);
    cpr.pool = _createPool(self, cpp, bank, admin, Common.Router.PERMISSIONLESS);
    cpr.cData = _addNewContributor(self, cpr.pool.uint256s.unitId, cpr.pool.uint256s.unit, admin, _d.t, _d.t, _d.t);
  }

  /**@dev Add new contributor to a band.
   * @param self: Storage ref of type Data.
   * @param _ab: Parameters struct.
   * @notice A contributor can occupy more than one spot.
  */
  function addToBand(
    Data storage self,
    Common.AddTobandParam memory _ab
  )
    internal
    returns (
      Common.CommonEventData memory ced
    ) 
  {
    Def memory _d = _defaults();
    // _isInitialized(self.units, _ab.unit, _d.t);
    Common.GetPoolResult memory gpr = _getCurrentPool(self, _ab.unit);
    _validateStage(gpr.data.stage, Common.FuncTag.JOIN, "Add Liquidity not ready");
    if(_ab.isPermissioned) {
      _mustBeAMember(self, _ab.unit, _msgSender());
      self.current[gpr.uId].cData[_getSlot(self.slots, _msgSender(), _ab.unit).value].sentQuota = _d.t;
    } else {
      Utils.assertTrue(_getUserCount(self.current[gpr.uId]) < gpr.data.uints.quorum, "Pub filled");
      _mustNotBeAMember(self, _ab.unit, _msgSender());
      _addNewContributor(self, gpr.uId, _ab.unit, _msgSender(), _d.f, _d.t, _d.t);
    }
    self.current[gpr.uId].uint256s.currentPool += gpr.data.uint256s.unit;
    if(_isPoolFilled(self.current[gpr.uId], _ab.isPermissioned)) {
      _setTurnTime(self, gpr.data.uints.selector, gpr.uId);
      _setNextStage(self.current[gpr.uId], Common.FuncTag.GET);
    }
    _validateAllowance(_msgSender(), gpr.data.addrs.asset, gpr.data.uint256s.unit);
    _withdrawAllowanceToBank(_msgSender(), gpr.data.addrs.asset, gpr.data.uint256s.unit, gpr.data.addrs.bank);
    _addUpToBank(gpr.data.addrs.bank, _msgSender());
    ced.pool = _getCurrentPool(self, _ab.unit).data;
  }

  /**
   * @dev Validate stage for invoked function.
   */
  function _validateStage(
    Common.FuncTag expected, 
    Common.FuncTag actual, 
    string memory errorMessage
  ) internal pure { 
    (expected == actual).assertTrue(errorMessage);
  }

  /**
   * @dev A Check to know if _msgSender() is a member of the band at unitId.
   * @param self: Storage {typeof => mapping}
   * @param unit: Unit contribution
   * @param user: Contributor address
  */
  function _mustBeAMember(
    Data storage self,
    uint256 unit,
    address user
  ) 
    internal 
    view 
  {
    _getSlot(self.slots, user, unit).isMember.assertTrue("Not a member");
  }

  /**@dev Return number of members already in the pool 
   */
  function _getUserCount(Common.Pool storage self) internal view returns(uint _return) {
    _return = self.userCount.current();
  }


  /**
   * @dev Msg.sender must not be a member of the band at epoch Id before now.
   * @param self: Storage {typeof mapping}
   * @param unit: Unit contribution
   * @param user : User
  */
  function _mustNotBeAMember(
    Data storage self,
    uint256 unit,
    address user
  ) 
    internal 
    view 
  {
    _getSlot(self.slots, user, unit).isMember.assertFalse("User is already a member");
  }

  /**@dev Check if pool is filled
    * @dev Msg.sender must not be a member of the band at epoch Id before now.
    * @param self: Pool struct
  */
  function _isPoolFilled(Common.Pool storage self, bool isPermissioned) 
    internal 
    view
    returns(bool filled) 
  {
    uint expected = self.uint256s.unit.mul(self.uints.quorum);
    filled = !isPermissioned? _getUserCount(self) == self.uints.quorum : expected == self.uint256s.currentPool;
  }

  /**@dev Update selector to who will get finance next
    * @param self: Storage {typeof mapping}
    * @param uId: Pool index.
    * @param selector : Spot selector.
  */
  function _setTurnTime(
    Data storage self, 
    uint selector, 
    uint uId
  ) 
    private
  {
    self.current[uId].cData[selector].turnTime = _now();
  }

  function getProfile(
    Data storage self, 
    address user,
    uint256 unit
  ) 
    internal 
    view 
    returns(Common.Contributor memory) 
  {
    _mustBeAMember(self, unit, user);
    return _getProfile(self, unit, user);
  }

  /**@dev Get the slots of user with address and unitId
    @param self : Storage of type mappping
    @param user : User address
   */
  function _getSlot(
    mapping(address =>mapping(uint256 => Common.Slot)) storage self, 
    address user, 
    uint256 unit
  ) 
    internal 
    view 
    returns(Common.Slot memory slot) 
  {
    slot = self[user][unit];
  }

  /**@dev Set the slot for contributor
    @param self : Common.Contributor
    @param slot : Slot struct
    @param uId : Unit Id
    @param unit : Unit contribution
    @param user : User's address
   */
  function _updateSlot(
    Data storage self,
    uint uId,
    uint256 unit,
    Common.Slot memory slot,
    address user
  ) 
    private 
  { 
    self.slots[user][unit] = slot;
    self.current[uId].cData[slot.value].id = user;
  }

  /**@dev Get finance: Sends current total contribution to the 
   * expected account and update respective accounts.
    @param self : Storage of type Data.
    @param unit : Contribution amount.
    @param msgValue : Value sent in call.
    @param daysOfUseInHr : Number of days specified in hours after which 
                      the contributor shall return the borrowed fund.
    @param getXFIPriceInUSD : A function that returns the current price of XFI.
  */
  function getFinance(
    Data storage self,
    uint256 unit,
    uint256 msgValue,
    uint16 daysOfUseInHr,
    function () internal returns(uint) getXFIPriceInUSD
  ) 
    internal
    returns(Common.CommonEventData memory ced)
  {
    Common.Pool memory _p = _getCurrentPool(self, unit).data;
    _validateStage(_p.stage, Common.FuncTag.GET, "Borrow not ready");
    if(_p.allGh == _p.uints.quorum) revert IFactory.AllMemberIsPaid();
    _incrementGF(self.current, _getIndex(self.indexes, unit));
    bool(_p.uint256s.currentPool >= (_p.uint256s.unit.mul(_p.uints.quorum))).assertTrue("Pool not complete");
    ced = _updateStorageAndCall(
      self,
      Common.UpdateMemberDataParam(
        _convertDurationToSec(daysOfUseInHr), 
        self.current[_getIndex(self.indexes, unit)].cData[_p.uints.selector].id,
        unit,
        _getIndex(self.indexes, unit),
        _p.uint256s.currentPool.computeFee(self.pData.makerRate),
        msgValue,
        getXFIPriceInUSD(),
        _p
      )
    );
  }

  /**@dev Increase slot selector
   *  This is a flag we use in selecting the next borrower.
  */
  function _incrementSelector(
    mapping(uint => Common.Pool) storage self, 
    uint uId
  ) 
    private 
  {
    self[uId].uints.selector ++;
  }

  /**@dev Increment allGh when one member get finance
  */
  function _incrementGF(
    mapping(uint => Common.Pool) storage self, 
    uint unitId
  )  
    private 
  {
    self[unitId].allGh ++;
  }

  /**
   * @dev Validates duration selected by this contributor must not exceed the set duration.
   * @param durInHrs : Duration set in hours.
   */
  function _convertDurationToSec(
    uint16 durInHrs
  ) 
    internal 
    pure
    returns(uint24 durOfChoiceInSec) 
  {
    durOfChoiceInSec = uint24(uint(durInHrs).mul(1 hours));
  }

  function _computeCollateral(
    uint loanAmount,
    uint amountOfXFISent,
    uint24 ccr,
    uint xfiPriceInUSD
  )
    internal
    pure
    returns(uint collateral)
  { 
    collateral = amountOfXFISent.computeCollateral(
      18,
      ccr,
      xfiPriceInUSD,
      loanAmount,
      false
      // amountOfXFISent > 0
    );
  }


  /** 
    * @dev Update storage.
    * Note: Priority is given to expected contributor. i.e the first to get finance.
    * Irrespective of who _msgSender() is, consideration is given to
    * expected user provided their time to get finance has not pass.
    * If _msgSender() is not the contributor we're expecting and the time
    * to get finance for the contributor has passed, we swap the whole
    * process in favor of the actual caller provided the conditions are met.
    * @param self: Storage.
    * @param arg : Parameter of type Common.UpdateMemberDataParam
    * Note: 
    *   slot = exp.slot;
        If the caller is not the next on the queue to getfinance
        and the time to get finance for the expected account has passed.
      @notice Debt is not determined ahead. We do that at the point of paying back
              since borrrowers decide when to return the borrowed fund so long it is not
              greater than the duration set by the admin.
      We will also not include the debt for the 'credit' parameter as stated in Strategy.setClaim
      unless borrowers are returning the loan.

      ASSUMPTION 1
      ------------
      Assuming 2 providers in a pool, if the first on the list with slot '0' failed to GF within the grace
      period, the next provider can take over. When this happens, the slots and profile are swapped to 
      alow the serious one proceed to borrow. Slot 0 becomes 1 vice versa. This allows the defaulted 
      party another chance to GF since the ticker i.e 'pool.uints.selector' waits for no one. It is always
      incremented as long at the epoch is active. If the second slot also default, the any party in the pool
      i.e Provider 1 can step in to GF. 

      ASSUMPTION 2
      ------------
      The case above is different where the number of providers exceeds 2. Since the selector goes forward, the 
      first one the list i.e admin is given priority to proceed to GF even after they defaulted. Since the admin
      is 0, if they defaulted, slots greater than 0 can step in i.e from 1, 2, to 'n'. Admin slot is swapped for
      higher slot.
      If a defaulted slot is swapped for higher one, they have another chance to GF. But if a defaulted slot is 
      is swapped for the lower one, the only chance available to them is for the next GF to default so they can 
      hop in. 
      Irrespective of who defaults, the orderliness is preserved, And the defaulted must wait for the turn of the 
      new slot assigned to them. 
  */  
  function _updateStorageAndCall(
    Data storage self,
    Common.UpdateMemberDataParam memory arg
  ) 
    private
    returns (Common.CommonEventData memory ced) 
  {
    address caller = arg.expected;
    Common.Contributor memory cbt = _getProfile(self, arg.unit, arg.expected); // Expected contributor
    if(_now() > cbt.turnTime + 1 hours){
      if(_msgSender() != arg.expected) {
        caller = _msgSender();
        _mustBeAMember(self, arg.unit, caller);
        cbt = _swapFullProfile(self, Common.SwapProfileArg(_getSlot(self.slots, caller, arg.unit), arg.expected, caller, arg.unit, arg.uId, cbt));
      }
    } else {
      require(_msgSender() == cbt.id, "Turn time has not passed");
    }
    uint computedCollateral = _computeCollateral(arg.pool.uint256s.currentPool, arg.msgValue, uint24(arg.pool.uints.colCoverage), arg.xfiUSDPriceInDecimals);
    self.current[arg.uId].addrs.lastPaid = caller;
    _incrementSelector(self.current, arg.uId);
    Common.Contributor memory cData = Common.Contributor({
      durOfChoice: arg.durOfChoice, 
      expInterest: arg.pool.uint256s.currentPool.computeInterestsBasedOnDuration(uint16(arg.pool.uints.intRate), uint24(arg.pool.uints.duration) ,arg.durOfChoice).intPerChoiceOfDur,
      payDate: _now().add(arg.durOfChoice),
      turnTime: cbt.turnTime,
      loan: IBank(arg.pool.addrs.bank).borrow{value: arg.msgValue}( caller, arg.pool.addrs.asset, arg.pool.uint256s.currentPool, arg.fee, computedCollateral),
      colBals: arg.msgValue,
      id: caller,
      sentQuota: cbt.sentQuota
    });
    _updateUserData(
      self,
      Common.UpdateUserParam(
        cData,
        _getSlot(self.slots, caller, arg.unit),
        arg.uId,
        arg.unit,
        caller
      )
    );
    _setNextStage(self.current[arg.uId], Common.FuncTag.PAYBACK);
    ced.pool = _getCurrentPool(self, arg.unit).data;
    _resetPoolBalance(self.current[arg.uId]);
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
   */
  function _resetPoolBalance(Common.Pool storage self) private {
    self.uint256s.currentPool = _defaults().zero;
  }

  /**
   * @dev Return the caller identifier from the msg object 
   * Gas-saving
   */
  function _msgSender() internal view returns(address _sender) {
    _sender = msg.sender;
  }

  
  /**
   * @dev Swaps slot if the calling address is different from the expected contributor.
   * The assumption is that profile data of contributors who are yet to get finance
   * are identical except if the expected address is an admin which makes it easier for us to swap profile data.
   * @param self: Storage ref of type `Data`.
   * @param sw: Parameters.
   * @notice Defaulted address will not be taken out. In this case, we move them backward. 
   *          The worse that could happen to them is to them is for someone else to occupy their slot. 
   */

  function _swapFullProfile(
    Data storage self,
    Common.SwapProfileArg memory sw
  )
    private 
    returns(Common.Contributor memory aCData) 
  {
    Common.Slot memory aSlot = _getSlot(self.slots, sw.actCaller, sw.unit);
    aCData = _getProfile(self, sw.unit, sw.actCaller);
    aCData.turnTime = sw.expcData.turnTime;
    sw.expcData.turnTime = 0;
    _updateUserData(self, Common.UpdateUserParam (sw.expcData,  Common.Slot(aSlot.value, sw.expSlot.isMember, sw.expSlot.isAdmin), sw.uId, sw.unit, sw.expCaller));
    _updateUserData(self, Common.UpdateUserParam (aCData,  Common.Slot(sw.expSlot.value, aSlot.isMember, aSlot.isAdmin), sw.uId, sw.unit, sw.actCaller));
    aCData = _getProfile(self, sw.unit, sw.actCaller);
  }

  /**
   * @dev Returns the current stage of pool at unitId 
   */
  function _getStage(
    Common.Pool[] storage self, 
    uint unitId
  ) internal view returns(Common.FuncTag stage) {
    stage = self[unitId].stage;
  }

  /**
   * @dev Sets the next stage of an epoch
   */
  function _setNextStage(
    Common.Pool storage self, 
    Common.FuncTag nextStage
  ) private {
    // uint8 stage = uint8(_getStage(self, unitId));
    assert(uint8(nextStage) < 6);
    self.stage = nextStage;
  }

  /**@dev Return accrued debt for user up to this moment.
   * @param self : Storage
   * @param unit : Contribution amount.
   * @param user : Contributor.
   * @notice This is the total accrued debt between the date user was paid and now.
  */
  function _getCurrentDebt(
    Data storage self, 
    uint256 unit, 
    address user
  ) 
    internal 
    view returns(Common.DebtReturnValue memory drv) 
  {
    uint intPerSec = _getCurrentPool(self, unit).data.uint256s.intPerSec;
    drv.pos = _getSlot(self.slots, user, unit).value;
    Common.Contributor memory _cb = _getProfile(self, unit, user);
    drv.debt = _cb.loan.add(intPerSec.mul(_now().sub(_cb.turnTime)));
  }

  function _clearDebt(
    Data storage self, 
    uint256 unit, 
    uint unitId, 
    address user
  ) internal {
    uint pos = _getSlot(self.slots, user, unit).value;
    self.current[unitId].cData[pos].loan = 0;
    self.current[unitId].cData[pos].colBals = 0;
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
   */
  function _replenishPoolBalance(Common.Pool storage self) private {
    self.uint256s.currentPool = self.uint256s.unit.mul(self.uints.quorum);
  }

  
  /**@dev Check if round is completed i.e all contributors have received finance
  */
  function _allHasGF(Common.Pool memory pool) internal pure returns(bool) {
    return pool.allGh == pool.uints.quorum;
  }

  function payback(
    Data storage self,
    Common.PaybackParam memory pb
  ) internal returns(Common.CommonEventData memory ced) {
    return _payback(self, pb, false, address(0));
  }

  /**@dev Payback borrowed fund.
   * @param self : Storage
   * @param pb : Payback Parameters struct.
  */
  function _payback(
    Data storage self,
    Common.PaybackParam memory pb,
    bool isSwapped,
    address defaulted
  )
    internal
    returns(Common.CommonEventData memory ced)
  {
    Common.GetPoolResult memory _p = _getCurrentPool(self, pb.unit);
    _validateStage(_p.data.stage, Common.FuncTag.PAYBACK, "Payback not ready");
    Common.DebtReturnValue memory drv = _getCurrentDebt(self, pb.unit, pb.user);
    bool(drv.debt > 0).assertTrue("No debt");
    _clearDebt(self, pb.unit, _p.uId, pb.user);
    bool allGF = _allHasGF(_p.data);
    if(!allGF){
      _replenishPoolBalance(self.current[_p.uId]);
      _setNextStage(self.current[_p.uId], Common.FuncTag.GET);
      _setTurnTime(self, _p.data.uints.selector, _p.uId);
      ced = Common.CommonEventData(_getCurrentPool(self, pb.unit).data, _p.data.cData[drv.pos].loan, _p.data.cData[drv.pos].colBals);
    } else {
      ced = Common.CommonEventData(_getCurrentPool(self, pb.unit).data, _p.data.cData[drv.pos].loan, _p.data.cData[drv.pos].colBals);
      _shuffle(self, _p.uId, pb.unit);
      _setNextStage(self.current[_p.uId], Common.FuncTag.ENDED);
    }
    uint attestedInitialBal = IERC20(_p.data.addrs.asset).balanceOf(_p.data.addrs.bank);
    _validateAllowance(pb.user, _p.data.addrs.asset, drv.debt);
    _withdrawAllowanceToBank(pb.user, _p.data.addrs.asset, drv.debt, _p.data.addrs.bank);
    IBank(_p.data.addrs.bank).payback(pb.user, _p.data.addrs.asset, drv.debt, attestedInitialBal, allGF, _p.data.cData, isSwapped, defaulted);
  }

  /**
   * @dev Return struct object with data if current beneficiary has defaulted otherwise an empty struct is returned.
   * @param self : Storage
   * @param unit: Unit contribution
   */
  function _enquireLiquidation(
    Data storage self, 
    uint256 unit
  ) 
    internal 
    view 
    returns (Common.Contributor memory _liq, bool defaulted, uint currentDebt, Common.Slot memory slot, address defaulter) 
  {
    Common.Pool memory _p = _getCurrentPool(self, unit).data;
    Common.Contributor memory prof = _getProfile(self, unit, _p.addrs.lastPaid);
    (_liq, defaulted, currentDebt, slot, defaulter)
      = 
        _now() <= prof.payDate? 
          (_liq, _defaults().f, uint256(0), Common.Slot(0, false, false), address(0)) 
            : 
              ( prof, _defaults().t, _getCurrentDebt( self, unit, prof.id).debt, self.slots[prof.id][unit], prof.id);
  }

  /**
    @dev Liquidates a borrower if they have defaulted in repaying their loan.
      - If the current beneficiary defaults, they're liquidated.
      - Their collateral balances is forwarded to the liquidator.
      - Liquidator must not be a participant in pool at `unitId. We use this 
        to avoid fatal error in storage.
    @param self : Storage ref.
    @param unit : Unit contribution.
  */
  function liquidate(
    Data storage self,
    uint256 unit
  ) 
    internal
    returns (Common.CommonEventData memory ced)
  {
    (Common.Contributor memory prof, bool defaulted,, Common.Slot memory slot, address defaulter) = _enquireLiquidation(self, unit);
    defaulted.assertTrue("Not defaulter");
    address liquidator = _msgSender() ;
    uint uId = _getIndex(self.indexes, unit);
    _mustNotBeAMember(self, unit, liquidator);
    prof.id = liquidator;
    _updateUserData(self, Common.UpdateUserParam(prof, slot, uId, unit, liquidator));
    delete self.slots[defaulter][unit];
    self.current[uId].addrs.lastPaid = liquidator;
    ced = _payback(self, Common.PaybackParam(unit, liquidator), true, defaulter);
  }

  /**
   * @dev Shuffle between pools i.e moves a finalized pool to the records ledger.
   * This action resets the data at 'uId' after moving it to records for viewing purpose.
   */
  function _shuffle(Data storage self, uint uId, uint256 unit) internal {
    self.pastEpoches.increment();
    uint rId = self.pastEpoches.current();
    self.records[rId] = self.current[uId];
    self.units[unit] = Common.Unit(true, Common.Status.AVAILABLE);
    self.current[uId] = self.current[0];
    // console.log("self.records[rId]: ", self.current[uId].uint256s.unit);
    // console.log("self.records[rId]: ", self.current[uId].cData.length);

    // address[] memory gff = new address[](2);
    // _createPool(
    //   self,
    //   Common.CreatePoolParam(
    //     0,
    //     3,
    //     4,
    //     120, 
    //     unit,
    //     gff,
    //     self.records[rId].addrs.asset
    //   ),
    //   self.records[rId].addrs.bank,
    //   _msgSender(),
    //   Common.Router.PERMISSIONLESS
    // );
    // console.log("self.current[uId]: ", self.current[uId].uint256s.unit);

  }

  /**
    @dev Cancels virgin band i.e Newly created band with only one contributor.
      Only admin of a band can cancel only if no one has join the band.
    @param self : Storage
    @param unit : Unit contribution.
    @param isPermissionLess : Whether band is public or not.

    @notice : Setting the quorum to 0 is an indication that a pool was removed.
  */
  function removeLiquidity(
    Data storage self,
    uint256 unit,
    bool isPermissionLess
  ) 
    internal
    returns (Common.GetPoolResult memory _p)
  {
    // _isInitialized(self.units, unit);
    _p = _getCurrentPool(self, unit);
    address creator = _msgSender();
    _isAdmin(self, unit, creator);
    if(isPermissionLess) {
      bool(self.current[_p.uId].userCount.current() == 1).assertTrue("FactoryLib - Pub: Cannot cancel");
    } else {
      bool(_p.data.uint256s.currentPool <= _p.data.uint256s.unit).assertTrue("FactoryLib - Priv: Cannot cancel");
    }
    self.current[_p.uId].stage = Common.FuncTag.CANCELED;
    _shuffle(self, _p.uId, unit);
    IBank(_p.data.addrs.bank).cancel(creator, _p.data.addrs.asset, _p.data.uint256s.unit);
  }

  function _isAdmin(
    Data storage self,
    uint256 unit,
    address user
  ) 
    internal
    view
  {
    require(self.slots[user][unit].isAdmin, "FactoryLib: Only admin");
  }

  /**
   * @dev Return the different balances locked in an epoch
   * @param self : Data ref
   * @param unit : Unit contribution
   */
  function _getBalancesInBank(
    Data storage self,
    uint256 unit
  )
    internal
    view
    returns(Common.Balances memory balances) 
  {

    // _isInitialized(self.units, unit);
    Common.Addresses memory addrs = _getCurrentPool(self, unit).data.addrs;
    if(addrs.asset == address(0)){
      balances = Common.Balances({
        xfi: 0,
        erc20: 0
      });
    } else {
      balances = Common.Balances({
        xfi: addrs.bank.balance,
        erc20: IERC20(addrs.asset).balanceOf(addrs.bank)
      });
    }
  }

  /** @dev Update Contract variables
    * @param self : Storage. 
    * @param assetAdmin : Asset manager contract.
    * @param feeTo : Fee receiver.
    * @param makerRate : Service fee.
   */
  function setContractData(
    Data storage self,
    address assetAdmin,
    address feeTo,
    uint16 makerRate,
    address bankFactory
  ) 
    internal 
    returns(bool)
  {
    if(assetAdmin != address(0)) self.pData.assetAdmin = assetAdmin;
    if(bankFactory != address(0)) self.pData.bankFactory = bankFactory;
    if(feeTo != address(0)) self.pData.feeTo = feeTo;
    if(makerRate < type(uint16).max) self.pData.makerRate = makerRate;
    return true;
  }

  ///@dev Returns epoches
  function getEpoches(Data storage self) internal view returns(uint epoches) {
    epoches = self.epoches.current();
  }

  ///@dev Returns epoches
  function getRecordEpoches(Data storage self) internal view returns(uint epoches) {
    epoches = self.pastEpoches.current();
  }

  /// @dev Return pool using unitId. @notice The correct unitId must be parsed.
  function getData(Data storage self, uint uId) internal view returns(Common.Pool memory pool) {
    pool = self.current[uId];
  }

  /// @dev Return past pools using unitId. @notice The correct unitId must be parsed.
  function getRecord(Data storage self, uint uId) internal view returns(Common.Pool memory pool) {
    pool = self.records[uId];
  }

  function getPoints(Data storage self, address user) internal view returns(Common.Point memory point) {
    point = self.points[user];
  }

  function getSlot(Data storage self, address user, uint256 unit) internal view returns(Common.Slot memory slot) {
    slot = self.slots[user][unit];
  }
}
