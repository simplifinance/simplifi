// // Sources flattened with hardhat v2.22.17 https://hardhat.org

// // SPDX-License-Identifier: MIT

// // File contracts/interfaces/IERC20Metadata.sol

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)

// pragma solidity 0.8.28;

// /**
//  * @dev Interface for the optional metadata functions from the ERC20 standard.
//  *
//  * _Available since v4.1._
//  */
// interface IERC20Metadata {
//     /**
//      * @dev Returns the name of the token.
//      */
//     function name() external view returns (string memory);

//     /**
//      * @dev Returns the symbol of the token.
//      */
//     function symbol() external view returns (string memory);

//     /**
//      * @dev Returns the decimals places of the token.
//      */
//     function decimals() external view returns (uint8);
// }


// // File contracts/interfaces/IERC20.sol

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

// pragma solidity 0.8.28;
// /**
//  * @dev Interface of the ERC20 standard as defined in the EIP.
//  */
// interface IERC20 is IERC20Metadata{
//     error NotCallable();
//     error AddressIsZero(address);
//     error NoPreviousLockDetected();

//     /**
//      * @dev Emitted when `value` tokens are moved from one account (`from`) to
//      * another (`to`).
//      *
//      * Note that `value` may be zero.
//      */
//     event Transfer(address indexed from, address indexed to, uint256 value);

//     /**
//      * @dev Emitted when the allowance of a `spender` for an `owner` is set by
//      * a call to {approve}. `value` is the new allowance.
//      */
//     event Approval(address indexed owner, address indexed spender, uint256 value);

//     /**
//      * @dev Returns the amount of tokens in existence.
//      */
//     function totalSupply() external view returns (uint256);

//     /**
//      * @dev Returns the amount of tokens owned by `account`.
//      */
//     function balanceOf(address account) external view returns (uint256);

//     /**
//      * @dev Moves `amount` tokens from the caller's account to `to`.
//      *
//      * Returns a boolean value indicating whether the operation succeeded.
//      *
//      * Emits a {Transfer} event.
//      */
//     function transfer(address to, uint256 amount) external returns (bool);
    
//     /** 
//      * @dev Moves `amounts` tokens from the caller's account to `to`.
//      *
//      * Returns a boolean value indicating whether the operation succeeded.
//      *
//      * Emits a {Transfer} event for each transfer.
//      * Note: BE AWARE OF THE GAS COST WHEN USING THIS FUNCTION. IT INCREASES 
//                 RELATIVE TO THE ACCOUNTS ARRAY
//      */
//     function batchTransfer(uint[] memory amounts, address[] memory accounts) external returns (bool);

//     /**
//      * @dev Returns the remaining number of tokens that `spender` will be
//      * allowed to spend on behalf of `owner` through {transferFrom}. This is
//      * zero by default.
//      *
//      * This value changes when {approve} or {transferFrom} are called.
//      */
//     function allowance(address owner, address spender) external view returns (uint256);

//     /**
//      * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
//      *
//      * Returns a boolean value indicating whether the operation succeeded.
//      *
//      * IMPORTANT: Beware that changing an allowance with this method brings the risk
//      * that someone may use both the old and the new allowance by unfortunate
//      * transaction ordering. One possible solution to mitigate this race
//      * condition is to first reduce the spender's allowance to 0 and set the
//      * desired value afterwards:
//      * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
//      *
//      * Emits an {Approval} event.
//      */
//     function approve(address spender, uint256 amount) external returns (bool);

//     /**
//      * @dev Moves `amount` tokens from `from` to `to` using the
//      * allowance mechanism. `amount` is then deducted from the caller's
//      * allowance.
//      *
//      * Returns a boolean value indicating whether the operation succeeded.
//      *
//      * Emits a {Transfer} event.
//      */
//     function transferFrom(address from, address to, uint256 amount) external returns (bool);

//     /**@dev Locks specific amount of JFT to the private ledger.
//         param: routeTo - Alternative address that funds will be sent to when panic call is made.
//         param: amount - Amount to lock.
//     */
//     function lockToken(address routeTo, uint256 amount) external returns(bool);

//     /**@dev Moves an 'amount' from private ledger to regular balances.
//         @param amount - Amount to unlock.
//         Note: If the lock duration was set, holder will not be able to unlock until the 
//             set time has passed else they can withdraw to regular balance anytime.
//      */
//     function unlockToken(uint amount) external returns(bool);

