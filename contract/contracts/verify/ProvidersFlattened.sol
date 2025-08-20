// // Sources flattened with hardhat v2.22.17 https://hardhat.org

// // SPDX-License-Identifier: MIT

// // File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.0.2

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

// // pragma solidity ^0.8.20;

// // /**
// //  * @dev Interface of the ERC20 standard as defined in the EIP.
// //  */
// // interface IERC20 {
// //     /**
// //      * @dev Emitted when `value` tokens are moved from one account (`from`) to
// //      * another (`to`).
// //      *
// //      * Note that `value` may be zero.
// //      */
// //     event Transfer(address indexed from, address indexed to, uint256 value);

// //     /**
// //      * @dev Emitted when the allowance of a `spender` for an `owner` is set by
// //      * a call to {approve}. `value` is the new allowance.
// //      */
// //     event Approval(address indexed owner, address indexed spender, uint256 value);

// //     /**
// //      * @dev Returns the value of tokens in existence.
// //      */
// //     function totalSupply() external view returns (uint256);

// //     /**
// //      * @dev Returns the value of tokens owned by `account`.
// //      */
// //     function balanceOf(address account) external view returns (uint256);

// //     /**
// //      * @dev Moves a `value` amount of tokens from the caller's account to `to`.
// //      *
// //      * Returns a boolean value indicating whether the operation succeeded.
// //      *
// //      * Emits a {Transfer} event.
// //      */
// //     function transfer(address to, uint256 value) external returns (bool);

// //     /**
// //      * @dev Returns the remaining number of tokens that `spender` will be
// //      * allowed to spend on behalf of `owner` through {transferFrom}. This is
// //      * zero by default.
// //      *
// //      * This value changes when {approve} or {transferFrom} are called.
// //      */
// //     function allowance(address owner, address spender) external view returns (uint256);

// //     /**
// //      * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
// //      * caller's tokens.
// //      *
// //      * Returns a boolean value indicating whether the operation succeeded.
// //      *
// //      * IMPORTANT: Beware that changing an allowance with this method brings the risk
// //      * that someone may use both the old and the new allowance by unfortunate
// //      * transaction ordering. One possible solution to mitigate this race
// //      * condition is to first reduce the spender's allowance to 0 and set the
// //      * desired value afterwards:
// //      * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
// //      *
// //      * Emits an {Approval} event.
// //      */
// //     function approve(address spender, uint256 value) external returns (bool);

// //     /**
// //      * @dev Moves a `value` amount of tokens from `from` to `to` using the
// //      * allowance mechanism. `value` is then deducted from the caller's
// //      * allowance.
// //      *
// //      * Returns a boolean value indicating whether the operation succeeded.
// //      *
// //      * Emits a {Transfer} event.
// //      */
// //     function transferFrom(address from, address to, uint256 value) external returns (bool);
// // }


// // File @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol@v5.0.2

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/IERC20Metadata.sol)

// pragma solidity ^0.8.20;

// /**
//  * @dev Interface for the optional metadata functions from the ERC20 standard.
//  */
// interface IERC20Metadata{
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


// // File contracts/interfaces/IERC20Metadata.sol

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)

// // pragma solidity 0.8.28;

// // /**
// //  * @dev Interface for the optional metadata functions from the ERC20 standard.
// //  *
// //  * _Available since v4.1._
// //  */
// // interface IERC20Metadata {
// //     /**
// //      * @dev Returns the name of the token.
// //      */
// //     function name() external view returns (string memory);

// //     /**
// //      * @dev Returns the symbol of the token.
// //      */
// //     function symbol() external view returns (string memory);

// //     /**
// //      * @dev Returns the decimals places of the token.
// //      */
// //     function decimals() external view returns (uint8);
// // }


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


// // File contracts/interfaces/Common.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// interface Common {
//     event PoolCreated(Pool);
//     event NewContributorAdded(Pool);
//     event GetFinanced(Pool);
//     event Payback(Pool);
//     event Liquidated(Pool);
//     event Cancellation(uint unit);
//     event PoolEdited(Pool);

//     enum Stage {
//         JOIN, 
//         GET, 
//         PAYBACK, 
//         CANCELED,
//         ENDED
//     }

//     // enum Network { HARDHAT, CELO, CROSSFI }

//     enum Phase { ALPHA, MAINNET }

//     enum Status { AVAILABLE, TAKEN }

//     enum Branch { CURRENT, RECORD }

//     enum Router { NONE, PERMISSIONLESS, PERMISSIONED }

//     struct Pool {
//         Low low;
//         Big big;
//         Addresses addrs;
//         Router router;
//         Stage stage;
//         Status status;
//     }

//     struct Low {
//         uint8 maxQuorum;
//         uint8 selector;
//         uint24 colCoverage;
//         uint32 duration;
//         uint8 allGh;
//         uint8 userCount;
//     }

