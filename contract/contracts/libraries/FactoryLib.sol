// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
import { Counters } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import { ISmartStrategyAdmin } from "../apis/ISmartStrategyAdmin.sol";
import { ITrustee } from "../apis/ITrustee.sol";
import { IFactory } from "../apis/IFactory.sol";
import { ISmartStrategy } from "../apis/ISmartStrategy.sol";
import { Common } from "../apis/Common.sol";
import { SafeCallSmartStrategy } from "../libraries/SafeCallSmartStrategy.sol";
import { AssetClass } from "../implementations/AssetClass.sol";
import { SafeCallTrustee } from "../libraries/SafeCallTrustee.sol";
import { Utils } from "../libraries/Utils.sol";

/**@dev
  * @param amountExist: Tracks unit contribution i.e values created in each permissionless communities
  * @param pools: Mapping of poolIds to Pool
  * @param pData: Public State variable stats
  * @param poolCount : Total pool created to date
  * @param strategies : Mapping of poolIds to group of strategies
  * @param positions : Reverse map of strategies to poolId to positions on the list.
*/
struct Data {
  IFactory.ContractData pData;
  Counters.Counter poolCount; 
  mapping(uint => Common.Pool) pools;
  mapping(uint256 => bool) amountExist; 
  mapping(uint => Common.StrategyInfo[]) strategies;
  mapping(address => mapping(uint => uint)) positions;
  address trustee;
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
  using SafeCallTrustee for ITrustee;
  using SafeCallSmartStrategy for ISmartStrategy;
  using Counters for Counters.Counter;

  event AllGh(uint poolId, Common.Pool pool);

  /**@dev Get the positions of strategy on the list
    @param self : Storage of type mappping
    @param strategy : Strategy account
   */
  function _getPosition(mapping(address =>mapping(uint => uint)) storage self, address strategy, uint poolId) internal view returns(uint16 _return) {
    _return = uint16(self[strategy][poolId]);
  }

  /**@dev Return number of members already in the pool
   */
  function _currentParticipants(mapping(uint => Common.StrategyInfo[]) storage self, uint poolId) internal view returns(uint _return) {
    _return = self[poolId].length;
  }

  /**@dev Set the position for strategy
    @param self : Storage of type mapping
    @param strategy : Strategy account
    @param position : New index
   */
  function _setPosition(mapping(address => mapping(uint => uint)) storage self, address strategy, uint16 position, uint poolId) private {
    self[strategy][poolId] = position;
  }

  /**@dev Get the positions of strategy on the list
    @param self : Storage of type mapping
    @param poolId : Pool Id
    Note: To avoid irregularity in accessing Strategy array 
      `_generatePosition` must be invoked before adding a new data 
      to the strategies array.
   */
  function _generatePosition(mapping(uint => Common.StrategyInfo[]) storage self, uint poolId) internal view returns(uint16 _return) {
    _return = uint16(self[poolId].length);
  }

  /**@dev Update strategy info
    @param self : Storage of type mapping
    @param info : Strategy struct containing updated data
    @param poolId : Pool id
    @param position : Position of Strategy 
    Note: This utility should only be used when data needs to be 
    updated otherwise use `_addStrategyInfoself.strategies, info, poolId, position`. The position must have 
    be generated.
   */
  function _setStrategyInfo(mapping(uint => Common.StrategyInfo[]) storage self, Common.StrategyInfo memory info, uint poolId, uint16 position) private {
    self[poolId][position] = info;
  }

  /**@dev Ruturn strategy info
    @param self : Storage of type mapping
    @param info : Strategy struct containing updated data
    @param poolId : Pool id
    @param position : Position of Strategy 
   */
  function _getStrategyInfo(mapping(uint => Common.StrategyInfo[]) storage self, uint poolId, uint16 position) internal view returns(Common.StrategyInfo memory info) {
    info = self[poolId][position];
  }

