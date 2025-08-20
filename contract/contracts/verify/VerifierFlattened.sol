// Sources flattened with hardhat v2.22.17 https://hardhat.org

// SPDX-License-Identifier: MIT

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


// File @openzeppelin/contracts/access/Ownable.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
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


// File @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.20;



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
     * @dev An operation with an ERC20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transferFrom, (from, to, value)));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeCall(token.approve, (spender, value));

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeCall(token.approve, (spender, 0)));
            _callOptionalReturn(token, approvalCall);
        }
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
        if (returndata.length != 0 && !abi.decode(returndata, (bool))) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return success && (returndata.length == 0 || abi.decode(returndata, (bool))) && address(token).code.length > 0;
    }
}


// File @selfxyz/contracts/contracts/constants/AttestationId.sol@v1.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title AttestationId Library
 * @notice This library provides attestation identifiers used across contracts.
 * @dev Currently, it contains the constant E_PASSPORT which represents the identifier
 * for an E-PASSPORT attestation computed as Poseidon("E-PASSPORT").
 */
library AttestationId {
    /**
     * @notice Identifier for an E-PASSPORT attestation.
     * @dev The identifier is computed based on the hash of "E-PASSPORT" using the Poseidon hash function.
     * Here it is hardcoded as bytes32(uint256(1)) for demonstration purposes.
     */
    bytes32 constant E_PASSPORT = bytes32(uint256(1));
    bytes32 constant EU_ID_CARD = bytes32(uint256(2));
}


// File @selfxyz/contracts/contracts/constants/CircuitConstantsV2.sol@v1.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title Circuit Constants Library
 * @notice This library defines constants representing indices used to access public signals
 *         of various circuits such as register, DSC, and VC/Disclose.
 * @dev These indices map directly to specific data fields in the corresponding circuits proofs.
 */
library CircuitConstantsV2 {
    // ---------------------------
    // Register Circuit Constants
    // ---------------------------

    /**
     * @notice Index to access the nullifier in the register circuit public signals.
     */
    uint256 constant REGISTER_NULLIFIER_INDEX = 0;

    /**
     * @notice Index to access the commitment in the register circuit public signals.
     */
    uint256 constant REGISTER_COMMITMENT_INDEX = 1;

    /**
     * @notice Index to access the Merkle root in the register circuit public signals.
     */
    uint256 constant REGISTER_MERKLE_ROOT_INDEX = 2;

    // ---------------------------
    // DSC Circuit Constants
    // ---------------------------

    /**
     * @notice Index to access the tree leaf in the DSC circuit public signals.
     */
    uint256 constant DSC_TREE_LEAF_INDEX = 0;

    /**
     * @notice Index to access the CSCA root in the DSC circuit public signals.
     */
    uint256 constant DSC_CSCA_ROOT_INDEX = 1;

    // -------------------------------------
    // VC and Disclose Circuit Constants
    // -------------------------------------

    /**
     * @notice Structure containing circuit indices for a specific attestation type.
     */
    struct DiscloseIndices {
        uint256 revealedDataPackedIndex;
        uint256 forbiddenCountriesListPackedIndex;
        uint256 nullifierIndex;
        uint256 attestationIdIndex;
        uint256 merkleRootIndex;
        uint256 currentDateIndex;
        uint256 namedobSmtRootIndex;
        uint256 nameyobSmtRootIndex;
        uint256 scopeIndex;
        uint256 userIdentifierIndex;
        uint256 passportNoSmtRootIndex; // Only for passport, 99 for ID card
    }

    /**
     * @notice Returns the circuit indices for a given attestation type.
     * @param attestationId The attestation identifier.
     * @return indices The DiscloseIndices struct containing all relevant indices.
     */
    function getDiscloseIndices(bytes32 attestationId) internal pure returns (DiscloseIndices memory indices) {
        if (attestationId == AttestationId.E_PASSPORT) {
            return
                DiscloseIndices({
                    revealedDataPackedIndex: 0,
                    forbiddenCountriesListPackedIndex: 3,
                    nullifierIndex: 7,
                    attestationIdIndex: 8,
                    merkleRootIndex: 9,
                    currentDateIndex: 10,
                    namedobSmtRootIndex: 17,
                    nameyobSmtRootIndex: 18,
                    scopeIndex: 19,
                    userIdentifierIndex: 20,
                    passportNoSmtRootIndex: 16
                });
        } else if (attestationId == AttestationId.EU_ID_CARD) {
            return
                DiscloseIndices({
                    revealedDataPackedIndex: 0,
                    forbiddenCountriesListPackedIndex: 4,
                    nullifierIndex: 8,
                    attestationIdIndex: 9,
                    merkleRootIndex: 10,
                    currentDateIndex: 11,
                    namedobSmtRootIndex: 17,
                    nameyobSmtRootIndex: 18,
                    scopeIndex: 19,
                    userIdentifierIndex: 20,
                    passportNoSmtRootIndex: 99
                });
        } else {
            revert("Invalid attestation ID");
        }
    }
}


