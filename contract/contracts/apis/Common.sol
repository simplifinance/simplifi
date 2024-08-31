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
    uint payDate;
    uint turnTime;
    uint owings;
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
    @param duration : The number of days the contribution contract will expires.
    @param colCoverage : Collateral Coverate Ratio : The ratio of collateral a member must hold 
                  in order to be able to get financed.
    @param value : The total value of pooled fund.
    @param members : List of members in a group.
    @param asset : The contract address of an approved assets in this group. 
                    @notice The pooled asset of this group is denominated in this currency. 
  */
  struct CreatePoolParam {
    uint quorum;
    uint duration;
    uint colCoverage; 
    uint unitContribution;
    address[] members;
    address asset;
    // address strategy;
  }

  /**
   *  @notice Structured types - uint256
   *  @param unit : Unit contribution.
   *  @param currentPool : Total contributed to date.
   */
  struct Uint256s {
    uint256 unit;
    uint256 currentPool;
  }

  /**
   *  @notice Structured types - unit8
   *  @param quorum : The maximum number of users that can form a contribution group.
   *  @param selector : This is like the hand or ticker of a clock that is used to select
   *                    the next participant to get finance.
   *  @param colCoverage : Collateral Coverate Ratio : The ratio of collateral a member must hold 
                  in order to be able to get financed.
      @param duration : The number of days the contribution contract will expires.
   */
  struct Uints {
    uint quorum;
    uint selector;
    uint colCoverage; // colCoverageRatio
    uint duration;
  }
  
  /**
   * @notice Structured types - Address
   * @param asset : Contract address of the asset in use.
   * @param lastPaid: Last contributor who got finance.
   * 
   */
  struct Addresses {
    address asset;
    address lastPaid;
    address strategy;
    address admin;
  }

  /**
   * @notice Liquidation data
   * @param position : Positional index of the defaulted contributor on the list of participants
   * @param target : The defaulter
   * @param expectedRepaymentTime : The period/time the defaulter is expected to repay the loan.
   * @param debt : Total debt balance of the defaulter.
   * @param colBalInToken : Collateral balance of the defaulter.
   */
  struct Liquidation {
    uint position;
    address target;
    uint expectedRepaymentTime;
    uint debt;
    uint colBalInToken;
  }

  struct LiquidateParam {
    uint epochId;
    bool isPermissionLess;
    function (uint, FuncTag) internal lock;
    function (uint, FuncTag) internal unlock;
    function (address) internal returns(address) getStrategy;
  }
  
  struct AddTobandParam {
    uint epochId;
    bool isPermissioned;
    // function (address) internal returns(address) getStrategy;
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
    address strategy;
    address colBalRecipient;
    Contributor contributor;
    function (uint, FuncTag) internal lock;
    function (uint, FuncTag) internal unlock;
  }

  struct UpdateMemberDataParam {
    address expected;
    uint epochId; 
    uint owings;
    uint fee;
    Pool pool;
    function () internal returns(uint) getPriceInUSD;
    function (address) internal returns(address) getStrategy;
  }

  struct CreatePermissionedPoolInputParam {
    CreatePoolParam cpp;
    function (address) internal returns(address) getStrategy;
    function (uint, FuncTag) internal _unlock;
  }

  error UpdateStrategyError();

}