//     /** @dev Returns seperate balances of @param who
//         return value will be in struct format having two values
//      */
//     function accountBalances(address who) external view returns(Balances memory);
   
//     // /**@dev Return JFT's Metadata including the information of `who`
//     //  */
//     // function getInfo(address who) external view returns(Protected memory);

//     /**
//      * @dev PanicUnlock is meant to be invoked only by the Attorney.
//      * It should only be called when JFT holder has lost access to their account and they had 
//      * earlier initiated a lock. The locked token is simply unlocked and sent to an escape address
//      * provided at the time the lock was activated.
//      * 
//      * Note: Attorney charges a fee for doing this. 
//      * @param account : Account that owns this token.
//      */
//     function panicUnlock(address account, Balances memory _bal) external returns(bool);

//     struct Protected {
//         uint256 value; // Total value currently locked
//         address escapeTo;
//     }

//     struct Balances {
//         uint256 spendable;
//         Protected locked;
//     }

//     struct TokenInfo {
//         uint8 decimals;
//         uint256 totalSupply;
//         string name;
//         string symbol;
//         address attorney;
//         // address rewarder;
//     }
// }


// // File contracts/interfaces/IRoleBase.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;

// /**
//  * @title IRoleBase 
//  * Interface of the OwnerShip contract
//  * @author Simplifi (Bobeu)
//  */
// interface IRoleBase {
//     function setRole(
//         address[] memory newRoleTos
//     ) 
//         external
//         returns(bool);

//     function removeRole(
//         address target
//     ) 
//         external
//         returns(bool);

//     function renounceRole() 
//         external
//         returns(bool);

//     function getRoleBearer(
//         uint ownerId
//     ) 
//         external 
//         view 
//         returns(address);

//     function hasRole(
//         address target
//     )
//         external
//         view 
//         returns(bool);
// }


// // File contracts/peripherals/OnlyRoleBase.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// /**
//  * @title MsgSender 
//  * @author Simplifi (Bobeu)
//  * @notice Non-deployable contract simply returning the calling account.
//  * ERROR CODE
//  * ==========
//  * R1 - Role manager is zero address
//  * R2 - User is not permitted
//  */
// abstract contract MsgSender {
//     function _msgSender() internal view virtual returns(address sender) {
//         sender = msg.sender;
//     }
// }

// abstract contract OnlyRoleBase is MsgSender {
//     // Role manager address
//     IRoleBase private roleManager;

//     // ============= constructor ============
//     constructor(address _roleManager)
//     {
//         require(_roleManager != address(0), 'R1');
//         roleManager = IRoleBase(_roleManager);
//     }

//     /**
//      * @notice Caller must have owner role before execeution can proceed.
//      * The 'errorMessage' argument can be used to return error specific to 
//      * a context e.g function call. 
//      */
//     modifier onlyRoleBearer {
//         require(_hasRole(_msgSender()), 'R2');
//         _;
//     }

//     function _hasRole(address target) internal view returns(bool result) {
//         result = roleManager.hasRole(target);
//     }
    
//     function getRoleManager() public view returns(address) {
//         return address(roleManager);
//     }

// }


// // File contracts/peripherals/Pausable.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// /**
//  * @dev Contract module which allows children to implement an emergency stop
//  * mechanism that can be triggered by an authorized account.
//  *
//  * This module is used through inheritance. It will make available the
//  * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
//  * the functions of your contract. Note that they will not be pausable by
//  * simply including this module, only once the modifiers are put in place.
//  * 
//  * We use part of the Openzeppelin Pausable contract to supplement our strategy.
//  * Thanks to the OZ team.
//  */
// abstract contract Pausable is OnlyRoleBase {
//     bool private _paused;

//     /**
//      * @dev Emitted when the pause is triggered by `account`.
//      */
//     event Paused(address account);

//     /**
//      * @dev Emitted when the pause is lifted by `account`.
//      */
//     event Unpaused(address account);

//     /**
//      * @dev The operation failed because the contract is paused.
//      */
//     error EnforcedPause();

//     /**
//      * @dev The operation failed because the contract is not paused.
//      */
//     error ExpectedPause();

