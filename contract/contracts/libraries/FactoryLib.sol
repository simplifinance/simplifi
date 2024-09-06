// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { Counters } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol";
import { IERC20 } from "../apis/IERC20.sol";
import { IStrategyManager } from "../apis/IStrategyManager.sol";
import { IStrategy } from "../apis/IStrategy.sol";
import { IFactory } from "../apis/IFactory.sol";
import { Common } from "../apis/Common.sol";
import { AssetClass } from "../implementations/AssetClass.sol";
import { Utils } from "../libraries/Utils.sol";

/**@dev
  * @param amountExist: Tracks unit contribution i.e values created in each permissionless communities
  * @param pools: Mapping of epochIds to Pool
  * @param pData: Public State variable stats
  * @param epoches : Total pool created to date
  * @param contributors : Mapping of epochIds to group of contributors
  * @param slots : Reverse map of contributors to epochId to slots on the list.
*/
struct Data {
  IFactory.ContractData pData;
  Counters.Counter epoches; 

  /**Mapping of epochIds to pools */
  mapping(uint => Common.Pool) pools;

  /**Mapping of contribution amount to bool indicating if they exit or not */
  mapping(uint256 => bool) amountExist; 

  /**Mapping of slots to Profiles */
  mapping(uint => Common.Contributor[]) contributors;

  /**Mapping of contributors addresses to epochid to slot */
  mapping(address => mapping(uint => uint)) slots;

  /**Mapping of epochId to contributors addresses to ranks */
  mapping(uint => mapping (address => Common.Rank)) ranks;

  Common.Pool[] poolArr;
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

  event AllGh(uint epochId, Common.Pool pool);

  /**
   * @dev Create a fresh pool
   * @param self: Storage of type `Data`
   * @param cpp: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @param epochId: Pool we are currently dealing with.
   * @param _unlock: Function as parameter. It should unlock a function with related `Common.FuncTag'
   *                 when invoked.
   * @notice We first check that the duraetion given by the admin should not be zero.
   * Note: `.assertChained3` is simply making tripple boolean checks.
   */
  function _createPool(
    Data storage self,
    Common.CreatePoolParam memory cpp,
    function (uint, Common.FuncTag) internal _unlock,
    address strategy,
    address user,
    uint epochId
  ) 
    private 
    returns(Common.Pool memory pool) 
  {
    Def memory _d = _def();
    // Utils.assertTrue_2(cpp.duration > _d.zero, cpp.duration < type(uint8).max, "Invalid duration"); // Please uncomment this line after you have completed the testing.
    _validateAllowance(user, cpp.asset, cpp.unitContribution);
    _updatePoolSlot(self, epochId, cpp, _d, strategy);
    _unlock(epochId, Common.FuncTag.JOIN);
    pool = _fetchPoolData(self, epochId);
    _updateAssetInStrategy(strategy, pool.addrs.asset, epochId);
    _withdrawAllowance(user, cpp.asset, cpp.unitContribution, strategy);
    _pushToStorage(self.poolArr, pool);
  }

  function _def()
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
   * @dev Check that user has given enough approval to spend from their balances
   * @param user : Caller.
   * @param assetInUse : ERC20 currency address to use as contribution base.
   * @param unitContribution : Contribution per user.
   */
  function _validateAllowance(
    address user, 
    address assetInUse, 
    uint unitContribution
  ) 
    internal 
    view 
  {
    require(IERC20(assetInUse).allowance(user, address(this)) >= unitContribution, "FactoryLib: Insufficient allowance");
  }

  /**@notice Send contribution to strategy
   * @param user : User/Caller address
   * @param assetInUse: ERC20 token { USD contract address }
   * @param unitContribution: Unit contribution
   * @param strategy : Address to hold funds on behalf of the members. The factory generates 
   * a strategy by querying StrategyManager. Every address that create a pool must operate a 
   * strategy. This process is managed internally for users.  
   */
  function _withdrawAllowance(
    address user, 
    address assetInUse, 
    uint unitContribution, 
    address strategy
  ) 
    private 
  {
    require(IERC20(assetInUse).transferFrom(user, strategy, unitContribution), "FactoryLib: Transfer failed");
  }

