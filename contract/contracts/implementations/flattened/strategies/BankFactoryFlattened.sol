// Sources flattened with hardhat v2.22.17 https://hardhat.org

// SPDX-License-Identifier: MIT

// File contracts/apis/IOwnerShip.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;

/**
 * @title IOwnerShip 
 * Interface of the OwnerShip contract
 * @author Simplifi (Bobeu)
 */
interface IOwnerShip {
    function setPermission(
        address[] memory newOwners
    ) 
        external
        returns(bool);

    function removeOwner(
        address target
    ) 
        external
        returns(bool);

    function renounceOwnerShip() 
        external
        returns(bool);

    function getOwner(
        uint ownerId
    ) 
        external 
        view 
        returns(address);

    function isOwner(
        address target
    )
        external
        view 
        returns(bool);
}


// File contracts/implementations/OwnerShip.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
/**
 * @title MsgSender 
 * @author Simplifi (Bobeu)
 * @notice Non-deployable contract simply returning the calling account.
 */
abstract contract MsgSender {
    function _msgSender() internal view virtual returns(address sender) {
        sender = msg.sender;
    }
}

/**
 * @title OwnerShip contract cuts across all contracts in the Simplifinance ecosystem. Multiple accounts can be given ownership right to interact with 
 * ecosystem's smart contracts. It is a standalone contract for managing ownership in Simplifi protocol
 * @author Simplifinance Code written by Isaac Jesse (a.k.a Bobeu) Github: https://github.com/bobeu
 * @notice Accounts with ownership access cannot access users'fund. Users'funds are isolated from the main contract. Funds are 
 * managed in a special safe called Bank. Each of the pools operates a unique and reusable safe.
 */
contract OwnerShip is IOwnerShip, MsgSender{
    /**
     * @notice Number of owners.
     */
    uint public ownersCount;

    /**
     * @notice Addresses with ownership permission.
     */
    
    mapping (address => bool) private _isOwner;

    /**
     * @notice Mapping of ownersCount to addresses.
     * A valid id will return a mapped owner.
     */
    mapping (uint => address) public owners;

    /**
     * @dev Only owner is allowed.
     */
    modifier onlyOwner {
        require(_isOwner[_msgSender()], "Oop! Caller is not recognized");
        _;
    }

    constructor() {
        _setOwner(_msgSender(), true);
    }

    /**
     * @dev Returns owner variable.
     */
    function _getOwner(uint ownerId) 
        internal 
        view 
        returns(address _owner) 
    {
        _owner = owners[ownerId];
    }

    /**
     * @dev Add or remove target address as owner.
     * @param target: Target address.
     * @notice 'target' parameter must not be empty.
     */
    function _setOwner(
        address target,
        bool add
    ) 
        private 
    {
        require(target != address(0), "Simplifi OwnerShip: 'target' parameter is empty");
        add? (_isOwner[target] = true, ownersCount ++) : (_isOwner[target] = false, ownersCount --);
    }

    /**
     * @dev Add a new owner address
     * @param newOwners: New owners
     * @notice Only address with owner permission can add another owner.
     */
    function setPermission(
        address[] memory newOwners
    ) 
        external
        onlyOwner
        returns(bool) 
    {
        bool rt = true;
        for(uint r = 0; r < newOwners.length; r++) {
            _setOwner(newOwners[r], rt);
        }
        return rt;
    }

    /**
     * @dev Remove an address as owner.
     * @param target: Target address
     * @notice Only address with owner permission can remove another owner.
     */
    function removeOwner(
        address target
    ) 
        external
        onlyOwner
        returns(bool) 
    {
        _setOwner(target, false);
        return true;
    }
    /**
     * @dev An owner can renounce their ownership. This however will not leave the
     * contract empty without an owner. There must be at least one owner left.
     * @notice Only address with owner permission can renounce ownership.
     */
    function renounceOwnerShip() 
        external
        onlyOwner
        returns(bool) 
    {
        require(ownersCount > 1, "At least 2 owners is required to leave"); 
        _setOwner(_msgSender(), false);
        return true;
    }

    /**
     * @dev Returns owner variable.
     * Can be called externally by contracts.
     * @param ownerId : Owner Id. 
     */
    function getOwner(
        uint ownerId
    ) 
        external 
        view 
        returns(address) 
    {
        return _getOwner(ownerId);
    }

    /**
     * @dev Check if target is an owner.
     * @param target : Target address.
     */
    function isOwner(
        address target
    )
        external
        view 
        returns(bool) 
    {
        return _isOwner[target];
    }
}


