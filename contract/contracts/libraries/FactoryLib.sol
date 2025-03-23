// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "hardhat/console.sol";   // For debugging only
import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { Counters } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol";
import { IERC20 } from "../apis/IERC20.sol";
import { IBankFactory } from "../apis/IBankFactory.sol";
import { IBank } from "../apis/IBank.sol";
import { IFactory } from "../apis/IFactory.sol";
import { Common } from "../apis/Common.sol";
import { AssetClass, IAssetClass } from "../implementations/AssetClass.sol";
import { Utils } from "../libraries/Utils.sol";
// import { IAssetClass } from "../apis/IAssetClass.sol";

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

  mapping(uint => Common.Contributor[]) cData;

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

library FactoryLib {
  using Utils for *;
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  /**
   * @dev Verifiy that status is already initialized
  */
  function _isValidUnit(Data storage self, uint256 unit) internal view {
    uint uId = self.indexes[unit];
    require(_isInitialized(uId) && self.current[uId].status == Common.Status.TAKEN, 'Amount not initialized');
  }

  /**
   * @dev Ensure that unit contribution is active.
   * Every unit contribution has a corresponding and unique id called unitId.
   * When a unitId equals zero mean it is not active
   */
  function _isInitialized(uint unitId) internal pure returns(bool result){
    result = unitId > 0;
  }

  /**
   * @dev Verifiy that unit contribution is not initialized, then intialize it.
   * @notice We preserve the first slot at self.current[0] for future use.
  */
  function _getUnitId(Data storage self, Common.CreatePoolParam memory _c) internal returns(Common.CreatePoolParam memory cpp) {
    _c.uId = self.indexes[_c.unit];
    if(!_isInitialized(_c.uId)){
      self.epoches.increment();
      _c.uId = self.epoches.current();
      self.indexes[_c.unit] = _c.uId;
    }
    _c.isTaken = self.current[_c.uId].status == Common.Status.TAKEN;
    self.pastEpoches.increment();
    _c.rId = self.pastEpoches.current();
    cpp = _c;
  }

  /**
   * @dev Return the corresponding index for a unit amount of contribution from storage
  */
  function _getCurrentPool(Data storage self, uint256 unit) internal view returns(Common.GetPoolResult memory result) {
    result.uId = self.indexes[unit];
    result.data = self.current[result.uId];
  }

  /**
   * @dev Check that user has given enough approval to spend from their balances
   * @param user : Caller.
   * @param asset : ERC20 currency address to use as contribution base.
   * @param value : Contribution per user.
  */
  function _validateAndWithdrawAllowance(
    address user, 
    address asset, 
    uint value,
    address to
  ) 
    internal 
    returns(uint allowance)
  {
    allowance = IERC20(asset).allowance(user, address(this));
    if(allowance < value) revert Common.InsufficientAllowance();
    if(!IERC20(asset).transferFrom(user, to, value)) revert Common.TransferFailed();
  }

  function _addUpToSafe(address safe, address user, uint rId) internal {
    IBank(safe).addUp(user, rId);
  }

  /**
   * @dev Create a fresh pool
   * @param self: Storage of type `Data`
   * @param _c: This is a struct of data much like an object. We use it to compress a few parameters
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
    Common.CreatePoolParam memory _c,
    address safe,
    address user,
    Common.Router router
  ) 
    private 
    returns(Common.Pool memory _p) 
  {
    Def memory _d = _defaults();
    // bool(_c.colCoverage >= 100).assertTrue("Col coverage is too low");
    Utils.assertTrue_2(_c.duration > _d.zero, _c.duration <= 720, "Invalid duration"); // 720hrs = 30 days.
    _awardPoint(self.points, user, _d.t);
    self.cSlots.increment();
    _c = _getUnitId(self, _c);
    if(_c.isTaken) revert Common.UnitIsTaken();
    _p = _updatePoolSlot(self, _c, safe, router);
    _callback(self, _p, _c.uId);
    if(!IBank(safe).addUp(user, _c.rId)) revert Common.SafeAddupFailed();
    _validateAndWithdrawAllowance(user, _c.asset, _c.unit, safe);
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

  /**
   * @dev Initializes the slot for the pool user intend to create.
   * @notice To maintain storage orderliness especially when an epoch has ended and we need to 
   * keep record of the pool, we create a slot ahead for the initialized pool so we can move current
   * pool to it when it is finalized.
   */
  function _initializePool(
    Data storage self,
    Common.CreatePoolParam memory _c,
    Common.Interest memory itr,
    address safe,
    uint24 durInSec,
    Common.Router router
  ) internal view returns(Common.Pool memory _p) {
    Def memory _d = _defaults();
    uint cSlot = self.cSlots.current();
    _p.lInt = Common.LInt(_c.quorum, _d.zero, _c.colCoverage, durInSec, _c.intRate, cSlot, _d.zero, _p.lInt.userCount);
    _p.bigInt = Common.BigInt(_c.unit, _c.unit, _c.rId, _c.uId);
    _p.addrs = Common.Addresses(_c.asset, _d.zeroAddr, safe, _c.members[0]);
    _p.router = router;
    _p.interest = itr;
    _p.status = Common.Status.TAKEN;
    _p.stage = Common.Stage.JOIN;
  }

  /*** @dev Update the storage with pool information
   * @param self: Storage of type `Data`
   * @param _c: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @param uId: Unit Id ref/index in storage.
   * @param router: Permissioned or Permissionless.
   */
  function _updatePoolSlot(
    Data storage self,
    Common.CreatePoolParam memory _c,
    address safe,
    Common.Router router
  ) 
    internal view returns(Common.Pool memory _p)
  {
    uint24 durInSec = _convertDurationToSec(uint16(_c.duration));
    _p = _initializePool(
      self, 
      _c, 
      _c.unit.mul(_c.quorum).computeInterestsBasedOnDuration(_c.intRate, durInSec), 
      safe, 
      durInSec, 
      router
    );
  }

  /**
   * @dev Update storage
   */
  function _callback(Data storage self, Common.Pool memory pool, uint uId) private {
    self.current[uId] = pool;
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
    returns (Common.Pool memory _p) 
  {
    Def memory _d = _defaults();
    address safe = _getSafe(cpp.unit, self.pData.safeFactory);
    for(uint i = _d.zero; i < cpp.members.length; i++) {
      address user = cpp.members[i];
      if(i == _d.zero) {
        _p = _createPool(self, cpp, safe, user, Common.Router.PERMISSIONED);
        _addNewContributor(self, _p.lInt.cSlot, _p.bigInt.unit, user, _d.t, _d.t, _d.t);
      } else {
        bool(user != _p.addrs.admin).assertTrue("Admin spotted twice");
        _addNewContributor(self, _p.lInt.cSlot, _p.bigInt.unit, user, _d.f, _d.t, _d.f);
        _p = _getCurrentPool(self, _p.bigInt.unit).data; 
      } 
    }
  }

  // /**
  //  * @dev Return safe for user
  //  * @param safeFactory: StrategyManager contract address
  //  * @param unit : Caller
  //  */
  // function _getSafe(
  //   address safeFactory, 
  //   uint256 unit
  // ) 
  //   internal 
  //   view
  //   returns(address _safe) 
  // {
  //   _safe = IBankFactory(safeFactory).getBank(unit);
  // }

  /**
   * @dev Checks, validate and return safe for the target address.
   * @param unit : Unit contribution.
   * @param safeFactory : StrategyManager contract address.
   */
  function _getSafe(
    uint256 unit,
    address safeFactory
  ) 
    private 
    returns(address safe) 
  {
    safe = IBankFactory(safeFactory).createBank(unit);
    assert(safe != address(0));
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
  {
    uint8 pos = uint8(self.cData[cSlot].length);
    self.cData[cSlot].push(); 
    self.slots[user][unit] = Common.Slot(pos, isMember, isAdmin);
    self.cData[cSlot][pos] = Common.Contributor(0, 0, 0, 0, 0, 0, user, sentQuota, 0);
    uint uId = self.indexes[unit];
    self.current[uId].lInt.userCount ++;
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
    self.cData[up.cSlot][up.slot.value] = up.cData;
    self.slots[up.user][up.unit] = up.slot;
  }

  ///@dev Award points to user based on contribution
  function _awardPoint(mapping(address => Common.Point) storage self, address user, bool isCreator) internal {
    isCreator? self[user].creator += 5 : self[user].contributor += 2;
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
    Common.Slot memory uSlot = self.slots[user][unit];
    uint cSlot = _getCurrentPool(self, unit).data.lInt.cSlot;
    if(self.cData[cSlot].length > 0){
      cbt = self.cData[cSlot][uSlot.value];
    } else {
      cbt = Common.Contributor(0, 0, 0, 0, 0, 0, address(0), false, 0);
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
    returns (Common.Pool memory _p)
  {
    Def memory _d = _defaults();
    address user = cpp.members[0];
    address safe = _getSafe(cpp.unit, self.pData.safeFactory);
    _p = _createPool(self, cpp, safe, user, Common.Router.PERMISSIONLESS);
    _addNewContributor(self, _p.lInt.cSlot, _p.bigInt.unit, user, _d.t, _d.t, _d.t);
  }

  /**@dev Add new contributor to a band.
   * @param self: Storage ref of type Data.
   * @param _ab: Parameters struct.
   * @notice A contributor can occupy more than one spot.
  */
  function addToPool(
    Data storage self,
    Common.AddTobandParam memory _ab
  )
    internal
    returns (
      Common.Pool memory _p
    ) 
  {
    Def memory _d = _defaults();
    _isValidUnit(self, _ab.unit);
    _p = _getCurrentPool(self, _ab.unit).data;
    address caller = _msgSender();
    _validateStage(_p.stage, Common.Stage.JOIN, "Cannot add contributor");
    if(_ab.isPermissioned) {
      _mustBeAMember(self, _ab.unit, caller);
      self.cData[_p.lInt.cSlot][_getSlot(self.slots, caller, _ab.unit).value].sentQuota = _d.t;
    } else {
      if(_p.lInt.userCount >= _p.lInt.quorum) revert Common.PoolIsFilled();
      _mustNotBeAMember(self, _ab.unit, caller);
      _addNewContributor(self, _p.lInt.cSlot, _ab.unit, caller, _d.f, _d.t, _d.t);
      _p = _getCurrentPool(self, _ab.unit).data;
    }
    _p.bigInt.currentPool += _p.bigInt.unit;
    if(_isPoolFilled(_p, _ab.isPermissioned)) {
      self.cData[_p.lInt.cSlot][_p.lInt.selector].turnStartTime = _now();
      _p = _setNextStage(_p, Common.Stage.GET);
    }
    _validateAndWithdrawAllowance(caller, _p.addrs.asset, _p.bigInt.unit, _p.addrs.bank);
    _addUpToSafe(_p.addrs.bank, caller, _p.bigInt.recordId);
    _callback(self, _p, _p.bigInt.unitId);
  }

  /**
   * @dev Validate stage for invoked function.
   */
  function _validateStage(
    Common.Stage expected, 
    Common.Stage actual, 
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
    if(!_getSlot(self.slots, user, unit).isMember) revert Common.NotAMember();
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
  function _isPoolFilled(Common.Pool memory _p, bool isPermissioned) 
    internal 
    pure
    returns(bool filled) 
  {
    uint expected = _p.bigInt.unit.mul(_p.lInt.quorum);
    filled = !isPermissioned? _p.lInt.userCount == _p.lInt.quorum : expected == _p.bigInt.currentPool;
  }

  // /**@dev Update selector to who will get finance next
  //   * @param self: Storage {typeof mapping}
  //   * @param cSlot: Pool index.
  //   * @param selector : Spot selector.
  // */
  // function _setTurnTime(
  //   Data storage self, 
  //   uint selector, 
  //   uint cSlot
  // ) 
  //   private
  // {
  //   self.cData[cSlot][selector].turnStartTime = _now();
  // }

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

  /**@dev Get finance: Sends current total contribution to the 
   * expected account and update respective accounts.
    @param self : Storage of type Data.
    @param unit : Contribution amount.
    @param daysOfUseInHr : Number of days specified in hours after which 
                      the contributor shall return the borrowed fund.
    @param getPriceOfCollateralToken : A function that returns the current price of XFI.
  */
  function getFinance(
    Data storage self,
    uint256 unit,
    uint16 daysOfUseInHr,
    function () internal returns(uint128) getPriceOfCollateralToken
  ) 
    internal
    returns(Common.Pool memory _p, uint256 amtFinanced, uint colDeposited)
  {
    _isValidUnit(self, unit);
    _p = _getCurrentPool(self, unit).data;
    amtFinanced = _p.bigInt.currentPool;
    _validateStage(_p.stage, Common.Stage.GET, "Borrow not ready");
    if(_p.lInt.allGh == _p.lInt.quorum) revert IFactory.AllMemberIsPaid();
    _p = _incrementGF(_p);
    if(_p.bigInt.currentPool < (_p.bigInt.unit.mul(_p.lInt.quorum))) revert Common.PoolNotComplete();
    (_p, colDeposited) = _updateStorageAndCall(
      self,
      Common.UpdateMemberDataParam( 
        _convertDurationToSec(daysOfUseInHr), 
        self.cData[_p.lInt.cSlot][_p.lInt.selector].id,
        unit,
        _p.bigInt.unitId,
        _p.bigInt.currentPool.computeFee(self.pData.makerRate),
        getPriceOfCollateralToken(),
        _p
      )
    );
    self.cData[_p.lInt.cSlot][_p.lInt.selector - 1].getFinanceTime = _now();
    _callback(self, _p, _p.bigInt.unitId);
  }

  /**@dev Increment allGh when one member get finance
  */
  function _incrementGF(
   Common.Pool memory pool 
    // uint unitId
  )  
    internal
    pure
    returns(Common.Pool memory _p) 
  {
    pool.lInt.allGh ++;
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
    uint24 ccr,
    uint128 collateralTokenPrice,
    uint8 colDecimals
  )
    internal
    pure
    returns(uint collateral)
  { 
    collateral = Common.Price(collateralTokenPrice, colDecimals).computeCollateral(ccr, loanAmount);
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
      party another chance to GF since the ticker i.e 'pool.lInt.selector' waits for no one. It is always
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
    returns (Common.Pool memory _p, uint computedCol) 
  {
    address caller = arg.expected;
    Common.Contributor memory cbt = _getProfile(self, arg.unit, arg.expected); // Expected contributor
    if(_now() > cbt.turnStartTime + 1 hours){
      if(_msgSender() != arg.expected) {
        caller = _msgSender();
        _mustBeAMember(self, arg.unit, caller);
        cbt = _swapFullProfile(self, Common.SwapProfileArg(_getSlot(self.slots, caller, arg.unit), arg.expected, caller, arg.unit, arg.pool.lInt.cSlot, cbt));
      }
    } else {
      if(_msgSender() != cbt.id) revert Common.TurnTimeHasNotPassed();
      // require(_msgSender() == cbt.id, "Turn time has not passed");
    }
    computedCol = _computeCollateral(arg.pool.bigInt.currentPool, uint24(arg.pool.lInt.colCoverage), arg.colPriceInDecimals, IERC20(self.pData.collateralToken).decimals());
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
    sw.expcData.id = sw.actCaller;
    aCData.id = sw.expCaller;
    _updateUserData(self, Common.UpdateUserParam (aCData,  aSlot, sw.cSlot, sw.unit, sw.expCaller));
    _updateUserData(self, Common.UpdateUserParam (sw.expcData, sw.expSlot, sw.cSlot, sw.unit, sw.actCaller));
    aCData = sw.expcData;
  }

  /**
   * @dev Returns the current stage of pool at unitId 
   */
  function _getStage(
    Common.Pool[] storage self, 
    uint unitId
  ) internal view returns(Common.Stage stage) {
    stage = self[unitId].stage;
  }

  /**
   * @dev Sets the next stage of an epoch
   */
  function _setNextStage(
    Common.Pool memory _p, 
    Common.Stage nextStage
  ) internal pure returns(Common.Pool memory _p_) {
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
    view returns(Common.DebtReturnValue memory drv) 
  {
    uint intPerSec = _getCurrentPool(self, unit).data.interest.intPerSec;
    drv.pos = _getSlot(self.slots, user, unit).value;
    Common.Contributor memory _cb = _getProfile(self, unit, user);
    drv.debt = _cb.loan.add(intPerSec.mul(_now().sub(_cb.turnStartTime)));
  }

  function _clearDebt(Common.Contributor memory cData) internal pure returns(Common.Contributor memory _cData) {
    cData.loan = 0;
    cData.colBals = 0;
    _cData = cData;
  }

  /**@dev Reset pool balances
    @param _p: Pool (location type is memory)
   */
  function _replenishPoolBalance(Common.Pool memory _p) internal pure returns(Common.Pool memory _p_) {
    _p.bigInt.currentPool = _p.bigInt.unit.mul(_p.lInt.quorum);
    _p_ = _p;
  }

  
  /**@dev Check if round is completed i.e all contributors have received finance
  */
  function _allHasGF(Common.Pool memory pool) internal pure returns(bool) {
    return pool.lInt.allGh == pool.lInt.quorum;
  }

  function payback(Data storage self, Common.PaybackParam memory pb) internal returns(uint, uint, Common.Pool memory) {
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
    returns(uint amtPayBackInUSD, uint colWithdrawn, Common.Pool memory _p)
  {
    _isValidUnit(self, pb.unit);
    _p = _getCurrentPool(self, pb.unit).data;
    Common.Contributor memory _cData = _getProfile(self, pb.unit, pb.user);
    _validateStage(_p.stage, Common.Stage.PAYBACK, "Payback not ready");
    uint debt = _getCurrentDebt(self, pb.unit, pb.user).debt;
    if(debt == 0) revert Common.NoDebtFound();
    amtPayBackInUSD = _cData.loan;
    colWithdrawn = _cData.colBals;
    _cData = _clearDebt(_cData);
    _awardPoint(self.points, pb.user, _defaults().f);
    bool allGF = _allHasGF(_p);
    if(!allGF){
      _p = _replenishPoolBalance(_p);
      _p = _setNextStage(_p, Common.Stage.GET);
      self.cData[_p.lInt.cSlot][_p.lInt.selector].paybackTime = _now();
      _callback(self, _p, self.indexes[pb.unit]);
      self.cData[_p.lInt.cSlot][_getSlot(self.slots, pb.user, pb.unit).value] = _cData;
    } else {
      _p = _setNextStage(_p, Common.Stage.ENDED);
      self.cData[_p.lInt.cSlot][_getSlot(self.slots, pb.user, pb.unit).value] = _cData;
      _callback(self, _shuffle(self, _p), self.indexes[pb.unit]);
    }
    (address user, IERC20 colToken) = (pb.user, self.pData.collateralToken);
    Common.Contributor[] memory cDatas = self.cData[_p.lInt.cSlot];
    (bool _isSwapped, address _defaulted, uint rId) = (isSwapped, defaulted, _p.bigInt.recordId);
    uint256 attestedInitialBal = IERC20(_p.addrs.asset).balanceOf(_p.addrs.bank);
    _validateAndWithdrawAllowance(user, _p.addrs.asset, debt, _p.addrs.bank);
    IBank(_p.addrs.bank).payback(Common.Payback_Bank(user, _p.addrs.asset, debt, attestedInitialBal, allGF, cDatas, _isSwapped, _defaulted, rId, colToken));
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
        _now() <= prof.paybackTime? 
          (_liq, defaulted, currentDebt, slot, defaulter) 
            : 
              ( 
                prof, 
                _defaults().t, 
                _getCurrentDebt( self, unit, _liq.id).debt, 
                self.slots[prof.id][unit],
                prof.id
              );
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
    returns(uint, uint, Common.Pool memory _p)
  {
    (Common.Contributor memory prof, bool defaulted,, Common.Slot memory slot, address defaulter) = _enquireLiquidation(self, unit);
    if(!defaulted) revert Common.CurrentReceiverIsNotADefaulter();
    address liquidator = _msgSender() ;
    _mustNotBeAMember(self, unit, liquidator);
    prof.id = liquidator;
    _updateUserData(
      self, 
      Common.UpdateUserParam(prof, slot, _getCurrentPool(self, unit).data.lInt.cSlot, unit, liquidator)
    );
    delete self.slots[defaulter][unit];
    self.current[self.indexes[unit]].addrs.lastPaid = liquidator;
    return _payback(self, Common.PaybackParam(unit, liquidator), true, defaulter);
  }

  /**
   * @dev Shuffle between pools i.e moves a finalized pool to the records ledger.
   * This action resets the data at 'uId' after moving it to records for viewing purpose.
   */
  function _shuffle(
    Data storage self,
    Common.Pool memory _p
  ) internal returns(Common.Pool memory empty) {
    empty = self.current[0];
    self.records[_p.bigInt.recordId] = _p;
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
    _isValidUnit(self, unit);
    Common.Pool memory _p = _getCurrentPool(self, unit).data;
    address creator = _msgSender();
    _isAdmin(self, unit, creator);
    if(isPermissionLess) {
      if(_p.lInt.userCount > 1 || _p.lInt.userCount < 1) revert Common.CancellationNotAllowed();
    } else {
      if(_p.bigInt.currentPool > _p.bigInt.unit) revert Common.CancellationNotAllowed();
    }
    _p.stage = Common.Stage.CANCELED;
    _callback(self, _shuffle(self, _p), _p.bigInt.unitId);
    IBank(_p.addrs.bank).cancel(creator, _p.addrs.asset, _p.bigInt.unit, _p.bigInt.recordId);
  }

  function _isAdmin(
    Data storage self,
    uint256 unit,
    address user
  ) 
    internal
    view
  {
    if(!self.slots[user][unit].isAdmin) revert Common.OnlyAdminIsAllowed();
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
    address safeFactory,
    IERC20 colToken
  ) 
    internal 
    returns(bool)
  {
    if(address(assetAdmin) != address(0)) self.pData.assetAdmin = assetAdmin;
    if(safeFactory != address(0)) self.pData.safeFactory = safeFactory;
    if(address(colToken) != address(0)) self.pData.collateralToken = colToken;
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
  function getData(Data storage self, uint uId) internal view returns(Common.ReadDataReturnValue memory rd) {
    rd.pool = self.current[uId];
    rd.cData = self.cData[rd.pool.lInt.cSlot];
  }

  /// @dev Return past pools using unitId. @notice The correct unitId must be parsed.
  function getRecord(Data storage self, uint rId) internal view returns(Common.ReadDataReturnValue memory rd) {
    rd.pool = self.records[rId];
    rd.cData = self.cData[rd.pool.lInt.cSlot];
  } 

  function getPoints(Data storage self, address user) internal view returns(Common.Point memory point) {
    point = self.points[user];
  }

  function getSlot(Data storage self, address user, uint256 unit) internal view returns(Common.Slot memory slot) {
    slot = self.slots[user][unit];
  }
}




// if(uId == 0) {
//       self.epoches.increment();
//       uId = self.epoches.current();
//       self.indexes[unit] = uId;
//     }


  // /**
  //  * @dev Return the different balances locked in an epoch
  //  * @param self : Data ref
  //  * @param unit : Unit contribution
  //  */
  // function _getBalancesInBank(
  //   Data storage self,
  //   uint256 unit
  // )
  //   internal
  //   view
  //   returns(Common.Balances memory balances) 
  // {

  //   _isValidUnit(self, unit);
  //   Common.Addresses memory addrs = _getCurrentPool(self, unit).data.addrs;
  //   if(addrs.asset == address(0)){
  //     balances = Common.Balances({
  //       xfi: 0,
  //       erc20: 0
  //     });
  //   } else {
  //     balances = Common.Balances({
  //       xfi: addrs.bank.balance,
  //       erc20: IERC20(addrs.asset).balanceOf(addrs.bank)
  //     });
  //   }
  // }