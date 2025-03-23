// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;
import { Counters } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol";
import { IERC20 } from "./IERC20.sol";

interface Common {
  /**
   * @dev Tags/Placeholders for functions available in the implementation contract.
   */

  enum Stage {
    JOIN, 
    GET, 
    PAYBACK, 
    WITHDRAW,
    CANCELED,
    ENDED
  }

  ////////////////////////////////////////////////////////// V3
  // enum Status { AVAILABLE, TAKEN }

  enum Router { PERMISSIONLESS, PERMISSIONED }

  struct Pool {
    LInt lInt;
    BigInt bigInt;
    Addresses addrs;
    Router router;
    Stage stage;
    Interest interest;

  }
    // Status status;

  struct Point {
    uint contributor;
    uint creator; 
  }

  /** 
   *  @param isMember : Whether user is a member or not
   *  @param turnStartTime: Time when the contributor's turn start to count.
   *  @param getFinanceTime: Date when loan was disbursed
   *  @param paybackTime: Date which the borrowed fund must be retured
   *  @param loan: Total debts owed by the last fund recipient.
   *  @param colBals: Collateral balances of the last recipient.
   *  @param sentQuota : Whether an user/current msg.sender has received or not.
   *  @param id : Address of the last recipient.    
  */
  struct Contributor {
    uint durOfChoice;
    uint paybackTime;
    uint turnStartTime;
    uint getFinanceTime;
    uint loan;
    uint colBals;
    address id;
    bool sentQuota;
    uint interestPaid;
  }

  // struct Rank {
  //   bool admin;
  //   bool member;
  // }

  
  struct UpdateMemberDataParam {
    uint24 durOfChoice;
    address expected;
    uint256 unit;
    uint uId;
    uint fee;
    uint128 colPriceInDecimals;
    Pool pool;
  }

  struct AddTobandParam {
    uint unit;
    bool isPermissioned;
  }

  struct GetPoolResult {
    Pool data;
    uint uId;
  }

  struct PaybackParam {
    uint unit;
    address user;
  }

  /**
    @dev Structured data types to convey parameters to avoid Stack too deep error.
    @param quorum : The maximum number of users that can form a contribution group.
    @param duration : The number of days the contribution contract will expires. It should be 
                      specified in hour.
    @param colCoverage : Collateral Coverate Ratio : The ratio of collateral a member must hold 
                  in order to be able to get financed. This should be specified in percentage i.e 
                  if raw ccr is 1.2 , actual ccr should be 1.2 * 100 = 120. It is pertinent to be
                  mindful how this works in our protocol. Even if ccr is 1 indicating that contributor
                  must hold at least 100% of collateral in their wallet before they can GF, it must 
                  be rendered in input section as 1 * 100. 100 is the minimum admins of bands
                  can give as collateral coverage ratio.
    @param value : The total value of pooled fund.
    @param members : List of members in a group.
    @param intRate : The rate of interest to charge for the duration of use of the fund.
    @param asset : The contract address of an approved assets in this group. 
                    @notice The pooled asset of this group is denominated in this currency. 
  */
  struct CreatePoolParam {
    uint16 intRate;
    uint8 quorum;
    uint16 duration;
    uint24 colCoverage; 
    uint unit;
    address[] members;
    address asset;
  }

  /**
   *  @notice Structured types - uint256
   *  @param unit : Unit contribution.
   *  @param currentPool : Total contributed to date.
   */
  struct BigInt {
    uint256 unit;
    uint256 currentPool;
    uint256 recordId;
  }

  /**
   *  @notice Structured types - unit less than uint124
   *  @param intRate : Rate of interest per duration. 
   *  @param quorum : The maximum number of users that can form a contribution group.
   *  @param selector : This is like the hand or ticker of a clock that is used to select
   *                    the next contributor to get finance.
   *  @param colCoverage : Collateral Coverate Ratio : The ratio of collateral a member must hold 
                  in order to be able to get financed.
      @param duration : The number of days the contribution contract will expires.
      @param cSlot : Slot ref No where the contributors are stored.
      @param allGh : Indicator showing whether all th members have been financed or not.
      @param userCount : Indicating the current number of contributors.
   */
  struct LInt {
    uint quorum;
    uint selector;
    uint colCoverage;
    uint duration;
    uint intRate;
    uint cSlot;
    uint allGh;
    uint userCount;
  }

  /**
   * @notice Structured types - Address
   * @param asset : Contract address of the asset in use.
   * @param lastPaid: Last contributor who got finance.
   * @param bank : Strategy for each pool or epoch. See Strategy.sol for more details.
   * @param admin : Pool creator.
   * 
   */
  struct Addresses {
    address asset;
    address lastPaid;
    address bank;
    address admin;
  }
  
  struct ReturnValue {
    Pool pool;
    uint uId;
    uint rId;
  }

  struct CreatePoolReturnValue {
    Pool pool;
    Contributor cData; 
  }

  struct Interest {
    uint fullInterest;
    uint intPerSec;
    uint intPerChoiceOfDur;
  }

  struct CommonEventData {
    Pool pool;
    uint debtBal;
    uint colBal;
  }

  // struct Contributor {
  //   Contributor cData;
  //   // Rank rank;
  //   // uint8 slot;
  // }

  struct Balances {
    uint collateral;
    uint assetBase;
  }

  struct DebtReturnValue {
    uint debt;
    uint pos;
  }

  struct SwapProfileArg {
    Slot expSlot;
    address expCaller;
    address actCaller;
    uint unit;
    uint cSlot;
    Contributor expcData;
  }

  struct Slot {
    uint value;
    bool isMember;
    bool isAdmin;
  }

  struct UpdateUserParam {
    Contributor cData;
    Slot slot;
    uint cSlot;
    uint256 unit;
    address user;
  }

  struct Price {
    uint128 price;
    uint8 decimals;
  }

  struct ReadDataReturnValue {
    Pool pool;
    Contributor[] cData;
  }

  struct Payback_Bank {
    address user; 
    address asset; 
    uint256 debt;
    uint256 attestedInitialBal;
    bool allGF; 
    Contributor[] cData;
    bool isSwapped;
    address defaulted;
    uint rId;
    IERC20 collateralToken;
  }

  error CollateralCoverageCannotGoBelow_100(uint24 ccr);
  error InsufficientAllowance();
  error TransferFailed();
  error UnitIsTaken();
  error SafeAddupFailed();
  error CurrentReceiverIsNotADefaulter();
  error CancellationNotAllowed();
  error TurnTimeHasNotPassed();
  error OnlyAdminIsAllowed();
  error PoolNotComplete();
  error PoolIsFilled();
  error NoDebtFound();
  error NotAMember();
  error UserDoesNotHaveAccess();

  // struct ViewFactoryData {
  //   Analytics analytics;
  //   uint currentEpoches;
  //   uint recordEpoches;
  //   uint makerRate;
  //   uint totalSafe;
  //   IERC20[] baseAssets; 
  // }

}