// File contracts/abstracts/OnlyOwner.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
abstract contract OnlyOwner is MsgSender {
    error ManagerAddressIsZero();
    error NotPermittedToCall();

    IOwnerShip public ownershipManager;

    constructor(IOwnerShip _ownershipManager)
    {
        _setOwnershipManager(_ownershipManager);
    }

    /**
     * @notice Caller must have owner role before execeution can proceed.
     * The 'errorMessage' argument can be used to return error specific to 
     * a context e.g function call. 
     */
    modifier onlyOwner {
        IOwnerShip mgr = ownershipManager;
        if(address(mgr) == address(0)) revert ManagerAddressIsZero();
        if(!IOwnerShip(mgr).isOwner(_msgSender())) revert NotPermittedToCall();
        _;
    }

    function _setOwnershipManager(
        IOwnerShip newManager
    )
        private
    {
        ownershipManager = newManager;
    }

    /**
     * Set Ownership manager
     * @param newManager : New manager address
     */
    function setOwnershipManager(
        address newManager
    )
        public
        onlyOwner
        returns(bool)
    {
        _setOwnershipManager(IOwnerShip(newManager));
        return true;
    }
}


// File @thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol@v3.15.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/Counters.sol)

pragma solidity ^0.8.0;

/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 */
library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}


// File contracts/apis/IERC20Metadata.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity 0.8.24;

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 *
 * _Available since v4.1._
 */
interface IERC20Metadata {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}


// File contracts/apis/IERC20.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

pragma solidity 0.8.24;
/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 is IERC20Metadata{
    error NotCallable();
    error AddressIsZero(address);
    error NoPreviousLockDetected();

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);
    
    /** 
     * @dev Moves `amounts` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event for each transfer.
     * Note: BE AWARE OF THE GAS COST WHEN USING THIS FUNCTION. IT INCREASES 
                RELATIVE TO THE ACCOUNTS ARRAY
     */
    function batchTransfer(uint[] memory amounts, address[] memory accounts) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    /**@dev Locks specific amount of JFT to the private ledger.
        param: routeTo - Alternative address that funds will be sent to when panic call is made.
        param: amount - Amount to lock.
    */
    function lockToken(address routeTo, uint256 amount) external returns(bool);

    /**@dev Moves an 'amount' from private ledger to regular balances.
        @param amount - Amount to unlock.
        Note: If the lock duration was set, holder will not be able to unlock until the 
            set time has passed else they can withdraw to regular balance anytime.
     */
    function unlockToken(uint amount) external returns(bool);

    /** @dev Returns seperate balances of @param who
        return value will be in struct format having two values
     */
    function accountBalances(address who) external view returns(Balances memory);
   
    // /**@dev Return JFT's Metadata including the information of `who`
    //  */
    // function getInfo(address who) external view returns(Protected memory);

    /**
     * @dev PanicUnlock is meant to be invoked only by the Attorney.
     * It should only be called when JFT holder has lost access to their account and they had 
     * earlier initiated a lock. The locked token is simply unlocked and sent to an escape address
     * provided at the time the lock was activated.
     * 
     * Note: Attorney charges a fee for doing this. 
     * @param account : Account that owns this token.
     */
    function panicUnlock(address account, Balances memory _bal) external returns(bool);

    /**
     * @dev Same as lockToken except that this function is called by the Factory contract to 
     * lock collateral amount to user's wallet
     * @param target : Account to lock to token to.
     * @param _routeTo : Escape address.
     * @param amount : Amount to lock
     */
    function lockSpecial(
        address target, 
        address _routeTo, 
        uint256 amount
    ) external returns(bool);

    struct Protected {
        uint256 value; // Total value currently locked
        address escapeTo;
    }

    struct Balances {
        uint256 spendable;
        Protected locked;
    }

    struct TokenInfo {
        uint8 decimals;
        uint256 totalSupply;
        string name;
        string symbol;
        address attorney;
        // address rewarder;
    }
}