//     /**
//      * @dev Initializes the contract in unpaused state.
//      */
//     constructor(
//         address _roleManager
//     ) OnlyRoleBase(_roleManager) {
//         _paused = false;
//     }

//     /**
//      * @dev Modifier to make a function callable only when the contract is not paused.
//      *
//      * Requirements:
//      *
//      * - The contract must not be paused.
//      */
//     modifier whenNotPaused() {
//         _requireNotPaused();
//         _;
//     }

//     /**
//      * @dev Modifier to make a function callable only when the contract is paused.
//      *
//      * Requirements:
//      *
//      * - The contract must be paused.
//      */
//     modifier whenPaused() {
//         _requirePaused();
//         _;
//     }

//     /**
//      * @dev Returns true if the contract is paused, and false otherwise.
//      */
//     function paused() public view returns (bool) {
//         return _paused;
//     }

//     /**
//      * @dev Throws if the contract is paused.
//      */
//     function _requireNotPaused() internal view {
//         if (paused()) {
//             revert EnforcedPause();
//         }
//     }

//     /**
//      * @dev Throws if the contract is not paused.
//      */
//     function _requirePaused() internal view virtual {
//         if (!paused()) {
//             revert ExpectedPause();
//         }
//     }

//     /**
//      * @dev Triggers stopped or return to normal state.
//      *
//      * Requirements:
//      * Only owner role can call.
//      * - The contract must not be paused.
//      */
//     function togglePause() 
//         public 
//         onlyRoleBearer
//     {
//         _paused = paused()? false : true;
//         if(paused()) emit Paused(_msgSender()); else emit Unpaused(_msgSender());
//     }

// }


// // File contracts/peripherals/token/ERC20Abstract.sol

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)

// pragma solidity 0.8.28;
// library Lib {
//   function cannotBeEmptyAddress(address target) internal pure {
//     require(target != address(0), "Lib: Target is zero address");
//   }

//   function mustBeAbove(uint a, uint b) internal pure {
//     require(a >= b, "B is greater than A");
//   }

//   function _now() internal view returns(uint64 result) {
//     result = uint64(block.timestamp);
//   }
// }

// /**
//  * @dev Implementation of the {IERC20} interface.
//  *
//  * This implementation is agnostic to the way tokens are created. This means
//  * that a supply mechanism has to be added in a derived contract using {_mint}.
//  * For a generic mechanism see {ERC20PresetMinterPauser}.
//  *
//  * TIP: For a detailed writeup see our guide
//  * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
//  * to implement supply mechanisms].
//  *
//  * The default value of {decimals} is 18. To change this, you should override
//  * this function so it returns a different value.
//  *
//  * We have followed general OpenZeppelin Contracts guidelines: functions revert
//  * instead returning `false` on failure. This behavior is nonetheless
//  * conventional and does not conflict with the expectations of ERC20
//  * applications.
//  *
//  * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
//  * This allows applications to reconstruct the allowance for all accounts just
//  * by listening to said events. Other implementations of the EIP may not emit
//  * these events, as it isn't required by the specification.
//  *
//  * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
//  * functions have been added to mitigate the well-known issues around setting
//  * allowances. See {IERC20-approve}.
//  */

// /**
//  * @title SimpliFinance Token Implementation { Non deployable }
//  * @author SimpliFinance - https://github.com/bobeu
//  * @notice @dev Simplifinance Token operates a dual ledger model:
//      *      - Regular balance : Compatible with the standard ERC20 balances.
//      *      - private balance : This is kept in a seperate ledger but reflects in the total balances when 
//      *          the `balanceOf` is invoked. We introduced this method for internal security reasons to protect
//      *          SPT holder in the event they lost access to their wallets.
//      *  HOW IS WORKS
//      *  ============
//      *      To be protected, holder must explicitly subscribe to it. During the processs, an alternative 
//      *      EOA referred to as `escapeTo` must be provided as an argument to the function. Holders are adviced to create a seperate account for this purpose
//      *      and keep the private keys secure. Such account might not be used for regular transaction. Providing this address activates 
//      *      the private balance mode. The specified amount of `inValue` is locked for the period of `lockTil`. During the locked period, if holder 
//      *      lost access to their account, through the `Attorney` contract, provided the lock is activated, they will regain access to their funds.
//      *      The Attorney will enquire from the Token contract if the caller has previously activated the lock, and if an escape address was set. otherwise
//      *      the request is ignored.
//      * Note: An amount is charged by the Attorney for such service.
//      * Even if an hacker gained access to your private keys, as a SPT holder, the fund is not accessible to them only if the holder had activated the lock feature.
//      * 
//      * Note: The call must be initiated by an account other than the owner.
//      *       An attacker only has access to SPT token in your regular ERC20 ledger balances.
//      *   
//         The `panicWithdraw` method resides in the Attorney contract. It unlocks all balances in the locked ledger and are sent to the `escape` account provided the  
//         an address was initially set.
//  */
// abstract contract ERC20Abstract is IERC20, Pausable {
//   using Lib for *;