// File @selfxyz/contracts/contracts/interfaces/IDscCircuitVerifier.sol@v1.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title IDscCircuitVerifier
 * @notice Interface for verifying zero-knowledge proofs related to the DSC circuit.
 * @dev This interface defines the structure of a DSC circuit proof and exposes a function to verify such proofs.
 */
interface IDscCircuitVerifier {
    /**
     * @notice Represents a DSC circuit proof.
     * @param a An array of two unsigned integers representing the proof component 'a'.
     * @param b A 2x2 array of unsigned integers representing the proof component 'b'.
     * @param c An array of two unsigned integers representing the proof component 'c'.
     * @param pubSignals An array of two unsigned integers representing the public signals associated with the proof.
     */
    struct DscCircuitProof {
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
        uint[2] pubSignals;
    }

    /**
     * @notice Verifies a given DSC circuit zero-knowledge proof.
     * @dev This function checks the validity of the provided DSC proof parameters.
     * @param pA The 'a' component of the proof.
     * @param pB The 'b' component of the proof.
     * @param pC The 'c' component of the proof.
     * @param pubSignals The public signals associated with the proof.
     * @return A boolean value indicating whether the provided proof is valid (true) or not (false).
     */
    function verifyProof(
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[2] calldata pubSignals
    ) external view returns (bool);
}


// File @selfxyz/contracts/contracts/interfaces/IRegisterCircuitVerifier.sol@v1.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.28;
/**
 * @title IRegisterCircuitVerifier
 * @notice Interface for verifying register circuit proofs.
 * @dev This interface defines the structure of a register circuit proof and exposes a function to verify such proofs.
 */
interface IRegisterCircuitVerifier {
    /**
     * @notice Represents a register circuit proof.
     * @dev This structure encapsulates the required proof elements.
     * @param a An array of two unsigned integers representing the proof component 'a'.
     * @param b A 2x2 array of unsigned integers representing the proof component 'b'.
     * @param c An array of two unsigned integers representing the proof component 'c'.
     * @param pubSignals An array of three unsigned integers representing the public signals associated with the proof.
     */
    struct RegisterCircuitProof {
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
        uint[3] pubSignals;
    }

    /**
     * @notice Verifies a given register circuit proof.
     * @dev This function checks the validity of the provided proof parameters.
     * @param a The 'a' component of the proof.
     * @param b The 'b' component of the proof.
     * @param c The 'c' component of the proof.
     * @param pubSignals The public signals associated with the proof.
     * @return isValid A boolean value indicating whether the provided proof is valid (true) or not (false).
     */
    function verifyProof(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[3] calldata pubSignals
    ) external view returns (bool isValid);
}


// File @selfxyz/contracts/contracts/libraries/SelfStructs.sol@v1.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title SelfStructs
 * @dev Library containing data structures for Self protocol identity verification
 * @notice Defines structs for passport verification, EU ID verification, and generic disclosure outputs
 */
