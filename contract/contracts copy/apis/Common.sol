// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

interface Common {
    error StatusShouldBeZeroOrOne();
    enum Stage {
        JOIN, 
        GET, 
        PAYBACK, 
        WITHDRAW,
        CANCELED,
        ENDED
    }

    enum Status { AVAILABLE, TAKEN }

    enum Branch { CURRENT, RECORD }

    enum Router { PERMISSIONLESS, PERMISSIONED }

    struct Safe {
        address id;
        bytes32 ownerHash;
    }

    struct Pool {
        address admin;
        address beneficiary;
        LowInt lInt;
        BigInt bigInt;
        Interest interest;
    }

    struct LowInt {
        uint quorum;
        // uint userCount;
        uint colCoverage;
        uint duration;
        Status status;
        Router router;
        Stage stage;
    }

    struct BigInt {
        uint unit;
        uint currentPool;
        uint recordId;
        uint unitId;
    }

    struct Point {
        uint contributor;
        uint creator; 
    }

    struct Interest {
        uint fullInterest;
        uint intPerSec;
        uint intPerChoiceOfDur;
    }

      /**
   *  @dev Data for each pool. 
   *  @param isMember : Whether user is a member or not
   *  @param payDate: The data in future on which the borrowed fund must be retured
   *  @param turnTime : This is a period or interval between the last received and the next.
   *  @param loan: Total debts owed by the last fund recipient.
   *  @param colBals: Collateral balances of the last recipient.
   *  @param sentQuota : Whether an user/current msg.sender has received or not.
   *  @param id : Address of the last recipient.  
   */
  struct Contributor {
    bool isMember;
    uint payDate;
    uint turnTime;
    uint loan;
    uint colBals;
    address id;
    bool sentQuota;
  }

struct Price {
    uint128 price;
    uint8 decimals;
  }
}