// File contracts/apis/Common.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
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
  enum Status { AVAILABLE, TAKEN }

  enum Router { PERMISSIONLESS, PERMISSIONED }

  struct Pool {
    LInt lInt;
    BigInt bigInt;
    Addresses addrs;
    Router router;
    Stage stage;
    Interest interest;
    Status status;
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
    uint rId;
    uint uId;
    bool isTaken;
  }

  /**
   *  @notice Structured types - uint256
   *  @param unit : Unit contribution.
   *  @param currentPool : Total contributed to date.
   */
  struct BigInt {
    uint256 unit;
    uint256 currentPool;
    uint recordId;
    uint unitId;
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


// File contracts/apis/IBank.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
interface IBank {
  error AssetTransferFailed();
  
  function addUp(address user, uint rId) external returns(bool);
  function getFinance(
    address user, 
    address asset, 
    uint256 loan, 
    uint fee, 
    uint256 calculatedCol,
    uint rId
  ) 
    external 
    returns(uint);

  function payback(Common.Payback_Bank memory) external returns(bool);
  function cancel(address user, address asset, uint unit, uint rId) external returns(bool);
  function getData() external view returns(ViewData memory);

  struct ViewData {
    uint totalClients;
    uint aggregateFee;
  }

  struct ViewUserData {
    bool access;
    uint collateralBalance;
  }
}


// File @thirdweb-dev/contracts/external-deps/openzeppelin/security/ReentrancyGuard.sol@v3.15.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}


// File @thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol@v3.15.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.6.0) (utils/math/SafeMath.sol)

pragma solidity ^0.8.0;

// CAUTION
// This version of SafeMath should only be used with Solidity 0.8 or later,
// because it relies on the compiler's built in overflow checks.

/**
 * @dev Wrappers over Solidity's arithmetic operations.
 *
 * NOTE: `SafeMath` is generally not needed starting with Solidity 0.8, since the compiler
 * now has built in overflow checking.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}


// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


// File @openzeppelin/contracts/utils/Address.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/Address.sol)

pragma solidity ^0.8.20;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev The ETH balance of the account is not enough to perform the operation.
     */
    error AddressInsufficientBalance(address account);

    /**
     * @dev There's no code at `target` (it is not a contract).
     */
    error AddressEmptyCode(address target);

    /**
     * @dev A call to an address target failed. The target may have reverted.
     */
    error FailedInnerCall();

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason or custom error, it is bubbled
     * up by this function (like regular Solidity function calls). However, if
     * the call reverted with no returned reason, this function reverts with a
     * {FailedInnerCall} error.
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        if (address(this).balance < value) {
            revert AddressInsufficientBalance(address(this));
        }
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
     * was not a contract or bubbling up the revert reason (falling back to {FailedInnerCall}) in case of an
     * unsuccessful call.
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata
    ) internal view returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            // only check if target is a contract if the call was successful and the return data is empty
            // otherwise we already know that it was a contract
            if (returndata.length == 0 && target.code.length == 0) {
                revert AddressEmptyCode(target);
            }
            return returndata;
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
     * revert reason or with a default {FailedInnerCall} error.
     */
    function verifyCallResult(bool success, bytes memory returndata) internal pure returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            return returndata;
        }
    }

    /**
     * @dev Reverts with returndata if present. Otherwise reverts with {FailedInnerCall}.
     */
    function _revert(bytes memory returndata) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert FailedInnerCall();
        }
    }
}


// File contracts/libraries/SafeCallERC20.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
library SafeCallERC20 {
  using Address for address;

  function safeTransfer(
    IERC20 token,
    address to,
    uint256 value
  ) internal {
    _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
  }

  function safeTransferFrom(
    IERC20 token,
    address from,
    address to,
    uint256 value
  ) internal {
    _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
  }

  function safeIncreaseAllowance(
    IERC20 token,
    address spender,
    uint256 value
  ) internal {
    uint256 newAllowance = token.allowance(address(this), spender) + value;
    _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
  }

  function safeDecreaseAllowance(
    IERC20 token,
    address spender,
    uint256 value
  ) internal {
    unchecked {
      uint256 oldAllowance = token.allowance(address(this), spender);
      require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
      uint256 newAllowance = oldAllowance - value;
      _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }
  }

  /** Imported from Openzeppelin
   * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
   * on the return value: the return value is optional (but if data is returned, it must not be false).
   * @param token The token targeted by the call.
   * @param data The call data (encoded using abi.encode or one of its variants).
   */
  function _callOptionalReturn(IERC20 token, bytes memory data) private {
    // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
    // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
    // the target address contains contract code and also asserts for success in the low-level call.

    bytes memory returndata = address(token).functionCall(data);
    if (returndata.length > 0) {
      // Return data is optional
      require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation failed");
    }
  }
}


// File contracts/implementations/strategies/Bank.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;

