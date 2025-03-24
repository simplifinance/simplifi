// Sources flattened with hardhat v2.22.17 https://hardhat.org

// SPDX-License-Identifier: MIT

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


// File @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 */
interface IERC20Metadata is IERC20 {
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


// File contracts/abstracts/Pausable.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 * 
 * We use part of the Openzeppelin Pausable contract to supplement our strategy.
 * Thanks to the OZ team.
 */
abstract contract Pausable is OnlyOwner {
    bool private _paused;

    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    /**
     * @dev The operation failed because the contract is paused.
     */
    error EnforcedPause();

    /**
     * @dev The operation failed because the contract is not paused.
     */
    error ExpectedPause();

    /**
     * @dev Initializes the contract in unpaused state.
     */
    constructor(
        IOwnerShip _ownershipManager
    ) OnlyOwner(_ownershipManager) {
        _paused = false;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     * Only owner role can call.
     * - The contract must not be paused.
     */
    function pause() 
        public 
        onlyOwner
        whenNotPaused 
    {
        _paused = true; 
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     * - Only owner role can call.
     * - The contract must be paused.
     */
    function unpause() 
        public 
        onlyOwner 
        whenPaused 
    {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}


// File contracts/apis/IAssetClass.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;

interface IAssetClass {
  error UnSupportedAsset(address);
  error Locked();
  
  function isSupportedAsset(
    address _asset
  ) 
    external 
    view returns(bool);
}


// File contracts/apis/IDIAOracleV2.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;

interface IDIAOracleV2 {
    function getValue(string memory key) 
        external 
        view 
        returns(uint128 price, uint128 timestamp);
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


// File contracts/apis/IFactory.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
interface IFactory is Common {
  error InsufficientFund();
  error AllMemberIsPaid();
  error QuorumIsInvalid();
  error OracleAddressIsZero();
  error OwnershipManagerIsNotSet();
  error MinimumParticipantIsTwo();
  error AmountLowerThanMinimumContribution();

  event PoolCreated(Pool);
  event NewContributorAdded(Pool);
  event GetFinanced(Pool);
  event Payback(Pool);
  event Liquidated(Pool);
  event Cancellation(uint epochId);

  // event RoundUp(uint, Pool);
  // event Rekeyed(address indexed, address indexed);
  
  function getEpoches() external view returns(uint);
  function createPermissionlessPool(
    uint16 intRate,
    uint8 quorum,
    uint16 durationInHours,
    uint24 colCoverage,
    uint unitLiquidity,
    address liquidAsset
  ) 
    external 
    returns(bool);

  function createPermissionedPool(
    uint16 intRate,
    uint16 durationInHours,
    uint24 colCoverage,
    uint unitLiquidity,
    address liquidAsset,
    address[] memory contributors
  ) 
    external 
    returns(bool);

  function payback(uint256 unit) external returns(bool);
  function joinAPool(uint256 unit) external returns(bool);
  function liquidate(uint256 unit) external returns(bool);
  function removeLiquidityPool(uint256 unit) external returns(bool);
  function getFinance(uint256 unit, uint8 daysOfUseInHr) external returns(bool);
  function getPoolData(uint256 unitId) external view returns(ReadDataReturnValue memory);
  function getRecord(uint256 rId) external view returns(ReadDataReturnValue memory);
  function enquireLiquidation(uint256 unit)external view returns(Contributor memory _liq, bool defaulted, uint currentDebt, Slot memory slot, address); 
  function getCurrentDebt( uint256 unit, address target) external view returns(uint debtToDate); 
  function getProfile(uint256 unit, address user) external view returns(Contributor memory);
  function getPoint(address user) external view returns(Point memory);
  function getRecordEpoches() external view returns(uint);
  function getSlot(address user, uint256 unit) external view returns(Slot memory);
  
  /**
   * @notice sendFee: will be used as flag to auto-withdraw fee from each strategy. If sendFee is true, 
   * when a round is completed, the fee balances in a strategy will be forwarded to 'feeReceiver'.
   */
  struct ContractData {
    address feeTo;
    IAssetClass assetAdmin;
    uint16 makerRate;
    address safeFactory;
    IERC20 collateralToken;
  }

  struct Analytics {
    uint256 tvlCollateral;
    uint256 tvlBase;
    uint totalPermissioned;
    uint totalPermissionless;
  }

  struct ViewFactoryData {
    Analytics analytics;
    ContractData contractData;
    uint currentEpoches;
    uint recordEpoches;
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


// File contracts/implementations/AssetClass.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
contract AssetClass is IAssetClass, OnlyOwner {
  address[] private assets;

  /**
   * @dev Mapping assets address to bool i.e Assets must be contract account
   * and must be supported
   */
  mapping(address => bool) private supportedAssets;

  mapping(address => bool) public listed;

  /**
   * @dev Asset must be supported before they can be used.
   */
  modifier onlySupportedAsset(address _asset) {
    if(!supportedAssets[_asset]) revert UnSupportedAsset(_asset);
    _;
  }

  /**
   * @dev Initialize state variables
   * @param _asset : Initial supported asset
   */
  constructor(
    address _asset,
    IOwnerShip _ownershipMgr
  ) 
    OnlyOwner(_ownershipMgr) 
  {
    require(_asset != address(0), "Asset cannot be empty");
    _supportAsset(_asset);
  }

  // fallback(bytes calldata data) external returns(bytes memory) {
  //   return "Function not found";
  // }

  /**
   * @dev Support a new asset
   * Note: OnlyOwner action
   * @param _asset : Asset to add to list of supported asset
   */
  function supportAsset(
    address _asset
  ) 
    public 
    onlyOwner
  {
    _supportAsset(_asset); 
  }

  function _supportAsset(address _asset) private {
    
    if(!listed[_asset]){
      listed[_asset] = true;
      assets.push(_asset);
    }
    if(!_isAssetSupported(_asset)){
      supportedAssets[_asset] = true;
    }
  }

  /**
   * @dev Unsupports an asset
   * Note: Only-owner action
   * @param newAsset : Removes an asset from the list of supported asset
   */
  function unsupportAsset(
    address newAsset
  ) 
    public 
    onlyOwner
  {
    supportedAssets[newAsset] = false;
  }

  function _isAssetSupported(address _asset) internal view returns(bool) {
    return supportedAssets[_asset];
  }

  /**
   * @dev Check if an asset is supported
   */
  function isSupportedAsset(address _asset) public override view returns(bool) {
    return _isAssetSupported(_asset);
  }

  /**
   * @dev Returns a list of supported assets
   */
  function getSupportedAssets() public view returns(address[] memory _assets) {
    _assets = assets;
    return _assets;
  }

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


// File contracts/libraries/Utils.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
library Utils {
    using Address for address;
    using SafeMath for uint256;

    error InsufficientCollateral(uint256 actual, uint256 expected);
    error CollateralCoverageCannotGoBelow_100();
    error InvalidDenominator(string message);

    ///@dev Requires all conditions to be true 
    function assertTrue_2(bool a, bool b, string memory errorMessage) internal pure {
        require(a && b, errorMessage);
    }

    ///@dev Requires single condition to be true 
    function assertTrue(bool condition, string memory errorMessage) internal pure {
        require(condition, errorMessage);
    }

    ///@dev Requires conditions to be true 
    function assertFalse(bool condition, string memory errorMessage) internal pure {
        require(!condition, errorMessage);
    }

    /**     @dev Calculation of percentage.
        *   This is how we calculate percentage to arrive at expected value with 
        *   precision.
        *   We choose a base value (numerator as 10000) repesenting a 100% of input value. This means if Alice wish to set 
        *   her interest rate to 0.05% for instance, she only need to multiply it by 100 i.e 0.05 * 100 = 5. Her input will be 5. 
        *   Since Solidity do not accept decimals as input, in our context, the minimum value to parse is '0' indicating 
        *   zero interest rate. If user wish to set interest at least, the minimum value will be 1 reprensenting 0.01%.
        *   The minimum interest rate to set is 0.01% if interest must be set at least.
        *   @notice To reiterate, raw interest must be multiplied by 100 before giving as input. 
        *   @param principal : The principal value on which the interest is based. Value should be in decimals.
        *   @param interest : Interest rate. 
        *   
        *   Rules
        *   -----
        *   - Principal cannot be less than base.
        *   - Interest cannot be greater than (2 ^ 16) - 1
    */
    function _getPercentage(
        uint principal, 
        uint16 interest
    )
        internal 
        pure 
        returns (uint _return) 
    {
        uint16 base = _getBase(); 
        if(interest == 0 || principal == 0) return 0;
        assertTrue(interest < type(uint16).max, "Interest overflow");
        assertTrue(principal > base, "Principal should be greater than 10000");
        _return = principal.mul(interest).div(base);
    }

    /**
     * Percentage base
     */
    function _getBase() internal pure returns(uint16 base) {
        base = 10000;
    }
    
    function _decimals(address asset) internal view returns(uint8 decimals) {
        decimals = IERC20Metadata(asset).decimals();
    }

    /**
     * @dev Computes collateral on the requested loan amount
     * @param ccr : Collateral ratio. Must be multiply by 100 before parsing as input i.e if raw ccr
     *              is 1.2, it should be rendered as 1.2 * 100 = 120.
     * @param price : Price of Collateral token base with decimals.
     * @param loanReqInDecimals : Total requested contribution in USD
     * @notice Based on Simplifi mvp, loans are collaterized in XFI until we add more pairs
     *         in the future.
     * Example: Alice, Bob and Joe formed a band to contribute $100 each where duration is for 
     * 10 days each. Alice being the admin set ccr to 1.5 equivalent to 150% of the total sum 
     * contribution of $300. If the price of XFI as at the time of GF is $0.5/XFI, where XFI decimals
     * is in 18, we calculate the required XFI to stake as follows:   
     *  
     *                    totalContribution *  (10** XFIdecimals)   |                 raw ccr
     *   totalLoanInXFI = --------------------------------------    |    actualCCR = (1.5 * 100) * 100 = 1500
     *                        (xfiPriceIndecimals)                  |
     * 
     *                     totalLoanInXFI * actualCCR
     *        XFINeeded = ----------------------------
     *                             _getBase()
     * 
     *  Therefore, Alice is required to stake 900XFI to GF $300 for 10 days.
     *   
     */
    function computeCollateral(
        Common.Price memory price,
        uint24 ccr,
        uint loanReqInDecimals
    ) 
        internal
        pure 
        returns(uint256 expCol) 
    {
        uint8 minCCR = 100;
        if(ccr < minCCR) revert CollateralCoverageCannotGoBelow_100();
        uint48 _ccr = uint48(uint(ccr).mul(100));
        uint totalLoan = loanReqInDecimals.mul(10**price.decimals).div(price.price);
        expCol = totalLoan.mul(_ccr).div(_getBase());
    }

    /**
        @dev Computes maker fee.
        @param makerRate : The amount of fee (in %) charged by the platform on the principal given to a borrower.
            Note : Raw rate must multiply by 100 to get the expected value i.e
            if maker rate is 0.1%, it should be parsed as 0.1 * 100 = 10.
            See `_getPercentage()`.
        @param amount should be in decimals.
    */
    function computeFee(
        uint amount, 
        uint16 makerRate
    ) 
        internal 
        pure 
        returns (uint mFee) 
    {
        mFee = _getPercentage(amount, makerRate);
    }

    /**
     * @dev Compute interest based on specified rate.
     * @param rate : Interest rate.
     * @param principal : Total expected contribution.
     * @param fullDurationInSec : Total duration.
     * 
     * Rules
     * -----
     * - Duration cannot exceed 30days i.e 2592000 seconds uint24 seconds
     */
    function computeInterestsBasedOnDuration(
        uint principal,
        uint16 rate,
        uint24 fullDurationInSec
    )
        internal 
        pure 
        returns(Common.Interest memory _itr) 
    {
        Common.Interest memory it;
        require(fullDurationInSec <= _maxDurationInSec(), "Utils: FullDur or DurOfChoice oerflow");
        it.fullInterest = _getPercentage(principal, rate); // Full interest for fullDurationInSec
        if(it.fullInterest > 0) {
            it.intPerSec = it.fullInterest.mul(1).div(fullDurationInSec);
        }
        _itr = it; 
    }

    /**
     * @dev Max duration : 30Days, presented in seconds
     */
    function _maxDurationInSec() internal pure returns(uint24 max) {
        max = 2592000;
    }

    function notZeroAddress(address target) internal pure {
        require(target != address(0), "Zero address");
    }

    function _now() internal view returns(uint64 date) {
        date = uint64(block.timestamp);
    }

}


// File hardhat/console.sol@v2.22.17

// Original license: SPDX_License_Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library console {
    address constant CONSOLE_ADDRESS =
        0x000000000000000000636F6e736F6c652e6c6f67;

    function _sendLogPayloadImplementation(bytes memory payload) internal view {
        address consoleAddress = CONSOLE_ADDRESS;
        /// @solidity memory-safe-assembly
        assembly {
            pop(
                staticcall(
                    gas(),
                    consoleAddress,
                    add(payload, 32),
                    mload(payload),
                    0,
                    0
                )
            )
        }
    }

    function _castToPure(
      function(bytes memory) internal view fnIn
    ) internal pure returns (function(bytes memory) pure fnOut) {
        assembly {
            fnOut := fnIn
        }
    }

    function _sendLogPayload(bytes memory payload) internal pure {
        _castToPure(_sendLogPayloadImplementation)(payload);
    }

    function log() internal pure {
        _sendLogPayload(abi.encodeWithSignature("log()"));
    }

    function logInt(int256 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(int256)", p0));
    }

    function logUint(uint256 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256)", p0));
    }

    function logString(string memory p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string)", p0));
    }

    function logBool(bool p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool)", p0));
    }

    function logAddress(address p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address)", p0));
    }

    function logBytes(bytes memory p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes)", p0));
    }

    function logBytes1(bytes1 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes1)", p0));
    }

    function logBytes2(bytes2 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes2)", p0));
    }