//   TokenInfo private tokenInfo;
  
//   mapping(address => Balances) private _balances;

//   mapping(address => mapping(address => uint256)) private _allowances;

//   /**
//    * @dev Initializes state varibles.
//    * Note: We mint the maxSupply at deployment. 30% of the total supply
//    * is in circulation while the rest is lcoked in the reserve.
//    */
//   constructor(
//     address attorney_,
//     address reserve_,
//     address initTokenReceiver,
//     address _roleManager
//   )  
//     Pausable(_roleManager)
//   {
//     attorney_.cannotBeEmptyAddress();
//     tokenInfo = TokenInfo(18, 0, "Simplfinance Token", "TSFT", attorney_);
//     _mint(_msgSender(), 200_000_000*(10**18)); // For testing, mint to msg.sender
//     _mint(initTokenReceiver, 800_000_000*(10**18));
//     _lock(initTokenReceiver, reserve_, 700_000_000*(10**18)); // We expect reserve_ to be a grouped account e.g multisig.
//   }

//   /**
//    * @dev Returns the name of the token.
//    */
//   function name() public view virtual override returns (string memory) {
//     return tokenInfo.name;
//   }

//   /**
//    * @dev Returns the symbol of the token, usually a shorter version of the
//    * name.
//    */
//   function symbol() public view virtual override returns (string memory) {
//     return tokenInfo.symbol;
//   }

//   /**
//    * @dev Returns the number of decimals used to get its user representation.
//    * For example, if `decimals` equals `2`, a balance of `505` tokens should
//    * be displayed to a user as `5.05` (`505 / 10 ** 2`).
//    *
//    * Tokens usually opt for a value of 18, imitating the relationship between
//    * Ether and Wei. This is the default value returned by this function, unless
//    * it's overridden.
//    *
//    * NOTE: This information is only used for _display_ purposes: it in
//    * no way affects any of the arithmetic of the contract, including
//    * {IERC20-balanceOf} and {IERC20-transfer}.
//    */
//   function decimals() public view virtual override returns (uint8) {
//     return tokenInfo.decimals;
//   }

//   /**
//    * @dev Returns contracts account connected to the token contracts i.e.
//    *    - Attorney
//    * Note: Attorney account acts on behalf of a holders to retrive their token
//    *        in the event they lost access to their accounts.
//    */
//   function getAttorney() public view returns(address _attorney) {
//     _attorney = tokenInfo.attorney;
//   }

//   /// @dev See IERC20.sol {getInfo}
//   function getLockedInfo(address target) public view returns(Protected memory _locked) {
//     address msgSender = _msgSender();
//     if(msgSender == tokenInfo.attorney) {
//       _locked = _balances[target].locked;
//     }
//     return _locked;
//   }

//   /**
//    * @dev See {IERC20-totalSupply}.
//    */
//   function totalSupply() public view virtual override returns (uint256) {
//     return tokenInfo.totalSupply;
//   }

//   ///@dev See {IERC20-accountBalances}.
//   function accountBalances(address who) external view returns (Balances memory _bal) {
//     _bal = _balances[who];
//     return _bal;
//   }

//   /**
//    * @dev See {IERC20-balanceOf}.
//    * Returns the spendable balance of @param account: Bytes32 address type
//    * Note: The function `balanceOf` complies with that ERC20 standard
//    */
//   function balanceOf(address account) public view returns (uint256 _bal) {
//     return _getSpendable(account);
//   }

//   /**
//    * @dev See {IERC20-transfer}.
//    *
//    * Requirements:
//    *
//    * - `to` cannot be the zero address.
//    * - the caller must have a balance of at least `amount`.
//    */
//   function transfer(address to, uint256 amount) public returns (bool) {
//     address owner = _msgSender();
//     _transfer(owner, to, amount);
//     return true;
//   }

