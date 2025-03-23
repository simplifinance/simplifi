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


// File contracts/implementations/token/ERC20Abstract.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)

pragma solidity 0.8.24;
library Lib {
  function cannotBeEmptyAddress(address target) internal pure {
    require(target != address(0), "Lib: Target is zero address");
  }

  function mustBeAbove(uint a, uint b) internal pure {
    require(a >= b, "B is greater than A");
  }

  function _now() internal view returns(uint64 result) {
    result = uint64(block.timestamp);
  }
}

/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * The default value of {decimals} is 18. To change this, you should override
 * this function so it returns a different value.
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC20
 * applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */

/**
 * @title SimpliFinance Token Implementation { Non deployable }
 * @author SimpliFinance - https://github.com/bobeu
 * @notice @dev Simplifinance Token operates a dual ledger model:
     *      - Regular balance : Compatible with the standard ERC20 balances.
     *      - private balance : This is kept in a seperate ledger but reflects in the total balances when 
     *          the `balanceOf` is invoked. We introduced this method for internal security reasons to protect
     *          SPT holder in the event they lost access to their wallets.
     *  HOW IS WORKS
     *  ============
     *      To be protected, holder must explicitly subscribe to it. During the processs, an alternative 
     *      EOA referred to as `escapeTo` must be provided as an argument to the function. Holders are adviced to create a seperate account for this purpose
     *      and keep the private keys secure. Such account might not be used for regular transaction. Providing this address activates 
     *      the private balance mode. The specified amount of `inValue` is locked for the period of `lockTil`. During the locked period, if holder 
     *      lost access to their account, through the `Attorney` contract, provided the lock is activated, they will regain access to their funds.
     *      The Attorney will enquire from the Token contract if the caller has previously activated the lock, and if an escape address was set. otherwise
     *      the request is ignored.
     * Note: An amount is charged by the Attorney for such service.
     * Even if an hacker gained access to your private keys, as a SPT holder, the fund is not accessible to them only if the holder had activated the lock feature.
     * 
     * Note: The call must be initiated by an account other than the owner.
     *       An attacker only has access to SPT token in your regular ERC20 ledger balances.
     *   
        The `panicWithdraw` method resides in the Attorney contract. It unlocks all balances in the locked ledger and are sent to the `escape` account provided the  
        an address was initially set.
 */
