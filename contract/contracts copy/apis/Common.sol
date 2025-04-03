// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

interface Common {
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
        // address admin;
        // address beneficiary;
        // LowInt lInt;
        // BigInt bigInt;
        // Interest interest;
        LInt lInt;
        BigInt bigInt;
        Addresses addrs;
        Router router;
        Stage stage;
        Interest interest;
        Status status;
    }

    struct LowInt {
        uint quorum;
        uint selector;
        uint colCoverage;
        uint duration;
        uint intRate;
        uint cSlot;
        uint allGh;
        uint userCount;
    }

    struct BigInt {
        uint256 unit;
        uint256 currentPool;
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

    /**
     *  @param isMember : Whether user is a member or not
     *  @param turnStartTime: Time when the contributor's turn start to count.
     *  @param getFinanceTime: Date when loan was disbursed
     *  @param paybackTime: Date which the borrowed fund must be retured
     *  @param loan: Total debts owed by the last fund recipient.
     *  @param colBals: Collateral balances of the last recipient.
     *  @param sentQuota : Whether an user/current msg.sender has received or not.
     *  @param id : Address of the last recipient.
     * @param interestPaid : The amount of interest paid  
    */
    struct Contributor {
        uint paybackTime;
        uint turnStartTime;
        uint getFinanceTime;
        uint loan;
        uint colBals;
        address id;
        bool sentQuota;
        uint interestPaid;
    }

    struct Price {
        uint128 price;
        uint8 decimals;
    }

    struct Provider {
        uint slot;
        uint amount;
        uint rate;
        uint earnStartDate;
        address account;
    }
}