  /*** @dev Update the storage with pool information
   * @param self: Storage of type `Data`
   * @param cpp: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @param epochId: Pool we are currently dealing with.
   * @param _d: Default literal values i.e True, False, 0, 1 and address(0) 
   */
  function _updatePoolSlot(
    Data storage self,
    uint epochId, 
    Common.CreatePoolParam memory cpp,
    Def memory _d,
    address strategy
  ) 
    private 
  {
    Common.InterestReturn memory _itr = cpp.unitContribution.mul(cpp.quorum).computeInterests(cpp.intRate, cpp.duration);
    self.pools[epochId] = Common.Pool(
      Common.Uints(cpp.quorum, _d.zero, cpp.colCoverage, _itr.durInSec),
      Common.Uint256s(_itr.fullInterest, _itr.intPerSec, cpp.unitContribution, cpp.unitContribution),
      Common.Addresses(cpp.asset, _d.zeroAddr, strategy, cpp.members[0]),
      _d.zero
    );
  }

  ///@dev Returns all uint256s related data in pool at epochId.
  function _fetchPoolData(Data storage self, uint epochId) internal view returns (Common.Pool memory _return) {
    _return = self.pools[epochId];
  }

  /**
   * @dev Update strategy.
   * @param strategy : Strategy for creator of band at 'epochId'.
   * @param assetInUse: ERC20 currency address to use as contribution base.
   * @param epochId: Otherwise known as pool Id.
   */
  function _updateAssetInStrategy(
    address strategy,
    address assetInUse,
    uint epochId
  ) private {
    if(!IStrategy(strategy).mapAsset(epochId, assetInUse)){
      revert Common.UpdateStrategyError();
    }
  }

  /**@dev Create permissioned band
   * @param self: Storage of type `Data`.
   * @param cpi : Parameter struct
   * Note: Each of the addresses on the members array must an Account instance. Participants must already own an
   * account before now otherwise, execution will not pass.
   * - Admin cannot replicate themselves in a band.
   * - Each of the contributors must have created account before now.
   * - We assume admin should be address in first slot in the members array, so expression evaluates to `if not admin`.
   */
  function createPermissionedPool(
    Data storage self,
    Common.CreatePermissionedPoolParam memory cpi
  ) 
    internal
    returns (Common.CreatePoolReturnValue memory cpr) 
  {
    Def memory _d = _def();
    uint epochId = _generateEpochId(self);
    address admin = cpi.cpp.members[0];
    address strategy = _fetchAndValidateStrategy(admin, self.pData.strategyManager);
    for(uint i = _d.zero; i < cpi.cpp.members.length; i++) {
      if(i == _d.zero) {
          Common.Pool memory pool = _createPool(self, cpi.cpp, cpi._unlock, strategy, admin, epochId);
        (
          uint slot,
          Common.Contributor memory cbData
        ) = _addNewContributor(self, cpr.epochId, admin, _d.t, _d.t);
        cpr = Common.CreatePoolReturnValue(pool, cbData, epochId, uint16(slot));
      } else {
        address contributor = cpi.cpp.members[i];
        bool(contributor != admin).assertTrue("Admin spotted twice");
        _addNewContributor(self, cpr.epochId, contributor, _d.f, _d.t);
      }
      // self.pools[cpr.epochId].uints.quorum ++;
    }
  }

  /**
   * @dev Return strategy for user
   * @param strategyManager: StrategyManager contract address
   * @param user : Caller
   */
  function _getStrategy(
    address strategyManager, 
    address user
  ) 
    internal 
    view
    returns(address _strategy) 
  {
    _strategy = IStrategyManager(strategyManager).getStrategy(user);
  }

  /**
   * @dev Checks, validate and return strategy for the target address.
   * @param user : Address for whom to get strategy.
   * @param strategyManager : StrategyManager contract address.
   */
  function _fetchAndValidateStrategy(
    address user,
    address strategyManager
  ) 
    private 
    returns(address strategy) 
  {
    strategy = _getStrategy(strategyManager, user);
    if(strategy == address(0)) {
      strategy = IStrategyManager(strategyManager).createStrategy(user);
    }
    assert(strategy != address(0));
  }