abstract contract ERC20Abstract is IERC20, Pausable {
  using Lib for *;

  TokenInfo private tokenInfo;
  
  mapping(address => Balances) private _balances;

  mapping(address => mapping(address => uint256)) private _allowances;

  /**
   * @dev Initializes state varibles.
   * Note: We mint the maxSupply at deployment. 30% of the total supply
   * is in circulation while the rest is lcoked in the reserve.
   */
  constructor(
    address attorney_,
    address reserve_,
    address initTokenReceiver,
    IOwnerShip _ownershipManager
  )  
    Pausable(_ownershipManager)
  {
    attorney_.cannotBeEmptyAddress();
    tokenInfo = TokenInfo(18, 0, "Simplfinance Token", "TSFT", attorney_);
    _mint(_msgSender(), 200000*(10**18)); // For testing, mint to msg.sender
    _mint(initTokenReceiver, 1_000_000_000*(10**18));
    _lock(initTokenReceiver, reserve_, 700_000_000*(10**18)); // We expect reserve_ to be a grouped account e.g multisig.
  }

  /**
   * @dev Returns the name of the token.
   */
  function name() public view virtual override returns (string memory) {
    return tokenInfo.name;
  }

  /**
   * @dev Returns the symbol of the token, usually a shorter version of the
   * name.
   */
  function symbol() public view virtual override returns (string memory) {
    return tokenInfo.symbol;
  }

  /**
   * @dev Returns the number of decimals used to get its user representation.
   * For example, if `decimals` equals `2`, a balance of `505` tokens should
   * be displayed to a user as `5.05` (`505 / 10 ** 2`).
   *
   * Tokens usually opt for a value of 18, imitating the relationship between
   * Ether and Wei. This is the default value returned by this function, unless
   * it's overridden.
   *
   * NOTE: This information is only used for _display_ purposes: it in
   * no way affects any of the arithmetic of the contract, including
   * {IERC20-balanceOf} and {IERC20-transfer}.
   */
  function decimals() public view virtual override returns (uint8) {
    return tokenInfo.decimals;
  }

  /**
   * @dev Returns contracts account connected to the token contracts i.e.
   *    - Attorney
   * Note: Attorney account acts on behalf of a holders to retrive their token
   *        in the event they lost access to their accounts.
   */
  function getAttorney() public view returns(address _attorney) {
    _attorney = tokenInfo.attorney;
  }

  /// @dev See IERC20.sol {getInfo}
  function getLockedInfo(address target) public view returns(Protected memory _locked) {
    address msgSender = _msgSender();
    if(msgSender == tokenInfo.attorney) {
      _locked = _balances[target].locked;
    }
    return _locked;
  }

  /**
   * @dev See {IERC20-totalSupply}.
   */
  function totalSupply() public view virtual override returns (uint256) {
    return tokenInfo.totalSupply;
  }

  ///@dev See {IERC20-accountBalances}.
  function accountBalances(address who) external view returns (Balances memory _bal) {
    _bal = _balances[who];
    return _bal;
  }

  /**
   * @dev See {IERC20-balanceOf}.
   * Returns the spendable balance of @param account: Bytes32 address type
   * Note: The function `balanceOf` complies with that ERC20 standard
   */
  function balanceOf(address account) public view returns (uint256 _bal) {
    return _getSpendable(account);
  }

  /**
   * @dev See {IERC20-transfer}.
   *
   * Requirements:
   *
   * - `to` cannot be the zero address.
   * - the caller must have a balance of at least `amount`.
   */
  function transfer(address to, uint256 amount) public returns (bool) {
    address owner = _msgSender();
    _transfer(owner, to, amount);
    return true;
  }

  /**
   * @dev See {IERC20-allowance}.
   */
  function allowance(address owner, address spender) public view virtual override returns (uint256) {
    return _allowances[owner][spender];
  }

  /**
   * @dev See {IERC20-approve}.
   *
   * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
   * `transferFrom`. This is semantically equivalent to an infinite approval.
   *
   * Requirements:
   *
   * - `spender` cannot be the zero address.
   */
  function approve(address spender, uint256 amount) public virtual override returns (bool) {
      address owner = _msgSender();
      _approve(owner, spender, amount);
      return true;
  }

  /**
   * @dev See {IERC20-transferFrom}.
   *
   * Emits an {Approval} event indicating the updated allowance. This is not
   * required by the EIP. See the note at the beginning of {ERC20}.
   *
   * NOTE: Does not update the allowance if the current allowance
   * is the maximum `uint256`.
   *
   * Requirements:
   *
   * - `from` and `to` cannot be the zero address.
   * - `from` must have a balance of at least `amount`.
   * - the caller must have allowance for ``from``'s tokens of at least
   * `amount`.
   */
  function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
    address spender = _msgSender();
    _spendAllowance(from, spender, amount);
    _transfer(from, to, amount);
    return true;
  }

  /**
   * @dev Atomically increases the allowance granted to `spender` by the caller.
   *
   * This is an alternative to {approve} that can be used as a mitigation for
   * problems described in {IERC20-approve}.
   *
   * Emits an {Approval} event indicating the updated allowance.
   *
   * Requirements:
   *
   * - `spender` cannot be the zero address.
   */
  function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
      address owner = _msgSender();
      _approve(owner, spender, allowance(owner, spender) + addedValue);
      return true;
  }

  /**
   * @dev Atomically decreases the allowance granted to `spender` by the caller.
   *
   * This is an alternative to {approve} that can be used as a mitigation for
   * problems described in {IERC20-approve}.
   *
   * Emits an {Approval} event indicating the updated allowance.
   *
   * Requirements:
   *
   * - `spender` cannot be the zero address.
   * - `spender` must have allowance for the caller of at least
   * `subtractedValue`.
   */
  function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns(bool) {
    address owner = _msgSender();
    uint256 currentAllowance = allowance(owner, spender);
    require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
    unchecked {
      _approve(owner, spender, currentAllowance - subtractedValue);
    }

    return true;
  }

  // Returns spendable balances of {from} i.e usual ERC20 'balanceOf'
  function _getSpendable(address from) internal view returns (uint256) {
    return _balances[from].spendable;
  }

  /**
   * @dev Moves `amount` of tokens from `from` to `to`.
   *
   * This internal function is equivalent to {transfer}, and can be used to
   * e.g. implement automatic token fees, slashing mechanisms, etc.
   *
   * Emits a {Transfer} event.
   *
   * Requirements:
   *
   * - `from` cannot be the zero address.
   * - `to` cannot be the zero address.
   * - `from` must have a balance of at least `amount`.
   */
  function _transfer(address from, address to, uint256 amount) internal virtual 
  {
    from.cannotBeEmptyAddress();
    to.cannotBeEmptyAddress();

    _beforeTokenTransfer(from, to, amount);
    uint256 fromBalance = _getSpendable(from);
    fromBalance.mustBeAbove(amount);
    unchecked {
        _balances[from].spendable = fromBalance - amount;
        // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
        // decrementing then incrementing.
        _balances[to].spendable += amount;
    }

    emit Transfer(from, to, amount);

    _afterTokenTransfer(from, to, amount);
  }

  /** @dev Creates `amount` tokens and assigns them to `account`, increasing
   * the total supply.
   *
   * Emits a {Transfer} event with `from` set to the zero address.
   *
   * Requirements:
   *
   * - `account` cannot be the zero address.
   */
  function _mint(address account, uint256 amount) internal virtual {
    // _requireContext(_isCallable(Internal.MINT));
    account.cannotBeEmptyAddress();
    _beforeTokenTransfer(address(0), account, amount);

    tokenInfo.totalSupply += amount;
    unchecked {
        // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
        _balances[account].spendable += amount;
    }
    emit Transfer(address(0), account, amount);

    _afterTokenTransfer(address(0), account, amount);
  }

  /**
   * @dev Destroys `amount` tokens from `account`, reducing the
   * total supply.
   *
   * Emits a {Transfer} event with `to` set to the zero address.
   *
   * Requirements:
   *
   * - `account` cannot be the zero address.
   * - `account` must have at least `amount` tokens.
   */
  function _burn(address account, uint256 amount) internal virtual {
    account.cannotBeEmptyAddress();
    _beforeTokenTransfer(account, address(0), amount);

    uint256 accountBalance = _balances[account].spendable;
    accountBalance.mustBeAbove(amount);
    unchecked {
      _balances[account].spendable = accountBalance - amount;
      // Overflow not possible: amount <= accountBalance <= totalSupply.
      tokenInfo.totalSupply -= amount;
    }

    emit Transfer(account, address(0), amount);

    _afterTokenTransfer(account, address(0), amount);
  }

  /**
   * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
   *
   * This internal function is equivalent to `approve`, and can be used to
   * e.g. set automatic allowances for certain subsystems, etc.
   *
   * Emits an {Approval} event.
   *
   * Requirements:
   *
   * - `owner` cannot be the zero address.
   * - `spender` cannot be the zero address.
   */
  function _approve(address owner, address spender, uint256 amount) internal virtual {
    owner.cannotBeEmptyAddress();
    spender.cannotBeEmptyAddress();
    _allowances[owner][spender] = amount;
    emit Approval(owner, spender, amount);
  }

  /**
   * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
   *
   * Does not update the allowance amount in case of infinite allowance.
   * Revert if not enough allowance is available.
   *
   * Might emit an {Approval} event.
   */
  function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
    uint256 currentAllowance = allowance(owner, spender);
    if (currentAllowance != type(uint256).max) {
      currentAllowance.mustBeAbove(amount);
      unchecked {
        _approve(owner, spender, currentAllowance - amount);
      }
    }
  }

  /**
   * @dev Hook that is called before any transfer of tokens. This includes
   * minting and burning.
   *
   * Calling conditions:
   *
   * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
   * will be transferred to `to`.
   * - when `from` is zero, `amount` tokens will be minted for `to`.
   * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
   * - `from` and `to` are never both zero.
   *
   * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
   */
  function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}

  /**
   * @dev Hook that is called after any transfer of tokens. This includes
   * minting and burning.
   *
   * Calling conditions:
   *
   * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
   * has been transferred to `to`.
   * - when `from` is zero, `amount` tokens have been minted for `to`.
   * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
   * - `from` and `to` are never both zero.
   *
   * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
   */
  function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}

  
  ///@dev Returns current Unix time stamp
  function _now() internal view returns(uint32) {
    return uint32(block.timestamp);
  }
  
  /**@dev Locks token in the private ledger balances.
    When tokens are locked they can be unlocked at any time.
      @param _escapeTo : An extra address that token will be forwarded to. This must not be zero address
      @param amount : Amount user is willing to send to the safe.
      Note: If caller has no lock previously set,`escapeTo` must not be an empty address.
            User will always have to provide an escape address each time they want to lock up tokens.
      REWARD
      ======
      Holders are eligible to claim reward if they hold SFT in private ledger for at least 30 days.
      The measure of such reward is determined by the team.
      @notice Care must be taken when locking and unlocking. Users must first check through the attorney if they're
            qualify for reward then they must claim first before lock again, otherwise, the locked time is overriden.
            This can nullify their rewards.

   */
  function _lock(address account, address _escapeTo, uint256 amount) 
    internal
  {
    _escapeTo.cannotBeEmptyAddress();
    Balances memory balances = _balances[account];

    balances.spendable.mustBeAbove(amount);
    // _balances[account].locked.escapeTo = _escapeTo;
    // _balances[account].locked.lastLocked = amount;
    unchecked {
      _balances[account] = Balances(
        balances.spendable - amount,
        Protected(
          balances.locked.value + amount,
          _escapeTo
        )
      );
    }
  }

  /**@dev Unlock token 
   */
  function _unlock(address account, uint amount) internal {
    Balances memory balances = _balances[account];
    if(balances.locked.escapeTo == address(0)) revert NoPreviousLockDetected();
    balances.locked.value.mustBeAbove(amount);
    unchecked {
      _balances[account].locked.value -= amount;
      _balances[balances.locked.escapeTo].spendable += amount;
    }
  }

  /**
   * @dev Replaces the attorney account. Only authorized owner account can perform
   * this action.
   */
  function setAttorney(address newAttorney) public onlyOwner {
    newAttorney.cannotBeEmptyAddress();
    tokenInfo.attorney = newAttorney;
  }

  /**See IERC20.sol {panicUnlock}
    Method is executed only of the caller is the attorney
    Note: Since the user is able to prove to the attorney that they
    own the lost account, they are also able to reclaim all balances.
   */ 
  function panicUnlock(address accountToRetrieve, Balances memory _bal) external returns(bool feedback) {
    tokenInfo.attorney.cannotBeEmptyAddress();
    if(_msgSender() == tokenInfo.attorney) {
      unchecked {
        _balances[accountToRetrieve].locked.value = 0;
        _balances[_bal.locked.escapeTo].spendable += _bal.locked.value;
      }
      if(_bal.spendable > 0) {
        _transfer(accountToRetrieve, _bal.locked.escapeTo, _bal.spendable);
      } 
      feedback = true;
    }
  }
}