// import "hardhat/console.sol";
contract Bank is IBank, OnlyOwner, ReentrancyGuard {
    using SafeMath for uint;

    // Number of contributors currently operating this safe
    uint private userCount;

    // Total fee collected
    uint private aggregateFee;

    // Collateral token
    // IERC20 public collateralToken;

    // Fee Receiver
    address public feeTo;

    // Mapping of user to record Id to access
    mapping(address => mapping(uint => bool)) private access;

    // Mapping of users to unitId to Collateral
    mapping(address => mapping(uint => uint256)) private collateralBalances;

    ///@dev Only users with access role are allowed
    modifier hasAccess(address user, uint rId) {
        if (!access[user][rId]) revert Common.UserDoesNotHaveAccess();
        _;
    }

    /**
     * @dev Initializes state variables.
     * OnlyOwner function.
     */
    constructor(
        IOwnerShip _ownershipManager,
        address _feeTo
    ) OnlyOwner(_ownershipManager) {
        feeTo = _feeTo;
    }

    receive() external payable {
        (bool s, ) = feeTo.call{value: msg.value}("");
        require(s);
    }

    /**
     * @dev Registers new user
     * @param user New user

    */
    function _addUser(address user, uint rId) private {
        assert(!access[user][rId]);
        access[user][rId] = true;
    }

    /**
     * @dev Implementation of IBank.addUp
     * See IBank.addUp
     */
    function addUp(address user, uint rId) external onlyOwner returns (bool) {
        unchecked {
            userCount++;
        }
        _addUser(user, rId);
        return true;
    }

    /**
     * @dev UnLocks collateral balances
     * @param user Existing user

    */
    function _removeUser(address user, uint rId) private {
        assert(access[user][rId]);
        if(userCount > 0) {
            userCount--;
        }
        access[user][rId] = false;
    }

    /**
     * @dev Approve spender contributor 'to' to spend from contract's balance
     * @param to : Contributor
     * @param asset : Currency in use
     * @param amount : Value
     * @notice Consideration is given to the previous allowances given to users.
     */
    function _setAllowance(address to, address asset, uint256 amount) private {
        uint prev = IERC20(asset).allowance(address(this), to);
        IERC20(asset).approve(to, amount.add(prev));
    }

    /**
     * @dev End the current epoch
     * @param asset : AssetBase
     * @param cData : Contributors data
     */
    function _tryRoundUp(
        address asset,
        Common.Contributor[] memory cData
    ) internal {
        uint erc20Balances = IERC20(asset).balanceOf(address(this));
        uint fees = aggregateFee;
        if (erc20Balances > 0) {
            if (erc20Balances > fees && fees > 0) {
                erc20Balances -= fees;
                aggregateFee = 0;
                if (!IERC20(asset).transfer(feeTo, fees))
                    revert AssetTransferFailed();
            }
            if (erc20Balances > 0) {
                fees = erc20Balances.div(cData.length); // Reusing the fee memory slot
                for (uint i = 0; i < cData.length; i++) {
                    address to = cData[i].id;
                    _setAllowance(to, asset, fees);
                }
            }
        }
        userCount = 0;
    }

    /**
     * @dev Get Finance - We send USD to user and accept collateral.
     * @param user : Beneficiary.
     * @param asset : Asset base
     * @param loan : Amount to receive as loan.
     * @param fee : Amount charged as platform fee
     * @param calculatedCol : Amount required to pay as collateral
     * @param rId : Record Id
     */
    function getFinance(
        address user,
        address asset,
        uint256 loan,
        uint fee,
        uint256 calculatedCol,
        uint rId
    ) external hasAccess(user, rId) onlyOwner returns (uint) {
        assert(asset != address(0) && user != address(0));
        collateralBalances[user][rId] = calculatedCol;
        uint loanable = loan;
        if (fee > 0) {
            unchecked {
                aggregateFee += fee;
                if (loanable > fee) {
                    loanable -= fee;
                }
            }
        }
        _setAllowance(user, asset, loanable);
        return loan;
    }

    /**
     * @dev Pays back loan
     * @param _p : Parameters of type PaybackParam
     * _p.user : Current txn.origin not msg.sender
     * _p.asset : Asset base
     * _p.debt : Amount owing by user
     * _p.attestedInitialBal : Initial recorded balance of this contract before asset was transfered from the user.
     * _p.allGF : Whether all the contributors have get finance or not
     * _p.cData : Contributors data
     * _p.isSwapped : If isSwapped is true, meaning the actual contributor defaulted.
     * _p.defaulted : Address of the defaulted
     * _p.rId : Record Id. Every pool has a record Id i.e pool.bigInt.recordId
     */
    function payback(Common.Payback_Bank memory _p) 
        external 
        onlyOwner 
        hasAccess(_p.isSwapped? _p.defaulted : _p.user, _p.rId) 
        returns (bool) 
    {
        uint col = collateralBalances[_p.user][_p.rId];
        if (_p.isSwapped) {
            col = collateralBalances[_p.defaulted][_p.rId];
            collateralBalances[_p.defaulted][_p.rId] = 0;
            _removeUser(_p.defaulted, _p.rId);
        } else {
            _removeUser(_p.user, _p.rId);
        }
        collateralBalances[_p.user][_p.rId] = 0;
        
        assert(
            IERC20(_p.asset).balanceOf(address(this)) >=
                (_p.attestedInitialBal + _p.debt)
        );
        _setAllowance(_p.user, address(_p.collateralToken), col);
        if (_p.allGF) _tryRoundUp(_p.asset, _p.cData);
        return true;
    }

    /**
     * Called when a contributor remove a pool
     * @param user : Contributor
     * @param asset : Asset base
     * @param unit : Unit contribution
     * @param rId : Record Id
     */
    function cancel(
        address user,
        address asset,
        uint unit,
        uint rId
    ) external onlyOwner hasAccess(user, rId) returns (bool) {
        _setAllowance(user, asset, unit);
        _removeUser(user, rId);
        return true;
    }

    /**
     * @dev Returns Safe-related data
     */
    function getData() external view returns (ViewData memory) {
        return ViewData(userCount, aggregateFee);
    }

    /**
     * @dev Returns User-related data
     * @param user : Contributor
     * @param rId : Record Id
     */
    function getUserData(
        address user,
        uint rId
    ) external view returns (ViewUserData memory) {
        return ViewUserData(access[user][rId], collateralBalances[user][rId]);
    }

}



    // function withdrawFee(
    //     address recipient, 
    //     address asset
    // ) 
    //     external 
    //     nonReentrant 
    //     onlyOwner
    // {
    //     uint fees = aggregateFee;
    //     if(fees == 0) revert NoFeeToWithdraw();
    //     if(asset == address(0)) revert TokenAddressIsZero();
    //     aggregateFee = 0;
    //     IERC20(asset).transfer(recipient, fees);


    // }

        // assert(asset != address(0) && user != address(0));
        // Collateral memory col = collateralBalances[user][rId];
        // uint primaryBal = col.balance.add(msg.value);
        // if(calculatedCol <= primaryBal){
        //     col.withdrawable = col.withdrawable.add(primaryBal.sub(calculatedCol));
        // } else {
        // uint agBalance = col.balance.add(msg.value).add(col.withdrawable);
        // require(agBalance >= calculatedCol, "Aggregate balances is insufficient");
        // col.withdrawable = agBalance.sub(calculatedCol);
        // }
        // col.balance = calculatedCol;
        // collateralBalances[user][rId] = col;
        // primaryBal = loan;
        // if(fee > 0) {
        // unchecked {
        //     aggregateFee += fee;
        // }
        // if(loan > fee){
        //     unchecked {
        //     primaryBal -= fee;
        //     }
        // }

        // }
        // _setAllowance(user, asset, primaryBal);
        // return loan;

        // assert(IERC20(asset).balanceOf(address(this)) >= (attestedInitialBal + debt));
        // Collateral memory col = collateralBalances[user][rId];
        // if(isSwapped) {
        // col = collateralBalances[defaulted][rId];
        // delete collateralBalances[defaulted][rId];
        // collateralBalances[user][rId] = col; 
        // _removeUser(defaulted, rId);
        // _addUser(user, rId);

        // }
        // collateralBalances[user][rId] = Collateral(0, col.withdrawable.add(col.balance));
        // if(allGF) { _tryRoundUp(asset, cData); }


    // /**
    //  *  @dev Withdraw Collateral.
    //  * @param rId : Record Slot
    //  */
    // function withdrawCollateral(uint rId) 
    //     public 
    //     hasAccess(_msgSender(), rId)
    //     nonReentrant
    //     returns(bool) 
    // {
    //     address caller = _msgSender();
    //     Collateral memory col = collateralBalances[caller][rId];
    //     uint balances = address(this).balance;
    //     if(col.withdrawable == 0) revert ZeroWithdrawable();
    //     if(col.balance == 0){
    //     _removeUser(caller, rId);
    //     delete collateralBalances[caller][rId];
    //     } else {
    //     collateralBalances[caller][rId].withdrawable = 0;
    //     }
    //     require(balances >= col.withdrawable, "Balance Anomaly");
    //     payable(caller).transfer(col.withdrawable);
    //     return true;
    // }

    //     /**
    //  * @notice User can deposit collateral ahead of time
    //  * @param amount msg.value
    //  * @param rId : Record Slot
    //  */
    // function _depositCollateral(uint amount, uint rId) 
    //     internal
    //     hasAccess(_msgSender(), rId)
    // {
    //     unchecked {
    //     collateralBalances[_msgSender()][rId].withdrawable += amount;
    //     }
    // }