library SelfStructs {
    /**
     * @dev Header structure for Hub input containing contract version and scope information
     * @param contractVersion Version of the contract being used
     * @param scope Scope identifier for the verification request
     * @param attestationId Unique identifier for the attestation
     */
    struct HubInputHeader {
        uint8 contractVersion;
        uint256 scope;
        bytes32 attestationId;
    }

    /**
     * @dev Output structure for passport verification results
     * @param attestationId Unique identifier for the attestation
     * @param revealedDataPacked Packed binary data of revealed information
     * @param userIdentifier Unique identifier for the user
     * @param nullifier Cryptographic nullifier to prevent double-spending
     * @param forbiddenCountriesListPacked Packed list of forbidden countries (4 uint256 array)
     */
    struct PassportOutput {
        uint256 attestationId;
        bytes revealedDataPacked;
        uint256 userIdentifier;
        uint256 nullifier;
        uint256[4] forbiddenCountriesListPacked;
    }

    /**
     * @dev Output structure for EU ID verification results
     * @param attestationId Unique identifier for the attestation
     * @param revealedDataPacked Packed binary data of revealed information
     * @param userIdentifier Unique identifier for the user
     * @param nullifier Cryptographic nullifier to prevent double-spending
     * @param forbiddenCountriesListPacked Packed list of forbidden countries (4 uint256 array)
     */
    struct EuIdOutput {
        uint256 attestationId;
        bytes revealedDataPacked;
        uint256 userIdentifier;
        uint256 nullifier;
        uint256[4] forbiddenCountriesListPacked;
    }

    /// @dev OFAC verification mode: Passport number only
    uint256 constant passportNoOfac = 0;
    /// @dev OFAC verification mode: Name and date of birth
    uint256 constant nameAndDobOfac = 1;
    /// @dev OFAC verification mode: Name and year of birth
    uint256 constant nameAndYobOfac = 2;

    /**
     * @dev Generic disclosure output structure (Version 2) with detailed personal information
     * @param attestationId Unique identifier for the attestation
     * @param userIdentifier Unique identifier for the user
     * @param nullifier Cryptographic nullifier to prevent double-spending
     * @param forbiddenCountriesListPacked Packed list of forbidden countries (4 uint256 array)
     * @param issuingState Country or state that issued the document
     * @param name Array of name components (first, middle, last names)
     * @param idNumber Government-issued identification number
     * @param nationality Nationality of the document holder
     * @param dateOfBirth Date of birth in string format
     * @param gender Gender of the document holder
     * @param expiryDate Document expiration date in string format
     * @param olderThan Minimum age verification result
     * @param ofac Array of OFAC (Office of Foreign Assets Control) verification results for different modes
     */
    struct GenericDiscloseOutputV2 {
        bytes32 attestationId;
        uint256 userIdentifier;
        uint256 nullifier;
        uint256[4] forbiddenCountriesListPacked;
        string issuingState;
        string[] name;
        string idNumber;
        string nationality;
        string dateOfBirth;
        string gender;
        string expiryDate;
        uint256 olderThan;
        bool[3] ofac;
    }

    /**
     * @dev Verification configuration structure (Version 1)
     * @param olderThanEnabled Whether minimum age verification is enabled
     * @param olderThan Minimum age requirement
     * @param forbiddenCountriesEnabled Whether forbidden countries check is enabled
     * @param forbiddenCountriesListPacked Packed list of forbidden countries (4 uint256 array)
     * @param ofacEnabled Array of boolean flags for different OFAC verification modes
     */
    struct VerificationConfigV1 {
        bool olderThanEnabled;
        uint256 olderThan;
        bool forbiddenCountriesEnabled;
        uint256[4] forbiddenCountriesListPacked;
        bool[3] ofacEnabled;
    }

    /**
     * @dev Verification configuration structure (Version 2)
     * @param olderThanEnabled Whether minimum age verification is enabled
     * @param olderThan Minimum age requirement
     * @param forbiddenCountriesEnabled Whether forbidden countries check is enabled
     * @param forbiddenCountriesListPacked Packed list of forbidden countries (4 uint256 array)
     * @param ofacEnabled Array of boolean flags for different OFAC verification modes
     */
    struct VerificationConfigV2 {
        bool olderThanEnabled;
        uint256 olderThan;
        bool forbiddenCountriesEnabled;
        uint256[4] forbiddenCountriesListPacked;
        bool[3] ofacEnabled;
    }
}