  /**@dev Update strategy info
    @param self : Storage of type mapping
    @param info : Strategy struct containing updated data
    @param poolId : Pool id
    Note: This utility should only be used when the array is not 
    updated otherwise use `_setStrategyInfo` 
   */
  function _addStrategyInfo(mapping(uint => Common.StrategyInfo[]) storage self, Common.StrategyInfo memory info, uint poolId) private {
    self[poolId].push(info);
  }

  /**
   * @dev Checks if user or caller is a member of the band
   * and return account information of the current caller. 
   * @param self: Storage {typeof => mapping}
   * @param poolId: Pool index
   * @param strategy: Strategy account
   */
  function requireIsMember(
    Data storage self,
    uint poolId,
    address strategy
  ) internal view returns(Common.StrategyInfo memory info) {
    info = self.strategies[poolId][_getPosition(self.positions, strategy, poolId)];
    info.isMember.assertTrue("Not A Member");
    // info = getStrategyInfo(strategy, poolId);
  }

  /**
   * @dev Checks if user or caller is a member of the band
   * and return account information of the caller.
   * @param self: Storage {typeof => mapping}
   * @param poolId: Pool index
   * @param strategy: Strategy account
  */
  function requireNotAMember(
    Data storage self,
    uint poolId,
    address strategy
  ) internal view returns(Common.StrategyInfo memory info) {
    info = self.strategies[poolId][_getPosition(self.positions, strategy, poolId)];
    // require(!info.isMember, "Is A Member");
    // info.isMember.assertFalse("Is A Member");
    // info = getStrategyInfo(strategy, poolId);
  }

  /**@dev Check if all participants have received financial help
  */
  function allIsGh(mapping(uint => Common.Pool) storage self, uint poolId) internal view returns(bool) {
    Common.Pool memory pool = self[poolId];
    return pool.allGh == pool.uints.quorum;
  }

  ///@dev Returns all uint256s related data in pool at poolId.
  function _fetchPoolData(Data storage self, uint poolId) internal view returns (Common.Pool memory _return) {
    _return = self.pools[poolId];
  }

  /**
   * @dev Return the caller identifier from the msg object 
   * Gas-saving
   */
  function _msgSender() internal view returns(address _sender) {
    _sender = msg.sender;
  }

  /**
   * @dev Generates Id for new pool
   */
  function _generateGroupID(Data storage self) internal returns (uint _return) {
    self.poolCount.increment();
    _return = _getPoolCount(self);
  }

  ///@dev Return the total pool created.
  function _getPoolCount(Data storage self) internal view returns(uint) {
    return self.poolCount.current();
  } 

  /**@dev Check if pool is filled
   */
  function _isPoolFilled(Data storage self, uint poolId) internal view returns(bool) {
    Common.Pool memory pool = self.pools[poolId];
    return self.strategies[poolId].length == pool.uints.quorum;
  }

  /**@dev Increment participant selector
  */
  function _incrementSelector(mapping(uint => Common.Pool) storage self, uint poolId) private {
    self[poolId].uints.selector ++;
  }

  /**@dev Increment allGh when one member get finance
  */
  function _incrementAllGh(mapping(uint => Common.Pool) storage self, uint poolId) private {
    self[poolId].allGh ++;
  }

  /**@dev Update turn time
  */
  function _setTurnTime(Data storage self, address strategy, uint poolId) private {
    self.strategies[poolId][_getPosition(self.positions, strategy, poolId)].turnTime = _now();
  }

