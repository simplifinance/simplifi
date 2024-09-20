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

  /**Mapping of contributors addresses to epochid to slot */
  mapping(address => mapping(uint => uint)) slots;

  Common.Pool[] poolArr;// For testing only. For better optimization, it will 
                        // removed before going on live network
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
   * @notice We first check that the duraetion given by the admin should not be zero.
   * Note: `.assertChained3` is simply making tripple boolean checks.
   */
  function _createPool(
    Data storage self,
    Common.CreatePoolParam memory cpp,
    address strategy,
    address user,
    bool isPermissionless
  ) 
    private 
    returns(Common.Pool memory pool) 
  {
    Def memory _d = _def();
    uint epochId = _generateEpochId(self);
    Utils.assertTrue_2(cpp.duration > _d.zero, cpp.duration <= 720, "Invalid duration"); // 720hrs = 30 days.
    _validateAllowance(user, cpp.asset, cpp.unitContribution);
    _updatePoolSlot(self.poolArr, cpp, _d, strategy, isPermissionless, epochId);
    // _setNextStage(self.poolArr, epochId, Common.FuncTag.JOIN);
    pool = _fetchPool(self, epochId);
    _updateAssetInStrategy(strategy, cpp.asset, epochId);
    _withdrawAllowance(user, cpp.asset, cpp.unitContribution, strategy);
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
    Common.Pool[] storage self,
    Common.CreatePoolParam memory cpp,
    Def memory _d,
    address strategy,
    bool isPermissionless,
    uint epochId
  ) 
    private
  {
    uint24 durInSec = _convertDurToSec(uint16(cpp.duration));
    Common.InterestReturn memory _itr = cpp.unitContribution.mul(cpp.quorum).computeInterestsBasedOnDuration(cpp.intRate, durInSec, durInSec);
    self[epochId].uints = Common.Uints(cpp.quorum, _d.zero, cpp.colCoverage, durInSec, cpp.intRate);
    self[epochId].uint256s = Common.Uint256s(_itr.fullInterest, _itr.intPerSec, cpp.unitContribution, cpp.unitContribution, epochId);
    self[epochId].addrs = Common.Addresses(cpp.asset, _d.zeroAddr, strategy, cpp.members[0]);
    self[epochId].isPermissionless = isPermissionless;
    self[epochId].cData.push(
      Common.ContributorData(
        Common.Contributor(0, 0, 0, 0, 0, 0, cpp.members[0]),
        Common.Rank(true, true),
        0
      )
    );
  }

  ///@dev Returns all uint256s related data in pool at epochId.
  function _fetchPool(Data storage self, uint epochId) internal view returns (Common.Pool memory _return) {
    _return = self.poolArr[epochId];
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
    Def memory _d = _def();
    address admin = cpp.members[0];
    address strategy = _fetchAndValidateStrategy(admin, self.pData.strategyManager);
    for(uint i = _d.zero; i < cpp.members.length; i++) {
      if(i == _d.zero) {
          cpr.pool = _createPool(self, cpp, strategy, admin, _d.f);
          cpr.cData = _addNewContributor(self, cpr.pool.uint256s.epochId, admin, _d.t, _d.t);
      } else {
        address contributor = cpp.members[i];
        bool(contributor != admin).assertTrue("Admin spotted twice");
        _addNewContributor(self, cpr.pool.uint256s.epochId, contributor, _d.f, _d.t);
        cpr.pool = _fetchPool(self, cpr.pool.uint256s.epochId); 
      } 
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
      Common.ContributorData memory cData
    )
  {
    self.poolArr[epochId].cData.push();
    uint8 slot = uint8(self.poolArr[epochId].userCount.current());
    self.poolArr[epochId].userCount.increment();
    cData = _addContributor(self, slot, Common.Rank({admin: isAdmin, member: isMember}), contributor, epochId);
  }

  /**@dev Push a new contributor to storage.
    @param self : Storage of type Common.ContributorData array
    @param rank : User's rank
    @param slot : User's slot
    @param contributor : Caller's address
   */
  function _addContributor(
    Data storage self, 
    uint8 slot,
    Common.Rank memory rank,
    address contributor,
    uint epochId
  ) 
    private 
    returns (Common.ContributorData memory cData)
  {
    _setSlotAndRank(self.poolArr[epochId].cData, slot, rank, contributor);
    self.slots[contributor][epochId] = slot;
    cData = _getProfile(self, slot, epochId);
  }

  /**@dev Update contributor's data
    @param self : Storage of type mapping
    @param cbData : Contributor struct containing updated data
    @param rank :  User rank of type Common.Rank.
    @param slot : Position of Contributor in the list
   */
  function _setContributorData(
    Common.ContributorData[] storage self, 
    Common.Contributor memory cbData,
    Common.Rank memory rank,
    uint16 slot 
  )
    private 
  {
    self[slot] = Common.ContributorData(
      {
        cData: Common.Contributor(
          {
            durOfChoice: cbData.durOfChoice,
            expInterest: cbData.expInterest,
            payDate: cbData.payDate,
            turnTime: cbData.turnTime,
            loan: cbData.loan,
            colBals: cbData.colBals,
            id: cbData.id
          }
        ),
        rank: rank,
        slot: uint8(slot)
      }
    );
  }

  /**
   * @dev Return the length of epochs i.e total epoch to date
   * @param self : Storage of type Data
   */
  function _getEpoches(Data storage self) internal view returns(uint epoch) {
    epoch = self.epoches.current();
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
    self.poolArr.push();
    _return = _getEpoches(self);
    self.epoches.increment();
  }

  /**@dev Ruturn provider's info
    @param self : Storage of type Common.ContributorData
   */
  function _getProfile(
    Data storage self,
    uint slot,
    uint epochId
  ) 
    internal 
    view 
    returns(Common.ContributorData memory cbt) 
  {
    cbt = self.poolArr[epochId].cData[slot];
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
    Def memory _d = _def();
    address admin = cpp.members[0];
    address strategy = _fetchAndValidateStrategy(admin, self.pData.strategyManager);
    self.amountExist[cpp.unitContribution].assertFalse("Amount exist");
    self.amountExist[cpp.unitContribution] = _d.t;
    cpr.pool = _createPool(self, cpp, strategy, admin, _d.t);
    cpr.cData = _addNewContributor(self, cpr.pool.uint256s.epochId, admin, _d.t, _d.t);
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
    require(epochId < _getEpoches(self), "Epoch Id has not begin");
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
    ced.pool = _fetchPool(self, _ab.epochId);
    _validateStage(ced.pool.stage, Common.FuncTag.JOIN, "Add Liquidity not ready");
    Def memory _d = _def();
    if(_ab.isPermissioned) {
      _mustBeAMember(self, _ab.epochId, _msgSender());
    } else {
      Utils.assertTrue(_getUserCount(self.poolArr[_ab.epochId]) < ced.pool.uints.quorum, "Pub filled");
      _mustNotBeAMember(self, _ab.epochId, _msgSender());
      _addNewContributor(self, _ab.epochId, _msgSender(), _d.f, _d.t);
    }
    self.poolArr[_ab.epochId].uint256s.currentPool += ced.pool.uint256s.unit;
    ced.pool = _fetchPool(self, _ab.epochId);
    if(_isPoolFilled(self.poolArr[_ab.epochId], _ab.isPermissioned)) {
      _setTurnTime(self, ced.pool.uints.selector, _ab.epochId);
      _setNextStage(self.poolArr, _ab.epochId, Common.FuncTag.GET);
    }
    _validateAllowance(_msgSender(), ced.pool.addrs.asset, ced.pool.uint256s.unit);
    _withdrawAllowance(_msgSender(), ced.pool.addrs.asset, ced.pool.uint256s.unit, ced.pool.addrs.strategy);
    addContributorToStrategy(_msgSender(), ced.pool.addrs.strategy, _ab.epochId); 
    ced.pool = _fetchPool(self, _ab.epochId);
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
  {
    Common.Pool memory pool = _fetchPool(self, epochId);
    uint8 slot = _getSlot(self.slots, contributor, epochId);
    slot == 0? 
      bool(contributor == pool.addrs.admin).assertTrue("Admin cannot liquidate")
        : 
          _getProfile(self, slot, epochId).rank.member.assertTrue("Not a member");
  }

  /**@dev Return number of members already in the pool 
   */
  function _getUserCount(Common.Pool storage self) internal view returns(uint _return) {
    _return = self.userCount.current();
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
  {
    Common.Pool memory pool = _fetchPool(self, epochId);
    uint8 slot = _getSlot(self.slots, contributor, epochId);
    slot == 0? 
      bool(contributor != pool.addrs.admin).assertTrue("Admin cannot liquidate")
        : 
          require(false, "Not permitted");
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
    * @param epochId: Pool index.
    * @param selector : Spot selector.
  */
  function _setTurnTime(
    Data storage self, 
    uint selector, 
    uint epochId
  ) 
    private
  {
    self.poolArr[epochId].cData[selector].cData.turnTime = _now();
  }

  function getProfile(
    Data storage self, 
    address user,
    uint epochId
  ) 
    internal 
    view 
    returns(Common.ContributorData memory) 
  {
    return _getProfile(self, _getSlot(self.slots, user, epochId), epochId);
  }

  /**@dev Get the slots of user with address and epochId
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
    @param self : Common.ContributorData
    @param rank : User's Rank
    @param slot : User's position
    @param user : User's address
   */
  function _setSlotAndRank(
    Common.ContributorData[] storage self,
    uint8 slot, 
    Common.Rank memory rank,
    address user
  ) 
    private 
  { 
    self[slot].slot = slot;
    self[slot].rank = rank;
    self[slot].cData.id = user;
  }
  
  /**@dev Set amount withdrawable by provider in their respective strategy.
   * @param scp : Parameter of type Common.SetClaimPAram
  */

  function _setClaim(Common.SetClaimParam memory scp) 
    private 
    returns(uint actualClaim)
  {
    actualClaim = 
      IStrategy(scp.strategy).setClaim{value: scp.value}(
        scp.amount,
        scp.fee,
        scp.debt,
        scp.epochId,
        scp.contributor,
        scp.feeTo,
        scp.allHasGF,
        scp.txType
      );
  }

  /**@dev Get finance: Sends current total contribution to the 
   * expected account and update respective accounts.
    @param self : Storage of type Data.
    @param epochId : Pool Id.
    @param msgValue : Value sent in call.
    @param daysOfUseInHr : Number of days specified in hours after which 
                      the contributor shall return the borrowed fund.
    @param getXFIPriceInUSD : A function that returns the current price of XFI.
  */
  function getFinance(
    Data storage self,
    uint epochId,
    uint msgValue,
    uint16 daysOfUseInHr,
    function () internal returns(uint) getXFIPriceInUSD
  ) 
    internal
    returns(Common.CommonEventData memory ced)
  {
    Common.Pool memory pool = _fetchPool(self, epochId);
    _validateStage(pool.stage, Common.FuncTag.GET, "Borrow not ready");
    if(pool.allGh == pool.uints.quorum) revert IFactory.AllMemberIsPaid();
    _increaseAllGh(self.poolArr, epochId);
    bool(pool.uint256s.currentPool >= (pool.uint256s.unit.mul(pool.uints.quorum))).assertTrue("Pool not complete");
    ced = _updateStorageAndCall(
      self,
      Common.UpdateMemberDataParam(
        _convertDurToSec(daysOfUseInHr), 
        self.poolArr[epochId].cData[pool.uints.selector].cData.id,
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
  function _moveSelectorToTheNext(
    Common.Pool[] storage self, 
    uint epochId
  ) 
    private 
  {
    self[epochId].uints.selector ++;
  }

  /**@dev Increment allGh when one member get finance
  */
  function _increaseAllGh(
    Common.Pool[] storage self, 
    uint epochId
  )  
    private 
  {
    self[epochId].allGh ++;
  }

  /**
   * @dev Validates duration selected by this contributor must not exceed the set duration.
   * @param durInHrs : Duration set in hours.
   */
  function _convertDurToSec(
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
    Def memory _d = _def();
    _resetPoolBalance(self.poolArr, arg.epochId);
    address caller = arg.expected;
    Common.ContributorData memory cbt = _getProfile(self, _getSlot(self.slots, arg.expected, arg.epochId), arg.epochId); // Expected contributor
    if(_now() > cbt.cData.turnTime + 1 hours){
      if(_msgSender() != arg.expected) {
        caller = _msgSender();
        _mustBeAMember(self, arg.epochId, caller);
        cbt = _swapFullProfile(self, cbt.slot, arg.expected, caller, arg.epochId, cbt);
      } else {
        // Do thing
      }
    } else {
      require(_msgSender() == cbt.cData.id, "Turn time has not passed");
    }
    bool(
      arg.msgValue >=
      _computeCollateral(
        arg.pool.uint256s.currentPool,
        arg.msgValue,
        uint24(arg.pool.uints.colCoverage),
        arg.xfiUSDPriceInDecimals
      )
    ).assertTrue("Insufficient Collateral in XFI");
    self.poolArr[arg.epochId].addrs.lastPaid = caller;
    _moveSelectorToTheNext(self.poolArr, arg.epochId);
    _setContributorData(
      self.poolArr[arg.epochId].cData,
      Common.Contributor({
        durOfChoice: arg.durOfChoice,
        expInterest: arg.pool.uint256s.currentPool.computeInterestsBasedOnDuration(uint16(arg.pool.uints.intRate), uint24(arg.pool.uints.duration) ,arg.durOfChoice).intPerChoiceOfDur,
        payDate: _now().add(arg.durOfChoice),
        turnTime: cbt.cData.turnTime,
        loan: _setClaim(Common.SetClaimParam(arg.pool.uint256s.currentPool, arg.epochId, arg.fee, 0, arg.msgValue ,caller, arg.pool.addrs.strategy, self.pData.feeTo, _d.f,Common.TransactionType.ERC20)),
        colBals: arg.msgValue,
        id: caller
      }),
      cbt.rank,
      cbt.slot
    );
    _setNextStage(self.poolArr, arg.epochId, Common.FuncTag.PAYBACK);
    ced.pool = _fetchPool(self, arg.epochId);
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
    @param epochId : Pool index
   */
  function _resetPoolBalance(Common.Pool[] storage self, uint epochId) private {
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
   * @param expSlot: Slot of the expected address.
   * @param expCaller : The address that should get finance if nothing change.
   * @param actCaller: Actual calling address.
   * @param epochId: Pool Id.
   * @param expcData: Profile of expected user.
   * @notice Defaulted address will not be taken out of the band. In this case, we move them backward. 
   *          The worse that could happen to them is to them is for someone else to occupy their slot. 
   */
  function _swapFullProfile(
    Data storage self,
    uint8 expSlot,
    address expCaller,
    address actCaller,
    uint epochId,
    Common.ContributorData memory expcData
  )
    private 
    returns(Common.ContributorData memory cbt) 
  {
    cbt = _getProfile(self, _getSlot(self.slots, actCaller, epochId), epochId);
    cbt.cData.turnTime = expcData.cData.turnTime;
    expcData.cData.turnTime = 0;
    _setContributorData(self.poolArr[epochId].cData, cbt.cData, cbt.rank, expSlot);
    _setContributorData(self.poolArr[epochId].cData, expcData.cData, expcData.rank, cbt.slot);
    self.slots[expCaller][epochId] = cbt.slot;
    self.slots[actCaller][epochId] = expSlot;
    cbt = _getProfile(self, _getSlot(self.slots, actCaller, epochId), epochId);
  }

  /**@dev Payback borrowed fund.
   * @param self : Storage
   * @param pb : Payback Parameters struct.
  */
  function payback(
    Data storage self,
    Common.PaybackParam memory pb,
    function(address, uint, bool) internal setPermit 
  )
    internal
    returns(Common.CommonEventData memory ced)
  {
    Common.Pool memory _p = _fetchPool(self, pb.epochId);
    _validateStage(_p.stage, Common.FuncTag.PAYBACK, "Payback not ready");
    Common.DebtReturnValue memory crv = _getCurrentDebt(self, pb.epochId, pb.user);
    bool(crv.debt > 0).assertTrue("No debt");
    bool allGF = _allHasGF(self.poolArr, pb.epochId);
    if(!allGF){
      _replenishPoolBalance(self.poolArr, pb.epochId);
      _setNextStage(self.poolArr, pb.epochId, Common.FuncTag.GET);
      _setTurnTime(self, _p.uints.selector, pb.epochId);
    } else {
      _setNextStage(self.poolArr, pb.epochId, Common.FuncTag.ENDED);
    }
    setPermit(pb.user, pb.epochId, _def().t);
    _validateAllowance(pb.user, _p.addrs.asset, crv.debt);
    _withdrawAllowance(pb.user, _p.addrs.asset, crv.debt, _p.addrs.strategy);
    ced.pool = _fetchPool(self, pb.epochId);
    _setClaim(
      Common.SetClaimParam(
        ced.pool.cData[crv.slot].cData.colBals,
        pb.epochId,
        0,
        crv.debt,
        0,
        pb.user,
        _p.addrs.strategy,
        address(0),
        allGF,
        Common.TransactionType.NATIVE
      )
    );
  }

  /**
   * @dev Returns the current stage of pool at epochId 
   */
  function _getStage(
    Common.Pool[] storage self, 
    uint epochId
  ) internal view returns(Common.FuncTag stage) {
    stage = self[epochId].stage;
  }

  /**
   * @dev Sets the next stage of an epoch
   */
  function _setNextStage(
    Common.Pool[] storage self, 
    uint epochId,
    Common.FuncTag nextStage
  ) private {
    // uint8 stage = uint8(_getStage(self, epochId));
    assert(uint8(nextStage) < 5);
    self[epochId].stage = nextStage;
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
    view returns(Common.DebtReturnValue memory crv) 
  {
    uint intPerSec = _fetchPool(self, epochId).uint256s.intPerSec;
    crv.slot = _getSlot(self.slots, user, epochId);
    Common.Contributor memory _cb = _getProfile(self, crv.slot, epochId).cData;
    crv.debt = _cb.loan.add(intPerSec.mul(_now().sub(_cb.turnTime)));
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
    @param epochId : Pool index
   */
  function _replenishPoolBalance(Common.Pool[] storage self, uint epochId) private {
    Common.Pool memory pool = self[epochId];
    self[epochId].uint256s.currentPool = pool.uint256s.unit.mul(pool.uints.quorum);
  }

  
  /**@dev Check if round is completed i.e all contributors have received finance
  */
  function _allHasGF(Common.Pool[] storage self, uint epochId) internal view returns(bool) {
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
    returns (Common.ContributorData memory _liq, bool defaulted, uint currentDebt) 
  {
    Common.Pool memory _p = _fetchPool(self, epochId);
    Common.ContributorData memory prof = _getProfile(self, _getSlot(self.slots, _p.addrs.lastPaid, epochId), epochId);
    (_liq, defaulted, currentDebt) 
      = 
        _now() <= prof.cData.payDate? 
          (_liq, _def().f, 0) 
            : 
              (prof, _def().t, _getCurrentDebt(
                self,
                epochId,
                prof.cData.id
              ).debt);
  }

  /**
    @dev Liquidates a borrower if they have defaulted in repaying their loan.
      - If the current beneficiary defaults, they're liquidated.
      - Their collateral balances is forwarded to the liquidator.
      - Liquidator must not be a participant in pool at `epochId. We use this 
        to avoid fatal error in storage.
    @param self : Storage ref.
    @param epochId : Epoch Id.
  */
  function liquidate(
    Data storage self,
    uint epochId,
    function(address, uint, bool) internal setPermit
  ) 
    internal
    returns (Common.CommonEventData memory ced)
  {
    (Common.ContributorData memory prof, bool defaulted,) = _enquireLiquidation(self, epochId);
    defaulted.assertTrue("Not defaulter");
    address liquidator = _msgSender();
    _mustNotBeAMember(self, epochId, liquidator);
    self.poolArr[epochId].addrs.lastPaid = liquidator;
    uint8 slot = _getSlot(self.slots, prof.cData.id, epochId);
    _swapProfile(self, epochId, slot, liquidator, prof.cData.id);
    ced = payback(
      self, 
      Common.PaybackParam(epochId, liquidator),
      setPermit
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
    address defProv
  ) 
    private 
  {
    self.poolArr[epochId].cData[oldProvSlot].cData.id = newProv;
    self.slots[newProv][epochId] = oldProvSlot;
    delete self.slots[defProv][epochId];
    IStrategy(_fetchPool(self, epochId).addrs.strategy).swapProvider(epochId, newProv, defProv);
  }

  /**
    @dev Cancels virgin band i.e Newly created band with only one contributor.
      Only admin of a band can cancel only if no one has join the band.
    @param self : Storage
    @param epochId : Pool Id.
    @param isPermissionLess : Whether band is public or not.

    @notice : Setting the quorum to 0 is an indication that a pool was removed.
  */
  function cancelBand(
    Data storage self,
    uint epochId,
    bool isPermissionLess,
    function(address, uint, bool) internal setPermit
  ) 
    internal
    returns (uint success)
  {
    verifyEpochId(self, epochId);
    Common.Pool memory _p = _fetchPool(self, epochId);
    address creator = _msgSender();
    _isAdmin(self, epochId, creator);
    Def memory _d = _def();
    if(isPermissionLess) {
      bool(self.poolArr[epochId].userCount.current() == 1).assertTrue("FactoryLib - Pub: Cannot cancel");
      delete self.amountExist[_p.uint256s.unit];
    } else {
      bool(_p.uint256s.currentPool <= _p.uint256s.unit).assertTrue("FactoryLib - Priv: Cannot cancel");
    }
    self.poolArr[epochId].uints.quorum = 0;
    setPermit(creator, epochId, true);
    _setNextStage(self.poolArr, epochId, Common.FuncTag.ENDED);
    _setClaim(Common.SetClaimParam(_p.uint256s.unit, epochId, 0, 0, 0, creator, _p.addrs.strategy, address(0), _d.f, Common.TransactionType.ERC20));
    success = epochId;
  }

  function _isAdmin(
    Data storage self,
    uint epochId,
    address user
  ) 
    internal
    view
  {
    uint8 slot = _getSlot(self.slots, user, epochId);
    require(self.poolArr[epochId].cData[slot].rank.admin, "FactoryLib: Only admin");
  }


  /**
   * @dev Withdraws collateral
   * @param self: storage ref.
   * @param epochId: Epoch Id.
   */
  function _withdrawCollateral(
    Data storage self,
    uint epochId
  ) 
    internal
  {
    address user = _msgSender();
    self.poolArr[epochId].cData[_getSlot(self.slots, user, epochId)].cData.colBals = 0;
    require(IStrategy(_fetchPool(self, epochId).addrs.strategy).withdraw(epochId, user), "Withdrawal failed");
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
    Common.Addresses memory addrs = _fetchPool(self, epochId).addrs;
    balances = Common.Balances({
      xfi: addrs.strategy.balance,
      erc20: IERC20(addrs.asset).balanceOf(addrs.strategy)
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

  function fetchPools(
    Data storage self
  )
    internal
    view
    returns(Common.Pool[] memory pools) 
  {
    pools = self.poolArr;
    return pools;
  } 
}