    /**
   * @dev Add new member to the pool
   * Note: `target` is expected to be an instance of the `SmartStrategy`
   * @param self: Storage pointer
   * @param epochId: Pool index
   * @param isAdmin: Whether strategy is an admin or not.
   * @param isMember: Strategy strategy is a member or not.
   */
  function _addNewContributor(
    Data storage self, 
    uint epochId, 
    address contributor,
    bool isAdmin,
    bool isMember                                                                                                                                                                                     
  ) 
    private 
    returns(
      uint8 slot,
      Common.Contributor memory cbData
    )
  {
    slot = _generateSlot(self.contributors, epochId);
    _setSlot(self.slots, contributor, slot, epochId);
    self.ranks[epochId][contributor] = Common.Rank({admin: isAdmin, member: isMember});
    cbData.id = contributor;
    _addContributor(self.contributors, cbData, epochId);
  }

  /**@dev Push a new contributor to storage.
    @param self : Storage of type mapping
    @param cbData : Common.Contributor.
    @param epochId : Pool id
   */
  function _addContributor(
    mapping(uint => Common.Contributor[]) storage self, 
    Common.Contributor memory cbData, 
    uint epochId
  ) 
    private 
  {
    self[epochId].push(cbData);
  }

  /**@dev Update contributor's data
    @param self : Storage of type mapping
    @param cbData : Contributor struct containing updated data
    @param epochId : Pool id
    @param slot : Position of Contributor in the list
   */
  function _setContributorData(
    mapping(uint => Common.Contributor[]) storage self, 
    Common.Contributor memory cbData, 
    uint epochId, 
    uint16 slot
  )
    private 
  {
    self[epochId][slot] = cbData;
  }

  /**
   * @dev Return the length of epochs i.e total epoch to date
   * @param self : Storage of type Data
   */
  function _getEpoches(Data storage self) internal view returns(uint) {
    return self.epoches.current();
  } 

  /**
   * @dev Generates Id for new epoch
   * @param self: Storage of type Data
   */
  function _generateEpochId(
    Data storage self
  ) 
    internal 
    returns (uint _return) 
  {
    _return = _getEpoches(self);
    self.epoches.increment();
  }

  /**@dev Ruturn provider's info
    @param self : Storage of type mapping
    @param epochId : Epoch id
    @param user : User 
   */
  function _getProfile(
    Data storage self, 
    uint epochId, 
    address user
  ) 
    internal 
    view 
    returns(Common.ContributorData memory cbt) 
  {
    uint8 slot = _getSlot(self.slots, user, epochId);
    cbt = Common.ContributorData({
      slot: slot,
      cData: self.contributors[epochId][slot],
      rank: _getRank(self.ranks, epochId, user)
    });
  }

  /**@dev Get the slots of strategy on the list
    @param self : Storage of type mapping
    @param epochId : Pool Id
    Note: To avoid irregularity in accessing Strategy array 
      `_generateSlot` must be invoked before adding a new data 
      to the contributors array.
   */
  function _generateSlot(
    mapping(uint => Common.Contributor[]) storage self, 
    uint epochId
  ) 
    internal 
    view 
    returns(uint8 _return) 
  {
    _return = uint8(self[epochId].length);
  }

  /**@dev Creates a new permissionless community i.e public
   * @param self: Storage of type `Data`
   * @param cpp: This is a data struct. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @param _unlock: Function as parameter. It should unlock a function with related `Common.FuncTag'
   *                 when invoked.
   * Note: Only in private bands we mandated the selected contribution value does not exist.
   *       This is to ensure orderliness in the system, timeliness, and efficiency.
   */
  function createPermissionlessPool( 
    Data storage self, 
    Common.CreatePoolParam memory cpp,
    function (uint, Common.FuncTag) internal _unlock
  )
    internal
    returns (Common.CreatePoolReturnValue memory cpr)
  {
    Def memory _d = _def();
    uint epochId = _generateEpochId(self);
    address admin = cpp.members[0];
    address strategy = _fetchAndValidateStrategy(admin, self.pData.strategyManager);
    self.amountExist[cpp.unitContribution].assertFalse("Amount exist");
    self.amountExist[cpp.unitContribution] = _d.t;
    Common.Pool memory pool = _createPool(self, cpp, _unlock, strategy, admin, epochId);
    (
      uint16 slot,
      Common.Contributor memory cbData
    ) = _addNewContributor(self, cpr.epochId, strategy, _d.t, _d.t);
    cpr = Common.CreatePoolReturnValue(pool, cbData, epochId, slot);
    // self.pools[epochId].uints.quorum ++;
  }