// File @openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/IERC20Permit.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 *
 * ==== Security Considerations
 *
 * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
 * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
 * considered as an intention to spend the allowance in any specific way. The second is that because permits have
 * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
 * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
 * generally recommended is:
 *
 * ```solidity
 * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
 *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
 *     doThing(..., value);
 * }
 *
 * function doThing(..., uint256 value) public {
 *     token.safeTransferFrom(msg.sender, address(this), value);
 *     ...
 * }
 * ```
 *
 * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
 * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
 * {SafeERC20-safeTransferFrom}).
 *
 * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
 * contracts should have entry points that don't rely on permit.
 */
interface IERC20Permit {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     *
     * CAUTION: See Security Considerations above.
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
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


// File contracts/implementations/token/SafeERC20.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity 0.8.24;
/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using Address for address;

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    /** Batch transfer
     * @dev Transfer `values` amount of `token` from the calling contract to `tos`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeBatchTransfer(IERC20 token, address[] memory tos, uint256[] memory values) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.batchTransfer.selector, tos, values));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Panicly unlock token from the 'token' contract by force transfer from the 'account' to the
     * preset escape account. 
     * This is done only by the Attorney.
     */
    function safePanicUnlock(IERC20 token, address account, IERC20.Balances memory _bal) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.panicUnlock.selector, account, _bal));
    }

    /**
     * @dev Unlocks token 'token' of 'amount' from the caller's account.
     * If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeUnlock(IERC20 token, uint256 amount) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.unlockToken.selector, amount));
    }
    
    /**
     * @dev Lock token 'token' of 'amount' from the caller's account.
     * If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeLock(IERC20 token, address _routeTo, uint256 amount) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.lockToken.selector, _routeTo, amount));
    }
    
    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance + value));
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance - value));
        }
    }

    /**
     * @dev Use a ERC-2612 signature to set the `owner` approval toward `spender` on `token`.
     * Revert on invalid signature.
     */
    function safePermit(
        IERC20Permit token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data);
        require(returndata.length == 0 || abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
    }

}