// File @selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol@v1.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.28;



/**
 * @title IIdentityVerificationHubV2
 * @notice Interface for the Identity Verification Hub V2 for verifying zero-knowledge proofs.
 * @dev Defines all external and public functions from IdentityVerificationHubImplV2.
 */
interface IIdentityVerificationHubV2 {
    // ====================================================
    // External Functions
    // ====================================================

    /**
     * @notice Registers a commitment using a register circuit proof.
     * @dev Verifies the register circuit proof and then calls the Identity Registry to register the commitment.
     * @param attestationId The attestation ID.
     * @param registerCircuitVerifierId The identifier for the register circuit verifier to use.
     * @param registerCircuitProof The register circuit proof data.
     */
    function registerCommitment(
        bytes32 attestationId,
        uint256 registerCircuitVerifierId,
        IRegisterCircuitVerifier.RegisterCircuitProof memory registerCircuitProof
    ) external;

    /**
     * @notice Registers a DSC key commitment using a DSC circuit proof.
     * @dev Verifies the DSC proof and then calls the Identity Registry to register the dsc key commitment.
     * @param attestationId The attestation ID.
     * @param dscCircuitVerifierId The identifier for the DSC circuit verifier to use.
     * @param dscCircuitProof The DSC circuit proof data.
     */
    function registerDscKeyCommitment(
        bytes32 attestationId,
        uint256 dscCircuitVerifierId,
        IDscCircuitVerifier.DscCircuitProof memory dscCircuitProof
    ) external;

    /**
     * @notice Sets verification config in V2 storage (owner only)
     * @dev The configId is automatically generated from the config content using sha256(abi.encode(config))
     * @param config The verification configuration
     * @return configId The generated config ID
     */
    function setVerificationConfigV2(
        SelfStructs.VerificationConfigV2 memory config
    ) external returns (bytes32 configId);

    /**
     * @notice Main verification function with new structured input format
     * @param baseVerificationInput The base verification input data
     * @param userContextData The user context data
     */
    function verify(bytes calldata baseVerificationInput, bytes calldata userContextData) external;

    /**
     * @notice Updates the registry address.
     * @param attestationId The attestation ID.
     * @param registryAddress The new registry address.
     */
    function updateRegistry(bytes32 attestationId, address registryAddress) external;

    /**
     * @notice Updates the VC and Disclose circuit verifier address.
     * @param attestationId The attestation ID.
     * @param vcAndDiscloseCircuitVerifierAddress The new VC and Disclose circuit verifier address.
     */
    function updateVcAndDiscloseCircuit(bytes32 attestationId, address vcAndDiscloseCircuitVerifierAddress) external;

    /**
     * @notice Updates the register circuit verifier for a specific signature type.
     * @param attestationId The attestation identifier.
     * @param typeId The signature type identifier.
     * @param verifierAddress The new register circuit verifier address.
     */
    function updateRegisterCircuitVerifier(bytes32 attestationId, uint256 typeId, address verifierAddress) external;

    /**
     * @notice Updates the DSC circuit verifier for a specific signature type.
     * @param attestationId The attestation identifier.
     * @param typeId The signature type identifier.
     * @param verifierAddress The new DSC circuit verifier address.
     */
    function updateDscVerifier(bytes32 attestationId, uint256 typeId, address verifierAddress) external;

    /**
     * @notice Batch updates register circuit verifiers.
     * @param attestationIds An array of attestation identifiers.
     * @param typeIds An array of signature type identifiers.
     * @param verifierAddresses An array of new register circuit verifier addresses.
     */
    function batchUpdateRegisterCircuitVerifiers(
        bytes32[] calldata attestationIds,
        uint256[] calldata typeIds,
        address[] calldata verifierAddresses
    ) external;