  /** 
   * @dev Add contributor to strategy. 
   * @param user : Contributor address
   * @param strategy : Strategy for the epoch
   * @param epochId : Epoch Id
   */
  function addContributorToStrategy(
    address user,
    address strategy,
    uint epochId
  ) 
    private 
  {
    require(IStrategy(strategy).addUp(user, epochId), "Adding User to strategy failed");
  }

  /**
   * @notice Validates epochId
   */
  function verifyEpochId(
    Data storage self,
    uint epochId
  )
    internal
    view
  {
    require(epochId < self.poolArr.length, "FaactoryLib: Invalid epochId");
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
    Common.Pool memory pool = _fetchPoolData(self, _ab.epochId);
    Def memory _d = _def();
    if(_ab.isPermissioned) {
      ced.cbData = _mustBeAMember(self, _ab.epochId, _msgSender());
    } else {
      Utils.assertTrue(_getCurrentProvidersSize(self.contributors, _ab.epochId) < pool.uints.quorum, "Pub filled");
      ced.cbData = _mustNotBeAMember(self, _ab.epochId, _msgSender());
      _addNewContributor(self, _ab.epochId, _msgSender(), _d.f, _d.t);
    }
    self.pools[_ab.epochId].uint256s.currentPool += pool.uint256s.unit;
    Common.Pool memory newPoolData = _fetchPoolData(self, _ab.epochId);
    if(_isPoolFilled(newPoolData)) {
      _ab.lock(_ab.epochId, Common.FuncTag.JOIN);
      _ab.unlock(_ab.epochId, Common.FuncTag.GET);
    }
    _validateAllowance(_msgSender(), pool.addrs.asset, pool.uint256s.unit);
    _withdrawAllowance(_msgSender(), pool.addrs.asset, pool.uint256s.unit, pool.addrs.strategy);
    ced.pool = newPoolData;
    ced.rank = _getRank(self.ranks, _ab.epochId, _msgSender());
    ced.slot = uint8(_getSlot(self.slots, _msgSender(), _ab.epochId));
  }

  /**
   * @dev Returns the Rank object of a user.
   */
  function _getRank(
    mapping(uint => mapping (address => Common.Rank)) storage self, 
    uint epochId, 
    address user
  ) 
    internal 
    view 
    returns(Common.Rank memory _rank) 
  {
    _rank = self[epochId][user];
  }

  /**
   * @dev A Check to know if _msgSender() is a member of the band at epochId.
   * @param self: Storage {typeof => mapping}
   * @param epochId: Pool index
   * @param contributor: Contributor address
  */
  function _mustBeAMember(
    Data storage self,
    uint epochId,
    address contributor
  ) 
    internal 
    view 
    returns(Common.Contributor memory cbData) 
  {
    cbData = self.contributors[epochId][_getSlot(self.slots, contributor, epochId)];
    self.ranks[epochId][contributor].member.assertTrue("Not A Member");
  }

  /**@dev Return number of members already in the pool
   */
  function _getCurrentProvidersSize(mapping(uint => Common.Contributor[]) storage self, uint epochId) internal view returns(uint _return) {
    _return = self[epochId].length;
  }


  /**
   * @dev Msg.sender must not be a member of the band at epoch Id before now.
   * @param self: Storage {typeof mapping}
   * @param epochId: Pool index
   * @param contributor : Contributor
  */
  function _mustNotBeAMember(
    Data storage self,
    uint epochId,
    address contributor
  ) 
    internal 
    view 
    returns(Common.Contributor memory cbData) 
  {
    cbData = self.contributors[epochId][_getSlot(self.slots, contributor, epochId)];
    self.ranks[epochId][contributor].member.assertFalse("Contributor is a member");
  }

  /**@dev Check if pool is filled
    * @dev Msg.sender must not be a member of the band at epoch Id before now.
    * @param pool: Pool struct
  */
  function _isPoolFilled(Common.Pool memory pool) 
    internal 
    pure
    returns(bool filled) 
  {
    uint expectedLiq = pool.uint256s.unit * pool.uints.quorum;
    filled = expectedLiq == pool.uint256s.currentPool;
  }

