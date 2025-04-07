// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

interface Common {
    event PoolCreated(Pool);
    event NewContributorAdded(Pool);
    event GetFinanced(Pool);
    event Payback(Pool);
    event Liquidated(Pool);
    event Cancellation(uint unit);
    event PoolEdited(Pool);

    enum Stage {
        JOIN, 
        GET, 
        PAYBACK, 
        CANCELED,
        ENDED
    }

    enum Status { AVAILABLE, TAKEN }

    enum Branch { CURRENT, RECORD }

    enum Router { PERMISSIONLESS, PERMISSIONED }

    struct Pool {
        Low low;
        Big bigInt;
        Addresses addrs;
        Router router;
        Stage stage;
        Status status;
    }

    struct Low {
        uint8 maxQuorum;
        uint8 selector;
        uint24 colCoverage;
        uint32 duration;
        uint8 allGh;
        uint8 userCount;
    }

    struct Big {
        uint256 unit;
        uint256 currentPool;
        uint96 recordId;
        uint96 unitId;
    }

    struct Point {
        uint contributor;
        uint creator;
        uint referrals;
    }

    // struct Interest {
    //     uint fullInterest;
    //     uint intPerSec;
    //     uint intPerChoiceOfDur;
    // }

    /**
     * @notice Structured types - Address
     * @param asset : Contract address of the asset in use.
     * @param lastPaid: Last contributor who got finance.
     * @param safe : Strategy for each pool or epoch. See Strategy.sol for more details.
     * @param admin : Pool creator.
     * 
    */
    struct Addresses {
        address asset;
        address lastPaid;
        address safe;
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
        uint32 paybackTime;
        uint32 turnStartTime;
        uint32 getFinanceTime;
        uint loan;
        uint colBals;
        address id;
        bool sentQuota;
        // uint interestPaid;
        Providers[] providers;
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
        uint accruals;
    }

    struct Payback_Safe {
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

    struct Slot {
        uint value;
        bool isMember;
        bool isAdmin;
    }

    struct ReadDataReturnValue {
        Pool pool;
        Contributor[] cData;
    }

    struct UpdatePoolData {
        uint unit;
        uint96 unitId,
        uint96 recordId,
        uint8 maxQuorum;
        uint24 colCoverage;
        uint16 durationInHours;
        address creator;
    }

    struct Analytics {
        uint256 tvlCollateral;
        uint256 tvlBase;
        uint totalPermissioned;
        uint totalPermissionless;
    }
}