//     struct Big {
//         uint256 unit;
//         uint256 currentPool;
//         uint96 recordId;
//         uint96 unitId;
//         // uint collateralQuote;
//     }

//     struct Point {
//         uint contributor;
//         uint creator;
//         uint referrals;
//         address user;
//         Phase phase;
//     }

//     struct PointsReturnValue {
//         string key;
//         Point[] value;
//     }

//     struct Interest {
//         uint fullInterest;
//         uint intPerSec;
//     }

//     /**
//      * @notice Structured types - Address
//      * @param asset : Contract address of the asset in use.
//      * @param lastPaid: Last contributor who got finance.
//      * @param safe : Strategy for each pool or epoch. See Strategy.sol for more details.
//      * @param admin : Pool creator.
//      * 
//     */
//     struct Addresses {
//         IERC20 colAsset;
//         address lastPaid;
//         address safe;
//         address admin;
//     }

//     /**
//      *  @param isMember : Whether user is a member or not
//      *  @param turnStartTime: Time when the contributor's turn start to count.
//      *  @param getFinanceTime: Date when loan was disbursed
//      *  @param paybackTime: Date which the borrowed fund must be retured
//      *  @param loan: Total debts owed by the last fund recipient.
//      *  @param colBals: Collateral balances of the last recipient.
//      *  @param sentQuota : Whether an user/current msg.sender has received or not.
//      *  @param id : Address of the last recipient.
//      * @param interestPaid : The amount of interest paid  
//     */
//     struct Contributor {
//         uint32 paybackTime;
//         uint32 turnStartTime;
//         uint32 getFinanceTime;
//         uint loan;
//         uint colBals;
//         address id;
//         bool sentQuota;
//     }

//     struct Price {
//         uint price;
//         uint8 decimals;
//     }

//     struct Provider {
//         uint slot;
//         uint amount;
//         uint rate;
//         uint earnStartDate;
//         address account;
//         Interest accruals;
//     }

//     struct Payback_Safe {
//         address user; 
//         IERC20 baseAsset; 
//         uint256 debt;
//         uint256 attestedInitialBal;
//         bool allGF; 
//         Contributor[] cData;
//         bool isSwapped;
//         address defaulted;
//         uint96 recordId;
//         IERC20 collateralAsset;
//         bool isColWrappedAsset;
//         Common.Provider[] providers; 
//     }

//     struct Slot {
//         uint value;
//         bool isMember;
//         bool isAdmin;
//     }

//     struct ReadPoolDataReturnValue {
//         Pool pool;
//         ContributorReturnValue[] cData;
//     }

//     // struct ReadRecordDataReturnValue {
//     //     Pool pool;
//     //     Contributor[] cData;
//     // }

//     struct UpdatePoolData {
//         uint unit;
//         uint96 unitId;
//         uint96 recordId;
//         uint8 maxQuorum;
//         uint24 colCoverage;
//         IERC20 colAsset;
//         uint16 durationInHours;
//         address creator;
//         Router router; 
//     }

//     struct Analytics {
//         uint256 tvlCollateral;
//         uint256 tvlBase;
//         uint totalPermissioned;
//         uint totalPermissionless;
//     }

//     struct ViewFactoryData {
//         // Analytics analytics;
//         uint16 makerRate;
//         ReadPoolDataReturnValue[] currentPools;
//         ReadPoolDataReturnValue[] pastPools;
//         uint currentEpoches;
//         uint recordEpoches;
//     }

//     struct ContributorReturnValue {
//         Contributor profile;
//         Slot slot;
//         Common.Provider[] providers;
//     }

//     struct CreatePoolParam {
//         address[] users;
//         address sender;
//         uint unit;
//         uint8 maxQuorum;
//         uint16 durationInHours;
//         uint24 colCoverage;
//         Common.Router router;
//         address colAsset;
//     }

// }


// // File contracts/interfaces/IPoint.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// /**
//  * @title Simplifi
//  * @author : Bobeu - https://github.com/bobeu
//  * @notice : Interface of the Point contract for managing user's rewards and points.
//  */
// interface IPoint {
//   struct Initializer {
//     bool isRegistered;
//     uint location; 
//   }

//   function getPoint(address user, uint8 phase) external view returns(Common.Point memory);
//   function setPoint(
//     address user, 
//     uint8 contributor,
//     uint8 creator,
//     uint8 referrals
//   ) external returns(bool);
//   function deductPoint(
//     address user, 
//     uint8 contributor,
//     uint8 creator,
//     uint8 referrals
//   ) external returns(bool);
// }


// // File contracts/interfaces/ISafeFactory.sol

// // Original license: SPDX_License_Identifier: MIT
// pragma solidity 0.8.28;