// // import "hardhat/console.sol";
// import { SafeMath } from "@thirdweb-dev/contracts/external-deps/openzeppelin/utils/math/SafeMath.sol";
// import { ReentrancyGuard } from "@thirdweb-dev/contracts/external-deps/openzeppelin/security/ReentrancyGuard.sol";
// import { SafeCallERC20, IERC20 } from "../../libraries/SafeCallERC20.sol";
// import { IBank } from "../../apis/IBank.sol";
// import { Common } from "../../apis/Common.sol";
// import { OnlyOwner } from "../../abstracts/OnlyOwner.sol";

// contract Bank is IBank, OnlyOwner, ReentrancyGuard {
//   using SafeMath for uint;

//   // Number of contributors currently operating this safe
//   uint private userCount;

//   // Total fee generated from the contributors
//   uint private aggregateFee;

//   // Fee Receiver
//   address public feeTo;

//   // Collateral token
//   IERC20 public collateralToken;

//   // Mapping of unitId to addresses
//   mapping (uint => address[]) private usersLists;

//   // Mapping of user to unitId to access
//   mapping (address => mapping(uint => User)) private access;

//   // Mapping of users to unitId to Collateral
//   mapping (address => mapping(uint => uint256)) private collateralBalances;

//   ///@dev Only users with access role are permitted
//   modifier hasAccess(address user, uint unitId) {
//     if(!access[user][unitId]) revert AccessDenied();
//     _;
//   }