    function logBytes3(bytes3 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes3)", p0));
    }

    function logBytes4(bytes4 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes4)", p0));
    }

    function logBytes5(bytes5 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes5)", p0));
    }

    function logBytes6(bytes6 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes6)", p0));
    }

    function logBytes7(bytes7 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes7)", p0));
    }

    function logBytes8(bytes8 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes8)", p0));
    }

    function logBytes9(bytes9 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes9)", p0));
    }

    function logBytes10(bytes10 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes10)", p0));
    }

    function logBytes11(bytes11 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes11)", p0));
    }

    function logBytes12(bytes12 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes12)", p0));
    }

    function logBytes13(bytes13 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes13)", p0));
    }

    function logBytes14(bytes14 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes14)", p0));
    }

    function logBytes15(bytes15 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes15)", p0));
    }

    function logBytes16(bytes16 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes16)", p0));
    }

    function logBytes17(bytes17 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes17)", p0));
    }

    function logBytes18(bytes18 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes18)", p0));
    }

    function logBytes19(bytes19 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes19)", p0));
    }

    function logBytes20(bytes20 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes20)", p0));
    }

    function logBytes21(bytes21 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes21)", p0));
    }

    function logBytes22(bytes22 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes22)", p0));
    }

    function logBytes23(bytes23 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes23)", p0));
    }

    function logBytes24(bytes24 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes24)", p0));
    }

    function logBytes25(bytes25 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes25)", p0));
    }

    function logBytes26(bytes26 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes26)", p0));
    }

    function logBytes27(bytes27 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes27)", p0));
    }

    function logBytes28(bytes28 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes28)", p0));
    }

    function logBytes29(bytes29 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes29)", p0));
    }

    function logBytes30(bytes30 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes30)", p0));
    }

    function logBytes31(bytes31 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes31)", p0));
    }

    function logBytes32(bytes32 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bytes32)", p0));
    }

    function log(uint256 p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256)", p0));
    }

    function log(string memory p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string)", p0));
    }

    function log(bool p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool)", p0));
    }

    function log(address p0) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address)", p0));
    }

    function log(uint256 p0, uint256 p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256)", p0, p1));
    }

    function log(uint256 p0, string memory p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string)", p0, p1));
    }

    function log(uint256 p0, bool p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool)", p0, p1));
    }

    function log(uint256 p0, address p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address)", p0, p1));
    }

    function log(string memory p0, uint256 p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256)", p0, p1));
    }

    function log(string memory p0, string memory p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string)", p0, p1));
    }

    function log(string memory p0, bool p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool)", p0, p1));
    }

    function log(string memory p0, address p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address)", p0, p1));
    }

    function log(bool p0, uint256 p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256)", p0, p1));
    }

    function log(bool p0, string memory p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string)", p0, p1));
    }

    function log(bool p0, bool p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool)", p0, p1));
    }

    function log(bool p0, address p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address)", p0, p1));
    }

    function log(address p0, uint256 p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256)", p0, p1));
    }

    function log(address p0, string memory p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string)", p0, p1));
    }

    function log(address p0, bool p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool)", p0, p1));
    }

    function log(address p0, address p1) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address)", p0, p1));
    }

    function log(uint256 p0, uint256 p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,uint256)", p0, p1, p2));
    }

    function log(uint256 p0, uint256 p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,string)", p0, p1, p2));
    }

    function log(uint256 p0, uint256 p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,bool)", p0, p1, p2));
    }

    function log(uint256 p0, uint256 p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,address)", p0, p1, p2));
    }

    function log(uint256 p0, string memory p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,uint256)", p0, p1, p2));
    }

    function log(uint256 p0, string memory p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,string)", p0, p1, p2));
    }

    function log(uint256 p0, string memory p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,bool)", p0, p1, p2));
    }

    function log(uint256 p0, string memory p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,address)", p0, p1, p2));
    }

    function log(uint256 p0, bool p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,uint256)", p0, p1, p2));
    }

    function log(uint256 p0, bool p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,string)", p0, p1, p2));
    }

    function log(uint256 p0, bool p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,bool)", p0, p1, p2));
    }

    function log(uint256 p0, bool p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,address)", p0, p1, p2));
    }

    function log(uint256 p0, address p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,uint256)", p0, p1, p2));
    }

    function log(uint256 p0, address p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,string)", p0, p1, p2));
    }

    function log(uint256 p0, address p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,bool)", p0, p1, p2));
    }

    function log(uint256 p0, address p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,address)", p0, p1, p2));
    }

    function log(string memory p0, uint256 p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,uint256)", p0, p1, p2));
    }

    function log(string memory p0, uint256 p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,string)", p0, p1, p2));
    }

    function log(string memory p0, uint256 p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,bool)", p0, p1, p2));
    }

    function log(string memory p0, uint256 p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,address)", p0, p1, p2));
    }

    function log(string memory p0, string memory p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,uint256)", p0, p1, p2));
    }

    function log(string memory p0, string memory p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,string)", p0, p1, p2));
    }

    function log(string memory p0, string memory p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,bool)", p0, p1, p2));
    }

    function log(string memory p0, string memory p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,address)", p0, p1, p2));
    }

    function log(string memory p0, bool p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,uint256)", p0, p1, p2));
    }

    function log(string memory p0, bool p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,string)", p0, p1, p2));
    }

    function log(string memory p0, bool p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,bool)", p0, p1, p2));
    }

    function log(string memory p0, bool p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,address)", p0, p1, p2));
    }

    function log(string memory p0, address p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,uint256)", p0, p1, p2));
    }

    function log(string memory p0, address p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,string)", p0, p1, p2));
    }

    function log(string memory p0, address p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,bool)", p0, p1, p2));
    }

    function log(string memory p0, address p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,address)", p0, p1, p2));
    }

    function log(bool p0, uint256 p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,uint256)", p0, p1, p2));
    }

    function log(bool p0, uint256 p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,string)", p0, p1, p2));
    }

    function log(bool p0, uint256 p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,bool)", p0, p1, p2));
    }

    function log(bool p0, uint256 p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,address)", p0, p1, p2));
    }

    function log(bool p0, string memory p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,uint256)", p0, p1, p2));
    }

    function log(bool p0, string memory p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,string)", p0, p1, p2));
    }

    function log(bool p0, string memory p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,bool)", p0, p1, p2));
    }

    function log(bool p0, string memory p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,address)", p0, p1, p2));
    }

    function log(bool p0, bool p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,uint256)", p0, p1, p2));
    }

    function log(bool p0, bool p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,string)", p0, p1, p2));
    }

    function log(bool p0, bool p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,bool)", p0, p1, p2));
    }

    function log(bool p0, bool p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,address)", p0, p1, p2));
    }

    function log(bool p0, address p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,uint256)", p0, p1, p2));
    }

    function log(bool p0, address p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,string)", p0, p1, p2));
    }

    function log(bool p0, address p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,bool)", p0, p1, p2));
    }

    function log(bool p0, address p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,address)", p0, p1, p2));
    }

    function log(address p0, uint256 p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,uint256)", p0, p1, p2));
    }

    function log(address p0, uint256 p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,string)", p0, p1, p2));
    }

    function log(address p0, uint256 p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,bool)", p0, p1, p2));
    }

    function log(address p0, uint256 p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,address)", p0, p1, p2));
    }

    function log(address p0, string memory p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,uint256)", p0, p1, p2));
    }

    function log(address p0, string memory p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,string)", p0, p1, p2));
    }

    function log(address p0, string memory p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,bool)", p0, p1, p2));
    }

    function log(address p0, string memory p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,address)", p0, p1, p2));
    }

    function log(address p0, bool p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,uint256)", p0, p1, p2));
    }

    function log(address p0, bool p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,string)", p0, p1, p2));
    }

    function log(address p0, bool p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,bool)", p0, p1, p2));
    }

    function log(address p0, bool p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,address)", p0, p1, p2));
    }

    function log(address p0, address p1, uint256 p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,uint256)", p0, p1, p2));
    }

    function log(address p0, address p1, string memory p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,string)", p0, p1, p2));
    }

    function log(address p0, address p1, bool p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,bool)", p0, p1, p2));
    }

    function log(address p0, address p1, address p2) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,address)", p0, p1, p2));
    }

    function log(uint256 p0, uint256 p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,uint256,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,uint256,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,uint256,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,string,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,string,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,string,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,string,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,bool,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,bool,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,bool,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,bool,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,address,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,address,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,address,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, uint256 p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,uint256,address,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,uint256,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,uint256,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,uint256,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,string,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,string,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,string,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,string,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,bool,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,bool,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,bool,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,bool,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,address,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,address,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,address,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, string memory p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,string,address,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,uint256,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,uint256,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,uint256,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,string,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,string,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,string,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,string,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,bool,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,bool,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,bool,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,bool,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,address,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,address,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,address,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, bool p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,bool,address,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,uint256,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,uint256,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,uint256,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,string,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,string,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,string,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,string,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,bool,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,bool,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,bool,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,bool,address)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,address,uint256)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,address,string)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,address,bool)", p0, p1, p2, p3));
    }

    function log(uint256 p0, address p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(uint256,address,address,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,uint256,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,uint256,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,uint256,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,string,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,string,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,string,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,string,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,bool,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,bool,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,bool,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,bool,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,address,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,address,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,address,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, uint256 p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,uint256,address,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,uint256,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,uint256,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,uint256,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,string,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,string,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,string,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,string,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,bool,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,bool,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,bool,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,bool,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,address,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,address,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,address,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, string memory p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,string,address,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,uint256,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,uint256,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,uint256,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,string,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,string,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,string,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,string,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,bool,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,bool,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,bool,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,bool,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,address,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,address,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,address,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, bool p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,bool,address,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,uint256,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,uint256,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,uint256,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,string,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,string,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,string,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,string,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,bool,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,bool,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,bool,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,bool,address)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,address,uint256)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,address,string)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,address,bool)", p0, p1, p2, p3));
    }

    function log(string memory p0, address p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(string,address,address,address)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,uint256,string)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,uint256,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,uint256,address)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,string,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,string,string)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,string,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,string,address)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,bool,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,bool,string)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,bool,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,bool,address)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,address,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,address,string)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,address,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, uint256 p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,uint256,address,address)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,uint256,string)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,uint256,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,uint256,address)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,string,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,string,string)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,string,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,string,address)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,bool,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,bool,string)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,bool,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,bool,address)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,address,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,address,string)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,address,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, string memory p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,string,address,address)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,uint256,string)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,uint256,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,uint256,address)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,string,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,string,string)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,string,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,string,address)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,bool,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,bool,string)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,bool,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,bool,address)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,address,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,address,string)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,address,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, bool p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,bool,address,address)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,uint256,string)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,uint256,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,uint256,address)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,string,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,string,string)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,string,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,string,address)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,bool,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,bool,string)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,bool,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,bool,address)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,address,uint256)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,address,string)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,address,bool)", p0, p1, p2, p3));
    }

    function log(bool p0, address p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(bool,address,address,address)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,uint256,string)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,uint256,bool)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,uint256,address)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,string,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,string,string)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,string,bool)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,string,address)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,bool,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,bool,string)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,bool,bool)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,bool,address)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,address,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,address,string)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,address,bool)", p0, p1, p2, p3));
    }

    function log(address p0, uint256 p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,uint256,address,address)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,uint256,string)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,uint256,bool)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,uint256,address)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,string,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,string,string)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,string,bool)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,string,address)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,bool,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,bool,string)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,bool,bool)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,bool,address)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,address,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,address,string)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,address,bool)", p0, p1, p2, p3));
    }

    function log(address p0, string memory p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,string,address,address)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,uint256,string)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,uint256,bool)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,uint256,address)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,string,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,string,string)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,string,bool)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,string,address)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,bool,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,bool,string)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,bool,bool)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,bool,address)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,address,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,address,string)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,address,bool)", p0, p1, p2, p3));
    }

    function log(address p0, bool p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,bool,address,address)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, uint256 p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,uint256,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, uint256 p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,uint256,string)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, uint256 p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,uint256,bool)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, uint256 p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,uint256,address)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, string memory p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,string,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, string memory p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,string,string)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, string memory p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,string,bool)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, string memory p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,string,address)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, bool p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,bool,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, bool p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,bool,string)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, bool p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,bool,bool)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, bool p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,bool,address)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, address p2, uint256 p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,address,uint256)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, address p2, string memory p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,address,string)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, address p2, bool p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,address,bool)", p0, p1, p2, p3));
    }

    function log(address p0, address p1, address p2, address p3) internal pure {
        _sendLogPayload(abi.encodeWithSignature("log(address,address,address,address)", p0, p1, p2, p3));
    }
}