// /**
//  * @title Interface of the Safe manager
//  * @author : Simplifinance (Written by Bobeu)
//  */
// interface ISafeFactory {  
// /**
//  * Clones and return a new safe 
//  * @param unit : Target address for whom to create safe
//  */
//   function pingSafe(uint256 unit) external returns(address safe);

//   /**
//    * Safe struct map
//    * key: user address { EOA }
//    * value: Safe { Contract } 
//    */
//   struct SafeData {
//     address key;
//     address value;
//   }

// }


// // File contracts/interfaces/ISupportedAsset.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// interface ISupportedAsset {
//   struct SupportedAsset {
//     address id;
//     string name;
//     string symbol;
//     bool isWrappedAsset;
//   }
//   function isSupportedAsset(address _asset) external view returns(bool);
//   function getDefaultSupportedCollateralAsset(uint index) external view returns(address);
//   function isWrappedAsset(address assetAddr) external view returns(bool);
// }


// // File contracts/interfaces/IFactory.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// interface IFactory is Common {
//   struct StateVariables {
//     address feeTo;
//     uint16 makerRate;
//     ISafeFactory safeFactory;
//     ISupportedAsset assetManager; 
//     IERC20 baseAsset;
//     IPoint pointFactory;
//   }
//   struct ConstructorArgs {
//     address feeTo;
//     uint16 makerRate;
//     address safeFactory;
//     address assetManager; 
//     address baseAsset;
//     address pointFactory;
//     address roleManager;
//   }

//   function contributeThroughProvider(Provider[] memory providers, address borrower, uint unit) external returns(bool);
//   function getPool(uint unit) external view returns(Common.Pool memory);
// }


// // File contracts/interfaces/IProviders.sol

// // Original license: SPDX_License_Identifier: MIT
// pragma solidity 0.8.28;
// /**
//  * @title Interface of the Providers contract
//  * @author : Simplifinance (Written by Bobeu)
//  */
// interface IProviders {  
// /**
//  * Refund providers when an admin closes a pool 
//  * @param providers : Target address for whom to create safe
//  */
//   function refund(Common.Provider[] memory providers) external returns(bool);
// }


// // File contracts/interfaces/IVerifier.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;

// interface IVerifier {
//     function isVerified(address user) external view returns(bool);
// }


// // File contracts/interfaces/IStateManager.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// interface IStateManager {
//     struct StateVariables {
//         address feeTo;
//         uint16 makerRate;
//         ISupportedAsset assetManager; 
//         IERC20 baseAsset;
//         IPoint pointFactory;
//         IVerifier verifier;
//     }
//     function getStateVariables() external view returns(StateVariables memory);
// }


// // File @openzeppelin/contracts/utils/Address.sol@v5.0.2

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts (last updated v5.0.0) (utils/Address.sol)

// pragma solidity ^0.8.20;

// /**
//  * @dev Collection of functions related to the address type
//  */
// library Address {
//     /**
//      * @dev The ETH balance of the account is not enough to perform the operation.
//      */
//     error AddressInsufficientBalance(address account);

//     /**
//      * @dev There's no code at `target` (it is not a contract).
//      */
//     error AddressEmptyCode(address target);

//     /**
//      * @dev A call to an address target failed. The target may have reverted.
//      */
//     error FailedInnerCall();

//     /**
//      * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
//      * `recipient`, forwarding all available gas and reverting on errors.
//      *
//      * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
//      * of certain opcodes, possibly making contracts go over the 2300 gas limit
//      * imposed by `transfer`, making them unable to receive funds via
//      * `transfer`. {sendValue} removes this limitation.
//      *
//      * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
//      *
//      * IMPORTANT: because control is transferred to `recipient`, care must be
//      * taken to not create reentrancy vulnerabilities. Consider using
//      * {ReentrancyGuard} or the
//      * https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
//      */
//     function sendValue(address payable recipient, uint256 amount) internal {
//         if (address(this).balance < amount) {
//             revert AddressInsufficientBalance(address(this));
//         }

//         (bool success, ) = recipient.call{value: amount}("");
//         if (!success) {
//             revert FailedInnerCall();
//         }
//     }

//     /**
//      * @dev Performs a Solidity function call using a low level `call`. A
//      * plain `call` is an unsafe replacement for a function call: use this
//      * function instead.
//      *
//      * If `target` reverts with a revert reason or custom error, it is bubbled
//      * up by this function (like regular Solidity function calls). However, if
//      * the call reverted with no returned reason, this function reverts with a
//      * {FailedInnerCall} error.
//      *
//      * Returns the raw returned data. To convert to the expected return value,
//      * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
//      *
//      * Requirements:
//      *
//      * - `target` must be a contract.
//      * - calling `target` with `data` must not revert.
//      */
//     function functionCall(address target, bytes memory data) internal returns (bytes memory) {
//         return functionCallWithValue(target, data, 0);
//     }