//   /**
//    * @dev See {IERC20-allowance}.
//    */
//   function allowance(address owner, address spender) public view virtual override returns (uint256) {
//     return _allowances[owner][spender];
//   }

//   /**
//    * @dev See {IERC20-approve}.
//    *
//    * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
//    * `transferFrom`. This is semantically equivalent to an infinite approval.
//    *
//    * Requirements:
//    *
//    * - `spender` cannot be the zero address.
//    */
//   function approve(address spender, uint256 amount) public virtual override returns (bool) {
//       address owner = _msgSender();
//       _approve(owner, spender, amount);
//       return true;
//   }

//   /**
//    * @dev See {IERC20-transferFrom}.
//    *
//    * Emits an {Approval} event indicating the updated allowance. This is not
//    * required by the EIP. See the note at the beginning of {ERC20}.
//    *
//    * NOTE: Does not update the allowance if the current allowance
//    * is the maximum `uint256`.
//    *
//    * Requirements:
//    *
//    * - `from` and `to` cannot be the zero address.
//    * - `from` must have a balance of at least `amount`.
//    * - the caller must have allowance for ``from``'s tokens of at least
//    * `amount`.
//    */
//   function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
//     address spender = _msgSender();
//     _spendAllowance(from, spender, amount);
//     _transfer(from, to, amount);
//     return true;
//   }

//   /**
//    * @dev Atomically increases the allowance granted to `spender` by the caller.
//    *
//    * This is an alternative to {approve} that can be used as a mitigation for
//    * problems described in {IERC20-approve}.
//    *
//    * Emits an {Approval} event indicating the updated allowance.
//    *
//    * Requirements:
//    *
//    * - `spender` cannot be the zero address.
//    */
//   function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
//       address owner = _msgSender();
//       _approve(owner, spender, allowance(owner, spender) + addedValue);
//       return true;
//   }

//   /**
//    * @dev Atomically decreases the allowance granted to `spender` by the caller.
//    *
//    * This is an alternative to {approve} that can be used as a mitigation for
//    * problems described in {IERC20-approve}.
//    *
//    * Emits an {Approval} event indicating the updated allowance.
//    *
//    * Requirements:
//    *
//    * - `spender` cannot be the zero address.
//    * - `spender` must have allowance for the caller of at least
//    * `subtractedValue`.
//    */
//   function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns(bool) {
//     address owner = _msgSender();
//     uint256 currentAllowance = allowance(owner, spender);
//     require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
//     unchecked {
//       _approve(owner, spender, currentAllowance - subtractedValue);
//     }

//     return true;
//   }

//   // Returns spendable balances of {from} i.e usual ERC20 'balanceOf'
//   function _getSpendable(address from) internal view returns (uint256) {
//     return _balances[from].spendable;
//   }

//   /**
//    * @dev Moves `amount` of tokens from `from` to `to`.
//    *
//    * This internal function is equivalent to {transfer}, and can be used to
//    * e.g. implement automatic token fees, slashing mechanisms, etc.
//    *
//    * Emits a {Transfer} event.
//    *
//    * Requirements:
//    *
//    * - `from` cannot be the zero address.
//    * - `to` cannot be the zero address.
//    * - `from` must have a balance of at least `amount`.
//    */
//   function _transfer(address from, address to, uint256 amount) internal virtual 
//   {
//     from.cannotBeEmptyAddress();
//     to.cannotBeEmptyAddress();

//     _beforeTokenTransfer(from, to, amount);
//     uint256 fromBalance = _getSpendable(from);
//     fromBalance.mustBeAbove(amount);
//     unchecked {
//         _balances[from].spendable = fromBalance - amount;
//         // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
//         // decrementing then incrementing.
//         _balances[to].spendable += amount;
//     }

//     emit Transfer(from, to, amount);

//     _afterTokenTransfer(from, to, amount);
//   }

//   /** @dev Creates `amount` tokens and assigns them to `account`, increasing
//    * the total supply.
//    *
//    * Emits a {Transfer} event with `from` set to the zero address.
//    *
//    * Requirements:
//    *
//    * - `account` cannot be the zero address.
//    */
//   function _mint(address account, uint256 amount) internal virtual {
//     // _requireContext(_isCallable(Internal.MINT));
//     account.cannotBeEmptyAddress();
//     _beforeTokenTransfer(address(0), account, amount);

