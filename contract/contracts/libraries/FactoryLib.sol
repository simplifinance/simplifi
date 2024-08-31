// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { Counters } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IStrategyManager } from "../apis/IStrategyManager.sol";
import { IStrategy } from "../apis/IStrategy.sol";
import { IFactory } from "../apis/IFactory.sol";
// import { ISmartStrategy } from "../apis/ISmartStrategy.sol";
import { Common } from "../apis/Common.sol";
import { SafeCallSmartStrategy } from "../libraries/SafeCallSmartStrategy.sol";
import { AssetClass } from "../implementations/AssetClass.sol";
import { SafeCallStrategy } from "../libraries/SafeCallStrategy.sol";
import { Utils } from "../libraries/Utils.sol";

/**@dev
  * @param amountExist: Tracks unit contribution i.e values created in each permissionless communities
  * @param pools: Mapping of epochIds to Pool
  * @param pData: Public State variable stats
  * @param poolCount : Total pool created to date
  * @param contributors : Mapping of epochIds to group of contributors
  * @param spots : Reverse map of contributors to epochId to spots on the list.
*/
struct Data {
  IFactory.ContractData pData;
  Counters.Counter poolCount; 
  mapping(uint => Common.Pool) pools;
  mapping(uint256 => bool) amountExist; 
  mapping(uint => Common.Contrubutor[]) contributors;
  mapping(address => mapping(uint => uint)) spots;
  mapping(uint => mapping (address => Common.Rank)) ranks;
  address strategyManager;
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
  using SafeCallStrategy for IStrategy;
  // using SafeCallSmartStrategy for ISmartStrategy;
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
    returns(
      Common.Pool memory pool, 
      Common.Contrubutor memory contributorStruct, 
      uint16 _spot
    ) 
  {
    Def memory _d = _def();
    // Utils.assertTrue_2(cpp.duration > _d.zero, cpp.duration < type(uint8).max, "Invalid duration"); // Please uncomment this line after you have completed the testing.
    _validateAllowance(user, cpp.asset, unitContribution);
    _updatePoolSlot(self, epochId, cpp, _d, strategy);
    _unlock(epochId, Common.FuncTag.JOIN);
    pool = _fetchPoolData(self, epochId);
    _updateStrategy(strategy,  assetInUse, user, epochId);
    _forwardContribution(user, cpp.asset, unitContribution, strategy);
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
   * @param : Unit contribution
   * @param strategy : Address to hold funds on behalf of the members. The factory generates 
   * a strategy by querying StrategyManager. Every address that create a pool must operate a 
   * strategy. This process is managed internally for users.  
   */
  function _forwardContribution(
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
  ) private {
    self.pools[epochId] = Common.Pool(
      Common.Uints(cpp.quorum, _d.zero, cpp.colCoverage, cpp.duration * 1 hours),
      Common.Uint256s(cpp.value, cpp.value),
      Common.Addresses(cpp.asset, _d.zeroAddr, strategy),
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
   * @param user : Caller.
   * @param epochId: Otherwise known as pool Id.
   */
  function _updateStrategy(
    address strategy, 
    address assetInUse,
    address user, 
    uint epochId
  ) private {
    if(!IStrategy(strategy).activateMember(epochId, user, assetInUse)){
      revert Common.UpdateStrategyError();
    }
  }

  /**@dev Create permissioned band
   * @param self: Storage of type `Data`.
   * @param cpi : Parameter struct
   * Note: Each of the addresses on the members array must an Account instance. Participants must already own an
   * account before now otherwise, execution will not pass.
   * - Admin cannot replicate themselves in a band.
   * - Each of the participants must have created account before now.
   * - We assume admin should be address in first slot in the members array, so expression evaluates to `if not admin`.
   */
  function createPermissionedPool(
    Data storage self,
    Common.CreatePermissionedPoolInputParam memory cpi
  ) 
    internal
    returns (Common.CreatePoolReturnValue memory cpr) 
  {
    Def memory _d = _def();
    uint epochId = _generatePoolId(self);
    address admin = cpi.cpp.members[0];
    address strategy = _fetchAndValidateStrategy(admin, self.strategyManager);
    for(uint i = _d.zero; i < cpi.cpp.members.length; i++) {
      if(i == _d.zero) {
        (
          Common.Pool memory pool, 
          Common.Contrubutor memory contributorStruct, 
          uint16 spot
        ) = _createPool(self, cpi.cpp, cpi._unlock, strategy, admin, epochId);
        _addNewMember(self, cpr.epochId, admin, _d.t, _d.t);
        cpr = Common.CreatePoolReturnValue(pool, contributorStruct, epochId, spot);
      } else {
        address contributor = cpi.cpp.members[i];
        bool(contributor != admin).assertTrue("Admin spotted twice");
        _addNewMember(self, cpr.epochId, contributor, _d.f, _d.t);
      }
      self.pools[cpr.epochId].uints.quorum ++;
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
    returns(address _strategy) 
  {
    _strategy = IStrategyManager(strategyManager).getStrategy(user);
  }

  /**
   * @dev Checks, validate and return strategy for the target address
   * @param user : Address for whom to get strategy
   * @param getStrategy : function that returns strategy
   */
  function _fetchAndValidateStrategy(
    address user,
    address strategyManager
  ) 
    private 
    returns(address strategy) 
  {
    strategy = _getStrategy(user);
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
  function _addNewMember(
    Data storage self, 
    uint epochId, 
    address contributor,
    bool isAdmin,
    bool isMember                                                                                                                                                                                            
  ) 
    private 
  {
    _setSpot(self.spots, contributor, _generateSpot(self.contributors, epochId), epochId);
    Common.Contrubutor memory _cb;
    self.ranks[epochId][contributor] = Common.Rank({admin: isAdmin, member: isMember});
    _cb.id = contributor;
    _addContributor(self.contributors, _cb, epochId);
  }

  /**@dev Push a new contributor to storage.
    @param self : Storage of type mapping
    @param contributorStruct : Common.Contributor.
    @param epochId : Pool id
   */
  function _addContributor(mapping(uint => Common.Contrubutor[]) storage self, Common.Contrubutor memory contributorStruct, uint epochId) private {
    self[epochId].push(contributorStruct);
  }

  /**@dev Update contributor's data
    @param self : Storage of type mapping
    @param contributorStruct : Contributor struct containing updated data
    @param epochId : Pool id
    @param spot : Position of Contributor in the list
   */
  function _setContrubutor(mapping(uint => Common.Contrubutor[]) storage self, Common.Contrubutor memory contributorStruct, uint epochId, uint16 spot) private {
    self[epochId][spot] = contributorStruct;
  }

  /**
   * @dev Return the length of pools i.e total pool to date
   * @param self : Storage of type Data
   */
  function _getPoolCount(Data storage self) internal view returns(uint) {
    return self.poolCount.current();
  } 

  /**
   * @dev Generates Id for new pool
   * @param self: Storage of type Data
   */
  function _generatePoolId(Data storage self) internal returns (uint _return) {
    self.poolCount.increment();
    _return = _getPoolCount(self);
  }

  /**@dev Get the spots of strategy on the list
    @param self : Storage of type mapping
    @param epochId : Pool Id
    Note: To avoid irregularity in accessing Strategy array 
      `_generateSpot` must be invoked before adding a new data 
      to the contributors array.
   */
  function _generateSpot(mapping(uint => Common.Contrubutor[]) storage self, uint epochId) internal view returns(uint16 _return) {
    _return = uint16(self[epochId].length);
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
    uint epochId = _generatePoolId(self);
    address admin = cpi.cpp.members[0];
    address strategy = _fetchAndValidateStrategy(admin, self.strategyManager);
    self.amountExist[cpp.value].assertFalse("Amount exist");
    self.amountExist[cpp.value] = _d.t;
    (
      Common.Pool memory pool, 
      Common.Contrubutor memory contributorStruct, 
      uint16 spot
    ) = _createPool(self, cpp, _unlock, strategy, admin, epochId);
    cpr = Common.CreatePoolReturnValue(pool, contributorStruct, epochId, spot);
    _addNewMember(self, cpr.epochId, strategy, _d.t, _d.t);
    self.pools[epochId].uints.quorum ++;
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
      Common.Pool memory _pool,
      Common.Contrubutor memory contributor
    ) 
  {
    Common.Pool memory pool = _fetchPoolData(self, _ab.epochId);
    // pool.addrs.strategy
    Def memory _d = _def();
    // address strategy = _fetchAndValidateStrategy(_msgSender(), _ab.getStrategy);
    if(_ab.isPermissioned) {
      contributor = _mustBeAMember(self, _ab.epochId, msg.sender);
      // Utils.assertTrue(pool.uints.quorum < _currentParticipants(self.contributors, _ab.epochId), "Priv filled");
      // self.pools[_ab.epochId].uints.quorum ++;
    } else {
      Utils.assertTrue(_currentParticipants(self.contributors, _ab.epochId) < pool.uints.quorum, "Pub filled");
      contributor = _mustNotBeAMember(self, _ab.epochId, msg.sender);
      _addNewMember(self, _ab.epochId, msg.sender, _d.f, _d.t);
    }
    unchecked {
      self.pools[_ab.epochId].uint256s.currentPool += pool.uint256s.unit;
    }

    if(_isPoolFilled(self, _ab.epochId)) {
      _ab.lock(_ab.epochId, Common.FuncTag.JOIN);
      _ab.unlock(_ab.epochId, Common.FuncTag.GET);
      _setTicker(self, pool.addrs.strategy, _ab.epochId);
      ISmartStrategy(pool.addrs.strategy).setBalance(pool.addrs.asset, self.trustee, uint256s.currentPool); // ====================== Here 
    }
    _validateAllowance(msg.sender, cpp.asset, pool.uint256s.unit);
    _forwardContribution(msg.sender, cpp.asset, pool.uint256s.unit, pool.addrs.strategy);
    // _compareBalance(pool.addrs.asset, strategy, pool.uint256s.unit);
    _pool = _fetchPoolData(self, _ab.epochId);
  }

  /**
   * @dev A Check to know if msg.sender is a member of the band at epochId.
   * @param self: Storage {typeof => mapping}
   * @param epochId: Pool index
   * @param strategy: Strategy account
  */
  function _mustBeAMember(
    Data storage self,
    uint epochId,
    address contributor
  ) 
    internal 
    view 
    returns(Common.Contrubutor memory _cb) 
  {
    _cb = self.contributors[epochId][_getSpot(self.spots, contributor, epochId)];
    self.ranks[epochId][contributor].member.assertTrue("Not A Member");
    // _cb = getContrubutor(strategy, epochId);
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
    returns(Common.Contrubutor memory _cb) 
  {
    _cb = self.contributors[epochId][_getSpot(self.spots, contributor, epochId)];
    self.ranks[epochId][contributor].member.assertFalse("Contributor is a member");
  }

  /**@dev Check if pool is filled
    * @dev Msg.sender must not be a member of the band at epoch Id before now.
    * @param self: Storage {typeof mapping}
    * @param epochId: Pool index
  */
  function _isPoolFilled(Data storage self, uint epochId) 
    internal 
    view 
    returns(bool filled) 
  {
    filled = self.contributors[epochId].length == self.pools[epochId].uints.quorum;
  }

  /**@dev Update ticker to who will get finance next
    * @param self: Storage {typeof mapping}
    * @param epochId: Pool index
    * @param contributor : Contributor
  */
  function _setTicker(
    Data storage self, 
    address contributor, 
    uint epochId
  ) 
    private
  {
    self.contributors[epochId][_getSpot(self.spots, contributor, epochId)].turnTime = _now();
  }

  










































  /**@dev Get the spots of contributor on the list
    @param self : Storage of type mappping
    @param contributor : Contributor
   */
  function _getSpot(mapping(address =>mapping(uint => uint)) storage self, address contributor, uint epochId) internal view returns(uint16 _return) {
    _return = uint16(self[contributor][epochId]);
  }

  /**@dev Return number of members already in the pool
   */
  function _currentParticipants(mapping(uint => Common.Contrubutor[]) storage self, uint epochId) internal view returns(uint _return) {
    _return = self[epochId].length;
  }

  /**@dev Set the spot for contributor
    @param self : Storage of type mapping
    @param contributor : Contributor
    @param spot : New index
   */
  function _setSpot(mapping(address => mapping(uint => uint)) storage self, address contributor, uint16 spot, uint epochId) private {
    self[contributor][epochId] = spot;
  }

  /**@dev Ruturn strategy info
    @param self : Storage of type mapping
    @param info : Strategy struct containing updated data
    @param epochId : Pool id
    @param spot : Position of Strategy 
   */
  function _getContrubutor(mapping(uint => Common.Contrubutor[]) storage self, uint epochId, uint16 spot) internal view returns(Common.Contrubutor memory info) {
    info = self[epochId][spot];
  }


  /**@dev Check if all participants have received financial help
  */
  function allIsGh(mapping(uint => Common.Pool) storage self, uint epochId) internal view returns(bool) {
    Common.Pool memory pool = self[epochId];
    return pool.allGh == pool.uints.quorum;
  }


  /**
   * @dev Return the caller identifier from the msg object 
   * Gas-saving
   */
  function _msgSender() internal view returns(address _sender) {
    _sender = msg.sender;
  }

  /**@dev Increment participant selector
  */
  function _incrementSelector(mapping(uint => Common.Pool) storage self, uint epochId) private {
    self[epochId].uints.selector ++;
  }

  /**@dev Increment allGh when one member get finance
  */
  function _incrementAllGh(mapping(uint => Common.Pool) storage self, uint epochId) private {
    self[epochId].allGh ++;
  }

  function _def() internal pure returns(Def memory) {
    return Def(true, false, 0, 1, address(0));
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
    @param epochId : Pool index
   */
  function _resetPoolBalance(mapping(uint => Common.Pool) storage self, uint epochId) private {
    self[epochId].uint256s.currentPool = _def().zero;
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
    @param epochId : Pool index
   */
  function _replenishPoolBalance(mapping(uint => Common.Pool) storage self, uint epochId) private {
    Common.Pool memory pool = self[epochId];
    self[epochId].uint256s.currentPool = pool.uint256s.unit.mul(pool.uints.quorum);
  }

  //   /**
  //  * @dev Scrutinizes strategy's erc20 balance
  //  * @param asset: ERC20 Asset to use for the contribution.
  //  * @param strategy: Standalone interactive account of caller.
  //  * @param contributionAmount: The approved unit value of contribution.
  //  */
  // function _compareBalance(address asset, address strategy, uint contributionAmount) internal view returns(uint256 spendable) {
  //   spendable = IERC20(asset).balanceOf(strategy);
  //   if(spendable < contributionAmount) revert IFactory.InsufficientFund();
  // }                                                                              

  ///@dev Returns current timestamp (unix).
  function _now() internal view returns (uint) {
    return block.timestamp;
  }

  /** 
   * @dev Modify member's profile
   * Note: We give priority to the account we are expecting to call.
   * meaning, irrespective of who is calling, contribution is sent to
   * the account that is expected provided their time to get finance has
   * not pass. If expected account is not the current caller and the time
   * to get finance for the expected caller has passed, we swap the whole
   * process in favor of the current caller provided they satisfy a few 
   * conditions.
    * @param self: Storage
    * @param upm : Parameter of type Common.UpdateMemberDataParam
    * Note: 
  *   spot = exp.spot;
      If the caller is not the next on the queue to getfinance
      and the time to get finance for the expected account has passed.
  */
  function _updateMemberData(
    Data storage self,
    Common.UpdateMemberDataParam memory upm
  ) 
    private 
    returns (Common.Contrubutor memory exp) 
  {
    Def memory _d = _def();
    _resetPoolBalance(self.pools, upm.epochId);
    address strategy = upm.expected;
    uint16 pos = _getSpot(self.spots, strategy, upm.epochId);
    exp = _getContrubutor(self.contributors, upm.epochId, pos);
    if(_now() > exp.turnTime + 30 minutes){
      strategy = upm.getStrategy(_msgSender());
      if(strategy != upm.expected) {
        _mustBeAMember(self, upm.epochId, strategy);
        (exp, pos) = _swapContrubutor(self ,exp, pos, upm.expected, strategy, upm.epochId);
      }
    }

    uint colBals = self.pData.token.computeCollateral(strategy, upm.pool.uints.ccr, upm.getPriceInUSD(), upm.pool.uint256s.currentPool);
    self.pools[upm.epochId].addrs.lastPaid = strategy;
    _incrementSelector(self.pools, upm.epochId);
    exp = Common.Contrubutor(
      exp.isMember,
      exp.isAdmin,
      _now().add(upm.pool.uints.duration),
      exp.turnTime,
      upm.pool.uint256s.currentPool,
      colBals,
      _d.t,
      exp.id
    );
    _setContrubutor(self.contributors, exp, upm.epochId, pos);
    ISmartStrategy(strategy).safeWithdrawAsset(self.pData.token, self.trustee, colBals);
    unchecked{
      ITrustee(self.trustee).safeTransferOut(
        upm.pool.addrs.asset, 
        strategy, 
        upm.pool.uint256s.currentPool - upm.fee,
        upm.fee
      );
    }
  }

  /**
   * @dev Swaps spot if the caller is different from the expected
   * Note: Some unfavorable could happen if the expect account is the admin.
   *       An admin could lose their right as the admin if they fall in this
   *       category.
   * The assumption is that profile data of participants who are yet to get finance
   * are identical except if the expected is an admin which makes it easier for us to swap profile data.
   * @param self: Storage ref of type `Data struct`.
   * @param _expInfo: Position of the actual calling strategy.
   * @param _expPos: Position of the expected strategy.
   * @param _expStrategy : The profile of Strategy that should get finance.
   * @param _actualStrategy: Actual calling strategy profile.
   * @param epochId: Pool Id.
   */
  function _swapContrubutor(
    Data storage self,
    Common.Contrubutor memory _expInfo, 
    uint16 _expPos,
    address _expStrategy,
    address _actualStrategy,
    uint epochId
  ) private returns(Common.Contrubutor memory _actInfo, uint16 _actPos) {
    _actPos = _getSpot(self.spots, _actualStrategy, epochId);
    _actInfo = _getContrubutor(self.contributors, epochId, _actPos);
    self.contributors[epochId][_actPos] = _expInfo;
    self.contributors[epochId][_expPos] = _actInfo;
    self.spots[_expStrategy][epochId] = _actPos;
    self.spots[_actualStrategy][epochId] = _expPos;
  }

  /**@dev Get finance: Sends current total contribution to the 
   * expected account and update respective accounts.
    @param self : Storage
    @param epochId : Pool Id.
    @param lock : Utility that lock a function when called.
    @param unlock : Utility that unlock a function when called.
    @param getStrategy : Return the strategy connected to an EOA.
    @param getPriceInUSD : Get the price of token i.e platform token.
  */
  function getFinance(
    Data storage self,
    uint epochId,
    function (uint, Common.FuncTag) internal lock,
    function (uint, Common.FuncTag) internal unlock,
    function (address) internal returns(address) getStrategy,
    function () internal returns(uint) getPriceInUSD
  ) 
    internal
    returns(Common.Contrubutor memory info)
  {
    lock(epochId, Common.FuncTag.GET);
    unlock(epochId, Common.FuncTag.PAYBACK);
    Common.Pool memory pool = _fetchPoolData(self, epochId);
    if(pool.allGh == pool.uints.quorum) revert IFactory.AllMemberIsPaid();
    _incrementAllGh(self.pools, epochId);
    bool(pool.uint256s.currentPool >= (pool.uint256s.unit.mul(pool.uints.quorum))).assertTrue("Pool not complete");

    uint mFee = pool.uint256s.currentPool.computeFee(self.pData.makerRate);
    info = _updateMemberData(
      self,
      Common.UpdateMemberDataParam(
        self.contributors[epochId][pool.uints.selector].id,
        epochId,
        pool.uint256s.currentPool,
        mFee,
        pool,
        getPriceInUSD,
        getStrategy
      )
    );
  }

  /**
   * @dev Return struct object with data if current beneficiary has defaulted otherwise an empty struct is returned.
   * @param self : Storage
   * @param epochId: Pool id
   */
  function _enquireLiquidation(Data storage self, uint epochId) internal view returns (Common.Liquidation memory _liq, bool defaulted) {
    Common.Pool memory _p = _fetchPoolData(self, epochId);
    uint16 pos = _getSpot(self.spots, _p.addrs.lastPaid, epochId);
    Common.Contrubutor memory info = _getContrubutor(self.contributors, epochId, pos);
    (_liq, defaulted) = _now() <= info.payDate ? (_liq, defaulted) : (Common.Liquidation(
      pos,
      _p.addrs.lastPaid,
      info.payDate,
      info.owings, 
      info.colBals
    ), _def().t);
  }

  function enquireLiquidation(Data storage self, uint epochId) external view returns (Common.Liquidation memory _liq, bool defaulted) {
    return _enquireLiquidation(self, epochId);
  }

  /**
    @dev Liquidates defaulter.
      - If the current beneficiary defaults, they're liquidated.
      - Their collateral balances is forwarded to the liquidator.
      - Liquidator must not be a participant in pool at `epochId`.
    @param self : Storage ref.
    @param lp : Parameters struct.
  */
  function liquidate(
    Data storage self,
    Common.LiquidateParam memory lp
  ) 
    internal
    returns (Common.Contrubutor memory info)
  {
    (Common.Liquidation memory liquidated, bool defaulted) = _enquireLiquidation(self, lp.epochId);
    defaulted.assertTrue("No defaulter");
    address liquidator = lp.getStrategy(_msgSender());
    _mustNotBeAMember(self, lp.epochId, liquidator);
    _compareBalance(self.pools[lp.epochId].addrs.asset, liquidator, liquidated.debt);
    ISmartStrategy(liquidator).safeWithdrawAsset(self.pools[lp.epochId].addrs.asset, self.trustee, liquidated.debt);

    info = payback(self, Common.PaybackParam(
      lp.epochId, 
      liquidated.target, 
      liquidator, 
      _getContrubutor(self.contributors, lp.epochId, _getSpot(self.spots, liquidated.target, lp.epochId)), 
      lp.lock, 
      lp.unlock
    )); 
  }

  /**
    @dev Cancels recent unfil band.
      Only admin of a band can cancel only if no one has join the band.
    @param self : Storage
    @param epochId : Pool Id.
    @param isPermissionLess : Whether band is public or not.
    @param getStrategy : Return the strategy connected to an EOA.
  */
  function cancelBand(
    Data storage self,
    uint epochId,
    bool isPermissionLess,
    function (address) internal returns(address) getStrategy
  ) 
    internal
    returns (uint)
  {
    Common.Pool memory _p = _fetchPoolData(self, epochId);
    address strategy = getStrategy(_msgSender());
    _mustBeAMember(self, epochId, strategy);
    Def memory _d = _def();
    if(isPermissionLess) {
      bool(self.contributors[epochId].length == 1).assertTrue("Router: Cannot cancel");
      delete self.amountExist[_p.uint256s.unit];
    } else {
      bool(_p.uint256s.currentPool <= _p.uint256s.unit).assertTrue("15");
    }
    delete self.pools[epochId];
    ITrustee(self.trustee).safeTransferOut(_p.addrs.asset, strategy, _p.uint256s.unit, _d.zero);
    delete self.contributors[epochId];
    // epochId.safeClearSubscrition(_msgSender(), _d.zero, ISmartStrategy(strategy));
    
    return epochId;
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
    returns(Common.Contrubutor memory info)
  {
    Common.Pool memory _p = _fetchPoolData(self, pb.epochId);
    bool(pb.expInfo.owings > 0).assertTrue("No debt");
    Def memory _d = _def();
    _compareBalance(_p.addrs.asset, pb.strategy, pb.expInfo.owings);
    ISmartStrategy(pb.strategy).safeWithdrawAsset(_p.addrs.asset, self.trustee, pb.expInfo.owings);
    pb.expInfo.owings = _d.zero;
    info = pb.expInfo;
    pb.unlock(pb.epochId, Common.FuncTag.GET);
    pb.lock(pb.epochId, Common.FuncTag.PAYBACK);
    _replenishPoolBalance(self.pools, pb.epochId);
    ITrustee(self.trustee).safeTransferOut(
      self.pData.token, 
      pb.colBalRecipient, 
      pb.expInfo.colBals,
      _d.zero
    );

    if(allIsGh(self.pools, pb.epochId)) _roundUp(self, pb.epochId, _p);
  }

  /**
    @dev Completes the current round {internal}.
    * @param self : Storage.
    * @param epochId : Pool Id.
    * @param pool : Pool data.
  */
  function _roundUp(
    Data storage self, 
    uint epochId,
    Common.Pool memory pool
  ) private {
    uint len = self.contributors[epochId].length;
    address[] memory _addrs = new address[](len);
    for(uint i = 0; i < len; i++) {
      _addrs[i] = self.contributors[epochId][i].id;
    }
    self.pools[epochId].uints.selector = 0;
    
    ITrustee(self.trustee).safeRegisterBeneficiaries(
      _addrs,
      pool.uint256s.unit,
      epochId,
      pool.addrs.asset
    );
    
    emit AllGh(epochId, pool);
  }

  /**
    * @param self : Storage.
    * @param token : Platform token.
   */
  function setContractData(
    Data storage self,
    address token,
    address trustee,
    address assetAdmin,
    uint16 makerRate
  ) internal {
    if(assetAdmin != address(0)) self.pData.assetAdmin = assetAdmin;
    // if(feeTo != address(0)) self.pData.feeTo = feeTo;
    if(token != address(0)) self.pData.token = token;
    if(trustee != address(0)) self.trustee = trustee;
    if(makerRate < type(uint16).max) self.pData.makerRate = makerRate;
  }
}