//     /**
//      * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
//      * but also transferring `value` wei to `target`.
//      *
//      * Requirements:
//      *
//      * - the calling contract must have an ETH balance of at least `value`.
//      * - the called Solidity function must be `payable`.
//      */
//     function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
//         if (address(this).balance < value) {
//             revert AddressInsufficientBalance(address(this));
//         }
//         (bool success, bytes memory returndata) = target.call{value: value}(data);
//         return verifyCallResultFromTarget(target, success, returndata);
//     }

//     /**
//      * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
//      * but performing a static call.
//      */
//     function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
//         (bool success, bytes memory returndata) = target.staticcall(data);
//         return verifyCallResultFromTarget(target, success, returndata);
//     }

//     /**
//      * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
//      * but performing a delegate call.
//      */
//     function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
//         (bool success, bytes memory returndata) = target.delegatecall(data);
//         return verifyCallResultFromTarget(target, success, returndata);
//     }

//     /**
//      * @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
//      * was not a contract or bubbling up the revert reason (falling back to {FailedInnerCall}) in case of an
//      * unsuccessful call.
//      */
//     function verifyCallResultFromTarget(
//         address target,
//         bool success,
//         bytes memory returndata
//     ) internal view returns (bytes memory) {
//         if (!success) {
//             _revert(returndata);
//         } else {
//             // only check if target is a contract if the call was successful and the return data is empty
//             // otherwise we already know that it was a contract
//             if (returndata.length == 0 && target.code.length == 0) {
//                 revert AddressEmptyCode(target);
//             }
//             return returndata;
//         }
//     }

//     /**
//      * @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
//      * revert reason or with a default {FailedInnerCall} error.
//      */
//     function verifyCallResult(bool success, bytes memory returndata) internal pure returns (bytes memory) {
//         if (!success) {
//             _revert(returndata);
//         } else {
//             return returndata;
//         }
//     }

//     /**
//      * @dev Reverts with returndata if present. Otherwise reverts with {FailedInnerCall}.
//      */
//     function _revert(bytes memory returndata) private pure {
//         // Look for revert reason and bubble it up if present
//         if (returndata.length > 0) {
//             // The easiest way to bubble the revert reason is using memory via assembly
//             /// @solidity memory-safe-assembly
//             assembly {
//                 let returndata_size := mload(returndata)
//                 revert(add(32, returndata), returndata_size)
//             }
//         } else {
//             revert FailedInnerCall();
//         }
//     }
// }


// // File contracts/libraries/ErrorLib.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;

// library ErrorLib {
//     error ErrorOccurred(string errorMsg);

//     /**
//      * @dev Reverts any operation.
//      * @param _error : Error struct
//      */
//     function _throw(string memory _error) internal pure {
//         if(bytes(_error).length > 0){ 
//             revert ErrorOccurred(_error);
//         }
//     }

// }


// // File contracts/libraries/Utils.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// library Utils {
//     using Address for address;
//     using ErrorLib for *;

//     /**     @dev Calculation of percentage.
//         *   This is how we calculate percentage to arrive at expected value with 
//         *   precision.
//         *   We choose a base value (numerator as 10000) repesenting a 100% of the principal value. This means if Alice wish to set 
//         *   her interest rate to 0.05% for instance, she only need to multiply it by 100 i.e 0.05 * 100 = 5. Her input will be 5. 
//         *   Since Solidity do not accept decimals as input, in our context, the minimum value to parse is '0' indicating 
//         *   zero interest rate. If user wish to set interest at least, the minimum value will be 1 reprensenting 0.01%.
//         *   The minimum interest rate to set is 0.01% if interest must be set at least.
//         *   @notice To reiterate, raw interest must be multiplied by 100 before giving as input. 
//         *   @param principal : The principal value on which the interest is based. Value should be in decimals.
//         *   @param interest : Interest rate. 
//         *   
//         *   Rules
//         *   -----
//         *   - Principal cannot be less than base.
//         *   - Interest cannot be greater than (2 ^ 16) - 1
//     */
//     function _getPercentage(
//         uint principal, 
//         uint16 interest
//     )
//         internal 
//         pure 
//         returns (uint _return) 
//     {
//         uint16 base = _getBase(); 
//         if(interest == 0 || principal == 0) return 0;
//         if(interest >= type(uint16).max) 'Interest overflow'._throw(); 
//         if(principal <= base) 'Principal should be greater than 10000'._throw();
//         unchecked {
//             _return = (principal * interest) / base;
//         }
//     }

//     /**
//      * Percentage base
//      */
//     function _getBase() internal pure returns(uint16 base) {
//         base = 10000;
//     }
    