  /**@dev Update selector to who will get finance next
    * @param self: Storage {typeof mapping}
    * @param epochId: Pool index.
    * @param selector : Spot selector.
  */
  function _setTurnTime(
    Data storage self, 
    uint selector, 
    uint epochId
  ) 
    private
    returns(address contributor)
  {
    self.contributors[epochId][selector].turnTime = _now();
    contributor = self.contributors[epochId][selector].id;
  }

  /**@dev Get the slots of contributor on the list
    @param self : Storage of type mappping
    @param contributor : Contributor address
   */
  function _getSlot(
    mapping(address =>mapping(uint => uint)) storage self, 
    address contributor, 
    uint epochId
  ) 
    internal 
    view 
    returns(uint8 _return) 
  {
    _return = uint8(self[contributor][epochId]);
  }

  /**@dev Set the slot for contributor
    @param self : Storage of type mapping
    @param contributor : Contributor
    @param slot : New index
   */
  function _setSlot(
    mapping(address => mapping(uint => uint)) storage self, 
    address contributor, 
    uint8 slot, 
    uint epochId
  ) 
    private 
  {
    self[contributor][epochId] = slot;
  }
  
  /**@dev Set amount withdrawable by provider in their respective strategy.
   * @param contributor : Contributor.
   * @param epochId: Pool index.
   * @param amount: Amount to set as claim.
   * @param fee: platform fee if any.
   * @param debt Loan or debt if any.
   * @param feeTo : If fee is greater than 0, feeTo (fee Recipient) must not be address(0).
   * @param allHasGF : A booleab flag indicating if all providers has fulfilled their borrowings.
   * @param strategy: Strategy for mentioned epoch.
   * @param txType : The type of transaction to perform in the strategy contract. It can either 
   *                  be ERC20 or NATIVE.
   */

  function _setClaim(
    uint amount,
    uint epochId,
    uint fee,
    uint debt,
    address contributor,
    address strategy,
    address feeTo,
    bool allHasGF,
    Common.TransactionType txType
  ) 
    private 
  {
    require(
      IStrategy(strategy).setClaim(
        amount,
        fee,
        debt,
        epochId,
        contributor,
        feeTo,
        allHasGF,
        txType
      ),
      "FactoryLib: Call to strategy failed"
    );
  }

  /**@dev Get finance: Sends current total contribution to the 
   * expected account and update respective accounts.
    @param self : Storage of type Data.
    @param epochId : Pool Id.
    @param msgValue : Value sent in call.
    @param daysOfUseInHr : Number of days specified in hours after which 
                      the contributor shall return the borrowed fund.
    @param _lock : Utility that lock a function when called.
    @param _unlock : Utility that unlock a function when called.
    @param getXFIPriceInUSD : A function that returns the current price of XFI.
  */
  function getFinance(
    Data storage self,
    uint epochId,
    uint msgValue,
    uint16 daysOfUseInHr,
    function (uint, Common.FuncTag) internal _lock,
    function (uint, Common.FuncTag) internal _unlock,
    function () internal returns(uint) getXFIPriceInUSD
  ) 
    internal
    returns(Common.CommonEventData memory ced)
  {
    _lock(epochId, Common.FuncTag.GET);
    _unlock(epochId, Common.FuncTag.PAYBACK);
    Common.Pool memory pool = _fetchPoolData(self, epochId);
    if(pool.allGh == pool.uints.quorum) revert IFactory.AllMemberIsPaid();
    _increaseAllGh(self.pools, epochId);
    bool(pool.uint256s.currentPool >= (pool.uint256s.unit.mul(pool.uints.quorum))).assertTrue("Pool not complete");
    ced = _updateStorageAndCall(
      self,
      Common.UpdateMemberDataParam(
        _validateDuration(daysOfUseInHr, pool.uints.duration),
        self.contributors[epochId][pool.uints.selector].id,
        epochId,
        pool.uint256s.currentPool.computeFee(self.pData.makerRate),
        msgValue,
        getXFIPriceInUSD(),
        pool
      )
    );
  }

  /**@dev Increase slot selector
   *  This is a flag we use in selecting the next borrower.
  */
  function _increaseSelector(
    mapping(uint => Common.Pool) storage self, 
    uint epochId
  ) 
    private 
  {
    self[epochId].uints.selector ++;
  }