// File contracts/libraries/FactoryLib.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
// import { IAssetClass } from "../apis/IAssetClass.sol";

/**@dev
  * @param amountExist: Tracks unit contribution i.e values created in each permissionless communities
  * @param pools: Mapping of unitIds to Pool
  * @param pData: Public State variable stats
  * @param epoches : Total pool created to date
  * @param contributors : Mapping of unitIds to group of contributors
  * @param slots : Reverse map of contributors to unitId to slots on the list.
    
  @param indexes: Each amount is mapped to an index. These indexes are used to retrieve the corresponding Amount struct from the 'amount' storage
  * 
*/
struct Data {
  Counters.Counter epoches;

  Counters.Counter cSlots;

  Counters.Counter pastEpoches;

  IFactory.ContractData pData;

  mapping(uint => Common.Contributor[]) cData;

  mapping(uint256 => uint) indexes; // For every unit amount of contribution, there is a corresponding index for retrieving data from the storage.

  mapping(uint => Common.Pool) records; // Past transactions i.e Ended or Canceled pools 

  mapping(uint => Common.Pool) current; // Mapping of unitId to Pool
  
  mapping(address => Common.Point) points;

  mapping(address => mapping(uint256 => Common.Slot)) slots;
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

  /**
   * @dev Verifiy that status is already initialized
  */
  function _isValidUnit(Data storage self, uint256 unit) internal view {
    uint uId = self.indexes[unit];
    require(_isInitialized(uId) && self.current[uId].status == Common.Status.TAKEN, 'Amount not initialized');
  }

  /**
   * @dev Ensure that unit contribution is active.
   * Every unit contribution has a corresponding and unique id called unitId.
   * When a unitId equals zero mean it is not active
   */
  function _isInitialized(uint unitId) internal pure returns(bool result){
    result = unitId > 0;
  }