//     function _decimals(address asset) internal view returns(uint8 decimals) {
//         decimals = IERC20Metadata(asset).decimals();
//     }

//     /**
//      * @dev Computes collateral on the requested loan amount
//      * @param ccr : Collateral ratio. Must be multiply by 100 before parsing as input i.e if raw ccr
//      *              is 1.2, it should be rendered as 1.2 * 100 = 120.
//      * @param price : Price of Collateral token base with decimals.
//      * @param loanReqInDecimals : Total requested contribution in USD
//      * @notice Based on Simplifi mvp, loans are collaterized in XFI until we add more pairs
//      *         in the future.
//      * Example: Alice, Bob and Joe formed a band to contribute $100 each where duration is for 
//      * 10 days each. Alice being the admin set ccr to 1.5 equivalent to 150% of the total sum 
//      * contribution of $300. If the price of XFI as at the time of GF is $0.5/XFI, where XFI decimals
//      * is in 18, we calculate the required XFI to stake as follows:   
//      *  
//      *                    totalContribution *  (10** XFIdecimals)   |                 raw ccr
//      *   totalLoanInXFI = --------------------------------------    |    actualCCR = (1.5 * 100) * 100 = 1500
//      *                        (xfiPriceIndecimals)                  |
//      * 
//      *                     totalLoanInXFI * actualCCR
//      *        XFINeeded = ----------------------------
//      *                             _getBase()
//      * 
//      *  Therefore, Alice is required to stake 900XFI to GF $300 for 10 days.
//      *   
//      */
//     function computeCollateral(
//         Common.Price memory price,
//         uint24 ccr,
//         uint loanReqInDecimals
//     ) 
//         internal
//         pure 
//         returns(uint256 expCol) 
//     {
//         uint8 minCCR = 100;
//         if(price.price == 0) 'Price is zero'._throw();
//         if(loanReqInDecimals == 0) 'Loan amount is zero'._throw();
//         if(ccr == 0) {
//             expCol = loanReqInDecimals;
//         } else {
//             if(ccr < minCCR) 'Coverage should either be 0 or above 100'._throw();
//             unchecked {
//                 uint48 _ccr = uint48(ccr * 100);
//                 uint totalLoan = (loanReqInDecimals * (10**price.decimals)) / price.price;
//                 expCol = (totalLoan * _ccr) / _getBase();
//             }
//         }
//     }

//     /**
//         @dev Computes maker fee.
//         @param makerRate : The amount of fee (in %) charged by the platform on the principal given to a borrower.
//             Note : Raw rate must multiply by 100 to get the expected value i.e
//             if maker rate is 0.1%, it should be parsed as 0.1 * 100 = 10.
//             See `_getPercentage()`.
//         @param amount should be in decimals.
//     */
//     function computeFee(
//         uint amount, 
//         uint16 makerRate
//     ) 
//         internal 
//         pure 
//         returns (uint mFee) 
//     {
//         mFee = _getPercentage(amount, makerRate);
//     }

//     /**
//      * @dev Compute interest based on specified rate.
//      * @param rate : Interest rate.
//      * @param principal : Total expected contribution.
//      * @param fullDurationInSec : Total duration.
//      * 
//      * Rules
//      * -----
//      * - Duration cannot exceed 30days i.e 2592000 seconds uint24 seconds
//      */
//     function computeInterestsBasedOnDuration(
//         uint principal,
//         uint16 rate,
//         uint32 fullDurationInSec
//     )
//         internal 
//         pure 
//         returns(Common.Interest memory it) 
//     {
//         assert(fullDurationInSec <= _maxDurationInSec());
//         it.fullInterest = _getPercentage(principal, rate); // Full interest for fullDurationInSec
//         if(it.fullInterest > 0) {
//             unchecked {
//                 it.intPerSec = (it.fullInterest * 1) / fullDurationInSec;
//             } 
//         }
//     }

//     /**
//      * @dev Max duration : 30Days, presented in seconds
//      */
//     function _maxDurationInSec() internal pure returns(uint24 max) {
//         max = 2592000;
//     }

//     function _now() internal view returns(uint64 date) {
//         date = uint64(block.timestamp);
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


// // File contracts/peripherals/ERC20Manager.sol

// // Original license: SPDX_License_Identifier: MIT
// pragma solidity 0.8.28;
// /**
//  * ERROR CODE
//  * =========
//  * E2 - Not supported
//  * E3 - Value exceed allowance
//  * E4 - Asset transfer failed
//  * E5 - Approval failed
//  * E1 - State manager address is zero
//  */
// abstract contract ERC20Manager is Pausable {
//     // Storage contract
//     IStateManager private stateManager;