//     tokenInfo.totalSupply += amount;
//     unchecked {
//         // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
//         _balances[account].spendable += amount;
//     }
//     emit Transfer(address(0), account, amount);

//     _afterTokenTransfer(address(0), account, amount);
//   }

//   /**
//    * @dev Destroys `amount` tokens from `account`, reducing the
//    * total supply.
//    *
//    * Emits a {Transfer} event with `to` set to the zero address.
//    *
//    * Requirements:
//    *
//    * - `account` cannot be the zero address.
//    * - `account` must have at least `amount` tokens.
//    */
//   function _burn(address account, uint256 amount) internal virtual {
//     account.cannotBeEmptyAddress();
//     _beforeTokenTransfer(account, address(0), amount);

//     uint256 accountBalance = _balances[account].spendable;
//     accountBalance.mustBeAbove(amount);
//     unchecked {
//       _balances[account].spendable = accountBalance - amount;
//       // Overflow not possible: amount <= accountBalance <= totalSupply.
//       tokenInfo.totalSupply -= amount;
//     }

//     emit Transfer(account, address(0), amount);

//     _afterTokenTransfer(account, address(0), amount);
//   }

//   /**
//    * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
//    *
//    * This internal function is equivalent to `approve`, and can be used to
//    * e.g. set automatic allowances for certain subsystems, etc.
//    *
//    * Emits an {Approval} event.
//    *
//    * Requirements:
//    *
//    * - `owner` cannot be the zero address.
//    * - `spender` cannot be the zero address.
//    */
//   function _approve(address owner, address spender, uint256 amount) internal virtual {
//     owner.cannotBeEmptyAddress();
//     spender.cannotBeEmptyAddress();
//     _allowances[owner][spender] = amount;
//     emit Approval(owner, spender, amount);
//   }

//   /**
//    * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
//    *
//    * Does not update the allowance amount in case of infinite allowance.
//    * Revert if not enough allowance is available.
//    *
//    * Might emit an {Approval} event.
//    */
//   function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
//     uint256 currentAllowance = allowance(owner, spender);
//     if (currentAllowance != type(uint256).max) {
//       currentAllowance.mustBeAbove(amount);
//       unchecked {
//         _approve(owner, spender, currentAllowance - amount);
//       }
//     }
//   }

//   /**
//    * @dev Hook that is called before any transfer of tokens. This includes
//    * minting and burning.
//    *
//    * Calling conditions:
//    *
//    * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
//    * will be transferred to `to`.
//    * - when `from` is zero, `amount` tokens will be minted for `to`.
//    * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
//    * - `from` and `to` are never both zero.
//    *
//    * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
//    */
//   function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}

//   /**
//    * @dev Hook that is called after any transfer of tokens. This includes
//    * minting and burning.
//    *
//    * Calling conditions:
//    *
//    * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
//    * has been transferred to `to`.
//    * - when `from` is zero, `amount` tokens have been minted for `to`.
//    * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
//    * - `from` and `to` are never both zero.
//    *
//    * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
//    */
//   function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}

  
//   ///@dev Returns current Unix time stamp
//   function _now() internal view returns(uint32) {
//     return uint32(block.timestamp);
//   }
  
//   /**@dev Locks token in the private ledger balances.
//     When tokens are locked they can be unlocked at any time.
//       @param _escapeTo : An extra address that token will be forwarded to. This must not be zero address
//       @param amount : Amount user is willing to send to the safe.
//       Note: If caller has no lock previously set,`escapeTo` must not be an empty address.
//             User will always have to provide an escape address each time they want to lock up tokens.
//       REWARD
//       ======
//       Holders are eligible to claim reward if they hold SFT in private ledger for at least 30 days.
//       The measure of such reward is determined by the team.
//       @notice Care must be taken when locking and unlocking. Users must first check through the attorney if they're
//             qualify for reward then they must claim first before lock again, otherwise, the locked time is overriden.
//             This can nullify their rewards.

//    */
//   function _lock(address account, address _escapeTo, uint256 amount) 
//     internal
//   {
//     _escapeTo.cannotBeEmptyAddress();
//     Balances memory balances = _balances[account];