//   /**
//    * @dev Initializes state variables.
//    * OnlyOwner function.
//    */
//   constructor (
//     address _ownershipManager, 
//     address _feeTo,
//     IERC20 _collateralToken
//   ) OnlyOwner(_ownershipManager)  {
//     feeTo = _feeTo;
//     collateralToken = _collateralToken;
//   }

//   receive() external payable {
//     (bool s,) = ownershipManager.call{value: msg.value}('');
//     require(s);
//   }

//   /**
//    * @dev Registers new user
//    * @param user New user
//    * @param unitId : Unit Id
//    */
//   function _addNewUser(address user, uint unitId, Users memory usr) private {
//     access[user][unitId] = usr;
//     usersLists[unitId].push(user);
//   }

//   /**
//    * @dev Implementation of IBank.addUp
//    * See IBank.addUp
//   */
//   function addUp(address user, uint unitId) 
//     external
//     onlyOwner
//   {
//     userCount ++;
//     _addNewUser(user, unitId, Users(true, usersLists[unitId].length));
//   }

//   /**
//    * @dev Swap two addresses without incrementing userCount
//   */
//   function _swap(address oldUser, address newUser, uint unitId) 
//     internal
//   {
//     // _removeUser(oldUser, unitId);
//     Users memory usr = access[oldUser][unitId];
//     Users memory usr_new = access[newUser][unitId];
//     if(usr_new.hasAccess) {
//       access[oldUser][unitId] = usr_new;
//       usersLists[unitId][usr_new.index] = oldUser;
//     }
//     access[newUser][unitId] = usr;
//     usersLists[unitId][usr.index] = newUser;
//   }

//   /**
//    * @dev UnLocks collateral balances
//    * @param user Existing user
//    * @param unitId : Unit Id
//    */
//   function _removeUser(address user, uint unitId) private {
//     Users memory usr = access[user][unitId];
//     if(usr.hasAccess) {
//       access[user][unitId] = Users(false, 0);
//       usersLists[unitId][usr.index] = address(0);
//     }
//   }