  function _def() internal pure returns(Def memory) {
    return Def(true, false, 0, 1, address(0));
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
    @param poolId : Pool index
   */
  function _resetPoolBalance(mapping(uint => Common.Pool) storage self, uint poolId) private {
    self[poolId].uint256s.currentPool = _def().zero;
  }

  /**@dev Reset pool balances
    @param self: Storage of type mapping
    @param poolId : Pool index
   */
  function _replenishPoolBalance(mapping(uint => Common.Pool) storage self, uint poolId) private {
    Common.Pool memory pool = self[poolId];
    self[poolId].uint256s.currentPool = pool.uint256s.unit.mul(pool.uints.quorum);
  }

  /**
   * @dev Add new member to the pool
   * Note: `target` is expected to be an instance of the `SmartStrategy`
   * @param self: Storage pointer
   * @param poolId: Pool index
   * @param strategy: Strategy to add to the pool.
   * @param isAdmin: Whether strategy is an admin or not.
   * @param isMember: Strategy strategy is a member or not.
   */
  function _addNewMember(
    Data storage self, 
    uint poolId, 
    address strategy,
    bool isAdmin,
    bool isMember                                                                                                                                                                                                                
  ) private returns(uint16 position) { 
    position = _generatePosition(self.strategies, poolId);
    _setPosition(self.positions, strategy, position, poolId);
    Common.StrategyInfo memory info;
    info.isAdmin = isAdmin;
    info.isMember = isMember;
    info.id = strategy;
    _addStrategyInfo(self.strategies, info, poolId);
  }

  /**
   * @dev Create a fresh pool
   * @param self: Storage of type `Data`
   * @param cpp: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @param poolId: Pool we are currently dealing with.
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
    uint poolId,
    uint16 position
  ) private returns(Common.Pool memory pool, Common.StrategyInfo memory info, uint16 _position) {
    Def memory _d = _def();
    _compareBalance(cpp.asset, strategy, cpp.value);
    // unchecked{
    //   cpp.value = cpp.value * cpp.value._decimals(cpp.asset);
    // }
    // Utils.assertTrue_2(cpp.duration > _d.zero, cpp.duration < type(uint8).max, "Invalid duration"); // Please uncomment this line after you have completed the testing.
    self.pools[poolId] = Common.Pool(
      Common.Uints(cpp.quorum, _d.zero, cpp.ccr, cpp.duration * 1 hours),
      Common.Uint256s(cpp.value, cpp.value),
      Common.Addresses(cpp.asset, _d.zeroAddr),
      _d.zero
    );
    _unlock(poolId, Common.FuncTag.JOIN);
    pool = _fetchPoolData(self, poolId);
    info = _getStrategyInfo(self.strategies, poolId, position);
    ISmartStrategy(strategy).safeWithdrawAsset(cpp.asset, self.trustee, cpp.value);
    _position = position;
  }

    /**
   * @dev Scrutinizes strategy's erc20 balance
   * @param asset: ERC20 Asset to use for the contribution.
   * @param strategy: Standalone interactive account of caller.
   * @param contributionAmount: The approved unit value of contribution.
   */
  function _compareBalance(address asset, address strategy, uint contributionAmount) internal view returns(uint256 spendable) {
    spendable = IERC20(asset).balanceOf(strategy);
    if(spendable < contributionAmount) revert IFactory.InsufficientFund();
  }

  /**
   * @dev Pulls and validate strategy account
   */
  function _validateStrategy(address target, function (address) internal view returns(address) getStrategy) internal view returns(address strategy) {
    strategy = getStrategy(target);
    strategy.notZeroAddress();
  }

  /**@dev Launches a fresh public band
   * @param self: Storage of type `Data`
   * @param cpp: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @param getStrategy : Return an interactive standalone account strategy.
   * @param _unlock: Function as parameter. It should unlock a function with related `Common.FuncTag'
   *                 when invoked.
   * Note: Only in private bands we ensure that amount selected for contribution does not exist.
   *       This is to ensure orderliness in the system, timeliness, and efficiency.
   */
  function createPermissionlessPool( 
    Data storage self, 
    Common.CreatePoolParam memory cpp,
    function (address) internal view returns(address) getStrategy,
    function (uint, Common.FuncTag) internal _unlock
  )
    internal
    returns (Common.CreatePoolReturnValueParam memory cpr)
  {
    Def memory _d = _def();
    address strategy = _validateStrategy(cpp.members[0], getStrategy);
    self.amountExist[cpp.value].assertFalse("Amount exist");
    self.amountExist[cpp.value] = _d.t;
    cpr.poolId = _generateGroupID(self);
    (cpr.pool, cpr.info, cpr.pos) = _createPool(
      self, 
      cpp, 
      _unlock, 
      strategy, 
      cpr.poolId,
      _addNewMember(self, cpr.poolId, strategy, _d.t, _d.t)
    );
  }

  /**@dev Launches a new private band
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
    returns (Common.CreatePoolReturnValueParam memory cpr) 
  {
    Def memory _d = _def();
    cpr.poolId = _generateGroupID(self);
    address admin = cpi.cpp.members[0];
    for(uint i = _d.zero; i < cpi.cpp.members.length; i++) {
      address strategy = _validateStrategy(cpi.cpp.members[i], cpi.getStrategy);
      if(i == _d.zero) {
        (cpr.pool, cpr.info, cpr.pos) = _createPool(
          self, 
          cpi.cpp, 
          cpi._unlock, 
          strategy, 
          cpr.poolId,
          _addNewMember(self, cpr.poolId, strategy, _d.t, _d.t)
        );
      } else {
        bool(cpi.cpp.members[i] != admin).assertTrue("Admin spotted twice");
        _addNewMember(self, cpr.poolId, strategy, _d.f, _d.t);
      }
    }
    self.pools[cpr.poolId].uints.quorum ++;
  }

  /**@dev Add user to a band.
   * We allow participant to hold more than one spot.
   * @param self: Storage ref.
   * @param abp: Parameter.
  */
  function addToBand(
    Data storage self,
    Common.AddTobandParam memory abp
  )
    internal
    returns (Common.Pool memory _pool, Common.StrategyInfo memory info) 
  {
    Common.Pool memory pool = _fetchPoolData(self, abp.poolId);
    address strategy = _validateStrategy(_msgSender(), abp.getStrategy);
    Def memory _d = _def(); 

    if(abp.isPermissioned) {
      info = requireIsMember(self, abp.poolId, strategy);
      Utils.assertTrue(pool.uints.quorum < _currentParticipants(self.strategies, abp.poolId), "Priv filled");
      self.pools[abp.poolId].uints.quorum ++;
    }

    if(!abp.isPermissioned) {
      Utils.assertTrue(_currentParticipants(self.strategies, abp.poolId) < pool.uints.quorum, "Pub filled");
      info = requireNotAMember(self, abp.poolId, strategy);
      _addNewMember(self, abp.poolId, strategy, _d.f, _d.t);
    }

    if(_isPoolFilled(self, abp.poolId)) {
      abp.lock(abp.poolId, Common.FuncTag.JOIN);
      abp.unlock(abp.poolId, Common.FuncTag.GET);
      _setTurnTime(self, strategy, abp.poolId);
    }
    _compareBalance(pool.addrs.asset, strategy, pool.uint256s.unit);
    unchecked {
      self.pools[abp.poolId].uint256s.currentPool += pool.uint256s.unit;
    }
    _pool = _fetchPoolData(self, abp.poolId); //==========================
    ISmartStrategy(strategy).safeWithdrawAsset(pool.addrs.asset, self.trustee, pool.uint256s.unit);
  }                                                                                  

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
  *   position = exp.position;
      If the caller is not the next on the queue to getfinance
      and the time to get finance for the expected account has passed.
  */
  function _updateMemberData(
    Data storage self,
    Common.UpdateMemberDataParam memory upm
  ) 
    private 
    returns (Common.StrategyInfo memory exp) 
  {
    Def memory _d = _def();
    _resetPoolBalance(self.pools, upm.poolId);
    address strategy = upm.expected;
    uint16 pos = _getPosition(self.positions, strategy, upm.poolId);
    exp = _getStrategyInfo(self.strategies, upm.poolId, pos);
    if(_now() > exp.turnTime + 30 minutes){
      strategy = upm.getStrategy(_msgSender());
      if(strategy != upm.expected) {
        requireIsMember(self, upm.poolId, strategy);
        (exp, pos) = _swapStrategyInfo(self ,exp, pos, upm.expected, strategy, upm.poolId);
      }
    }

    uint colBals = self.pData.token.computeCollateral(strategy, upm.pool.uints.ccr, upm.getPriceInUSD(), upm.pool.uint256s.currentPool);
    self.pools[upm.poolId].addrs.lastPaid = strategy;
    _incrementSelector(self.pools, upm.poolId);
    exp = Common.StrategyInfo(
      exp.isMember,
      exp.isAdmin,
      _now().add(upm.pool.uints.duration),
      exp.turnTime,
      upm.pool.uint256s.currentPool,
      colBals,
      _d.t,
      exp.id
    );
    _setStrategyInfo(self.strategies, exp, upm.poolId, pos);
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
   * @dev Swaps position if the caller is different from the expected
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
   * @param poolId: Pool Id.
   */
  function _swapStrategyInfo(
    Data storage self,
    Common.StrategyInfo memory _expInfo, 
    uint16 _expPos,
    address _expStrategy,
    address _actualStrategy,
    uint poolId
  ) private returns(Common.StrategyInfo memory _actInfo, uint16 _actPos) {
    _actPos = _getPosition(self.positions, _actualStrategy, poolId);
    _actInfo = _getStrategyInfo(self.strategies, poolId, _actPos);
    self.strategies[poolId][_actPos] = _expInfo;
    self.strategies[poolId][_expPos] = _actInfo;
    self.positions[_expStrategy][poolId] = _actPos;
    self.positions[_actualStrategy][poolId] = _expPos;
  }

  /**@dev Get finance: Sends current total contribution to the 
   * expected account and update respective accounts.
    @param self : Storage
    @param poolId : Pool Id.
    @param lock : Utility that lock a function when called.
    @param unlock : Utility that unlock a function when called.
    @param getStrategy : Return the strategy connected to an EOA.
    @param getPriceInUSD : Get the price of token i.e platform token.
  */
  function getFinance(
    Data storage self,
    uint poolId,
    function (uint, Common.FuncTag) internal lock,
    function (uint, Common.FuncTag) internal unlock,
    function (address) internal view returns(address) getStrategy,
    function () internal returns(uint) getPriceInUSD
  ) 
    internal
    returns(Common.StrategyInfo memory info)
  {
    lock(poolId, Common.FuncTag.GET);
    unlock(poolId, Common.FuncTag.PAYBACK);
    Common.Pool memory pool = _fetchPoolData(self, poolId);
    if(pool.allGh == pool.uints.quorum) revert IFactory.AllMemberIsPaid();
    _incrementAllGh(self.pools, poolId);
    bool(pool.uint256s.currentPool >= (pool.uint256s.unit.mul(pool.uints.quorum))).assertTrue("Pool not complete");

    uint mFee = pool.uint256s.currentPool.computeFee(self.pData.makerRate);
    info = _updateMemberData(
      self,
      Common.UpdateMemberDataParam(
        self.strategies[poolId][pool.uints.selector].id,
        poolId,
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
   * @param poolId: Pool id
   */
  function _enquireLiquidation(Data storage self, uint poolId) internal view returns (Common.Liquidation memory _liq, bool defaulted) {
    Common.Pool memory _p = _fetchPoolData(self, poolId);
    uint16 pos = _getPosition(self.positions, _p.addrs.lastPaid, poolId);
    Common.StrategyInfo memory info = _getStrategyInfo(self.strategies, poolId, pos);
    (_liq, defaulted) = _now() <= info.payDate ? (_liq, defaulted) : (Common.Liquidation(
      pos,
      _p.addrs.lastPaid,
      info.payDate,
      info.owings, 
      info.colBals
    ), _def().t);
  }

  function enquireLiquidation(Data storage self, uint poolId) external view returns (Common.Liquidation memory _liq, bool defaulted) {
    return _enquireLiquidation(self, poolId);
  }

  /**
    @dev Liquidates defaulter.
      - If the current beneficiary defaults, they're liquidated.
      - Their collateral balances is forwarded to the liquidator.
      - Liquidator must not be a participant in pool at `poolId`.
    @param self : Storage ref.
    @param lp : Parameters struct.
  */
  function liquidate(
    Data storage self,
    Common.LiquidateParam memory lp
  ) 
    internal
    returns (Common.StrategyInfo memory info)
  {
    (Common.Liquidation memory liquidated, bool defaulted) = _enquireLiquidation(self, lp.poolId);
    defaulted.assertTrue("No defaulter");
    address liquidator = lp.getStrategy(_msgSender());
    requireNotAMember(self, lp.poolId, liquidator);
    _compareBalance(self.pools[lp.poolId].addrs.asset, liquidator, liquidated.debt);
    ISmartStrategy(liquidator).safeWithdrawAsset(self.pools[lp.poolId].addrs.asset, self.trustee, liquidated.debt);

    info = payback(self, Common.PaybackParam(
      lp.poolId, 
      liquidated.target, 
      liquidator, 
      _getStrategyInfo(self.strategies, lp.poolId, _getPosition(self.positions, liquidated.target, lp.poolId)), 
      lp.lock, 
      lp.unlock
    )); 
  }

  /**
    @dev Cancels recent unfil band.
      Only admin of a band can cancel only if no one has join the band.
    @param self : Storage
    @param poolId : Pool Id.
    @param isPermissionLess : Whether band is public or not.
    @param getStrategy : Return the strategy connected to an EOA.
  */
  function cancelBand(
    Data storage self,
    uint poolId,
    bool isPermissionLess,
    function (address) internal view returns(address) getStrategy
  ) 
    internal
    returns (uint)
  {
    Common.Pool memory _p = _fetchPoolData(self, poolId);
    address strategy = getStrategy(_msgSender());
    requireIsMember(self, poolId, strategy);
    Def memory _d = _def();
    if(isPermissionLess) {
      bool(self.strategies[poolId].length == 1).assertTrue("Router: Cannot cancel");
      delete self.amountExist[_p.uint256s.unit];
    } else {
      bool(_p.uint256s.currentPool <= _p.uint256s.unit).assertTrue("15");
    }
    delete self.pools[poolId];
    ITrustee(self.trustee).safeTransferOut(_p.addrs.asset, strategy, _p.uint256s.unit, _d.zero);
    delete self.strategies[poolId];
    // poolId.safeClearSubscrition(_msgSender(), _d.zero, ISmartStrategy(strategy));
    
    return poolId;
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
    returns(Common.StrategyInfo memory info)
  {
    Common.Pool memory _p = _fetchPoolData(self, pb.poolId);
    bool(pb.expInfo.owings > 0).assertTrue("No debt");
    Def memory _d = _def();
    _compareBalance(_p.addrs.asset, pb.strategy, pb.expInfo.owings);
    ISmartStrategy(pb.strategy).safeWithdrawAsset(_p.addrs.asset, self.trustee, pb.expInfo.owings);
    pb.expInfo.owings = _d.zero;
    info = pb.expInfo;
    pb.unlock(pb.poolId, Common.FuncTag.GET);
    pb.lock(pb.poolId, Common.FuncTag.PAYBACK);
    _replenishPoolBalance(self.pools, pb.poolId);
    ITrustee(self.trustee).safeTransferOut(
      self.pData.token, 
      pb.colBalRecipient, 
      pb.expInfo.colBals,
      _d.zero
    );

    if(allIsGh(self.pools, pb.poolId)) _roundUp(self, pb.poolId, _p);
  }

  /**
    @dev Completes the current round {internal}.
    * @param self : Storage.
    * @param poolId : Pool Id.
    * @param pool : Pool data.
  */
  function _roundUp(
    Data storage self, 
    uint poolId,
    Common.Pool memory pool
  ) private {
    uint len = self.strategies[poolId].length;
    address[] memory _addrs = new address[](len);
    for(uint i = 0; i < len; i++) {
      _addrs[i] = self.strategies[poolId][i].id;
    }
    self.pools[poolId].uints.selector = 0;
    
    ITrustee(self.trustee).safeRegisterBeneficiaries(
      _addrs,
      pool.uint256s.unit,
      poolId,
      pool.addrs.asset
    );
    
    emit AllGh(poolId, pool);
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