// File contracts/implementations/token/TokenInteractor.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.24;
abstract contract TokenInteractor is OnlyOwner {
  using Lib for *;
  using SafeERC20 for IERC20;

  IERC20 public token;

  ///@dev Contract accepts platform coin
  receive () external payable {
    revert("NA");
  } 

  constructor(IOwnerShip _ownershipManager) OnlyOwner(_ownershipManager) { }

  function setToken(IERC20 newToken) public onlyOwner {
    address(newToken).cannotBeEmptyAddress();
    token = newToken;
  }

  ///@dev Transfer Token to @param account : Token recipient
  function transferToken(address account, uint amount) public onlyOwner {
    token.safeTransfer(account, amount);
  }

  ///@dev Batch tranfer: Sends token to many addresses
  function batchTransfer(address[] memory accounts, uint256[] memory amounts) public onlyOwner {
    token.safeBatchTransfer(accounts, amounts);
  }

  ///@dev Locks certain amount i.e Move from private ledger to the regular balance
  function lockToken(address _routeTo, uint256 amount) public onlyOwner {
    token.safeLock(_routeTo, amount);
  }

  ///@dev Unlocks certain amount i.e Move from private ledger to the regular balance
  function unlockToken(uint256 amount) public onlyOwner {
    token.safeUnlock(amount);
  }

}


// File contracts/implementations/token/Escape.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.24;
/**
 * @title Escape
 * @dev Total supply is minted to this contract and is controlled by an owner address
 * that should be a multisig account.
 */

contract Escape is TokenInteractor {
    constructor(IOwnerShip _ownershipManager) TokenInteractor(_ownershipManager) { }

    function name() public pure returns(string memory) {
        return "ESCAPE";
    }
}