//   /**
//    * @dev Approve spender contributor 'to' to spend from contract's balance
//    * @param to : Contributor
//    * @param asset : Currency in use
//    * @param amount : Value
//    * @notice Consideration is not given to the previous allowances given to users.
//    *          Users are expected to withdraw allowances immediately they complete 
//    *          related transactions such as 'getFinance'.
//    */
//   function _setAllowance(
//     address to, 
//     IERC20 asset, 
//     uint256 amount
//   ) 
//     private 
//   {
//     IERC20(asset).approve(to, amount);
//   }

//   /**
//    * @dev Complete a round if all the contributors have been financed 
//    * @param asset : Base asset used for contribution.
//    * @param unitId : Unit Id or pool Id
//    */
//   function _tryRoundUp(IERC20 asset, uint unitId) internal {
//     uint erc20Balances = IERC20(asset).balanceOf(address(this));
//     uint fees = aggregateFee;
//     if(erc20Balances > 0) {
//       if(erc20Balances > fees && fees > 0) {
//         erc20Balances -= fees;
//         aggregateFee = 0;
//         if(!IERC20(asset).transfer(feeTo, fees)) revert AssetTransferFailed();
//       }
//       address[] memory users = usersLists[unitId];
//       if(erc20Balances > 0) {
//         fees = erc20Balances.div(users.length); // Reusing the fee memory slot
//         for(uint i = 0; i < users.length; i++) {
//           address to = users[i].id;
//           _setAllowance(to, asset, fees);
//         }
//       }
//     }
//     userCount = 0;
//   }

//   /**
//    * @dev Get Finance - We send USD to user and accept collateral.
//    * @param user : Beneficiary.
//    * @param loan : Amount to receive as loan.
//    * @param asset : base asset
//    * @param fee : Fee collacted
//    * @param calculatedCol : Collateral amount user is expected to deposit
//    * @param unitId : Unit Id
//    */
//   function getFinance(
//     address oldUser, 
//     IERC20 asset, 
//     uint256 loan, 
//     uint fee, 
//     uint256 calculatedCol,
//     uint unitId,
//     bool swap,
//     address newUser
//   ) 
//     external 
//     onlyOwner
//     returns(uint) 
//   {
//     assert(address(asset) != address(0) && user != address(0));
//     address user = oldUser;
//     if(swap) {
//       user = newUser;
//       if(oldUser != newUser) _swap(oldUser, newUser, unitId);
//     };
//     IERC20 token = collateralToken;
//     collateralBalances[user][unitId] = calculatedCol;
//     uint loanable = loan;
//     if(fee > 0) {
//       unchecked {
//         aggregateFee += fee;
//       }
//       if(loan > fee){
//         unchecked {
//           loanable -= fee;
//         }
//       }

//     }
//     _setAllowance(user, asset, loanable);
//     return loan;
//   }

//   /**
//    * @dev Payback loan
//    * @param user : User. Not msg.sender
//    * @param asset : Base asset in use
//    * @param debt : amount owe as debt
//    * @param attestedInitialBal : Initial balance that was recorded before execution get to this point
//    * @param allGF : If all has get finance or not
//    * @param cData : Contributors array
//    * @param isSwapped : If the expected contributor defaults, and they're being liquidated, this flag becomes true
//    * @param defaulted : Defaulted account
//    * @param unitId : Unit Id
//    */
//   function payback(
//     address user, 
//     IERC20 asset, 
//     uint256 debt,
//     uint256 attestedInitialBal,
//     bool allGF, 
//     bool isSwapped,
//     address defaulted,
//     uint unitId
//   ) external onlyOwner{
//     uint col = collateralBalances[user][unitId];
//     if(isSwapped) {
//       col = collateralBalances[defaulted][unitId];
//       collateralBalances[defaulted][unitId] = 0;
//       _swap(defaulted, user, unitId);
//     }
//     assert(IERC20(asset).balanceOf(address(this)) >= (attestedInitialBal + debt));
//     _setAllowance(user, collateralToken, col);
//     if(allGF) _tryRoundUp(asset, unitId);
//   }

//   function cancel(
//     address user, 
//     IERC20 asset, 
//     uint unit,
//     uint unitId
//   ) external onlyOwner  {
//     _setAllowance(user, asset, unit);
//     _removeUser(user, unitId);
//   }