    /**
     * @notice Batch updates DSC circuit verifiers.
     * @param attestationIds An array of attestation identifiers.
     * @param typeIds An array of signature type identifiers.
     * @param verifierAddresses An array of new DSC circuit verifier addresses.
     */
    function batchUpdateDscCircuitVerifiers(
        bytes32[] calldata attestationIds,
        uint256[] calldata typeIds,
        address[] calldata verifierAddresses
    ) external;

    // ====================================================
    // External View Functions
    // ====================================================

    /**
     * @notice Returns the registry address for a given attestation ID.
     * @param attestationId The attestation ID to query.
     * @return The registry address associated with the attestation ID.
     */
    function registry(bytes32 attestationId) external view returns (address);

    /**
     * @notice Returns the disclose verifier address for a given attestation ID.
     * @param attestationId The attestation ID to query.
     * @return The disclose verifier address associated with the attestation ID.
     */
    function discloseVerifier(bytes32 attestationId) external view returns (address);

    /**
     * @notice Returns the register circuit verifier address for a given attestation ID and type ID.
     * @param attestationId The attestation ID to query.
     * @param typeId The type ID to query.
     * @return The register circuit verifier address associated with the attestation ID and type ID.
     */
    function registerCircuitVerifiers(bytes32 attestationId, uint256 typeId) external view returns (address);

    /**
     * @notice Returns the DSC circuit verifier address for a given attestation ID and type ID.
     * @param attestationId The attestation ID to query.
     * @param typeId The type ID to query.
     * @return The DSC circuit verifier address associated with the attestation ID and type ID.
     */
    function dscCircuitVerifiers(bytes32 attestationId, uint256 typeId) external view returns (address);

    /**
     * @notice Returns the merkle root timestamp for a given attestation ID and root.
     * @param attestationId The attestation ID to query.
     * @param root The merkle root to query.
     * @return The merkle root timestamp associated with the attestation ID and root.
     */
    function rootTimestamp(bytes32 attestationId, uint256 root) external view returns (uint256);

    /**
     * @notice Returns the identity commitment merkle root for a given attestation ID.
     * @param attestationId The attestation ID to query.
     * @return The identity commitment merkle root associated with the attestation ID.
     */
    function getIdentityCommitmentMerkleRoot(bytes32 attestationId) external view returns (uint256);

    /**
     * @notice Checks if a verification config exists
     * @param configId The configuration identifier
     * @return exists Whether the config exists
     */
    function verificationConfigV2Exists(bytes32 configId) external view returns (bool exists);

    // ====================================================
    // Public Functions
    // ====================================================

    /**
     * @notice Generates a config ID from a verification config
     * @param config The verification configuration
     * @return The generated config ID (sha256 hash of encoded config)
     */
    function generateConfigId(SelfStructs.VerificationConfigV2 memory config) external pure returns (bytes32);
}


// File @selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol@v1.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title ISelfVerificationRoot
 * @notice Interface for self-verification infrastructure integration
 * @dev Provides base functionality for verifying and disclosing identity credentials
 */
interface ISelfVerificationRoot {
    /**
     * @notice Structure containing proof data for disclose circuits
     * @dev Contains the proof elements required for zero-knowledge verification
     * @param a First proof element
     * @param b Second proof element (2x2 matrix)
     * @param c Third proof element
     * @param pubSignals Array of 21 public signals for the circuit
     */
    struct DiscloseCircuitProof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
        uint256[21] pubSignals;
    }

    /**
     * @notice Structure containing verified identity disclosure output data
     * @dev Contains all disclosed identity information after successful verification
     * @param attestationId Unique identifier for the identity documents
     * @param userIdentifier Unique identifier for the user
     * @param nullifier Unique nullifier to prevent double-spending
     * @param forbiddenCountriesListPacked Packed representation of forbidden countries list
     * @param issuingState The state/country that issued the identity document
     * @param name Array of name components
     * @param idNumber The identity document number
     * @param nationality The nationality of the document holder
     * @param dateOfBirth Date of birth in string format
     * @param gender Gender of the document holder
     * @param expiryDate Expiry date of the identity document
     * @param olderThan Verified age threshold (e.g., 18 for adult verification)
     * @param ofac Array of OFAC (Office of Foreign Assets Control) compliance flags
     */
    struct GenericDiscloseOutputV2 {
        bytes32 attestationId;
        uint256 userIdentifier;
        uint256 nullifier;
        uint256[4] forbiddenCountriesListPacked;
        string issuingState;
        string[] name;
        string idNumber;
        string nationality;
        string dateOfBirth;
        string gender;
        string expiryDate;
        uint256 olderThan;
        bool[3] ofac;
    }

    /**
     * @notice Verifies a self-proof using the bytes-based interface
     * @dev Parses relayer data format and validates against contract settings before calling hub V2
     * @param proofPayload Packed data from relayer in format: | 32 bytes attestationId | proof data |
     * @param userContextData User-defined data in format: | 32 bytes configId | 32 bytes destChainId | 32 bytes userIdentifier | data |
     */
    function verifySelfProof(bytes calldata proofPayload, bytes calldata userContextData) external;

    /**
     * @notice Callback function called upon successful verification
     * @dev Only the identity verification hub V2 contract should call this function
     * @param output The verification output data containing disclosed identity information
     * @param userData The user-defined data passed through the verification process
     */
    function onVerificationSuccess(bytes memory output, bytes memory userData) external;
}