//     modifier onlySupportedAsset(address asset) {
//         IStateManager.StateVariables memory state = _getVariables();
//         if(asset != address(state.baseAsset)){
//             require(state.assetManager.isSupportedAsset(asset), 'E2');
//         }
//         _;
//     }

//     // ============= Constructor ================

//     constructor(address _stateManager, address _roleManager) Pausable(_roleManager) {
//         require(_stateManager != address(0), 'E1');
//         stateManager = IStateManager(_stateManager);
//     }

//     /**
//      * @dev Validate allowance given by user against actual value
//      * @param asset : ERC20 compatible contract
//      * @param owner : Owner account
//      * @param value : Value to compare allowance to
//      */
//     function _validateAllowance(
//         address asset, 
//         address owner, 
//         uint value
//     ) 
//         onlySupportedAsset(asset)
//         internal 
//         view
//         returns(uint allowance) 
//     {
//         allowance = IERC20(asset).allowance(owner, address(this));
//         require(allowance >= value,  'E3');
//     }

//     /**
//      * @dev Validate allowance given by user against actual value
//      * @param asset : ERC20 compatible contract
//      * @param owner : Owner account
//      * @param beneficiary : Recipient of the allowance
//      * @param value : Value to compare allowance to
//     */
//     function _checkAndWithdrawAllowance(IERC20 asset, address owner, address beneficiary, uint value) internal returns(uint allowance) {
//         address _owner = owner == _msgSender()? owner : _msgSender();
//         allowance = _validateAllowance(address(asset), _owner, value);
//         require(asset.transferFrom(_owner, beneficiary, allowance), 'E4');
//     }

//     /**
//      * @dev Approve an account to spend from the contract balance
//      * @param asset : ERC20 compatible contract
//      * @param spender : Recipient of the allowance
//      * @param value : Amount to approve
//     */
//     function _setApprovalFor(IERC20 asset, address spender, uint value) internal {
//         uint prevAllowance = IERC20(asset).allowance(address(this), spender);
//         unchecked {
//             require(IERC20(asset).approve(spender, value + prevAllowance), 'E5');
//         }
//     }

//     // Get all state variables internally from the state manager
//     function _getVariables() internal view returns(IStateManager.StateVariables memory result) {
//         result = stateManager.getStateVariables();
//     }

//     function getStateManager() public view returns(address) {
//         return address(stateManager); 
//     }

// }


// // File contracts/peripherals/MinimumLiquidity.sol

// // Original license: SPDX_License_Identifier: MIT
// pragma solidity 0.8.28;
// abstract contract MinimumLiquidity is ERC20Manager {
//     using ErrorLib for *;

//     // Minimum liquidity a provider can make
//     uint private minimumLiquidity;

//     // ============= Constructor ================
//     constructor(
//         address _statetManager, 
//         address _roleManager, 
//         uint _minmumLiquidity
//     ) ERC20Manager(_statetManager, _roleManager){
//         minimumLiquidity = _minmumLiquidity;
//     }

//     /**
//      * @dev Set minimum liquidity. 
//      * @param _minLiquidity : Minimum liquidity
//      * @notice Only accounts with rolebearer access are allowed
//      */
//     function setMinimumLiquidity(uint _minLiquidity) public onlyRoleBearer {
//         if(_minLiquidity == minimumLiquidity) 'Same param'._throw();
//         minimumLiquidity = _minLiquidity;
//     }

//     function getMinimumLiquidity() public view returns(uint) {
//         return minimumLiquidity;
//     }
// }


// // File @openzeppelin/contracts/utils/ReentrancyGuard.sol@v5.0.2

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts (last updated v5.0.0) (utils/ReentrancyGuard.sol)

// pragma solidity ^0.8.20;

// /**
//  * @dev Contract module that helps prevent reentrant calls to a function.
//  *
//  * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
//  * available, which can be applied to functions to make sure there are no nested
//  * (reentrant) calls to them.
//  *
//  * Note that because there is a single `nonReentrant` guard, functions marked as
//  * `nonReentrant` may not call one another. This can be worked around by making
//  * those functions `private`, and then adding `external` `nonReentrant` entry
//  * points to them.
//  *
//  * TIP: If you would like to learn more about reentrancy and alternative ways
//  * to protect against it, check out our blog post
//  * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
//  */
// abstract contract ReentrancyGuard {
//     // Booleans are more expensive than uint256 or any type that takes up a full
//     // word because each write operation emits an extra SLOAD to first read the
//     // slot's contents, replace the bits taken up by the boolean, and then write
//     // back. This is the compiler's defense against contract upgrades and
//     // pointer aliasing, and it cannot be disabled.