//   /**
//    * @dev Alternate way of withdrawing collateral balance if user forget to do so before this safe
//    * is transfered to a new set of contributors. It is advisable to withdraw collaterals before an epoch is 
//    * completed.
//    * @param poolId : Poolid or unitId
//    * @param asset : Asset that was in the pool 
//    */
//   function withdrawCollateralFromPool(uint poolId, IERC20 asset) public nonReentrant returns(bool) {
//     uint colBal = collateralBalances[_msgSender()][poolId];
//     require(colBal > 0, "Zero");
//     if(address(asset) == address(0)) revert InvalidIERC20Contract();
//     collateralBalances[user][poolId] = 0;
//     if(IERC20(collateralToken).balanceOf(address(this)) < colBal) revert InsufficientContractBalance();
//     _setAllowance(_msgSender(), asset, colBal);
//     return true;
//   }

//   function getData() external view returns(ViewData memory) {
//     return ViewData(userCount, aggregateFee);
//   }

//   function getUserData(address user, uint unitId) external view returns(ViewUserData memory) {
//     return ViewUserData(
//       access[user][unitId],
//       collateralBalances[user][unitId]
//     );
//   }

// }


// File contracts/apis/IBankFactory.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title Interface of the Bank manager
 * @author : Simplifinance
 */
interface IBankFactory {
  error ZeroAddress(address);
  
  /**
   * Query bank for user
   * @param unit : Address to get bank for
   * @return A bank if none was found, it returns address(0).
   */
  function getBank(uint256 unit) external view returns(address);
  // function getBank(address user) external view returns(address);

/**
 * Clones and return a new bank 
 * @param unit : Target address for whom to create bank
 */
  function createBank(uint256 unit) external returns(address bank);

  /**
   * Bank struct map
   * key: user address { EOA }
   * value: Bank { Contract } 
   */
  struct BankData {
    address key;
    address value;
  }

}


// File contracts/implementations/strategies/BankFactory.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
/**@title SmartBankAdmin: A standalone contract that manages bank creation, 
   deletion, read and write data.

   Author: Simplifinance
 */
contract BankFactory is IBankFactory, OnlyOwner {
  // using Clones for address;

  // Bank count 
  uint public totalBanks;

  address public feeTo;

/**
 * @dev List of Strategies and their keys 
 */
  // BankData[] private strategies;

 /**
 * @dev Mapping of addresses to strategies.
 * Also used as reverse map of strategies to status.
 */
  mapping(uint256 => address) private bankMap;

  constructor (IOwnerShip _ownershipManager, address _feeTo) OnlyOwner(_ownershipManager) {
    feeTo = _feeTo;
  }

  receive() 
    external 
    payable 
  {
    revert();
  }
  
  /**@dev Return if account owns a bank or not
  */
  function _hasBank(
    uint256 unit
  ) 
    internal 
    view 
    returns (bool) 
  {
    return bankMap[unit] != address(0);
  }

  // Returns smartBank for 'user'
  function _getBank(
    uint256 unit
  ) 
    internal 
    view returns(address) 
  { 
    return bankMap[unit];
  }
  
  // function _getBank(
  //   address user
  // ) 
  //   internal 
  //   view returns(address) 
  // { 
  //   return bankMap[user];
  // }
  
  /**@dev Create a new bank.
   * @notice 'unit' should not own a bank before now.
   *          only address with owner permission can call.
  */
  function createBank(
    uint256 unit
  )
    external
    onlyOwner
    returns(address _bank) 
  {
    if(!_hasBank(unit)){
      _bank = _createBank(unit);
    } else {
      _bank = _getBank(unit);
    }
    return _bank;
  }

  /**
    * @param unit : Amount
   * 
   * @notice Even if user is trying to rekey or upgrade smartbank, same amount of fee is required
   * for successful upgrade.
   */
  function _createBank(
    uint256 unit
  ) 
    private 
    returns(address bank) 
  {
    totalBanks ++;
    // address ssi = instance;
    // bank = ssi.cloneDeterministic(keccak256(abi.encodePacked(totalBanks, caller)));
    bank = address(new Bank(ownershipManager, feeTo));
    _updateBank(unit, bank);
  }

  /**
   * Update storage with the new Bank instance : {internal}
   * @param unit : Unit amount 
   * @param bank : New Bank address
   */
  function _updateBank(
    uint256 unit, 
    address bank
  ) 
    private 
  {
    bankMap[unit] = bank;
  }

  /// Returns then bank for 'unit'
  /// @param unit : Unit amount
  function getBank(
    uint unit
  ) 
    external 
    view 
    returns(address) 
  { 
    return _getBank(unit);
  }

  function setFeeTp(address newFeeTo) public onlyOwner {
    feeTo = newFeeTo;
  }
}