  /**
   * @dev Verifiy that unit contribution is not initialized, then intialize it.
   * @notice We preserve the first slot at self.current[0] for future use.
  */
  function _getUnitId(Data storage self, Common.CreatePoolParam memory _c) internal returns(Common.CreatePoolParam memory cpp) {
    _c.uId = self.indexes[_c.unit];
    if(!_isInitialized(_c.uId)){
      self.epoches.increment();
      _c.uId = self.epoches.current();
      self.indexes[_c.unit] = _c.uId;
    }
    _c.isTaken = self.current[_c.uId].status == Common.Status.TAKEN;
    self.pastEpoches.increment();
    _c.rId = self.pastEpoches.current();
    cpp = _c;
  }

  /**
   * @dev Return the corresponding index for a unit amount of contribution from storage
  */
  function _getCurrentPool(Data storage self, uint256 unit) internal view returns(Common.GetPoolResult memory result) {
    result.uId = self.indexes[unit];
    result.data = self.current[result.uId];
  }

  /**
   * @dev Check that user has given enough approval to spend from their balances
   * @param user : Caller.
   * @param asset : ERC20 currency address to use as contribution base.
   * @param value : Contribution per user.
  */
  function _validateAndWithdrawAllowance(
    address user, 
    address asset, 
    uint value,
    address to
  ) 
    internal 
    returns(uint allowance)
  {
    allowance = IERC20(asset).allowance(user, address(this));
    if(allowance < value) revert Common.InsufficientAllowance();
    if(!IERC20(asset).transferFrom(user, to, value)) revert Common.TransferFailed();
  }

  function _addUpToSafe(address safe, address user, uint rId) internal {
    IBank(safe).addUp(user, rId);
  }

  /**
   * @dev Create a fresh pool
   * @param self: Storage of type `Data`
   * @param _c: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @notice cSlot is the position where the contibutors for the current unit is stored.
   *          Anytime we created a pool, a record is known in advance i.e. a slot is created in advance for the it. This is where the pool
   *          is moved when it is finalized.
   * 
   *          - We removed collateral coverage check so as to enable more flexible tuning and customization. Example: Bob, Alice and Kate agreed
   *            to operate a flexpool of unit $100 at zero collateral index. So Bob creates a flexpool of $100 setting quorum to maximum 3 participants.
   *            He set colCoverage to 0. If particapant A wants to get finance, they will be required to provide (collateralCalculor * 0) which is 0
   *            in order to get finance.
  */   
  function _createPool(
    Data storage self,
    Common.CreatePoolParam memory _c,
    address safe,
    address user,
    Common.Router router
  ) 
    private 
    returns(Common.Pool memory _p) 
  {
    Def memory _d = _defaults();
    // bool(_c.colCoverage >= 100).assertTrue("Col coverage is too low");
    Utils.assertTrue_2(_c.duration > _d.zero, _c.duration <= 720, "Invalid duration"); // 720hrs = 30 days.
    _awardPoint(self.points, user, _d.t);
    self.cSlots.increment();
    _c = _getUnitId(self, _c);
    if(_c.isTaken) revert Common.UnitIsTaken();
    _p = _updatePoolSlot(self, _c, safe, router);
    _callback(self, _p, _c.uId);
    if(!IBank(safe).addUp(user, _c.rId)) revert Common.SafeAddupFailed();
    _validateAndWithdrawAllowance(user, _c.asset, _c.unit, safe);
  }

  function _defaults()
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
   * @dev Initializes the slot for the pool user intend to create.
   * @notice To maintain storage orderliness especially when an epoch has ended and we need to 
   * keep record of the pool, we create a slot ahead for the initialized pool so we can move current
   * pool to it when it is finalized.
   */
  function _initializePool(
    Data storage self,
    Common.CreatePoolParam memory _c,
    Common.Interest memory itr,
    address safe,
    uint24 durInSec,
    Common.Router router
  ) internal view returns(Common.Pool memory _p) {
    Def memory _d = _defaults();
    uint cSlot = self.cSlots.current();
    _p.lInt = Common.LInt(_c.quorum, _d.zero, _c.colCoverage, durInSec, _c.intRate, cSlot, _d.zero, _p.lInt.userCount);
    _p.bigInt = Common.BigInt(_c.unit, _c.unit, _c.rId, _c.uId);
    _p.addrs = Common.Addresses(_c.asset, _d.zeroAddr, safe, _c.members[0]);
    _p.router = router;
    _p.interest = itr;
    _p.status = Common.Status.TAKEN;
    _p.stage = Common.Stage.JOIN;
  }

  /*** @dev Update the storage with pool information
   * @param self: Storage of type `Data`
   * @param _c: This is a struct of data much like an object. We use it to compress a few parameters
   *              instead of overloading _createPool.
   * @param uId: Unit Id ref/index in storage.
   * @param router: Permissioned or Permissionless.
   */
  function _updatePoolSlot(
    Data storage self,
    Common.CreatePoolParam memory _c,
    address safe,
    Common.Router router
  ) 
    internal view returns(Common.Pool memory _p)
  {
    uint24 durInSec = _convertDurationToSec(uint16(_c.duration));
    _p = _initializePool(
      self, 
      _c, 
      _c.unit.mul(_c.quorum).computeInterestsBasedOnDuration(_c.intRate, durInSec), 
      safe, 
      durInSec, 
      router
    );
  }

