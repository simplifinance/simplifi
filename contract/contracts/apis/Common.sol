// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface Common {
  /**
   * @dev Tags/Placeholders for functions available in the implementation contract.
   */
  enum FuncTag { 
    JOIN, 
    GET, 
    PAYBACK, 
    COMPLETE 
  }

  enum TransactionType { NATIVE, ERC20 }

  /**
   *  @dev Data for each pool. 
   *    Note: We use the term `allGh` to denote when every participant in a 
   *    group had get financed.
   *  @param isMember : Whether user is a member or not
   *  @param isAdmin: Whether user is an admin or not i.e the initiator.
   *  @param payDate: The data in future on which the borrowed fund must be retured
   *  @param turnTime : This is a period or interval between the last received and the next.
   *  @param owings: Total debts owed by the last fund recipient.
   *  @param colBals: Collateral balances of the last recipient.
   *  @param hasGH : Whether an user/current msg.sender has received or not.
   *  @param id : Address of the last recipient.  
   */
  struct Contributor {
    uint durOfChoice;
    uint expInterest;
    uint payDate;
    uint turnTime;
    uint loan;
    uint colBals;
    bool hasGH;
    address id;
  }

  struct Rank {
    bool admin;
    bool member;
  }

  /**
   *  @dev Pool data
   *  @param uints : Structured data of all unsigned integers type uint8.
   *  @param uint256s: Structured data of all unsigned integers type uint256.
   *  @param addrs : Structured data of all address type
   *  @param allGh : Total members already got financed.
   */
  struct Pool {
    Uints uints;
    Uint256s uint256s;
    Addresses addrs;
    uint allGh;
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
    uint unitContribution;
    address[] members;
    address asset;
  }

  /**
   *  @notice Structured types - uint256
   *  @param unit : Unit contribution.
   *  @param currentPool : Total contributed to date.
   */
  struct Uint256s {
    uint fullInterest;
    uint intPerSec;
    uint256 unit;
    uint256 currentPool;
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
   */
  struct Uints {
    uint quorum;
    uint selector;
    uint colCoverage;
    uint duration;
  }
  
  /**
   * @notice Structured types - Address
   * @param asset : Contract address of the asset in use.
   * @param lastPaid: Last contributor who got finance.
   * @param strategy : Strategy for each pool or epoch. See Strategy.sol for more details.
   * @param admin : Pool creator.
   * 
   */
  struct Addresses {
    address asset;
    address lastPaid;
    address strategy;
    address admin;
  }

  struct LiquidateParam {
    uint epochId;
    function (uint, FuncTag) internal lock;
    function (uint, FuncTag) internal unlock;
  }
  
  struct AddTobandParam {
    uint epochId;
    bool isPermissioned;
    function (uint, FuncTag) internal lock;
    function (uint, FuncTag) internal unlock;
  }

  struct CreatePoolReturnValue {
    Pool pool; 
    Contributor contributor; 
    uint epochId;
    uint16 spot;
  }

  struct PaybackParam {
    uint epochId;
    address user;
    function (uint, FuncTag) internal lock;
    function (uint, FuncTag) internal unlock;
  }

  struct UpdateMemberDataParam {
    uint48 durOfChoice;
    address expected;
    uint epochId; 
    uint fee;
    uint msgValue;
    uint xfiUSDPriceInDecimals;
    Pool pool;
  }

  struct CreatePermissionedPoolParam {
    CreatePoolParam cpp;
    function (uint, FuncTag) internal _unlock;
  }

  struct InterestReturn {
    uint fullInterest;
    uint intPerSec;
    uint48 durInSec;
  }

  struct CommonEventData {
    uint8 slot;
    Rank rank;
    Contributor cbData;
    Pool pool;
  }

  error UpdateStrategyError();
  error CollateralCoverageCannotGoBelow_100(uint24 ccr);

}