//     balances.spendable.mustBeAbove(amount);
//     // _balances[account].locked.escapeTo = _escapeTo;
//     // _balances[account].locked.lastLocked = amount;
//     unchecked {
//       _balances[account] = Balances(
//         balances.spendable - amount,
//         Protected(
//           balances.locked.value + amount,
//           _escapeTo
//         )
//       );
//     }
//   }

//   /**@dev Unlock token 
//    */
//   function _unlock(address account, uint amount) internal {
//     Balances memory balances = _balances[account];
//     if(balances.locked.escapeTo == address(0)) revert NoPreviousLockDetected();
//     balances.locked.value.mustBeAbove(amount);
//     unchecked {
//       _balances[account].locked.value -= amount;
//       _balances[balances.locked.escapeTo].spendable += amount;
//     }
//   }

//   /**
//    * @dev Replaces the attorney account. Only authorized owner account can perform
//    * this action.
//    */
//   function setAttorney(address newAttorney) public onlyRoleBearer {
//     newAttorney.cannotBeEmptyAddress();
//     tokenInfo.attorney = newAttorney;
//   }

//   /**See IERC20.sol {panicUnlock}
//     Method is executed only of the caller is the attorney
//     Note: Since the user is able to prove to the attorney that they
//     own the lost account, they are also able to reclaim all balances.
//    */ 
//   function panicUnlock(address accountToRetrieve, Balances memory _bal) external returns(bool feedback) {
//     tokenInfo.attorney.cannotBeEmptyAddress();
//     if(_msgSender() == tokenInfo.attorney) {
//       unchecked {
//         _balances[accountToRetrieve].locked.value = 0;
//         _balances[_bal.locked.escapeTo].spendable += _bal.locked.value;
//       }
//       if(_bal.spendable > 0) {
//         _transfer(accountToRetrieve, _bal.locked.escapeTo, _bal.spendable);
//       } 
//       feedback = true;
//     }
//   }
// }


// // File contracts/standalone/collaterals/SimpliToken.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// /*
//     @title SToken is the native token of the Simplifinance platform.
//             It is a utility token that gives its holders access to Simplifinance
//             products.
//         Standard: Custom and ERC20 compatible.
//         Type: Deflationary.
//         Max Supply: 1_000_000_000.
//         Decimal: 18.
// */
// contract SimpliToken is ERC20Abstract {
//     event Locked(address from, uint256 amount);
//     event UnLocked(address from, uint256 amount);

//     constructor( 
//         address attorney_,
//         address reserve_,
//         address initTokenReceiver,
//         address _roleManager
//     ) ERC20Abstract(attorney_, reserve_, initTokenReceiver, _roleManager) { }

//     ///@dev Contract accepts no platform coin
//     receive() external payable {
//         revert("NA");
//     }

//     ///@dev See IERC20.sol {lockToken}
//     function lockToken(address _routeTo, uint256 amount) public returns (bool) {
//         _lock(_msgSender(), _routeTo, amount);

//         emit Locked(_msgSender(), amount);
//         return true;
//     }

//     ///@dev See IERC20.sol {unlock}
//     function unlockToken(uint256 amount) public returns (bool) {
//         _unlock(_msgSender(), amount);

//         emit UnLocked(_msgSender(), amount);
//         return true;
//     }

//     ///@dev Burns token of `amount`
//     function burn(uint amount) public {
//         _burn(_msgSender(), amount);
//     }

//     /**
//         See IERC20.sol {batchTransfer}
//         A dynamic transfer utility. 
//         Note: The size of the amount array must match that of the 
//         account's. Another benefit is that each of the addresses on the 
//         list can be dynamically mapped to different amount.
//      */
//     function batchTransfer(
//         uint[] memory amounts,
//         address[] memory accounts
//     ) public override returns (bool) {
//         uint accountSize = accounts.length;
//         require(accountSize == amounts.length, "Unequal list");
//         for (uint i = 0; i < accountSize; i++) {
//             address to = accounts[i];
//             uint amount = amounts[i];
//             _transfer(_msgSender(), to, amount);
//         }
//         return true;
//     }

//     // function mint(address[] memory tos, uint amount) public {
//     //   for(uint i = 0; i < tos.length; i++) {
//     //     _mint(tos[i], amount);
//     //   }
//     // }
// }
