// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "hardhat/console.sol";   // For debugging only
import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { Counters } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol";
import { IERC20 } from "../apis/IERC20.sol";
import { IBankFactory } from "../apis/IBankFactory.sol";
import { IBank } from "../apis/IBank.sol";
import { IFactory } from "../apis/IFactory.sol";
import { C3 } from "../apis/C3.sol";
import { AssetClass } from "../implementations/AssetClass.sol";
import { Utils } from "../libraries/Utils.sol";
import { IAssetClass } from "../apis/IAssetClass.sol";

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

  Counters.Counter cSlots;

  Counters.Counter pastEpoches;

  IFactory.ContractData pData;

  mapping(uint => C3.Contributor[]) cData;

  mapping(uint256 => uint) indexes; // For every unit amount of contribution, there is a corresponding index for retrieving data from the storage.

  mapping(uint => C3.Pool) records; // Past transactions i.e Ended or Canceled pools 

  mapping(uint => C3.Pool) current; // Mapping of unitId to Pool
  
  mapping(address => C3.Point) points;

  mapping(address => mapping(uint256 => C3.Slot)) slots;
}

struct Def {
  bool t;
  bool f;
  uint8 zero;
  uint8 one;
  address zeroAddr;
  uint reserve;
}

library FactoryLibV3 {
  using Utils for *;
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  error CurrentReceiverIsNotADefaulter();
  error APoolWithThisAmountExist();
  error CancellationNotAllowed();
  error TurnTimeHasNotPassed();
  error AmountNotInitialized();
  error OnlyAdminIsAllowed();
  error PoolNotComplete();
  error PoolIsFilled();
  error NoDebtFound();
  error NotAMember();

  /**
   * @dev Verifiy that status is already initialized
  */
  function _isInitialized(Data storage self, uint256 unit, bool secondCheck) internal view {
    uint uId = _getIndex(self.indexes, unit);
    C3.Pool memory _p = self.current[uId];
    if(uId == 0) revert AmountNotInitialized();
    if(secondCheck){
      require(_p.status == C3.Status.TAKEN, 'Amount not initialized');
    } 
  }

  /**
   * @dev Verifiy that unit contribution is not initialized, then intialize it.
  */
  function _initializeUnit(Data storage self, uint256 unit) internal returns(C3.ReturnValue memory rv) {
    rv.uId = _getIndex(self.indexes, unit);
    rv.pool = self.current[rv.uId];
    if(rv.uId == 0) {
      self.epoches.increment();
      rv.uId = self.epoches.current();
      self.indexes[unit] = rv.uId;
    } else {
      if(rv.pool.status == C3.Status.TAKEN) {
        revert APoolWithThisAmountExist();
      }
    }
    self.pastEpoches.increment();
    rv.pool.status = C3.Status.TAKEN;
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
  function _getCurrentPool(Data storage self, uint256 unit) internal view returns(C3.GetPoolResult memory result) {
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

  function _addUpToBank(address bank, address user, uint rId) internal {
    IBank(bank).addUp(user, rId);
  }

  /**
   * @dev Create a fresh pool
   * @param self: Storage of type `Data`
   * @param cpp: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @notice cSlot is the position where the contibutors for the current unit is stored.
   *          Anytime we created a pool, a record is known in advance i.e. a slot is created in advance for the it. This is where the pool
   *          is moved when it is finalized.
   * 
   *          - We removed collateral coverage check so as to enable more flexible tuning and customization. Example: Bob, Alice and Kate agreed
   *            to operate a flexpool of unit $100 at zero collateral index. So Bob creates a flexpool of $100 setting quorum to maximum 3 participants.
   *            He set colCoverage to 0. If particapant A wants to get finance, they will be required to provide (collateralCalculor * 0) which is 0
   *            in order to get finance.
  */   
  function _createPool(
    Data storage self,
    C3.CreatePoolParam memory cpp,
    address bank,
    address user,
    C3.Router router,
    function (Data storage, C3.ReturnValue memory) internal callback
  ) 
    private 
    returns(C3.ReturnValue memory rv) 
  {
    Def memory _d = _defaults();
    // bool(cpp.colCoverage >= 100).assertTrue("Col coverage is too low");
    Utils.assertTrue_2(cpp.duration > _d.zero, cpp.duration <= 720, "Invalid duration"); // 720hrs = 30 days.
    _awardPoint(self.points, user, _d.t);
    self.cSlots.increment();
    rv = _updatePoolSlot(self, cpp, bank, router, _initializeUnit(self, cpp.unit));
    callback(self, rv);
    _addUpToBank(bank, user, rv.rId);
    _validateAllowance(user, cpp.asset, cpp.unit);
    _withdrawAllowanceToBank(user, cpp.asset, cpp.unit, bank);
  }

  function _defaults()
    internal 
    pure 
    returns(Def memory) 
  {
    return Def(true, false, 0, 1, address(0), uint(0));
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

  /**
   * @dev Initializes the slot for pool user intend to create.
   * @notice To maintain storage orderliness especially when an epoch has ended and we need to 
   * keep record of the pool, we create a slot ahead for the initialized pool so we can move current
   * pool to it when it is finalized.
   */
  function _initializePool(
    Data storage self,
    C3.Pool memory _p, 
    C3.CreatePoolParam memory cpp,
    C3.InterestReturn memory itr,
    address bank,
    uint uId,
    uint24 durInSec,
    C3.Router router
  ) internal view returns(C3.ReturnValue memory rv) {
    Def memory _d = _defaults();
    rv.rId = self.pastEpoches.current();
    uint cSlot = self.cSlots.current();
    _p.uints = C3.Uints(cpp.quorum, _d.zero, cpp.colCoverage, durInSec, cpp.intRate, cSlot, _d.zero, _p.uints.userCount);
    _p.uint256s = C3.Uint256s(itr.fullInterest, itr.intPerSec, cpp.unit, cpp.unit, uId, rv.rId);
    _p.addrs = C3.Addresses(cpp.asset, _d.zeroAddr, bank, cpp.members[0]);
    _p.router = router;
    _p.stage = C3.FuncTag.JOIN;
    rv.uId = uId;
    rv.pool = _p;
  }

  /*** @dev Update the storage with pool information
   * @param self: Storage of type `Data`
   * @param cpp: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @param uId: Unit Id ref/index in storage.
   * @param bank: Strategy contract.
   */
  function _updatePoolSlot(
    Data storage self,
    C3.CreatePoolParam memory cpp,
    address bank,
    C3.Router router,
    C3.ReturnValue memory rv
    // C3.Pool memory pool,
    // uint uId
  ) 
    internal view returns(C3.ReturnValue memory _rv)
  {
    uint24 durInSec = _convertDurationToSec(uint16(cpp.duration));
    _rv = _initializePool(
      self, 
      rv.pool, 
      cpp, 
      cpp.unit.mul(cpp.quorum).computeInterestsBasedOnDuration(cpp.intRate, durInSec, durInSec), 
      bank, 
      rv.uId, 
      durInSec, 
      router
    );
  }

  /**
   * @dev Update storage
   */
  function _callback(Data storage self, C3.ReturnValue memory rv) private {
    self.current[rv.uId] = rv.pool;
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
    C3.CreatePoolParam memory cpp
  ) 
    internal
    returns (C3.Pool memory _p) 
  {
    Def memory _d = _defaults();
    address bank = _fetchAndValidateBank(cpp.unit, self.pData.bankFactory); //////1
    for(uint i = _d.zero; i < cpp.members.length; i++) {
      address user = cpp.members[i];
      if(i == _d.zero) {
        _p = _createPool(self, cpp, bank, user, C3.Router.PERMISSIONED, _callback).pool;
        _addNewContributor(self, _p.uints.cSlot, _p.uint256s.unit, user, _d.t, _d.t, _d.t);
      } else {
        bool(user != _p.addrs.admin).assertTrue("Admin spotted twice");
        _addNewContributor(self, _p.uints.cSlot, _p.uint256s.unit, user, _d.f, _d.t, _d.f);
        _p = _getCurrentPool(self, _p.uint256s.unit).data; 
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
   */
  function _addNewContributor(
    Data storage self, 
    uint cSlot, 
    uint256 unit,
    address user,
    bool isAdmin,
    bool isMember,
    bool sentQuota                                                                                                                                                                              
  ) 
    private 
    // returns(
    //   C3.Contributor memory cData
    // )
  {
    uint8 pos = uint8(self.cData[cSlot].length);
    self.cData[cSlot].push(); 
    // console.log("pos: ", pos);
    // console.log("self.cData[cSlot]: ", self.cData[cSlot].length);
    self.slots[user][unit] = C3.Slot(pos, isMember, isAdmin);
    self.cData[cSlot][pos] = C3.Contributor(0, 0, 0, 0, 0, 0, user, sentQuota);
    self.current[_getIndex(self.indexes, unit)].uints.userCount ++;
    // cData = _getProfile(self, unit, user);

    // cData = _addContributor(
    //   self, 
    //   C3.Slot(position, isMember, isAdmin), 
    //   user, 
    //   unit, 
    //   uId, 
    //   sentQuota
    // );
    // console.log("self.current[uId].cData: ", self.current[uId].cData.length); //3
  }

  // /**@dev Push a new contributor to storage.
  //   @param self : Storage of type C3.Contributor array
  //   @param unit : Unit contribution
  //   @param uId : Unit ID
  //   @param slot : Slot struct
  //   @param user : Caller's address
  //   @param sentQuota : Whether this user has paid their contribution or not.
  //  */
  // function _addContributor(
  //   Data storage self, 
  //   C3.Slot memory slot,
  //   address user,
  //   uint256 unit,
  //   uint uId,
  //   bool sentQuota
  // ) 
  //   private 
  //   returns (C3.Contributor memory cData)
  // {
  //   _updateSlot(self, uId, unit, slot, user);
  //   self.current[uId].cData[slot.value].sentQuota = sentQuota;
  //   cData = _getProfile(self, unit, user); 
  // }

  /**@dev Update contributor's data
    @param self : Storage of type mapping
    @param up : Parameters
   */
  function _updateUserData(
    Data storage self, 
    C3.UpdateUserParam memory up
  )
    private 
  {
    self.cData[up.cSlot][up.slot.value] = up.cData;
    // self.current[up.uId].cData[up.slot.value] = up.cData;
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
  function _awardPoint(mapping(address => C3.Point) storage self, address user, bool isCreator) internal {
    isCreator? self[user].creator += 5 : self[user].contributor += 2;
  }

  /**@dev Ruturn provider's info
    @param self : Storage of type C3.Contributor
   */
  function _getProfile(
    Data storage self,
    uint unit,
    address user
  ) 
    internal 
    view 
    returns(C3.Contributor memory cbt) 
  {
    C3.Slot memory uSlot = self.slots[user][unit];
    uint cSlot = _getCurrentPool(self, unit).data.uints.cSlot;
    if(self.cData[cSlot].length > 0){
      cbt = self.cData[cSlot][uSlot.value];
    } else {
      cbt = C3.Contributor(0, 0, 0, 0, 0, 0, address(0), false);
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
    C3.CreatePoolParam memory cpp
  )
    internal
    returns (C3.Pool memory _p)
  {
    Def memory _d = _defaults();
    address user = cpp.members[0];
    address bank = _fetchAndValidateBank(cpp.unit, self.pData.bankFactory);
    _p = _createPool(self, cpp, bank, user, C3.Router.PERMISSIONLESS, _callback).pool;
    _addNewContributor(self, _p.uints.cSlot, _p.uint256s.unit, user, _d.t, _d.t, _d.t);
  }

  /**@dev Add new contributor to a band.
   * @param self: Storage ref of type Data.
   * @param _ab: Parameters struct.
   * @notice A contributor can occupy more than one spot.
  */
  function addContributor(
    Data storage self,
    C3.AddTobandParam memory _ab
  )
    internal
    returns (
      C3.Pool memory _p
    ) 
  {
    Def memory _d = _defaults();
    // _isInitialized(self.units, _ab.unit, _d.t);
    _p = _getCurrentPool(self, _ab.unit).data;
    address caller = _msgSender();
    _validateStage(_p.stage, C3.FuncTag.JOIN, "Cannot add contributor");
    if(_ab.isPermissioned) {
      _mustBeAMember(self, _ab.unit, caller);
      self.cData[_p.uints.cSlot][_getSlot(self.slots, caller, _ab.unit).value].sentQuota = _d.t;
    } else {
      if(_p.uints.userCount >= _p.uints.quorum) revert PoolIsFilled();
      _mustNotBeAMember(self, _ab.unit, caller);
      _addNewContributor(self, _p.uints.cSlot, _ab.unit, caller, _d.f, _d.t, _d.t);
      _p = _getCurrentPool(self, _ab.unit).data;
    }
    _p.uint256s.currentPool += _p.uint256s.unit;
    if(_isPoolFilled(_p, _ab.isPermissioned)) {
      _setTurnTime(self, _p.uints.selector, _p.uints.cSlot);
      _p = _setNextStage(_p, C3.FuncTag.GET);
    }
    _validateAllowance(caller, _p.addrs.asset, _p.uint256s.unit);
    _withdrawAllowanceToBank(caller, _p.addrs.asset, _p.uint256s.unit, _p.addrs.bank);
    _addUpToBank(_p.addrs.bank, caller, _p.uint256s.rId);
    _callback(self, C3.ReturnValue(_p, _p.uint256s.unitId, _p.uint256s.rId));
  }

  /**
   * @dev Validate stage for invoked function.
   */
  function _validateStage(
    C3.FuncTag expected, 
    C3.FuncTag actual, 
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
    if(!_getSlot(self.slots, user, unit).isMember) revert NotAMember();
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
    * @param _p: Pool struct (Location: Memory)
  */
  function _isPoolFilled(C3.Pool memory _p, bool isPermissioned) 
    internal 
    pure
    returns(bool filled) 
  {
    uint expected = _p.uint256s.unit.mul(_p.uints.quorum);
    filled = !isPermissioned? _p.uints.userCount == _p.uints.quorum : expected == _p.uint256s.currentPool;
  }

  /**@dev Update selector to who will get finance next
    * @param self: Storage {typeof mapping}
    * @param cSlot: Pool index.
    * @param selector : Spot selector.
  */
  function _setTurnTime(
    Data storage self, 
    uint selector, 
    uint cSlot
  ) 
    private
  {
    self.cData[cSlot][selector].turnTime = _now();
  }

  function getProfile(
    Data storage self, 
    address user,
    uint256 unit
  ) 
    internal 
    view 
    returns(C3.Contributor memory) 
  {
    _mustBeAMember(self, unit, user);
    return _getProfile(self, unit, user);
  }

  /**@dev Get the slots of user with address and unitId
    @param self : Storage of type mappping
    @param user : User address
   */
  function _getSlot(
    mapping(address =>mapping(uint256 => C3.Slot)) storage self, 
    address user, 
    uint256 unit
  ) 
    internal 
    view 
    returns(C3.Slot memory slot) 
  {
    slot = self[user][unit];
  }

  /**@dev Get finance: Sends current total contribution to the 
   * expected account and update respective accounts.
    @param self : Storage of type Data.
    @param unit : Contribution amount.
    @param msgValue : Value sent in call.
    @param daysOfUseInHr : Number of days specified in hours after which 
                      the contributor shall return the borrowed fund.
    @param getPriceOfCollateralToken : A function that returns the current price of XFI.
  */
  function getFinance(
    Data storage self,
    uint256 unit,
    uint256 msgValue,
    uint16 daysOfUseInHr,
    function () internal returns(uint128) getPriceOfCollateralToken
  ) 
    internal
    returns(C3.Pool memory _p, uint256 amtFinanced)
  {
    _p = _getCurrentPool(self, unit).data;
    amtFinanced = _p.uint256s.currentPool;
    _validateStage(_p.stage, C3.FuncTag.GET, "Borrow not ready");
    if(_p.uints.allGh == _p.uints.quorum) revert IFactory.AllMemberIsPaid();
    _p = _incrementGF(_p);
    if(_p.uint256s.currentPool < (_p.uint256s.unit.mul(_p.uints.quorum))) revert PoolNotComplete();
    _p = _updateStorageAndCall(
      self,
      C3.UpdateMemberDataParam( 
        _convertDurationToSec(daysOfUseInHr), 
        self.cData[_p.uints.cSlot][_p.uints.selector].id,
        unit,
        _getIndex(self.indexes, unit),
        _p.uint256s.currentPool.computeFee(self.pData.makerRate),
        msgValue,
        getPriceOfCollateralToken(),
        _p
      )
    );
    _callback(self, C3.ReturnValue(_p, _p.uint256s.unitId, _p.uint256s.rId));
  }

  /**@dev Increment allGh when one member get finance
  */
  function _incrementGF(
   C3.Pool memory pool 
    // uint unitId
  )  
    internal
    pure
    returns(C3.Pool memory _p) 
  {
    pool.uints.allGh ++;
    _p = pool;
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
    uint128 xfiPriceInUSD,
    uint8 priceDecimals
  )
    internal
    pure
    returns(uint collateral)
  { 
    collateral = C3.XFIPrice(xfiPriceInUSD, priceDecimals).computeCollateral(
      amountOfXFISent,
      ccr,
      loanAmount,
      false
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
    * @param arg : Parameter of type C3.UpdateMemberDataParam
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
    C3.UpdateMemberDataParam memory arg
  ) 
    private
    returns (C3.Pool memory _p) 
  {
    address caller = arg.expected;
    C3.Contributor memory cbt = _getProfile(self, arg.unit, arg.expected); // Expected contributor
    if(_now() > cbt.turnTime + 1 hours){
      if(_msgSender() != arg.expected) {
        caller = _msgSender();
        _mustBeAMember(self, arg.unit, caller);
        cbt = _swapFullProfile(self, C3.SwapProfileArg(_getSlot(self.slots, caller, arg.unit), arg.expected, caller, arg.unit, arg.pool.uints.cSlot, cbt));
      }
    } else {
      if(_msgSender() != cbt.id) revert TurnTimeHasNotPassed();
      // require(_msgSender() == cbt.id, "Turn time has not passed");
    }
    uint computedCollateral = _computeCollateral(arg.pool.uint256s.currentPool, arg.msgValue, uint24(arg.pool.uints.colCoverage), arg.xfiUSDPriceInDecimals, IERC20(self.pData.collacteralToken).decimals());
    arg.pool.addrs.lastPaid = caller;
    arg.pool.uints.selector ++;
    C3.Contributor memory cData = C3.Contributor({
      durOfChoice: arg.durOfChoice, 
      expInterest: arg.pool.uint256s.currentPool.computeInterestsBasedOnDuration(uint16(arg.pool.uints.intRate), uint24(arg.pool.uints.duration) ,arg.durOfChoice).intPerChoiceOfDur,
      payDate: _now().add(arg.durOfChoice),
      turnTime: cbt.turnTime,
      loan: IBank(arg.pool.addrs.bank).borrow{value: arg.msgValue}( caller, arg.pool.addrs.asset, arg.pool.uint256s.currentPool, arg.fee, computedCollateral, arg.pool.uint256s.rId),
      colBals: arg.msgValue,
      id: caller,
      sentQuota: cbt.sentQuota
    });
    _updateUserData(
      self,
      C3.UpdateUserParam(
        cData,
        _getSlot(self.slots, caller, arg.unit),
        arg.pool.uints.cSlot,
        arg.unit,
        caller
      )
    );
    arg.pool.stage = C3.FuncTag.PAYBACK;
    arg.pool.uint256s.currentPool = _defaults().zero;
    _p = arg.pool;
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
    C3.SwapProfileArg memory sw
  )
    private 
    returns(C3.Contributor memory aCData) 
  {
    C3.Slot memory aSlot = _getSlot(self.slots, sw.actCaller, sw.unit);
    aCData = _getProfile(self, sw.unit, sw.actCaller);
    aCData.turnTime = sw.expcData.turnTime;
    sw.expcData.turnTime = 0;
    _updateUserData(self, C3.UpdateUserParam (sw.expcData,  C3.Slot(aSlot.value, sw.expSlot.isMember, sw.expSlot.isAdmin), sw.cSlot, sw.unit, sw.expCaller));
    _updateUserData(self, C3.UpdateUserParam (aCData,  C3.Slot(sw.expSlot.value, aSlot.isMember, aSlot.isAdmin), sw.cSlot, sw.unit, sw.actCaller));
    aCData = _getProfile(self, sw.unit, sw.actCaller);
  }

  /**
   * @dev Returns the current stage of pool at unitId 
   */
  function _getStage(
    C3.Pool[] storage self, 
    uint unitId
  ) internal view returns(C3.FuncTag stage) {
    stage = self[unitId].stage;
  }

  /**
   * @dev Sets the next stage of an epoch
   */
  function _setNextStage(
    C3.Pool memory _p, 
    C3.FuncTag nextStage
  ) internal pure returns(C3.Pool memory _p_) {
    assert(uint8(nextStage) < 6);
    _p.stage = nextStage;
    _p_ = _p;
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
    view returns(C3.DebtReturnValue memory drv) 
  {
    uint intPerSec = _getCurrentPool(self, unit).data.uint256s.intPerSec;
    drv.pos = _getSlot(self.slots, user, unit).value;
    C3.Contributor memory _cb = _getProfile(self, unit, user);
    drv.debt = _cb.loan.add(intPerSec.mul(_now().sub(_cb.turnTime)));
  }

  function _clearDebt(C3.Contributor memory cData) internal pure returns(C3.Contributor memory _cData) {
    cData.loan = 0;
    cData.colBals = 0;
    _cData = cData;
  }

  /**@dev Reset pool balances
    @param _p: Pool (location type is memory)
   */
  function _replenishPoolBalance(C3.Pool memory _p) internal pure returns(C3.Pool memory _p_) {
    _p.uint256s.currentPool = _p.uint256s.unit.mul(_p.uints.quorum);
    _p_ = _p;
  }

  
  /**@dev Check if round is completed i.e all contributors have received finance
  */
  function _allHasGF(C3.Pool memory pool) internal pure returns(bool) {
    return pool.uints.allGh == pool.uints.quorum;
  }

  function payback(
    Data storage self,
    C3.PaybackParam memory pb
  ) internal returns(uint, uint, C3.Pool memory) {
    return _payback(self, pb, false, address(0));
  }

  /**@dev Payback borrowed fund.
   * @param self : Storage
   * @param pb : Payback Parameters struct.
  */
  function _payback(
    Data storage self,
    C3.PaybackParam memory pb,
    bool isSwapped,
    address defaulted
  )
    internal
    returns(uint amtPayBackInUSD, uint colWithdrawn, C3.Pool memory _p)
  {
    _p = _getCurrentPool(self, pb.unit).data;
    C3.Contributor memory _cData = _getProfile(self, pb.unit, pb.user);
    _validateStage(_p.stage, C3.FuncTag.PAYBACK, "Payback not ready");
    uint debt = _getCurrentDebt(self, pb.unit, pb.user).debt;
    if(debt == 0) revert NoDebtFound();
    amtPayBackInUSD = _cData.loan;
    colWithdrawn = _cData.colBals;
    _cData = _clearDebt(_cData);
    // console.log("_Cdata.colBalAfter", _cData.colBals);
    bool allGF = _allHasGF(_p);
    if(!allGF){
      // console.log("_CurrentPoolB4", _p.uint256s.currentPool);
      _p = _replenishPoolBalance(_p);
      // console.log("_CurrentPoolAfter", _p.uint256s.currentPool);
      _p = _setNextStage(_p, C3.FuncTag.GET);
      _setTurnTime(self, _p.uints.selector, _p.uints.cSlot);
      _callback(self, C3.ReturnValue(_p, _p.uint256s.unitId, _p.uint256s.rId));
      self.cData[_p.uints.cSlot][_getSlot(self.slots, pb.user, pb.unit).value] = _cData;
    } else {
      _p = _setNextStage(_p, C3.FuncTag.ENDED);
      self.cData[_p.uints.cSlot][_getSlot(self.slots, pb.user, pb.unit).value] = _cData;
      _callback(self, C3.ReturnValue(_shuffle(self, _p), _p.uint256s.unitId, _p.uint256s.rId));
    }
    C3.Contributor[] memory cDatas = self.cData[_p.uints.cSlot];
    (bool _isSwapped, address _defaulted, uint rId) = (isSwapped, defaulted, _p.uint256s.rId);
    uint256 attestedInitialBal = IERC20(_p.addrs.asset).balanceOf(_p.addrs.bank);
    _validateAllowance(pb.user, _p.addrs.asset, debt);
    _withdrawAllowanceToBank(pb.user, _p.addrs.asset, debt, _p.addrs.bank);
    IBank(_p.addrs.bank).payback(
      pb.user, 
      _p.addrs.asset, 
      debt, 
      attestedInitialBal, 
      allGF,
      cDatas, 
      _isSwapped, 
      _defaulted, 
      rId
    );
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
    returns (C3.Contributor memory _liq, bool defaulted, uint currentDebt, C3.Slot memory slot, address defaulter) 
  {
    C3.Pool memory _p = _getCurrentPool(self, unit).data;
    C3.Contributor memory prof = _getProfile(self, unit, _p.addrs.lastPaid);
    (_liq, defaulted, currentDebt, slot, defaulter)
      = 
        _now() <= prof.payDate? 
          (_liq, _defaults().f, uint256(0), C3.Slot(0, false, false), address(0)) 
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
    returns(uint, uint, C3.Pool memory _p)
  {
    (C3.Contributor memory prof, bool defaulted,, C3.Slot memory slot, address defaulter) = _enquireLiquidation(self, unit);
    if(!defaulted) revert CurrentReceiverIsNotADefaulter();
    address liquidator = _msgSender() ;
    _mustNotBeAMember(self, unit, liquidator);
    prof.id = liquidator;
    _updateUserData(
      self, 
      C3.UpdateUserParam(prof, slot, _getCurrentPool(self, unit).data.uints.cSlot, unit, liquidator)
    );
    delete self.slots[defaulter][unit];
    self.current[_getIndex(self.indexes, unit)].addrs.lastPaid = liquidator;
    return _payback(self, C3.PaybackParam(unit, liquidator), true, defaulter);
  }

  /**
   * @dev Shuffle between pools i.e moves a finalized pool to the records ledger.
   * This action resets the data at 'uId' after moving it to records for viewing purpose.
   */
  function _shuffle(
    Data storage self,
    C3.Pool memory _p
  ) internal returns(C3.Pool memory empty) {
    empty = self.current[0];
    self.records[_p.uint256s.rId] = _p;
    // self.current[_p.uint256s.unitId] = empty;
    // self.units[unit] = C3.Unit(true, C3.Status.AVAILABLE);
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
  {
    // _isInitialized(self.units, unit);
    C3.Pool memory _p = _getCurrentPool(self, unit).data;
    address creator = _msgSender();
    _isAdmin(self, unit, creator);
    if(isPermissionLess) {
      if(_p.uints.userCount > 1 || _p.uints.userCount < 1) revert CancellationNotAllowed();
    } else {
      if(_p.uint256s.currentPool > _p.uint256s.unit) revert CancellationNotAllowed();
    }
    _p.stage = C3.FuncTag.CANCELED;
    _callback(self, C3.ReturnValue(_shuffle(self, _p), _p.uint256s.unitId, _p.uint256s.rId));
    IBank(_p.addrs.bank).cancel(creator, _p.addrs.asset, _p.uint256s.unit, _p.uint256s.rId);
  }

  function _isAdmin(
    Data storage self,
    uint256 unit,
    address user
  ) 
    internal
    view
  {
    if(!self.slots[user][unit].isAdmin) revert OnlyAdminIsAllowed();
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
    returns(C3.Balances memory balances) 
  {

    // _isInitialized(self.units, unit);
    C3.Addresses memory addrs = _getCurrentPool(self, unit).data.addrs;
    if(addrs.asset == address(0)){
      balances = C3.Balances({
        xfi: 0,
        erc20: 0
      });
    } else {
      balances = C3.Balances({
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
    IAssetClass assetAdmin,
    address feeTo,
    uint16 makerRate,
    address bankFactory,
    IERC20 colToken
  ) 
    internal 
    returns(bool)
  {
    if(address(assetAdmin) != address(0)) self.pData.assetAdmin = assetAdmin;
    if(bankFactory != address(0)) self.pData.bankFactory = bankFactory;
    if(address(colToken) != address(0)) self.pData.collacteralToken = colToken;
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

  // ///@dev Return all contributors in a pool
  // function getCData(Data storage self, uint unit) internal view returns(C3.Contributor[] memory cData){
  //   cData = self.cData[_getCurrentPool(self, unit).data.uints.cSlot];
  // }

  /// @dev Return pool using unitId. @notice The correct unitId must be parsed.
  function getData(Data storage self, uint uId) internal view returns(C3.ReadDataReturnValue memory rd) {
    rd.pool = self.current[uId];
    rd.cData = self.cData[rd.pool.uints.cSlot];
  }

  /// @dev Return past pools using unitId. @notice The correct unitId must be parsed.
  function getRecord(Data storage self, uint rId) internal view returns(C3.ReadDataReturnValue memory rd) {
    rd.pool = self.records[rId];
    rd.cData = self.cData[rd.pool.uints.cSlot];
  } 

  function getPoints(Data storage self, address user) internal view returns(C3.Point memory point) {
    point = self.points[user];
  }

  function getSlot(Data storage self, address user, uint256 unit) internal view returns(C3.Slot memory slot) {
    slot = self.slots[user][unit];
  }
}
