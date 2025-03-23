// Sources flattened with hardhat v2.22.17 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/interfaces/draft-IERC6093.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (interfaces/draft-IERC6093.sol)
pragma solidity ^0.8.20;

/**
 * @dev Standard ERC20 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC20 tokens.
 */
interface IERC20Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC20InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC20InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `spender`’s `allowance`. Used in transfers.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` is allowed to operate with.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC20InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `spender` to be approved. Used in approvals.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC20InvalidSpender(address spender);
}

/**
 * @dev Standard ERC721 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC721 tokens.
 */
interface IERC721Errors {
    /**
     * @dev Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in EIP-20.
     * Used in balance queries.
     * @param owner Address of the current owner of a token.
     */
    error ERC721InvalidOwner(address owner);

    /**
     * @dev Indicates a `tokenId` whose `owner` is the zero address.
     * @param tokenId Identifier number of a token.
     */
    error ERC721NonexistentToken(uint256 tokenId);

    /**
     * @dev Indicates an error related to the ownership over a particular token. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param tokenId Identifier number of a token.
     * @param owner Address of the current owner of a token.
     */
    error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC721InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC721InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param tokenId Identifier number of a token.
     */
    error ERC721InsufficientApproval(address operator, uint256 tokenId);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC721InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC721InvalidOperator(address operator);
}

/**
 * @dev Standard ERC1155 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC1155 tokens.
 */
interface IERC1155Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     * @param tokenId Identifier number of a token.
     */
    error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC1155InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC1155InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param owner Address of the current owner of a token.
     */
    error ERC1155MissingApprovalForAll(address operator, address owner);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC1155InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC1155InvalidOperator(address operator);

    /**
     * @dev Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation.
     * Used in batch transfers.
     * @param idsLength Length of the array of token identifiers
     * @param valuesLength Length of the array of token amounts
     */
    error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength);
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


// File @openzeppelin/contracts/utils/Context.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File @openzeppelin/contracts/token/ERC20/ERC20.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.20;




/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
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
 */
abstract contract ERC20 is Context, IERC20, IERC20Metadata, IERC20Errors {
    mapping(address account => uint256) private _balances;

    mapping(address account => mapping(address spender => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
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
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `value`.
     */
    function transfer(address to, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, value);
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
     * - `from` must have a balance of at least `value`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `value`.
     */
    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _transfer(address from, address to, uint256 value) internal {
        if (from == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        if (to == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(from, to, value);
    }

    /**
     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
     * this function.
     *
     * Emits a {Transfer} event.
     */
    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            // Overflow check required: The rest of the code assumes that totalSupply never overflows
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from];
            if (fromBalance < value) {
                revert ERC20InsufficientBalance(from, fromBalance, value);
            }
            unchecked {
                // Overflow not possible: value <= fromBalance <= totalSupply.
                _balances[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
                _totalSupply -= value;
            }
        } else {
            unchecked {
                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }

    /**
     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
     * Relies on the `_update` mechanism
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _mint(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(address(0), account, value);
    }

    /**
     * @dev Destroys a `value` amount of tokens from `account`, lowering the total supply.
     * Relies on the `_update` mechanism.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead
     */
    function _burn(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        _update(account, address(0), value);
    }

    /**
     * @dev Sets `value` as the allowance of `spender` over the `owner` s tokens.
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
     *
     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
     */
    function _approve(address owner, address spender, uint256 value) internal {
        _approve(owner, spender, value, true);
    }

    /**
     * @dev Variant of {_approve} with an optional flag to enable or disable the {Approval} event.
     *
     * By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by
     * `_spendAllowance` during the `transferFrom` operation set the flag to false. This saves gas by not emitting any
     * `Approval` event during `transferFrom` operations.
     *
     * Anyone who wishes to continue emitting `Approval` events on the`transferFrom` operation can force the flag to
     * true using the following override:
     * ```
     * function _approve(address owner, address spender, uint256 value, bool) internal virtual override {
     *     super._approve(owner, spender, value, true);
     * }
     * ```
     *
     * Requirements are the same as {_approve}.
     */
    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
        if (owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

    /**
     * @dev Updates `owner` s allowance for `spender` based on spent `value`.
     *
     * Does not update the allowance value in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Does not emit an {Approval} event.
     */
    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
            }
            unchecked {
                _approve(owner, spender, currentAllowance - value, false);
            }
        }
    }
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


// File contracts/implementations/TestBaseAsset.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.24;
contract TestBaseAsset is OnlyOwner, ERC20 {
  error AlreadySignedUp();
  struct Tester {
    bool isSignedUp;
    bool isApproved;
  }

  address[] public testers;

  IERC20 public collateralToken;

  mapping (address => Tester) public indexes;

  constructor(
    IOwnerShip _ownershipManager,
    IERC20 _collateralToken
  ) ERC20("Test Base Asset", "TBSD") OnlyOwner(_ownershipManager) {
    require(address(_collateralToken) != address(0), "Collateral token is zero");
    require(address(_ownershipManager) != address(0), "OwnershipManager addr is zero");
    collateralToken = _collateralToken;
    _mint(msg.sender, 100000 * (10**18));
    _signUp();
  }

  /**
   * @dev Claim test token 
   * @param to : Recipient
   * @notice Two assets are sent to recipient:
   *      1. Base contribution asset
   *      2. Collateral token
   *  Sender must registered and be approved in order to claim test tokens
   */
  function _claimTestTokens(address to) internal {
    require(indexes[to].isApproved, "Not approved");
    uint amount = 5000 * (10**18);
    uint colAmount = amount * 4;
    if(balanceOf(to) == 0) _mint(to, amount);
    if(IERC20(collateralToken).balanceOf(to) == 0 && IERC20(collateralToken).balanceOf(address(this)) >= colAmount) IERC20(collateralToken).transfer(to, colAmount);
  }

  function claimTestTokens() public returns(bool) {
    _claimTestTokens(_msgSender());
    return true;
  }
   
  /**
   * @dev Assigned owner account (s) can send test tokens to multiple users provided they're 
   * registered and approved.
   * @param tos : A list of recipients
   * @notice Sender must have ownership right or access
   */
  function mintBatch(address[] memory tos) public onlyOwner {
    for(uint i = 0; i < tos.length; i++) {
      _claimTestTokens(tos[i]);
    }
  }

  function _signUp() internal {
    Tester memory ts = indexes[_msgSender()];
    if(!ts.isSignedUp){
      indexes[_msgSender()].isSignedUp = true;
      testers.push(_msgSender());
    } else revert AlreadySignedUp();
  }
  
  /**
   * @dev Register users for testnet participation
   */
  function joinTestnet() public returns(bool) {
    _signUp();
    return true;
  }

  /**
   * @dev Owner accounts can approve testers
   * @param targets : List of accounts to approve 
   */
  function approveTester(address[] memory targets) public onlyOwner {
    for(uint i = 0; i < targets.length; i++){
      address target = targets[i];
      Tester memory ts = indexes[target];
      if(ts.isSignedUp && !ts.isApproved) indexes[target].isApproved = true;
    }
  }

  function _msgSender() internal view override(Context, MsgSender) returns(address sender) {
    sender = msg.sender;
  }
}