  /**
   * @dev Update storage
   */
  function _callback(Data storage self, Common.Pool memory pool, uint uId) private {
    self.current[uId] = pool;
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
    returns (Common.Pool memory _p) 
  {
    Def memory _d = _defaults();
    address safe = _getSafe(cpp.unit, self.pData.safeFactory);
    for(uint i = _d.zero; i < cpp.members.length; i++) {
      address user = cpp.members[i];
      if(i == _d.zero) {
        _p = _createPool(self, cpp, safe, user, Common.Router.PERMISSIONED);
        _addNewContributor(self, _p.lInt.cSlot, _p.bigInt.unit, user, _d.t, _d.t, _d.t);
      } else {
        bool(user != _p.addrs.admin).assertTrue("Admin spotted twice");
        _addNewContributor(self, _p.lInt.cSlot, _p.bigInt.unit, user, _d.f, _d.t, _d.f);
        _p = _getCurrentPool(self, _p.bigInt.unit).data; 
      } 
    }
  }

  // /**
  //  * @dev Return safe for user
  //  * @param safeFactory: StrategyManager contract address
  //  * @param unit : Caller
  //  */
  // function _getSafe(
  //   address safeFactory, 
  //   uint256 unit
  // ) 
  //   internal 
  //   view
  //   returns(address _safe) 
  // {
  //   _safe = IBankFactory(safeFactory).getBank(unit);
  // }

  /**
   * @dev Checks, validate and return safe for the target address.
   * @param unit : Unit contribution.
   * @param safeFactory : StrategyManager contract address.
   */
  function _getSafe(
    uint256 unit,
    address safeFactory
  ) 
    private 
    returns(address safe) 
  {
    safe = IBankFactory(safeFactory).createBank(unit);
    assert(safe != address(0));
  }

    /**
   * @dev Add new member to the pool
   * Note: `target` is expected to be an instance of the `SmartBank`
   */
  function _addNewContributor(
    Data storage self, 
    uint cSlot, 
    uint256 unit,
    address user,
    bool isAdmin,
    bool isMember,
    bool sentQuota                                                                                                                                                                              
  ) 
    private 
  {
    uint8 pos = uint8(self.cData[cSlot].length);
    self.cData[cSlot].push(); 
    self.slots[user][unit] = Common.Slot(pos, isMember, isAdmin);
    self.cData[cSlot][pos] = Common.Contributor(0, 0, 0, 0, 0, 0, user, sentQuota, 0);
    uint uId = self.indexes[unit];
    self.current[uId].lInt.userCount ++;
  }

  /**@dev Update contributor's data
    @param self : Storage of type mapping
    @param up : Parameters
   */
  function _updateUserData(
    Data storage self, 
    Common.UpdateUserParam memory up
  )
    private 
  {
    self.cData[up.cSlot][up.slot.value] = up.cData;
    self.slots[up.user][up.unit] = up.slot;
  }

  ///@dev Award points to user based on contribution
  function _awardPoint(mapping(address => Common.Point) storage self, address user, bool isCreator) internal {
    isCreator? self[user].creator += 5 : self[user].contributor += 2;
  }

  /**@dev Ruturn provider's info
    @param self : Storage of type Common.Contributor
   */
  function _getProfile(
    Data storage self,
    uint unit,
    address user
  ) 
    internal 
    view 
    returns(Common.Contributor memory cbt) 
  {
    Common.Slot memory uSlot = self.slots[user][unit];
    uint cSlot = _getCurrentPool(self, unit).data.lInt.cSlot;
    if(self.cData[cSlot].length > 0){
      cbt = self.cData[cSlot][uSlot.value];
    } else {
      cbt = Common.Contributor(0, 0, 0, 0, 0, 0, address(0), false, 0);
    }
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
    returns (Common.Pool memory _p)
  {
    Def memory _d = _defaults();
    address user = cpp.members[0];
    address safe = _getSafe(cpp.unit, self.pData.safeFactory);
    _p = _createPool(self, cpp, safe, user, Common.Router.PERMISSIONLESS);
    _addNewContributor(self, _p.lInt.cSlot, _p.bigInt.unit, user, _d.t, _d.t, _d.t);
  }

  /**@dev Add new contributor to a band.
   * @param self: Storage ref of type Data.
   * @param _ab: Parameters struct.
   * @notice A contributor can occupy more than one spot.
  */
  function addToPool(
    Data storage self,
    Common.AddTobandParam memory _ab
  )
    internal
    returns (
      Common.Pool memory _p
    ) 
  {
    Def memory _d = _defaults();
    _isValidUnit(self, _ab.unit);
    _p = _getCurrentPool(self, _ab.unit).data;
    address caller = _msgSender();
    _validateStage(_p.stage, Common.Stage.JOIN, "Cannot add contributor");
    if(_ab.isPermissioned) {
      _mustBeAMember(self, _ab.unit, caller);
      self.cData[_p.lInt.cSlot][_getSlot(self.slots, caller, _ab.unit).value].sentQuota = _d.t;
    } else {
      if(_p.lInt.userCount >= _p.lInt.quorum) revert Common.PoolIsFilled();
      _mustNotBeAMember(self, _ab.unit, caller);
      _addNewContributor(self, _p.lInt.cSlot, _ab.unit, caller, _d.f, _d.t, _d.t);
      _p = _getCurrentPool(self, _ab.unit).data;
    }
    _p.bigInt.currentPool += _p.bigInt.unit;
    if(_isPoolFilled(_p, _ab.isPermissioned)) {
      self.cData[_p.lInt.cSlot][_p.lInt.selector].turnStartTime = _now();
      _p = _setNextStage(_p, Common.Stage.GET);
    }
    _validateAndWithdrawAllowance(caller, _p.addrs.asset, _p.bigInt.unit, _p.addrs.bank);
    _addUpToSafe(_p.addrs.bank, caller, _p.bigInt.recordId);
    _callback(self, _p, _p.bigInt.unitId);
  }

  /**
   * @dev Validate stage for invoked function.
   */
  function _validateStage(
    Common.Stage expected, 
    Common.Stage actual, 
    string memory errorMessage
  ) internal pure { 
    (expected == actual).assertTrue(errorMessage);
  }

  /**
   * @dev A Check to know if _msgSender() is a member of the band at unitId.
   * @param self: Storage {typeof => mapping}
   * @param unit: Unit contribution
   * @param user: Contributor address
  */
  function _mustBeAMember(
    Data storage self,
    uint256 unit,
    address user
  ) 
    internal 
    view 
  {
    if(!_getSlot(self.slots, user, unit).isMember) revert Common.NotAMember();
  }

  /**
   * @dev Msg.sender must not be a member of the band at epoch Id before now.
   * @param self: Storage {typeof mapping}
   * @param unit: Unit contribution
   * @param user : User
  */
  function _mustNotBeAMember(
    Data storage self,
    uint256 unit,
    address user
  ) 
    internal 
    view 
  {
    _getSlot(self.slots, user, unit).isMember.assertFalse("User is already a member");
  }

  /**@dev Check if pool is filled
    * @dev Msg.sender must not be a member of the band at epoch Id before now.
    * @param _p: Pool struct (Location: Memory)
  */
  function _isPoolFilled(Common.Pool memory _p, bool isPermissioned) 
    internal 
    pure
    returns(bool filled) 
  {
    uint expected = _p.bigInt.unit.mul(_p.lInt.quorum);
    filled = !isPermissioned? _p.lInt.userCount == _p.lInt.quorum : expected == _p.bigInt.currentPool;
  }

  // /**@dev Update selector to who will get finance next
  //   * @param self: Storage {typeof mapping}
  //   * @param cSlot: Pool index.
  //   * @param selector : Spot selector.
  // */
  // function _setTurnTime(
  //   Data storage self, 
  //   uint selector, 
  //   uint cSlot
  // ) 
  //   private
  // {
  //   self.cData[cSlot][selector].turnStartTime = _now();
  // }

  function getProfile(
    Data storage self, 
    address user,
    uint256 unit
  ) 
    internal 
    view 
    returns(Common.Contributor memory) 
  {
    _mustBeAMember(self, unit, user);
    return _getProfile(self, unit, user);
  }

  /**@dev Get the slots of user with address and unitId
    @param self : Storage of type mappping
    @param user : User address
   */
  function _getSlot(
    mapping(address =>mapping(uint256 => Common.Slot)) storage self, 
    address user, 
    uint256 unit
  ) 
    internal 
    view 
    returns(Common.Slot memory slot) 
  {
    slot = self[user][unit];
  }

  /**@dev Get finance: Sends current total contribution to the 
   * expected account and update respective accounts.
    @param self : Storage of type Data.
    @param unit : Contribution amount.
    @param daysOfUseInHr : Number of days specified in hours after which 
                      the contributor shall return the borrowed fund.
    @param getPriceOfCollateralToken : A function that returns the current price of XFI.
  */
  function getFinance(
    Data storage self,
    uint256 unit,
    uint16 daysOfUseInHr,
    function () internal returns(uint128) getPriceOfCollateralToken
  ) 
    internal
    returns(Common.Pool memory _p, uint256 amtFinanced, uint colDeposited)
  {
    _isValidUnit(self, unit);
    _p = _getCurrentPool(self, unit).data;
    amtFinanced = _p.bigInt.currentPool;
    _validateStage(_p.stage, Common.Stage.GET, "Borrow not ready");
    if(_p.lInt.allGh == _p.lInt.quorum) revert IFactory.AllMemberIsPaid();
    _p = _incrementGF(_p);
    if(_p.bigInt.currentPool < (_p.bigInt.unit.mul(_p.lInt.quorum))) revert Common.PoolNotComplete();
    (_p, colDeposited) = _updateStorageAndCall(
      self,
      Common.UpdateMemberDataParam( 
        _convertDurationToSec(daysOfUseInHr), 
        self.cData[_p.lInt.cSlot][_p.lInt.selector].id,
        unit,
        _p.bigInt.unitId,
        _p.bigInt.currentPool.computeFee(self.pData.makerRate),
        getPriceOfCollateralToken(),
        _p
      )
    );
    self.cData[_p.lInt.cSlot][_p.lInt.selector - 1].getFinanceTime = _now();
    _callback(self, _p, _p.bigInt.unitId);
  }

  /**@dev Increment allGh when one member get finance
  */
  function _incrementGF(
   Common.Pool memory pool 
    // uint unitId
  )  
    internal
    pure
    returns(Common.Pool memory _p) 
  {
    pool.lInt.allGh ++;
    _p = pool;
  }

  /**
   * @dev Validates duration selected by this contributor must not exceed the set duration.
   * @param durInHrs : Duration set in hours.
   */
  function _convertDurationToSec(
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
    uint24 ccr,
    uint128 collateralTokenPrice,
    uint8 colDecimals
  )
    internal
    pure
    returns(uint collateral)
  { 
    collateral = Common.Price(collateralTokenPrice, colDecimals).computeCollateral(ccr, loanAmount);
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
      party another chance to GF since the ticker i.e 'pool.lInt.selector' waits for no one. It is always
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
    returns (Common.Pool memory _p, uint computedCol) 
  {
    address caller = arg.expected;
    Common.Contributor memory cbt = _getProfile(self, arg.unit, arg.expected); // Expected contributor
    if(_now() > cbt.turnStartTime + 1 hours){
      if(_msgSender() != arg.expected) {
        caller = _msgSender();
        _mustBeAMember(self, arg.unit, caller);
        cbt = _swapFullProfile(self, Common.SwapProfileArg(_getSlot(self.slots, caller, arg.unit), arg.expected, caller, arg.unit, arg.pool.lInt.cSlot, cbt));
      }
    } else {
      if(_msgSender() != cbt.id) revert Common.TurnTimeHasNotPassed();
      // require(_msgSender() == cbt.id, "Turn time has not passed");
    }
    computedCol = _computeCollateral(arg.pool.bigInt.currentPool, uint24(arg.pool.lInt.colCoverage), arg.colPriceInDecimals, IERC20(self.pData.collateralToken).decimals());
    arg.pool.addrs.lastPaid = caller;
    arg.pool.lInt.selector ++;
    // console.log("ComputedCol", computedCol);
    _validateAndWithdrawAllowance(caller, address(self.pData.collateralToken), computedCol, arg.pool.addrs.bank);
    Common.Contributor memory cData = Common.Contributor({
      durOfChoice: arg.durOfChoice, 
      interestPaid: 0,
      // expInterest: arg.pool.bigInt.currentPool.computeInterestsBasedOnDuration(uint16(arg.pool.lInt.intRate), uint24(arg.pool.lInt.duration) ,arg.durOfChoice).intPerChoiceOfDur,
      paybackTime: _now().add(arg.durOfChoice),
      turnStartTime: cbt.turnStartTime,
      getFinanceTime: cbt.getFinanceTime,
      loan: IBank(arg.pool.addrs.bank).getFinance(caller, arg.pool.addrs.asset, arg.pool.bigInt.currentPool, arg.fee, computedCol, arg.pool.bigInt.recordId),
      colBals: computedCol,
      id: caller,
      sentQuota: cbt.sentQuota
    });
    _updateUserData(
      self,
      Common.UpdateUserParam(
        cData,
        _getSlot(self.slots, caller, arg.unit),
        arg.pool.lInt.cSlot,
        arg.unit,
        caller
      )
    );
    arg.pool.stage = Common.Stage.PAYBACK;
    arg.pool.bigInt.currentPool = _defaults().zero;
    _p = arg.pool;
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
   * @param sw: Parameters.
   * @notice Defaulted address will not be taken out. In this case, we move them backward. 
   *          The worse that could happen to them is to them is for someone else to occupy their slot. 
   */

  function _swapFullProfile(
    Data storage self,
    Common.SwapProfileArg memory sw
  )
    private 
    returns(Common.Contributor memory aCData) 
  {
    Common.Slot memory aSlot = _getSlot(self.slots, sw.actCaller, sw.unit);
    aCData = _getProfile(self, sw.unit, sw.actCaller);
    sw.expcData.id = sw.actCaller;
    aCData.id = sw.expCaller;
    _updateUserData(self, Common.UpdateUserParam (aCData,  aSlot, sw.cSlot, sw.unit, sw.expCaller));
    _updateUserData(self, Common.UpdateUserParam (sw.expcData, sw.expSlot, sw.cSlot, sw.unit, sw.actCaller));
    aCData = sw.expcData;
  }

  /**
   * @dev Returns the current stage of pool at unitId 
   */
  function _getStage(
    Common.Pool[] storage self, 
    uint unitId
  ) internal view returns(Common.Stage stage) {
    stage = self[unitId].stage;
  }

  /**
   * @dev Sets the next stage of an epoch
   */
  function _setNextStage(
    Common.Pool memory _p, 
    Common.Stage nextStage
  ) internal pure returns(Common.Pool memory _p_) {
    assert(uint8(nextStage) < 6);
    _p.stage = nextStage;
    _p_ = _p;
  }

  /**@dev Return accrued debt for user up to this moment.
   * @param self : Storage
   * @param unit : Contribution amount.
   * @param user : Contributor.
   * @notice This is the total accrued debt between the date user was paid and now.
  */
  function _getCurrentDebt(
    Data storage self, 
    uint256 unit, 
    address user
  ) 
    internal 
    view returns(Common.DebtReturnValue memory drv) 
  {
    uint intPerSec = _getCurrentPool(self, unit).data.interest.intPerSec;
    drv.pos = _getSlot(self.slots, user, unit).value;
    Common.Contributor memory _cb = _getProfile(self, unit, user);
    drv.debt = _cb.loan.add(intPerSec.mul(_now().sub(_cb.turnStartTime)));
  }

  function _clearDebt(Common.Contributor memory cData) internal pure returns(Common.Contributor memory _cData) {
    cData.loan = 0;
    cData.colBals = 0;
    _cData = cData;
  }

  /**@dev Reset pool balances
    @param _p: Pool (location type is memory)
   */
  function _replenishPoolBalance(Common.Pool memory _p) internal pure returns(Common.Pool memory _p_) {
    _p.bigInt.currentPool = _p.bigInt.unit.mul(_p.lInt.quorum);
    _p_ = _p;
  }

  
  /**@dev Check if round is completed i.e all contributors have received finance
  */
  function _allHasGF(Common.Pool memory pool) internal pure returns(bool) {
    return pool.lInt.allGh == pool.lInt.quorum;
  }

  function payback(Data storage self, Common.PaybackParam memory pb) internal returns(uint, uint, Common.Pool memory) {
    return _payback(self, pb, false, address(0));
  }

  /**@dev Payback borrowed fund.
   * @param self : Storage
   * @param pb : Payback Parameters struct.
  */
  function _payback(
    Data storage self,
    Common.PaybackParam memory pb,
    bool isSwapped,
    address defaulted
  )
    internal
    returns(uint amtPayBackInUSD, uint colWithdrawn, Common.Pool memory _p)
  {
    _isValidUnit(self, pb.unit);
    _p = _getCurrentPool(self, pb.unit).data;
    Common.Contributor memory _cData = _getProfile(self, pb.unit, pb.user);
    _validateStage(_p.stage, Common.Stage.PAYBACK, "Payback not ready");
    uint debt = _getCurrentDebt(self, pb.unit, pb.user).debt;
    if(debt == 0) revert Common.NoDebtFound();
    amtPayBackInUSD = _cData.loan;
    colWithdrawn = _cData.colBals;
    _cData = _clearDebt(_cData);
    _awardPoint(self.points, pb.user, _defaults().f);
    bool allGF = _allHasGF(_p);
    if(!allGF){
      _p = _replenishPoolBalance(_p);
      _p = _setNextStage(_p, Common.Stage.GET);
      self.cData[_p.lInt.cSlot][_p.lInt.selector].paybackTime = _now();
      _callback(self, _p, self.indexes[pb.unit]);
      self.cData[_p.lInt.cSlot][_getSlot(self.slots, pb.user, pb.unit).value] = _cData;
    } else {
      _p = _setNextStage(_p, Common.Stage.ENDED);
      self.cData[_p.lInt.cSlot][_getSlot(self.slots, pb.user, pb.unit).value] = _cData;
      _callback(self, _shuffle(self, _p), self.indexes[pb.unit]);
    }
    (address user, IERC20 colToken) = (pb.user, self.pData.collateralToken);
    Common.Contributor[] memory cDatas = self.cData[_p.lInt.cSlot];
    (bool _isSwapped, address _defaulted, uint rId) = (isSwapped, defaulted, _p.bigInt.recordId);
    uint256 attestedInitialBal = IERC20(_p.addrs.asset).balanceOf(_p.addrs.bank);
    _validateAndWithdrawAllowance(user, _p.addrs.asset, debt, _p.addrs.bank);
    IBank(_p.addrs.bank).payback(Common.Payback_Bank(user, _p.addrs.asset, debt, attestedInitialBal, allGF, cDatas, _isSwapped, _defaulted, rId, colToken));
  }

  /**
   * @dev Return struct object with data if current beneficiary has defaulted otherwise an empty struct is returned.
   * @param self : Storage
   * @param unit: Unit contribution
   */
  function _enquireLiquidation(
    Data storage self, 
    uint256 unit
  ) 
    internal 
    view 
    returns (Common.Contributor memory _liq, bool defaulted, uint currentDebt, Common.Slot memory slot, address defaulter) 
  {
    Common.Pool memory _p = _getCurrentPool(self, unit).data;
    Common.Contributor memory prof = _getProfile(self, unit, _p.addrs.lastPaid);
    (_liq, defaulted, currentDebt, slot, defaulter)
      = 
        _now() <= prof.paybackTime? 
          (_liq, defaulted, currentDebt, slot, defaulter) 
            : 
              ( 
                prof, 
                _defaults().t, 
                _getCurrentDebt( self, unit, _liq.id).debt, 
                self.slots[prof.id][unit],
                prof.id
              );
  }

  /**
    @dev Liquidates a borrower if they have defaulted in repaying their loan.
      - If the current beneficiary defaults, they're liquidated.
      - Their collateral balances is forwarded to the liquidator.
      - Liquidator must not be a participant in pool at `unitId. We use this 
        to avoid fatal error in storage.
    @param self : Storage ref.
    @param unit : Unit contribution.
  */
  function liquidate(
    Data storage self,
    uint256 unit
  ) 
    internal
    returns(uint, uint, Common.Pool memory _p)
  {
    (Common.Contributor memory prof, bool defaulted,, Common.Slot memory slot, address defaulter) = _enquireLiquidation(self, unit);
    if(!defaulted) revert Common.CurrentReceiverIsNotADefaulter();
    address liquidator = _msgSender() ;
    _mustNotBeAMember(self, unit, liquidator);
    prof.id = liquidator;
    _updateUserData(
      self, 
      Common.UpdateUserParam(prof, slot, _getCurrentPool(self, unit).data.lInt.cSlot, unit, liquidator)
    );
    delete self.slots[defaulter][unit];
    self.current[self.indexes[unit]].addrs.lastPaid = liquidator;
    return _payback(self, Common.PaybackParam(unit, liquidator), true, defaulter);
  }

  /**
   * @dev Shuffle between pools i.e moves a finalized pool to the records ledger.
   * This action resets the data at 'uId' after moving it to records for viewing purpose.
   */
  function _shuffle(
    Data storage self,
    Common.Pool memory _p
  ) internal returns(Common.Pool memory empty) {
    empty = self.current[0];
    self.records[_p.bigInt.recordId] = _p;
  }

  /**
    @dev Cancels virgin band i.e Newly created band with only one contributor.
      Only admin of a band can cancel only if no one has join the band.
    @param self : Storage
    @param unit : Unit contribution.
    @param isPermissionLess : Whether band is public or not.

    @notice : Setting the quorum to 0 is an indication that a pool was removed.
  */
  function removeLiquidity(
    Data storage self,
    uint256 unit,
    bool isPermissionLess
  ) 
    internal
  {
    _isValidUnit(self, unit);
    Common.Pool memory _p = _getCurrentPool(self, unit).data;
    address creator = _msgSender();
    _isAdmin(self, unit, creator);
    if(isPermissionLess) {
      if(_p.lInt.userCount > 1 || _p.lInt.userCount < 1) revert Common.CancellationNotAllowed();
    } else {
      if(_p.bigInt.currentPool > _p.bigInt.unit) revert Common.CancellationNotAllowed();
    }
    _p.stage = Common.Stage.CANCELED;
    _callback(self, _shuffle(self, _p), _p.bigInt.unitId);
    IBank(_p.addrs.bank).cancel(creator, _p.addrs.asset, _p.bigInt.unit, _p.bigInt.recordId);
  }

  function _isAdmin(
    Data storage self,
    uint256 unit,
    address user
  ) 
    internal
    view
  {
    if(!self.slots[user][unit].isAdmin) revert Common.OnlyAdminIsAllowed();
  }

  /** @dev Update Contract variables
    * @param self : Storage. 
    * @param assetAdmin : Asset manager contract.
    * @param feeTo : Fee receiver.
    * @param makerRate : Service fee.
   */
  function setContractData(
    Data storage self,
    IAssetClass assetAdmin,
    address feeTo,
    uint16 makerRate,
    address safeFactory,
    IERC20 colToken
  ) 
    internal 
    returns(bool)
  {
    if(address(assetAdmin) != address(0)) self.pData.assetAdmin = assetAdmin;
    if(safeFactory != address(0)) self.pData.safeFactory = safeFactory;
    if(address(colToken) != address(0)) self.pData.collateralToken = colToken;
    if(feeTo != address(0)) self.pData.feeTo = feeTo;
    if(makerRate < type(uint16).max) self.pData.makerRate = makerRate;
    return true;
  }

  ///@dev Returns epoches
  function getEpoches(Data storage self) internal view returns(uint epoches) {
    epoches = self.epoches.current();
  }

  ///@dev Returns epoches
  function getRecordEpoches(Data storage self) internal view returns(uint epoches) {
    epoches = self.pastEpoches.current();
  }

  /// @dev Return pool using unitId. @notice The correct unitId must be parsed.
  function getData(Data storage self, uint uId) internal view returns(Common.ReadDataReturnValue memory rd) {
    rd.pool = self.current[uId];
    rd.cData = self.cData[rd.pool.lInt.cSlot];
  }

  /// @dev Return past pools using unitId. @notice The correct unitId must be parsed.
  function getRecord(Data storage self, uint rId) internal view returns(Common.ReadDataReturnValue memory rd) {
    rd.pool = self.records[rId];
    rd.cData = self.cData[rd.pool.lInt.cSlot];
  } 

  function getPoints(Data storage self, address user) internal view returns(Common.Point memory point) {
    point = self.points[user];
  }

  function getSlot(Data storage self, address user, uint256 unit) internal view returns(Common.Slot memory slot) {
    slot = self.slots[user][unit];
  }
}




// if(uId == 0) {
//       self.epoches.increment();
//       uId = self.epoches.current();
//       self.indexes[unit] = uId;
//     }


  // /**
  //  * @dev Return the different balances locked in an epoch
  //  * @param self : Data ref
  //  * @param unit : Unit contribution
  //  */
  // function _getBalancesInBank(
  //   Data storage self,
  //   uint256 unit
  // )
  //   internal
  //   view
  //   returns(Common.Balances memory balances) 
  // {

  //   _isValidUnit(self, unit);
  //   Common.Addresses memory addrs = _getCurrentPool(self, unit).data.addrs;
  //   if(addrs.asset == address(0)){
  //     balances = Common.Balances({
  //       xfi: 0,
  //       erc20: 0
  //     });
  //   } else {
  //     balances = Common.Balances({
  //       xfi: addrs.bank.balance,
  //       erc20: IERC20(addrs.asset).balanceOf(addrs.bank)
  //     });
  //   }
  // }


// File contracts/abstracts/AbstractFactory.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;

// import "hardhat/console.sol";
// import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**@title Abstract Factory contract
 * Non deployable.
*/

abstract contract AbstractFactory is
    IFactory,
    Pausable
{
    using FactoryLib for Data;

    // Storage of type FactoryLib.Data
    Data private data;

    // Frontend analytics
    Analytics public analytics;

    /**
     * @dev Only supported assets are allowed.
     * Note: Asset must be supported by the AssetClass contract.
     * @param _asset : Input asset contract address
     */
    modifier onlySupportedAsset(address _asset) {
        if (!IAssetClass(data.pData.assetAdmin).isSupportedAsset(_asset)) {
            revert IAssetClass.UnSupportedAsset(_asset);
        }
        _;
    }

    // ///@dev Unit contribution must have been initialized before they can be interacted with.
    // modifier onlyInitialized(uint256 unit,bool secondCheck) {
    //     data._isInitialized(unit, secondCheck);
    //     _;
    // }

    ///@dev Unit contribution must not be less than the minimum contribution.
    // modifier isMinimumContribution(uint256 unit) {
    //     if(unit < minContribution) revert AmountLowerThanMinimumContribution();
    //     _;
    // }
    
    /**
     * See _setUp() for doc
     */
    constructor(
        uint16 serviceRate,
        address feeTo,
        IAssetClass assetClass,
        address strategyManager,
        IOwnerShip _ownershipManager,
        address _diaOracleAddress,
        IERC20 colToken
    ) Pausable(_ownershipManager) {
        _setUp(
            serviceRate, 
            feeTo, 
            assetClass, 
            strategyManager,
            colToken
        );
        diaOracleAddress = _diaOracleAddress;
    }

    ///@dev Fallback
    receive() external payable {
        if(msg.value > 15e14 wei) {
            (bool success,) = data.pData.feeTo.call{value:msg.value}('');
            if(!success) revert ();
        }
    }

    /** @dev See _setUp() for doc.
     */
    function performSetUp(
        uint16 serviceRate,
        address feeTo,
        IAssetClass assetClass,
        address strategyManager,
        IERC20 colToken
    ) public onlyOwner {
        _setUp(
            serviceRate, 
            feeTo, 
            assetClass, 
            strategyManager,
            colToken
        );
    }

    /**
     * @dev Can be used to initialize and reinitialized state variables.
     * @notice Only address with owner role can call. Check Ownable.sol to see 
     * how we manage ownership (different from OZ pattern). 
     * @param serviceRate : Platform fee
     * @param feeTo : Fee recipient.
     * @param assetAdmin : Asset manager contract.
     * @param bankFactory : Strategy manager contract.
     * @param colToken : Collateral asset.
     */
    function _setUp(
        uint16 serviceRate,
        address feeTo,
        IAssetClass assetAdmin,
        address bankFactory,
        IERC20 colToken
    ) private {
        data.setContractData(assetAdmin, feeTo, serviceRate, bankFactory, colToken);
    }

    /**
    @dev Launch a liquidity pool. Based on router, it could be permissioned or permissionless.
      @param intRate : Rate of interest to charge on loans.
      @param quorum: The Required number of contributors to form a band. 
      @param durationInHours: The maximum time limit (from when turn time begins) with which a contributor
                            will take custody of the loan before repayment. Should be specified in hours.
      @param colCoverage - Collateral factor - Collateral determinant for contributors to borrow.
                            This is expressed as a multiplier index in the total loanable amount.
      @param unitLiquidity - Unit contribution.
      @param asset - Liquidity asset. This will often be an ERC20 compatible asset.
      @param contributors : Array contributors addresses
      @param router : We use this to determine which pool to launch. Router can either be permissioned
                    or permissionless.
        - asset must be supported by AssetClass.sol
    */
    function _createPool(
        uint16 intRate,
        uint8 quorum,
        uint16 durationInHours,
        uint24 colCoverage,
        uint unitLiquidity,
        address asset,
        address[] memory contributors,
        Router router
    )
        internal 
        whenNotPaused
        onlySupportedAsset(asset)
        returns (uint)
    {
        bool isPermissionless = router == Router.PERMISSIONLESS;
        if(isPermissionless) {
            if(quorum <= 1) revert MinimumParticipantIsTwo();
        } else {
            if(contributors.length <= 1) revert MinimumParticipantIsTwo();
        }
        CreatePoolParam memory cpp = CreatePoolParam(intRate, quorum, durationInHours, colCoverage, unitLiquidity, contributors, asset, 0, 0, false);
        Analytics memory alt = analytics;
        analytics = Analytics(
            alt.tvlCollateral, 
            alt.tvlBase + unitLiquidity, 
            isPermissionless? alt.totalPermissioned : alt.totalPermissioned + 1,
            isPermissionless? alt.totalPermissionless + 1 : alt.totalPermissionless
        );
        emit PoolCreated(
            !isPermissionless ? data
            .createPermissionedPool(cpp)
                : data.createPermissionlessPool(cpp)
        );
        return unitLiquidity;
    } 

    /** @dev Return current epoch. 
     * This is also total epoches generated to date 
    */
    function getEpoches() 
        external 
        view 
        returns(uint)
    {
        return data.getEpoches();
    }
    
    ///@dev Returns epoches
    function getRecordEpoches() external view returns(uint) {
        return data.getRecordEpoches();
    }

    /**@dev Add contributor.
      @param unit : Contribution amount.
      @param isPermissioned : Whether pool is permissioned or not
   */
    function _joinEpoch(
        uint256 unit,
        bool isPermissioned
    )
        internal
        returns(bool)
    {
        unchecked {
            analytics.tvlBase += unit;
        }
        emit NewContributorAdded(
            data.addToPool(AddTobandParam(unit, isPermissioned))
        );
        return true;
    }

    /** @dev Providers borrow from their pool provided the citeria are met.
        @param unit : Epoh Id user wants to borrow from. 
        @notice Users can be members of multiple epoches. This enlarges the
        volume of funds they can access. 

        - This is a payable function since borrowers are required to stake XFI
        before they can access funds in epoches.
        - The contract must be in a usable state i.e not paused.
        - For the selected epoch, the getFinance() must already be unlocked. Unlocking 
        is automated soon as the required quorum for the epoch is achieved i.e the 
        numbers of providers equals the set quorum.
        @param daysOfUseInHr : The time in hours the borrower wishes to retain the loan
        before paying back.
  */
    function getFinance(
        uint256 unit,
        uint8 daysOfUseInHr
    )
        external
        whenNotPaused
        returns (bool)
    {
        (Pool memory _p, uint256 amtFinanced, uint colDeposited) = data.getFinance(unit, daysOfUseInHr, _getCollateralTokenPrice);
        Analytics memory analy = analytics;
        unchecked {
            analy.tvlCollateral += colDeposited;
            if(analy.tvlBase >= amtFinanced) analy.tvlBase -= amtFinanced;
        }
        analytics = analy;
        emit GetFinanced(_p);
        return true;
    }

    /**
    @dev Return borrowed fund.
      @param unit : Contribution
     See FactoryLib.payback().
   */
    function payback(uint256 unit)
        external
        whenNotPaused
        returns (bool)
    {
        (uint amtPayBackInUSD, uint colWithdrawn, Pool memory _p) = data.payback(PaybackParam(unit, _msgSender()));
        Analytics memory atl = analytics;
        unchecked {
            atl.tvlBase += amtPayBackInUSD;
            if(atl.tvlCollateral >= colWithdrawn) atl.tvlCollateral -= colWithdrawn;
        }
        analytics = atl;
        emit Payback(_p);
        return true;
    }

    /**
  @dev Liquidate defaulter.
    Note: The expected repayment time for last paid contributor must have passed.
    See FactoryLib.liquidate() for more details.
    @param unit : Epoch Id
  */
    function liquidate(uint256 unit) 
        external 
        whenNotPaused 
        returns (bool) 
    {
        (uint amtPayBackInUSD, uint colWithdrawn, Pool memory _p) = data.liquidate(unit);
        emit Payback(_p);
        Analytics memory atl = analytics;
        unchecked {
            atl.tvlBase += amtPayBackInUSD;
            if(atl.tvlCollateral >= colWithdrawn) atl.tvlCollateral -= colWithdrawn;
        }
        analytics = atl;
        return true;
    }

    /**
     * @dev See FactoryLib.enquireLiquidation
     */
    function enquireLiquidation(uint256 unit) 
        external
        view 
        // onlyInitialized(unit, true)
        returns (Contributor memory, bool, uint, Slot memory, address)
    {
        return data._enquireLiquidation(unit);
    }

    /**
     * @dev Returns collaterl quote for the epoch.
     * @param unit : EpochId
     * @return collateral Collateral
     * @return colCoverage Collateral coverage
     */
    function getCollaterlQuote(
        uint256 unit
    )
        external
        view
        // onlyInitialized(unit, true)
        returns(uint collateral, uint24 colCoverage)
    {
        Pool memory _p = data._getCurrentPool(unit).data;
        unchecked {
            (collateral, colCoverage) = (FactoryLib._computeCollateral(
                _p.bigInt.unit * _p.lInt.quorum,
                uint24(_p.lInt.colCoverage),
                _getCollateralTokenPrice(),
                diaOracleAddress == address(0)? 18 : 8
            ), uint24(_p.lInt.colCoverage));
        }
        return (collateral, colCoverage);

    }

    /**
     * Returns the current debt of target user.
     * @param unit : Epoch Id
     * @param target : Target user.
     */
    function getCurrentDebt(
        uint256 unit,
        address target
    ) 
        external
        view 
        // onlyInitialized(unit, true)
        returns (uint256) 
    {
        return data._getCurrentDebt(unit, target).debt;
    }

    /**
     * @dev Returns the profile of user
     * @param unit : unit contribution
     * @param user : User
     */
    function getProfile(
        uint256 unit,
        address user
    )
        external
        view
        // onlyInitialized(unit, false)
        returns(Contributor memory) 
    {
        return data.getProfile(user, unit);
    }

    /**
     * @dev Set state variables.
     * @param feeTo : Fee receiver.
     * @param assetAdmin : AssetAdmin contract.
     * @param makerRate : fee in %.
     * - Only-owner function.
     */
    function setContractData(
        IAssetClass assetAdmin,
        address feeTo,
        uint16 makerRate,
        address safeFactory,
        IERC20 colToken
    ) 
        public
        onlyOwner
        returns(bool)
    {
        return data.setContractData(assetAdmin, feeTo, makerRate, safeFactory, colToken);
    }

    function setOracleAddress(address newOracleAddr) public onlyOwner {
        if(newOracleAddr == address(0)) revert OracleAddressIsZero();
        diaOracleAddress = newOracleAddr;
    }

    // function getStatus(uint256 unit) external view returns(string memory) {
    //     return data._getCurrentPool(unit).data.status == Status.AVAILABLE? 'AVAILABLE' : 'TAKEN';
    // }

    /**
     * @dev See FactoryLib._cancelBand()
     */
    function _removeLiquidityPool(
        uint256 unit,
        bool isPermissionLess
    ) 
        internal
        whenNotPaused 
        // onlyInitialized(unit, true)
        returns (bool)
    {
        uint256 tvlBase = analytics.tvlBase;
        unchecked {
            if(tvlBase >= unit) analytics.tvlBase = tvlBase - unit; 
        }
        data.removeLiquidity(unit, isPermissionLess);
        emit Cancellation(unit);

        return true;
    }

    /**
     * @dev Returns a single pool for 'unit'
     * @param unitId : Contribution Id.
     */
    function getPoolData(
        uint unitId
    ) 
        external 
        view 
        returns(ReadDataReturnValue memory) 
    {
        return data.getData(unitId);
    }

    /// @dev Return past pools using unitId. @notice The correct unitId must be parsed.
    function getRecord(uint rId) external view returns(ReadDataReturnValue memory) {
        return data.getRecord(rId);
    }

    function getPoint(address user) external view returns(Point memory point) {
        point = data.getPoints(user);
        return point;
    }

    function getSlot(address user, uint256 unit) 
        external 
        view 
        // onlyInitialized(unit, false)
        returns(Slot memory) 
    {
        return data.getSlot(user, unit);
    }

    function getFactoryData()
        public
        view
        returns(ViewFactoryData memory)
    {
        return ViewFactoryData(analytics, data.pData, data.getEpoches(), data.getRecordEpoches());
    }
    
    /**
     * @dev Get price of XFI in USD.
     * @notice from price oracle
     */
    function _getCollateralTokenPrice() 
        internal 
        view 
        returns (uint128 _price) 
    {
        if(diaOracleAddress != address(0)) {
            (uint128 price,) = IDIAOracleV2(diaOracleAddress).getValue('XFI/USD');
            _price = price;
        } else {
            _price = 10000000000000000000;
        }
    }

    address public diaOracleAddress;
}


// File contracts/implementations/Factory.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
/** @title Factory
 *  @author Simplifinance - Written by Isaac Jesse (https://github.com/bobeu) 
 * A protocol for short-term lending and borrowing services through a peer-funding mechanism, with an auto-AI yield dashboard. This is a structure where liquidity providers are also the borrowers.
 * Two currencies are used:
 *        - Native currency/Platform/Base currency e.g Celo, XFI, ETH, etc. This is the currency used as collateral.
 *        - Stable coin e.g cUSD, xUSD, USDT etc. This is the base currency use for contribution.
*/

contract Factory is AbstractFactory {
    mapping(uint => Router) public routers;

    /** @dev Initializes state variables.
     * @param serviceRate : Platform fee in %
     * @param feeTo : Account to receive fees.
     * @param assetClass : Asset manager contract.
     * @param bankFactory : BankFactory contract.
     * @param ownerShipManager : Accessibility manager contract
    */
   
    constructor(
        uint16 serviceRate,
        address feeTo,
        IAssetClass assetClass,
        address bankFactory,
        IOwnerShip ownerShipManager,
        address diaOracleAddress,
        IERC20 colToken
    )
        AbstractFactory(
            serviceRate,
            feeTo,
            assetClass,
            bankFactory,
            ownerShipManager,
            diaOracleAddress,
            colToken
        )
    {}

    /**@dev Create permissioned pool
        See AbstractFactory.sol 
     */
    function createPermissionedPool(
        uint16 intRate,
        uint16 durationInHours,
        uint24 colCoverage,
        uint unitLiquidity,
        address asset,
        address[] memory contributors
    ) external returns (bool) {
        Router router = Router.PERMISSIONED;
        uint quorum = contributors.length;
        routers[
            _createPool(
                intRate,
                uint8(quorum),
                durationInHours,
                colCoverage,
                unitLiquidity,
                asset,
                contributors,
                router
            )
        ] = router;
        return true;
    }

    /**@dev Create permissionless
        See AbstractFactory.sol
    */
    function createPermissionlessPool(
        uint16 intRate,
        uint8 quorum,
        uint16 durationInHours,
        uint24 colCoverage,
        uint unitLiquidity,
        address asset
    ) external returns (bool) {
        Router _router = Router.PERMISSIONLESS;
        address[] memory contributors = new address[](1);
        contributors[0] = _msgSender();
        routers[
            _createPool(
                intRate,
                quorum,
                durationInHours,
                colCoverage,
                unitLiquidity,
                asset,
                contributors,
                _router
            )
        ] = _router;
        return true;
    }

    /**
     * @dev Remove liquidity pool
     * @param unit : Epoch/Poool id
     */
    function removeLiquidityPool(uint256 unit) external returns (bool) {
        _removeLiquidityPool(unit, routers[unit] == Router.PERMISSIONLESS);
        return true;
    }

    /**@dev See AbstractFactory.sol */
    function joinAPool(uint256 unit) 
        external 
        whenNotPaused
        returns(bool) 
    {
        return _joinEpoch(unit, routers[unit] == Router.PERMISSIONED);
    }

    /**@dev Return the router for an unit.
     */
    function getRouter(uint256 unit) external view returns (string memory) {
        return
            routers[unit] == Router.PERMISSIONLESS
                ? "PERMISSIONLESS"
                : "PERMISSIONED";
    }

}