// File @selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol@v1.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.28;




/**
 * @title SelfVerificationRoot
 * @notice Abstract base contract to be integrated with self's verification infrastructure
 * @dev Provides base functionality for verifying and disclosing identity credentials
 * @author Self Team
 */
abstract contract SelfVerificationRoot is ISelfVerificationRoot {
    // ====================================================
    // Constants
    // ====================================================

    /// @notice Contract version identifier used in verification process
    /// @dev This version is included in the hub data for protocol compatibility
    uint8 constant CONTRACT_VERSION = 2;

    // ====================================================
    // Storage Variables
    // ====================================================

    /// @notice The scope value that proofs must match
    /// @dev Used to validate that submitted proofs match the expected scope
    uint256 internal _scope;

    /// @notice Reference to the identity verification hub V2 contract
    /// @dev Immutable reference used for bytes-based proof verification
    IIdentityVerificationHubV2 internal immutable _identityVerificationHubV2;

    // ====================================================
    // Errors
    // ====================================================

    /// @notice Error thrown when the data format is invalid
    /// @dev Triggered when the provided bytes data doesn't have the expected format
    error InvalidDataFormat();

    /// @notice Error thrown when onVerificationSuccess is called by an unauthorized address
    /// @dev Only the identity verification hub V2 contract can call onVerificationSuccess
    error UnauthorizedCaller();

    // ====================================================
    // Events
    // ====================================================

    /// @notice Emitted when the scope is updated
    /// @param newScope The new scope value that was set
    event ScopeUpdated(uint256 indexed newScope);

    /**
     * @notice Initializes the SelfVerificationRoot contract
     * @dev Sets up the immutable reference to the hub contract and initial scope
     * @param identityVerificationHubV2Address The address of the Identity Verification Hub V2
     * @param scopeValue The expected proof scope for user registration
     */
    constructor(address identityVerificationHubV2Address, uint256 scopeValue) {
        _identityVerificationHubV2 = IIdentityVerificationHubV2(identityVerificationHubV2Address);
        _scope = scopeValue;
    }

    /**
     * @notice Returns the current scope value
     * @dev Public view function to access the current scope setting
     * @return The scope value that proofs must match
     */
    function scope() public view returns (uint256) {
        return _scope;
    }

    /**
     * @notice Updates the scope value
     * @dev Protected internal function to change the expected scope for proofs
     * @param newScope The new scope value to set
     */
    function _setScope(uint256 newScope) internal {
        _scope = newScope;
        emit ScopeUpdated(newScope);
    }

    /**
     * @notice Verifies a self-proof using the bytes-based interface
     * @dev Parses relayer data format and validates against contract settings before calling hub V2
     * @param proofPayload Packed data from relayer in format: | 32 bytes attestationId | proof data |
     * @param userContextData User-defined data in format: | 32 bytes destChainId | 32 bytes userIdentifier | data |
     * @custom:data-format proofPayload = | 32 bytes attestationId | proofData |
     * @custom:data-format userContextData = | 32 bytes destChainId | 32 bytes userIdentifier | data |
     * @custom:data-format hubData = | 1 bytes contract version | 31 bytes buffer | 32 bytes scope | 32 bytes attestationId | proofData |
     */
    function verifySelfProof(bytes calldata proofPayload, bytes calldata userContextData) public {
        // Minimum expected length for proofData: 32 bytes attestationId + proof data
        if (proofPayload.length < 32) {
            revert InvalidDataFormat();
        }

        // Minimum userDefinedData length: 32 (destChainId) + 32 (userIdentifier) + 0 (userDefinedData) = 64 bytes
        if (userContextData.length < 64) {
            revert InvalidDataFormat();
        }

        bytes32 attestationId;
        assembly {
            // Load attestationId from the beginning of proofData (first 32 bytes)
            attestationId := calldataload(proofPayload.offset)
        }

        bytes32 destinationChainId = bytes32(userContextData[0:32]);
        bytes32 userIdentifier = bytes32(userContextData[32:64]);
        bytes memory userDefinedData = userContextData[64:];

        bytes32 configId = getConfigId(destinationChainId, userIdentifier, userDefinedData);

        // Hub data should be | 1 byte contractVersion | 31 bytes buffer | 32 bytes scope | 32 bytes attestationId | proof data
        bytes memory baseVerificationInput = abi.encodePacked(
            // 1 byte contractVersion
            CONTRACT_VERSION,
            // 31 bytes buffer (all zeros)
            bytes31(0),
            // 32 bytes scope
            _scope,
            // 32 bytes attestationId
            attestationId,
            // proof data (starts after 32 bytes attestationId)
            proofPayload[32:]
        );

        // Call hub V2 verification
        _identityVerificationHubV2.verify(baseVerificationInput, bytes.concat(configId, userContextData));
    }

    /**
     * @notice Callback function called upon successful verification by the hub contract
     * @dev Only callable by the identity verification hub V2 contract for security
     * @param output The verification output data containing disclosed identity information
     * @param userData The user-defined data passed through the verification process
     * @custom:security Only the authorized hub contract can call this function
     * @custom:flow This function decodes the output and calls the customizable verification hook
     */
    function onVerificationSuccess(bytes memory output, bytes memory userData) public {
        // Only allow the identity verification hub V2 to call this function
        if (msg.sender != address(_identityVerificationHubV2)) {
            revert UnauthorizedCaller();
        }

        ISelfVerificationRoot.GenericDiscloseOutputV2 memory genericDiscloseOutput = abi.decode(
            output,
            (ISelfVerificationRoot.GenericDiscloseOutputV2)
        );

        // Call the customizable verification hook
        customVerificationHook(genericDiscloseOutput, userData);
    }

    /**
     * @notice Generates a configId for the user
     * @dev This function should be overridden by the implementing contract to provide custom configId logic
     * @param destinationChainId The destination chain ID
     * @param userIdentifier The user identifier
     * @param userDefinedData The user defined data
     * @return The configId
     */
    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier,
        bytes memory userDefinedData
    ) public view virtual returns (bytes32) {
        // Default implementation reverts; must be overridden in derived contract
        revert("SelfVerificationRoot: getConfigId must be overridden");
    }

    /**
     * @notice Custom verification hook that can be overridden by implementing contracts
     * @dev This function is called after successful verification and hub address validation
     * @param output The verification output data from the hub containing disclosed identity information
     * @param userData The user-defined data passed through the verification process
     * @custom:override Override this function in derived contracts to add custom verification logic
     * @custom:security This function is only called after proper authentication by the hub contract
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal virtual {
        // Default implementation is empty - override in derived contracts to add custom logic
    }
}


// File contracts/interfaces/IVerifier.sol

// Original license: SPDX_License_Identifier: MIT

pragma solidity 0.8.28;

interface IVerifier {
    function isVerified(address user) external view returns(bool);
}


// File contracts/peripherals/Verifier.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.28;
contract Verifier is IVerifier, SelfVerificationRoot, Ownable {
    using SafeERC20 for IERC20;

    enum Type { UNCLAIM, CLAIMED }

    // Errors
    error NativeClaimUnsuccessful();

    // Events
    event UserIdentifierVerified(address indexed registeredUserIdentifier);

    /// @notice Verification config ID for identity verification
    bytes32 public configId;

    ///@notice When this flag is turned off, user will need no verification to claim reward
    bool public isWalletVerificationRequired; // default is true in the constructor, meaning user must verify before claiming

    /// @dev User's registered claim. We use this to prevent users from trying to verify twice
    mapping(address => bool) internal verification;

    modifier whenWalletRequired() {
        require(isWalletVerificationRequired, "Wallet verification required");
        _;
    }

    /**
     * @dev Constructor
     * @param identityVerificationHubAddress : Hub verification address
     * @notice We set the scope to zero value hoping to set the real value immediately after deployment. This saves 
     * us the headache of generating the contract address ahead of time 
     */
    constructor(address identityVerificationHubAddress)
        Ownable(_msgSender())
        SelfVerificationRoot(identityVerificationHubAddress, 0)
    {
        isWalletVerificationRequired = true; 
    }

    // receive() external payable {}

    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier, 
        bytes memory userDefinedData // Custom data from the qr code configuration
    ) public view override returns (bytes32 _return) {
        // Return your app's configuration ID
        _return = configId;
    }

    // Set verification config ID
    function setConfigId(bytes32 _configId) external onlyOwner {
        configId = _configId;
    }

    /**
     * @notice Updates the scope used for verification.
     * @dev Only callable by the contract owner.
     * @param newScope The new scope to set.
     */
    function setScope(uint256 newScope) external onlyOwner {
        _setScope(newScope);
    }
    
    /**
     * @dev Verify and register users for unclaim rewards. 
     * @param user : User account
     * @notice This is expected to be the data parse as userData to the verification hook. To prevent attack,
     * user cannot make eligibity check twice in the same week. 
     * Note: User cannot verify eligibility for a week twice.
    */
    function _setVerification(address user) internal {
        require(user != address(0), "Zero address");
        require(!verification[user], "Already verified");
        verification[user] = true;
    }

    /**
     * @dev Registers user for the claim. 
     * @notice This is expected to be the data parse as userData to the verification hook. To prevent attack,
     * user cannot make eligibity check twice in the same week.
     * @notice Should be called by anyone provided they subscribed to the campaign already
     */
    function setVerification() external whenWalletRequired returns(bool) {
        _setVerification(_msgSender());
        return true;
    }
 
    /**
     * @dev Manually registers user for the claim. 
     * @notice This is expected to be the data parse as userData to the verification hook. To prevent attack,
     * user cannot make eligibity check twice in the same week.
     * @notice Should be called only by the approved account provided the parsed user had subscribed to the campaign already.
     * Must not be using Self verification.
     */
    function setVerification(address user) external whenWalletRequired onlyOwner returns(bool) {
        _setVerification(user);
        return true;
    }
 
    /**
     * @notice Hook called after successful verification - handles user registration
     * @dev Validates registration conditions and registers the user for both E-Passport and EUID attestations
     * @param output The verification output containing user data
    */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory /** unused-param */ 
    ) internal override {
        address user = address(uint160(output.userIdentifier));
        require(output.userIdentifier > 0, "InvalidUserIdentifier");
        require(output.olderThan >= 16, "You should be at least 16 yrs");
        bool[3] memory ofacs = output.ofac;
        for(uint8 i = 0; i < ofacs.length; i++) {
            require(ofacs[i], "Sanction individual");
        }
 
        _setVerification(user);

        emit UserIdentifierVerified(user);
    }

    /**
     * @dev Update the isWalletVerificationRequired = true; flag
     */
    function toggleUseWalletVerification() public onlyOwner {
       isWalletVerificationRequired = !isWalletVerificationRequired;
    }

    /**@dev Get user status
        @param user: Target user
     */
    function isVerified(address user) external view returns(bool) {
        return verification[user];
    }

}