  /**@dev Increment allGh when one member get finance
  */
  function _increaseAllGh(
    mapping(uint => Common.Pool) storage self, 
    uint epochId
  )  
    private 
  {
    self[epochId].allGh ++;
  }

  /**
   * @dev Validates duration selected by this contributor must not exceed the set duration.
   * @param durInHrs : Contributor's prefered duration specified in hours.
   * @param expDur : Duration set by the band creator.
   */
  function _validateDuration(
    uint16 durInHrs, 
    uint expDur
  ) 
    internal 
    pure
    returns(uint48 durOfChoiceInSec) 
  {
    durOfChoiceInSec = durInHrs * 1 hours;
    bool(durOfChoiceInSec <= expDur).assertTrue("Duration exceed maximum");
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
      amountOfXFISent > 0
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
  */  
  function _updateStorageAndCall(
    Data storage self,
    Common.UpdateMemberDataParam memory arg
  ) 
    private
    returns (Common.CommonEventData memory ced) 
  {
    Def memory _d = _def();
    _resetPoolBalance(self.pools, arg.epochId);
    address sender = arg.expected;
    Common.ContributorData memory cbt = _getProfile(self, arg.epochId, arg.expected); // Expected contributor
    ced.slot = cbt.slot;
    ced.cbData = cbt.cData;
    if(_now() > ced.cbData.turnTime + 1 hours){
      if(_msgSender() != arg.expected) {
        sender = _msgSender();
        _mustBeAMember(self, arg.epochId, sender);
        (ced.cbData, ced.slot) = _swapSlots(self, ced.slot, arg.expected, sender, arg.epochId);
      }
    }
    _computeCollateral(
      arg.pool.uint256s.currentPool,
      arg.msgValue,
      uint24(arg.pool.uints.colCoverage),
      arg.xfiUSDPriceInDecimals
    );
    self.pools[arg.epochId].addrs.lastPaid = sender;
    _increaseSelector(self.pools, arg.epochId);
    ced.cbData = Common.Contributor({
      durOfChoice: arg.durOfChoice,
      expInterest: _computeDebt(arg.durOfChoice, uint48(arg.pool.uints.duration), arg.pool.uint256s.currentPool, arg.pool).sub(arg.pool.uint256s.currentPool),
      payDate: _now().add(arg.durOfChoice),
      turnTime: _now(),
      loan: arg.pool.uint256s.currentPool,
      colBals: arg.msgValue,
      hasGH: _d.t,
      id: sender
    });
    _setContributorData(self.contributors, ced.cbData, arg.epochId, ced.slot);
    _setClaim(arg.pool.uint256s.currentPool, arg.epochId, arg.fee, 0 ,sender, arg.pool.addrs.strategy, self.pData.feeTo, _d.f,Common.TransactionType.ERC20);
    ced.pool = _fetchPoolData(self, arg.epochId);
    (bool sent,) = arg.pool.addrs.strategy.call{value:arg.msgValue}("");
    sent.assertTrue("XFI sent to strategy failed");
  }

  function _computeDebt(
    uint48 durOfChoice, 
    uint48 expDur, 
    uint loan, 
    Common.Pool memory _p
  ) 
    internal 
    pure 
    returns(uint debt) 
  {
    debt = durOfChoice < expDur? loan.add(_p.uint256s.intPerSec.mul(durOfChoice)) : loan.add(_p.uint256s.fullInterest);
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
    @param epochId : Pool index
   */
  function _resetPoolBalance(mapping(uint => Common.Pool) storage self, uint epochId) private {
    self[epochId].uint256s.currentPool = _def().zero;
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
   * @param _expSlot: Slot of the expected address.
   * @param _expContributor : The address that should get finance if nothing change.
   * @param _actContributor: Actual calling address.
   * @param epochId: Pool Id.
   * @notice Defaulted address will not be taken out of the band. In this case, we move them backward. 
   *          The worse that could happen to them is to them is for someone else to occupy their slot. 
   */
  function _swapSlots(
    Data storage self,
    uint8 _expSlot,
    address _expContributor,
    address _actContributor,
    uint epochId
  )
    private 
    returns(
      Common.Contributor memory _actInfo, 
      uint8 _actSlot
    ) 
  {
    Common.ContributorData memory cbt = _getProfile(self, epochId, _actContributor);
    _actInfo = cbt.cData;
    _actSlot = _expSlot;
    self.slots[_expContributor][epochId] = cbt.slot;
  }

  /**@dev Payback borrowed fund.
   * @param self : Storage
   * @param pb : Payback Parameters struct.
  */
  function payback(
    Data storage self,
    Common.PaybackParam memory pb
  )
    internal
    returns(Common.CommonEventData memory ced)
  {
    Common.Pool memory _p = _fetchPoolData(self, pb.epochId);
    uint debt = _getCurrentDebt(self, pb.epochId, pb.user);
    bool(debt > 0).assertTrue("No debt");
    pb.unlock(pb.epochId, Common.FuncTag.GET);
    pb.lock(pb.epochId, Common.FuncTag.PAYBACK);
    _replenishPoolBalance(self.pools, pb.epochId);
    _validateAllowance(pb.user, _p.addrs.asset, debt);
    _withdrawAllowance(pb.user, _p.addrs.asset, debt, _p.addrs.strategy);
    ced = Common.CommonEventData(
      _getSlot(self.slots, pb.user, pb.epochId),
      _getRank(self.ranks, pb.epochId, pb.user),
      _getProfile(self, pb.epochId, pb.user).cData,
      _fetchPoolData(self, pb.epochId)
    );
    _setClaim(
      ced.cbData.colBals,
      pb.epochId,
      0,
      debt,
      pb.user,
      _p.addrs.strategy,
      address(0),
      _allHasGF(self.pools, pb.epochId),
      Common.TransactionType.NATIVE
    );
  }

  /**@dev Return accrued debt for user up to this moment.
   * @param self : Storage
   * @param epochId : EpochId.
   * @param user : Contributor.
   * @notice This is the total accrued debt between the date user was paid and now.
  */
  function _getCurrentDebt(
    Data storage self, 
    uint epochId, 
    address user
  ) 
    internal 
    view returns(uint debt) 
  {
    Common.Pool memory _p = _fetchPoolData(self, epochId);
    Common.Contributor memory _cb = _getProfile(self, epochId, user).cData;
    debt = _cb.loan.add(_p.uint256s.intPerSec.mul(_now().sub(_cb.turnTime)));
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
    @param epochId : Pool index
   */
  function _replenishPoolBalance(mapping(uint => Common.Pool) storage self, uint epochId) private {
    Common.Pool memory pool = self[epochId];
    self[epochId].uint256s.currentPool = pool.uint256s.unit.mul(pool.uints.quorum);
  }

  
  /**@dev Check if round is completed i.e all contributors have received finance
  */
  function _allHasGF(mapping(uint => Common.Pool) storage self, uint epochId) internal view returns(bool) {
    Common.Pool memory pool = self[epochId];
    return pool.allGh == pool.uints.quorum;
  }

  /**
   * @dev Return struct object with data if current beneficiary has defaulted otherwise an empty struct is returned.
   * @param self : Storage
   * @param epochId: Pool id
   */
  function _enquireLiquidation(
    Data storage self, 
    uint epochId
  ) 
    internal 
    view 
    returns (Common.Contributor memory _liq, bool defaulted, uint currentDebt) 
  {
    Common.Pool memory _p = _fetchPoolData(self, epochId);
    // uint16 slot = _getSlot(self.slots, _p.addrs.lastPaid, epochId);
    Common.Contributor memory prof = _getProfile(self, epochId, _p.addrs.lastPaid).cData;
    (_liq, defaulted, currentDebt) 
      = 
        _now() <= prof.payDate? 
          (_liq, _def().f, 0) 
            : 
              (prof, _def().t, _getCurrentDebt(
                self,
                epochId,
                prof.id
              ));
  }

  /**
    @dev Liquidates a borrower if they have defaulted in repaying their loan.
      - If the current beneficiary defaults, they're liquidated.
      - Their collateral balances is forwarded to the liquidator.
      - Liquidator must not be a participant in pool at `epochId. We use this 
        to avoid fatal error in storage.
    @param self : Storage ref.
    @param lp : Parameters.
  */
  function liquidate(
    Data storage self,
    Common.LiquidateParam memory lp
  ) 
    internal
    returns (Common.CommonEventData memory ced)
  {
    (Common.Contributor memory prof, bool defaulted,) = _enquireLiquidation(self, lp.epochId);
    defaulted.assertTrue("Not defaulter");
    address liquidator = _msgSender();
    _mustNotBeAMember(self, lp.epochId, liquidator);
    self.pools[lp.epochId].addrs.lastPaid = liquidator;
    _swapProfile(self, lp.epochId, _getSlot(self.slots, prof.id, lp.epochId), liquidator, prof, self.ranks[lp.epochId][prof.id]);
    ced = payback(
      self, 
      Common.PaybackParam(
        lp.epochId, 
        liquidator,
        lp.lock, 
        lp.unlock
      )
    ); 
  }

  /**
   * @dev Swaps profiles of two contributors
   * This is useful during liquidation where we swap the defaulted borrower's
   * profile to the liquidator. One thing to note is that when liquidation takes
   * place, the new contributor will have their collateral balances and debts set
   * to zero while this is not the case otherwise.
   */
  function _swapProfile(
    Data storage self,
    uint epochId,
    uint8 oldProvSlot,
    address newProv,
    Common.Contributor memory oldProvData,
    Common.Rank memory oldProvRank
  ) 
    private 
  {
    Common.Contributor memory newProvData = oldProvData;
    newProvData.id = newProv;
    newProvData.loan = 0;
    newProvData.colBals = 0;
    _setContributorData(self.contributors, newProvData, epochId, oldProvSlot);
    _setSlot(self.slots, newProv, oldProvSlot, epochId);
    self.ranks[epochId][newProv] = oldProvRank;
    delete self.ranks[epochId][oldProvData.id];
    IStrategy(_fetchPoolData(self, epochId).addrs.strategy).swapProvider(epochId, newProv, oldProvData.id);
  }

  /**
    @dev Cancels virgin band i.e Newly created band with only one contributor.
      Only admin of a band can cancel only if no one has join the band.
    @param self : Storage
    @param epochId : Pool Id.
    @param isPermissionLess : Whether band is public or not.
  */
  function cancelBand(
    Data storage self,
    uint epochId,
    bool isPermissionLess
  ) 
    internal
    returns (uint success)
  {
    require(epochId < self.poolArr.length, "Invalid epoch lId");
    Common.Pool memory _p = _fetchPoolData(self, epochId);
    address creator = _msgSender();
    _mustBeAMember(self, epochId, creator);
    Def memory _d = _def();
    if(isPermissionLess) {
      bool(self.contributors[epochId].length == 1).assertTrue("FactoryLib - Pub: Cannot cancel");
      delete self.amountExist[_p.uint256s.unit];
    } else {
      bool(_p.uint256s.currentPool <= _p.uint256s.unit).assertTrue("FactoryLib - Priv: Cannot cancel");
    }
    delete self.poolArr[epochId];
    delete self.pools[epochId];
    delete self.contributors[epochId];
    _setClaim(_p.uint256s.unit, epochId, 0, 0, creator, _p.addrs.strategy, address(0), _d.f, Common.TransactionType.ERC20);
    success = epochId;
  }

  /**
   * @dev Return the different balances locked in an epoch
   * @param self : Data ref
   * @param epochId : Epoch Id
   */
  function _getBalancesOfStrategy(
    Data storage self,
    uint epochId
  )
    internal
    view
    returns(Common.Balances memory balances) 
  {
    Common.Pool memory pool = _fetchPoolData(self, epochId);
    balances = Common.Balances({
      xfi: pool.addrs.strategy.balance,
      erc20: IERC20(pool.addrs.asset).balanceOf(pool.addrs.strategy)
    });
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
    uint16 makerRate
  ) 
    internal 
    returns(bool)
  {
    if(assetAdmin != address(0)) self.pData.assetAdmin = assetAdmin;
    if(feeTo != address(0)) self.pData.feeTo = feeTo;
    if(makerRate < type(uint16).max) self.pData.makerRate = makerRate;
    return true;
  }

  /**
   * @dev Set pool to storage array. 
   * We use it for read purpose.
   */
  function _pushToStorage(
    Common.Pool[] storage self, 
    Common.Pool memory pool
  ) 
    private
  {
    self.push(pool);
  } 

  function fetchPools(
    Data storage self
  )
    internal
    view
    returns(Common.Pool[] memory pools) 
  {
    pools = self.poolArr;
  } 
}