//     // The values being non-zero value makes deployment a bit more expensive,
//     // but in exchange the refund on every call to nonReentrant will be lower in
//     // amount. Since refunds are capped to a percentage of the total
//     // transaction's gas, it is best to keep them low in cases like this one, to
//     // increase the likelihood of the full refund coming into effect.
//     uint256 private constant NOT_ENTERED = 1;
//     uint256 private constant ENTERED = 2;

//     uint256 private _status;

//     /**
//      * @dev Unauthorized reentrant call.
//      */
//     error ReentrancyGuardReentrantCall();

//     constructor() {
//         _status = NOT_ENTERED;
//     }

//     /**
//      * @dev Prevents a contract from calling itself, directly or indirectly.
//      * Calling a `nonReentrant` function from another `nonReentrant`
//      * function is not supported. It is possible to prevent this from happening
//      * by making the `nonReentrant` function external, and making it call a
//      * `private` function that does the actual work.
//      */
//     modifier nonReentrant() {
//         _nonReentrantBefore();
//         _;
//         _nonReentrantAfter();
//     }

//     function _nonReentrantBefore() private {
//         // On the first call to nonReentrant, _status will be NOT_ENTERED
//         if (_status == ENTERED) {
//             revert ReentrancyGuardReentrantCall();
//         }

//         // Any calls to nonReentrant after this point will fail
//         _status = ENTERED;
//     }

//     function _nonReentrantAfter() private {
//         // By storing the original value once again, a refund is triggered (see
//         // https://eips.ethereum.org/EIPS/eip-2200)
//         _status = NOT_ENTERED;
//     }

//     /**
//      * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
//      * `nonReentrant` function in the call stack.
//      */
//     function _reentrancyGuardEntered() internal view returns (bool) {
//         return _status == ENTERED;
//     }
// }


// // File contracts/standalone/Providers.sol

// // Original license: SPDX_License_Identifier: MIT
// pragma solidity 0.8.28;
// /**
//  * @title Providers
//  * @author Simplifi (Bobeu)
//  * @notice Deployable Providers contract is a general liquidity pool purposely for funding Flexpools.
//  * Contributors that cannot afford unit contributions can access providers pool to source for funds. 
//  * Loans accessed in this pool are not withdrawable by the borrower. Since there is a direct relationship
//  * between the Providers contract and the Flexpool's, borrowed funds are moved straight to the Flexpool contract
//  * and registered on behalf of the contributor.
//  * With this contract, you can perform the following actions:
//  * - Provider liquidity.
//  * - Remove liquidity
//  * - Borrow to finance Flexpool
//  * - Get the list of providers
//  */
// contract Providers is MinimumLiquidity, IProviders, ReentrancyGuard {
//     using ErrorLib for *;
//     using Utils for uint;

//     event LiquidityProvided(Common.Provider);
//     event LiquidityRemoved(Common.Provider);
//     event Borrowed(Common.Provider[] providers, address indexed borrower);
//     event Refunded(Common.Provider[]);

//     struct Data { 
//         uint id;
//         bool hasIndex;
//     }

//     // Flexpool factory contract
//     IFactory public flexpoolFactory;

//     // List of providers
//     Common.Provider[] private providers;

//     /**
//      * @dev Mapping of providers to their position in the providers list
//      * @notice Slot '0' is reserved
//      */
//     mapping (address provider => Data) public slots;

//     /**
//      * ============= Constructor ================
//      */
//     constructor(
//         address _stateManager,
//         address _flexpoolFactory,
//         address _roleManager,
//         uint _minimumLiquidity
//     )
//         MinimumLiquidity(_stateManager, _roleManager, _minimumLiquidity) 
//     {
//         if(_flexpoolFactory == address(0)) '_flexpoolFactory is zero'._throw();
//         flexpoolFactory = IFactory(_flexpoolFactory);
//     }

//     /**
//     * @dev Utility for provide liquidity
//     * @notice User must approve this contract with the liquidiy amount prior to this call.
//     * @param rate: Interest rate the provider is willing to charge.      
//     *   We choose a base value (numerator as 10000) repesenting a 100% of input value. This means if Alice wish to set 
//     *   her interest rate to 0.05% for instance, she only need to multiply it by 100 i.e 0.05 * 100 = 5. Her input will be 5. 
//     *   Since Solidity do not accept decimals as input, in our context, the minimum value to parse is '0' indicating 
//     *   zero interest rate. If user wish to set interest at least, the minimum value will be 1 reprensenting 0.01%.
//     *   The minimum interest rate to set is 0.01% if interest must be set at least.
//     *   To reiterate, raw interest must be multiplied by 100 before giving as input. 
//     */
//     function provideLiquidity(uint16 rate) public whenNotPaused returns(bool) {
//         if(rate >= type(uint16).max) "Invalid rate"._throw();
//         address sender = _msgSender();
//         Data memory data = slots[sender];
//         Common.Interest memory interest;
//         uint liquidity = _checkAndWithdrawAllowance(_getVariables().baseAsset, sender, address(this), getMinimumLiquidity());
//         unchecked {
//             if(!data.hasIndex){
//                 data.id = providers.length;
//                 data.hasIndex = true;
//                 slots[sender] = data;
//                 providers.push(Common.Provider(data.id, liquidity, rate, 0, sender, interest));
//             } else {
//                 providers[data.id].amount += liquidity;
//                 providers[data.id].rate = rate;
//             }
//         }

//         emit LiquidityProvided(providers[data.id]);
//         return true;
//     }

//     /**
//      * @dev Remove liquidity.
//      * @notice Liquidity can be removed anytime provided the balance exceeds zero
//      */
//     function removeLiquidity() public whenNotPaused nonReentrant returns(bool) {
//         (Common.Provider memory prov, uint slot, address caller) = _getProvider();
//         if(prov.amount == 0) "Nothing to remove"._throw();
//         providers[slot].amount = 0;
//         _setApprovalFor(_getVariables().baseAsset, caller, prov.amount);

//         emit LiquidityRemoved(prov);
//         return true;
//     }

//     /**
//      * @dev Users can borrow from liquidity providers to finance a Flexpool
//      * @param providersSlots : Selected providers' slots are required 
//      * @param amount : Amount user wish to borrow.
//      */
//     function borrow(uint[] memory providersSlots, uint amount) public whenNotPaused returns(bool) {
//         if(providersSlots.length == 0) 'List is empty'._throw();
//         if(amount == 0) 'Loan amt is 0'._throw();
//         address spender = address(flexpoolFactory);
//         Common.Provider[] memory provs = _aggregateLiquidityFromProviders(providersSlots, amount, flexpoolFactory.getPool(amount)); 
//         _setApprovalFor(_getVariables().baseAsset, spender, amount);
//         if(!flexpoolFactory.contributeThroughProvider(provs, _msgSender(), amount)) 'Factory errored'._throw();

//         emit Borrowed(provs, _msgSender());
//         return true;
//     }

//     /**
//      * @dev Loop through the selected providers balances, and check if there is enough balances
//      * to accommodate the requested loan, otherwise operation fails.
//      * @param providersSlots : Array of selected providers slots
//      * @param amount : Requested loan amount
//      * Return a list of providers that financed the contribution
//      */
//     function _aggregateLiquidityFromProviders(
//         uint[] memory providersSlots, 
//         uint amount,
//         Common.Pool memory pool
//     ) 
//         internal 
//         returns(Common.Provider[] memory result)
//     {
//         uint32 durationInSec = pool.low.duration > 0? pool.low.duration : uint32(72 hours);
//         uint amountLeft = amount;
//         uint providersSize = providersSlots.length;
//         Common.Provider[] memory _providers = new Common.Provider[](providersSize);
//         for(uint i = 0; i < providersSize; i++) {
//             uint slot = providersSlots[i];
//             if(slot >= providers.length) 'Invalid slot detected'._throw();
//             Common.Provider memory prov = providers[slot];
//             unchecked {
//                 if(prov.amount >= amountLeft) {
//                     providers[slot].amount = prov.amount - amountLeft; 
//                     amountLeft = 0;
//                 } else {
//                     amountLeft -= prov.amount; 
//                     providers[slot].amount = 0;
//                 }
//             }

//             uint newBalance = providers[slot].amount;
//             prov.amount -= newBalance; // Record actual amount the provider lends to the borrower
//             prov.accruals = prov.amount.computeInterestsBasedOnDuration(uint16(prov.rate), durationInSec);
//             _providers[i] = prov;
//             if(amountLeft == 0) break;
//         }
//         if(amountLeft > 0) 'Loan exceed aggregate providers bal'._throw();
//         result = _providers;
//     }

//     ///@dev Refund providers
//     function refund(Common.Provider[] memory beneficiaries) external returns(bool){
//         for(uint i = 0; i < beneficiaries.length; i++){
//             uint slot = beneficiaries[i].slot;
//             uint quota = beneficiaries[i].amount;
//             unchecked {
//                 providers[slot].amount += quota;
//             }
//         }
//         emit Refunded(beneficiaries);
//         return true;
//     }

//     // ReadOnly function. Return provider's information. 
//     function _getProvider() 
//         internal 
//         view 
//         returns(Common.Provider memory prov, uint slot, address caller) 
//     {
//         caller = _msgSender();
//         Data memory data = slots[caller];
//         if(!data.hasIndex) 'User is not a provider'._throw();
//         slot = data.id;
//         prov = providers[slot];
//     }

//     // Returns providers in storage.
//     function getProviders() public view returns(Common.Provider[] memory prov) {
//         prov = providers;
//         return prov;
//     }
// }
