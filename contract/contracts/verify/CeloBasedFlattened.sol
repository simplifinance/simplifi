// // Sources flattened with hardhat v2.22.17 https://hardhat.org

// // SPDX-License-Identifier: MIT

// // File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.0.2

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

// pragma solidity ^0.8.20;

// /**
//  * @dev Interface of the ERC20 standard as defined in the EIP.
//  */
// interface IERC20 {
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
//      * @dev Returns the value of tokens in existence.
//      */
//     function totalSupply() external view returns (uint256);

//     /**
//      * @dev Returns the value of tokens owned by `account`.
//      */
//     function balanceOf(address account) external view returns (uint256);

//     /**
//      * @dev Moves a `value` amount of tokens from the caller's account to `to`.
//      *
//      * Returns a boolean value indicating whether the operation succeeded.
//      *
//      * Emits a {Transfer} event.
//      */
//     function transfer(address to, uint256 value) external returns (bool);

//     /**
//      * @dev Returns the remaining number of tokens that `spender` will be
//      * allowed to spend on behalf of `owner` through {transferFrom}. This is
//      * zero by default.
//      *
//      * This value changes when {approve} or {transferFrom} are called.
//      */
//     function allowance(address owner, address spender) external view returns (uint256);

//     /**
//      * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
//      * caller's tokens.
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
//     function approve(address spender, uint256 value) external returns (bool);

//     /**
//      * @dev Moves a `value` amount of tokens from `from` to `to` using the
//      * allowance mechanism. `value` is then deducted from the caller's
//      * allowance.
//      *
//      * Returns a boolean value indicating whether the operation succeeded.
//      *
//      * Emits a {Transfer} event.
//      */
//     function transferFrom(address from, address to, uint256 value) external returns (bool);
// }


// // File @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol@v5.0.2

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/IERC20Metadata.sol)

// pragma solidity ^0.8.20;

// /**
//  * @dev Interface for the optional metadata functions from the ERC20 standard.
//  */
// interface IERC20Metadata is IERC20 {
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


// // File contracts/interfaces/ISafe.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// interface ISafe {
//   function addUp(address user, uint96 recordId) external returns(bool);
//   function getFinance(
//     address user, 
//     IERC20 baseAsset, 
//     uint256 loan, 
//     uint fee, 
//     uint256 calculatedCol,
//     uint96 recordId
//   ) 
//     external 
//     returns(bool);

//   function payback(Common.Payback_Safe memory, uint unit) external returns(bool);
//   function cancel(address user, IERC20 asset, uint unit, uint96 recordId) external returns(bool);
//   function getData() external view returns(ViewData memory);
//   function registerProvidersTo(Common.Provider[] memory providers, address contributor, uint96 recordId) external;
//   function forwardBalances(address to, address erc20) external returns(bool);
//   struct ViewData {
//     uint totalClients;
//     uint aggregateFee;
//   }

//   struct ViewUserData {
//     bool access;
//     uint collateralBalance;
//   }
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


// // File @thirdweb-dev/contracts/external-deps/openzeppelin/utils/Counters.sol@v3.15.0

// // Original license: SPDX_License_Identifier: MIT
// // OpenZeppelin Contracts v4.4.1 (utils/Counters.sol)

// pragma solidity ^0.8.0;

// /**
//  * @title Counters
//  * @author Matt Condon (@shrugs)
//  * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
//  * of elements in a mapping, issuing ERC721 ids, or counting request ids.
//  *
//  * Include with `using Counters for Counters.Counter;`
//  */
// library Counters {
//     struct Counter {
//         // This variable should never be directly accessed by users of the library: interactions must be restricted to
//         // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
//         // this feature: see https://github.com/ethereum/solidity/issues/4637
//         uint256 _value; // default: 0
//     }

//     function current(Counter storage counter) internal view returns (uint256) {
//         return counter._value;
//     }

//     function increment(Counter storage counter) internal {
//         unchecked {
//             counter._value += 1;
//         }
//     }

//     function decrement(Counter storage counter) internal {
//         uint256 value = counter._value;
//         require(value > 0, "Counter: decrement overflow");
//         unchecked {
//             counter._value = value - 1;
//         }
//     }

//     function reset(Counter storage counter) internal {
//         counter._value = 0;
//     }
// }


// // File contracts/peripherals/Epoches.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;

// /**
//  * @title : Epoches contract
//  * @author : Bobeu - Simplifinance - https://github.com/bobeu
//  * @notice It is a base contract manages push and retrieval actions on pools in storage.
//  * 
//  * ERROR CODE
//  * =========
//  * 1 - Unit is active
//  * 2 - Unit is inactive
//  */
// abstract contract Epoches {
//     using Counters for Counters.Counter;

//     // Current pool counter
//     Counters.Counter private currentCounter;

//     // Past pool counter
//     Counters.Counter private recordCounter;

//     /**
//      * Mapping holding two storage branches. Common.Branch.CURRENT => unitId returns a mapped value of type Common.Pool while
//      * Common.Branch.RECORD => recordId returns a mapped value of type Pool. The difference is that one is a past pool while the 
//      * other returns a active pool 
//     */ 
//     mapping(Common.Branch => mapping(uint96 unitOrRecordId => Common.Pool)) private pools;
 
//     /**
//      * @dev Mapping of unit contribution to unit Ids
//      * For every unit amount of contribution, there is a corresponding index for retrieving the pool object from the storage.
//      */
//     mapping(uint256 unitContribution => uint96) private ids; 

//     /**
//      * @dev Ensure the contribution unit is active. 
//      * @notice When unit is not active, it can be relaunched. 
//     */
//     modifier _requireUnitIsActive(uint unit){
//         require(_isUnitActive(unit), '2');
//         _;
//     }

//     /**
//      *  @dev Add a completed pool to history 
//      * @param pool : Pool object to push to storage
//     */
//     function _setRecord(Common.Pool memory pool) internal {
//         pools[Common.Branch.RECORD][pool.big.recordId] = pool;
//     }

//     /**
//      * @dev Verify that the contribution unit is not active. 
//      * @notice When unit is not active, it can be relaunched. 
//     */
//     modifier _requireUnitIsNotActive(uint unit){
//         require(!_isUnitActive(unit), '1');
//         _;
//     }

//     /**
//         * @dev Ensure that unit contribution is active.
//         * Every unit contribution has a corresponding and unique id called unitId.
//         * When a unitId equals zero mean it is not active
//     */
//     function _isUnitActive(uint unit) internal view returns(bool result){
//         result = pools[Common.Branch.CURRENT][_getUnitId(unit)].status == Common.Status.TAKEN; 
//     }

//     /**
//      * @dev Fetch unit id/index
//      * @param unit : Unit contribution
//      */
//     function _getUnitId(uint unit) internal view returns(uint96 _unitId) {
//         _unitId = ids[unit];
//     }

//     /** 
//      * @dev Generate a new unit Id
//      * @param unit : Unit contribution
//      * @notice When a pool is created, we generate a unitId and a recordId. Unit Id can be used to access the pool directly
//      * from the activePools storage reference while recordId can be used to retrieve the past pool. Since every unit contribution can 
//      * have a unique id assigned to them, to avoid collision and data loss, we generate a slot stored in each pool object ahead before the epoch is
//      * completed. So at any point in time, a completed pool can be retrieved using its corresponding recordId while an active pool maintains a 
//      * unique unit Id
//      */
//     function _generateIds(uint unit) internal returns(uint96 unitId, uint96 recordId) {
//         currentCounter.increment(); 
//         (unitId, recordId) = _getCounters();
//         recordCounter.increment();
//         ids[unit] = unitId;
//     }

//     /**
//      * @dev Return both the current and past pool counters
//      */
//     function _getCounters() internal view returns(uint96 activePoolCounter, uint96 pastPoolCounter) {
//         (activePoolCounter, pastPoolCounter) = (uint96(currentCounter.current()), uint96(recordCounter.current()));
//     }

//     /**
//      * @dev Fetch current pool with unit contribution
//      * @param unit : Unit contribution
//      */
//     function _getPool(uint unit) internal view returns(Common.Pool memory result) {
//         result = _getPoolWithUnitId(_getUnitId(unit));
//     }

//     /**
//      * @dev Update pool in storage
//      * @param pool : Pool object
//      * @param unitId : Unit Id
//      */    
//     function _setPool(Common.Pool memory pool, uint96 unitId) internal {
//         pools[Common.Branch.CURRENT][unitId] = pool;
//     }

//     /**
//      * @dev Fetch Current pool with unitId
//      * @param unitId : Unit Id
//      */
//     function _getPoolWithUnitId(uint96 unitId) internal view returns(Common.Pool memory result){
//         result = pools[Common.Branch.CURRENT][unitId];
//     }

//     /**
//      * @dev Fetch Current pool with unitId
//      * @param recordId : Unit Id
//      */
//     function _getPoolWithRecordId(uint96 recordId) internal view returns(Common.Pool memory result){
//         result = pools[Common.Branch.RECORD][recordId];
//     }

//     /**
//      * @dev Shuffle pools i.e move the current pool to history and reset it 
//      * @param pool : Current pool
//      */ 
//     function _shufflePool(Common.Pool memory pool) internal {
//         Common.Pool memory empty = pools[Common.Branch.CURRENT][0];
//         _setPool(empty, pool.big.unitId);
//         _setRecord(pool);
//     }

//     /**@dev Check if pool is filled
//         * @dev Msg.sender must not be a member of the band at epoch Id before now.
//         * @param pool: Pool struct (Location: Memory)
//         * @notice : Be sure to wrap this function in an uncheck block
//     */
//     function _isPoolFilled(Common.Pool memory pool, bool isPermissioned) 
//         internal 
//         pure
//         returns(bool filled) 
//     {
//         unchecked {
//             filled = !isPermissioned? pool.low.userCount == pool.low.maxQuorum : pool.big.currentPool == (pool.big.unit * pool.low.maxQuorum);
//         }
//     }

//     /**@dev Sets new last paid */
//     function _setLastPaid(address to, uint unit) internal {
//         pools[Common.Branch.CURRENT][_getUnitId(unit)].addrs.lastPaid = to; 
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


// // File contracts/peripherals/PointsAndSafe.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// /**
//  * @title AwardPoint contract rewards users for their participation only if they had register to earn points in the Points contract 
//  * @author : Bobeu - https://github.com/bobeu
//  * @notice Users must opt in to earn reward before their points can reflect.
//  * 
//  * ERROR CODE
//  * =========
//  * A1 - Safe factory address parsed to the constructor is zero
//  * A2 - Safe creation failed
//  */
// abstract contract PointsAndSafe is MinimumLiquidity {
//     // Whether to award point to users or not
//     bool private awardPoint;
    
//     // Safe factory contract
//     ISafeFactory private safeFactory;

//     /**
//      * ================ Constructor ==============
//      */
//     constructor(
//         address _stateManager, 
//         address _roleManager, 
//         address _safeFactory,
//         uint _minmumLiquidity
//     ) 
//         MinimumLiquidity(_stateManager, _roleManager, _minmumLiquidity)
//     { 
//         require(_safeFactory != address(0), 'A1');
//         awardPoint = true;
//         safeFactory = ISafeFactory(_safeFactory); 
//     }

//     ///@dev Award points for users
//     function _awardPoint(address target, uint8 asMember, uint8 asAdmin, bool deduct) internal {
//         IPoint pointFactory = _getVariables().pointFactory;
//         bool done;
//         if(awardPoint) done = deduct? pointFactory.deductPoint(target, asMember, asAdmin, 0) : pointFactory.setPoint(target, asMember, asAdmin, 0);
        
//         require(done); 
//     }

//     /// @dev Activate reward
//     function toggleReward() public onlyRoleBearer returns(bool) {
//         awardPoint? awardPoint = false : awardPoint = true;
//         return true;
//     }
    
//     /**
//         * @dev Checks, validate and return safe for the target unit.
//         * @param unit : Unit contribution.
//     */
//     function _getSafe(uint256 unit) internal returns(address safe) {
//         safe = safeFactory.pingSafe(unit);
//         require(safe != address(0), 'A2');
//     }

//     function getAwardPointStatus() public view returns(bool result) {
//         result = awardPoint;
//     }
 
// }


// // File contracts/peripherals/Slots.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// abstract contract Slots {
//     // Every contributor owns a slot in each unit contribution
//     mapping(address contributor => mapping(uint unitId => Common.Slot)) private slots;

//     /**
//         * @dev Create a new slot for target account
//         * @param target : Target account
//         * @param unitId : Unit contribution
//         * @param position : User's position in the list of contributors
//         * @param isAdmin : Whether target is an admin or not
//         * @param isMember : Whether target is a member or not
//      */
//     function _createSlot(
//         address target, 
//         uint unitId,
//         uint8 position,
//         bool isAdmin,
//         bool isMember
//     ) internal {
//         _setSlot(
//             target,
//             unitId, 
//             Common.Slot(position, isMember, isAdmin),
//             false
//         );
//     }

//     /**
//      * @dev Set a new slot for the target
//      * @param target : Target account
//      * @param unitId : unitId
//      * @param slot : Slot
//      */
//     function _setSlot( address target, uint unitId, Common.Slot memory slot, bool setEmpty) internal {
//         Common.Slot memory empty;
//         slots[target][unitId] = setEmpty? empty : slot;
//     }

//     /**
//         * @dev Returns the slot for target account
//         * @param target : Target account
//         * @param unitId : Unit
//     */
//     function _getSlot(
//         address target, 
//         uint unitId
//     ) internal view returns(Common.Slot memory slot) {
//         slot = slots[target][unitId];
//     }

//     // For detailed doc, see _getSlot
//     function getSlot(address target, uint unitId) 
//         external 
//         view 
//         // onlyInitialized(unit, false)
//         returns(Common.Slot memory) 
//     { 
//         return _getSlot(target, unitId);
//     }
// }


// // File contracts/peripherals/Contributor.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// // import "hardhat/console.sol";

// /**
//  * ERROR CODE
//  * ==========
//  * 9 -  Not member
//  * 10 - Not allowed
//  * 11 - No debt
//  * 12 - No User
//  * 13 - Payback failed
//  */
// abstract contract Contributor is Epoches, Slots, PointsAndSafe {
//     using Utils for *;

//     /**
//      * @dev Mapping of unitId to contributors
//      * @notice We used record Id to index the contributors in a pool while a unit contribution
//      * van have multiple records, it makes sense to track contributors in each pool with their record Id
//     */
//     mapping(uint => Common.Contributor[]) private contributors;

//     /**
//      * @dev Mapping of unit ids to contributors to array of providers
//      * @notice Each contributor maintain a list of providers they borrow from
//      */
//     mapping(uint => mapping(address => Common.Provider[])) private unitProviders;

//     // ============= constructor ============
//     constructor(
//         address _stateManager, 
//         address _roleManager, 
//         address _safeFactory,
//         uint _minmumLiquidity
//         ) 
//     PointsAndSafe(
//         _stateManager, 
//         _roleManager, 
//         _safeFactory, 
//         _minmumLiquidity
//     )
//     {} 

//     /**
//      * @dev Only contributor in a pool is allowed
//      * @param target : Target
//      * @param unit : Unit Contribution
//     */
//     function _checkStatus(address target, uint256 unit, bool value) internal view {
//         bool isMember = _getSlot(target, _getUnitId(unit)).isMember;
//         value? require(isMember, '9') : require(!isMember, '10');
//     }

//     /**
//      * @dev returns target's profile status in a pool
//      * @param target : Target account
//      * @param unit : Unit contribution
//      */
//     function _getContributor(
//         address target, 
//         uint unit
//     ) internal view returns(Common.ContributorReturnValue memory result) {
//         uint unitId = _getUnitId(unit); 
//         result.slot = _getSlot(target, unitId); 
//         result.profile = contributors[unitId][result.slot.value];
//         result.providers = _getContributorProviders(target, unitId);
//     }

//     /**
//      * @dev Return providers associated with the target account
//      * @param target : Target account
//      * @param unitId : Record id
//      */
//     function _getContributorProviders(address target, uint unitId) internal view returns(Common.Provider[] memory result){
//         result = unitProviders[unitId][target];
//     }

//     /**
//      * @dev returns user's profile status in a pool
//      * @param unit : Unit contribution
//      */
//     function _getExpected(uint256 unit, uint8 selector) internal view returns(Common.Contributor memory _expected) {
//         _expected = contributors[_getUnitId(unit)][selector];
//     }

//     /** 
//      * @dev Update the provider list of a contributor
//      * @param providers : List of providers
//      * @param user : Target user
//      * @param unitId : Record Id
//      */
//     function _setProviders(
//         Common.Provider[] memory providers, 
//         address user, 
//         uint unitId
//     ) internal {
//         for(uint i = 0; i < providers.length; i++){
//             unitProviders[unitId][user].push(providers[i]);
//         }
//     } 

//     /**
//      * @dev Set user's time to get finance
//      * @param user : Target address
//      * @param unit : Unit contribution
//      * @param date : Date/timestamp
//      * @notice If 'user' is zero address, we generate a new slot otherwise fetch existing slot
//      */ 
//     function _setTurnStartTime(address user, uint256 unit, uint32 date) internal {
//         uint position;
//         if(user == address(0)){
//             position = _getPool(unit).low.selector;
//             user = _getExpected(unit, uint8(position)).id;
//         } else {
//             position = _getSlot(user, _getUnitId(unit)).value;
//         }
//         contributors[_getUnitId(unit)][position].turnStartTime = date;
//      }

//     /**
//      * @dev Add or update contributor to the list of contributors
//      * @param profile : Target profile
//      * @param position : The position of target user in the list
//      * @param unitId : Unit Id
//      */
//     function _setContributor(Common.Contributor memory profile, uint unitId, uint8 position, bool setEmpty) internal {
//         Common.Contributor memory empty;
//         contributors[unitId][position] = setEmpty? empty : profile;
//     }

//     /**
//      * @dev Add contributor data to storage
//      * @param pool : Pool struct
//      * @param target : Target user
//      * @param isAdmin : Whether user is the creator or not
//      * @param isMember : Whether user is a member or not
//      * @param sentQuota : Whether user have sent their quota of the contribution or not
//      */
//     function _initializeContributor(
//         Common.Pool memory pool, 
//         address target,
//         bool isAdmin,
//         bool isMember,
//         bool sentQuota            
//     ) internal returns(Common.ContributorReturnValue memory data) {
//         data.slot.value = contributors[pool.big.unitId].length;
//         _createSlot(target, pool.big.unitId, uint8(data.slot.value), isAdmin, isMember);
//         contributors[pool.big.unitId].push(); 
//         data.profile.id = target; 
//         data.profile.sentQuota = sentQuota;
//     }

//     /**
//      * @dev Remove contributor from a pool
//      * @param target : Target address
//      * @param unit : Unit contribution
//      * @notice Parsing true to _setSlot as the last argument with set the slot to empty
//      */
//     function _removeContributor(address target, uint256 unit) internal {
//         uint unitId = _getUnitId(unit);
//         _setSlot(target, unitId, _getSlot(target, unitId), true); 
//     }
 
//     /**
//      * @dev Swaps contributors data if the expected caller is not the same as the actual caller
//      * and the grace period has elapsed.
//      * @param unit : Unit contribution
//      * @param actual : Actual calling account
//      * @param expectedSlot : Slot of expected calling account
//      * @param expectedData : Data of expected calling account
//      */
//     function _swapContributors(
//         uint256 unit,
//         address actual,
//         Common.Slot memory expectedSlot,
//         Common.Contributor memory expectedData
//     )
//         internal
//         returns(Common.Contributor memory actualData) 
//     {
//         _checkStatus(actual, unit, true);
//         uint unitId = _getUnitId(unit);
//         Common.Slot memory actualSlot = _getSlot(actual, unitId);
//         actualData = _getContributor(actual, unit).profile;
//         _setSlot(actual, unitId, expectedSlot, false);
//         _setSlot(expectedData.id, unitId, actualSlot, false);
//         expectedData.id = actual; 
//         actualData.id = expectedData.id;
//         _setContributor(expectedData, unitId, uint8(expectedSlot.value), false);
//         _setContributor(actualData, unitId, uint8(actualSlot.value), false);
//     }

//     /**
//      * @dev Complete the getFinance task
//      * @param pool : Existing pool. Must not be an empty pool.
//      * @param collateral : Expected collateral
//      * @param profile : User's profile data
//      */
//     function _completeGetFinance(Common.Pool memory pool, uint collateral, Common.Contributor memory profile) internal returns(Common.Pool memory _pool, Common.Contributor memory _profile) {
//         pool.low.selector ++;
//         unchecked {
//             profile.paybackTime = _now() + pool.low.duration;
//         }
//         profile.colBals = collateral;
//         profile.loan = pool.big.currentPool;
//         Common.Provider[] memory providers = unitProviders[pool.big.unitId][pool.addrs.lastPaid];
//         for(uint i = 0; i < providers.length; i++){
//             unitProviders[pool.big.unitId][pool.addrs.lastPaid][i].earnStartDate = _now();
//             unitProviders[pool.big.unitId][pool.addrs.lastPaid][i].accruals = providers[i].amount.computeInterestsBasedOnDuration(uint16(providers[i].rate), pool.low.duration);
//         }
//         pool.big.currentPool = 0;
//         pool.stage = Common.Stage.PAYBACK;
//         _pool = pool;
//         _profile = profile;
//     }

//     /**
//      * @dev Payback loan
//      * @param unit : Unit contribution
//      * @param payer : Contributor
//      * @param isSwapped : Whether there was swapping or not. Often swapping will happen when a contributor defaults
//      * @param defaulter : The defaulter account
//      */
//     function _payback(
//         uint unit, 
//         address payer,
//         bool isSwapped,
//         address defaulter
//     ) 
//         internal
//         _requireUnitIsActive(unit)
//         returns(Common.Pool memory _pool)
//     { 
//         (uint debt, Common.Pool memory pool) = _getCurrentDebt(unit, payer);
//         require(debt > 0, '11');
//         uint slot = _getSlot(pool.addrs.lastPaid, pool.big.unitId).value;
//         contributors[pool.big.unitId][slot].loan = 0;
//         contributors[pool.big.unitId][slot].colBals = 0;
//         contributors[pool.big.unitId][slot].paybackTime = _now();
//         if(getAwardPointStatus()) _awardPoint(pool.addrs.lastPaid, 2, 0, false);
//         if(pool.low.maxQuorum == pool.low.allGh){
//             pool.stage = Common.Stage.ENDED;
//             _shufflePool(pool);
//         } else {
//             contributors[pool.big.unitId][pool.low.selector].turnStartTime = _now();
//             pool.stage = Common.Stage.GET;
//             unchecked {
//                 pool.big.currentPool = pool.big.unit * pool.low.maxQuorum;
//             }
//             _setPool(pool, pool.big.unitId);
//         }
//         IStateManager.StateVariables memory stm = _getVariables();
//         uint attestedInitialBal = stm.baseAsset.balanceOf(pool.addrs.safe);
//         _checkAndWithdrawAllowance(stm.baseAsset, payer, pool.addrs.safe, debt);
//         require(
//             ISafe(pool.addrs.safe).payback(
//                 Common.Payback_Safe(payer, stm.baseAsset, debt, attestedInitialBal, pool.low.maxQuorum == pool.low.allGh, contributors[pool.big.unitId], isSwapped, defaulter, pool.big.recordId, pool.addrs.colAsset, stm.assetManager.isWrappedAsset(address(pool.addrs.colAsset)), _getContributorProviders(payer, pool.big.unitId)),
//                 unit
//             )
//             ,
//             '13'    
//         );
//         _pool = pool;
//     }

//     /**
//      * @dev Return current pools with its contributors using unitId. 
//      * @notice For every unit contribution, the unit Id is unique to another and does not change
//      * @param unitId: UnitId 
//     */
//     function getPoolData(uint96 unitId) public view returns(Common.ReadPoolDataReturnValue memory result) {
//         result = _getPoolData(_getPoolWithUnitId(unitId));
//         return result;
//     }
 
//     function _getPoolData(Common.Pool memory pool) internal view returns(Common.ReadPoolDataReturnValue memory result) {
//         result.pool = pool;
//         Common.Contributor[] memory participants = contributors[result.pool.big.unitId];
//         Common.ContributorReturnValue[] memory data = new Common.ContributorReturnValue[](participants.length);
//         if(result.pool.big.unit > 0) {
//             for(uint i = 0; i < participants.length; i++) {
//                 address target = participants[i].id;
//                 data[i] = _getContributor(target, result.pool.big.unit);
//             }
//         }
//         result.cData = data;
//         // return result;
//     }

//     /**
//     * @dev Return past pools
//     */
//     function getRecords() public view returns(Common.ReadPoolDataReturnValue[] memory result) {
//         (,uint96 size) = _getCounters();
//         Common.ReadPoolDataReturnValue[] memory rdrs = new Common.ReadPoolDataReturnValue[](size);
//         for(uint96 i = 0; i <size; i++) {
//             rdrs[i] = _getPoolData(_getPoolWithRecordId(i));
//         }
//         result = rdrs;
//     }

//     /**
//      * @dev Returns the profile of target
//      * @param unit : unit contribution
//      * @param target : User
//      */
//     function getProfile(
//         uint256 unit,
//         address target
//     )
//         public
//         view
//         // onlyInitialized(unit, false)
//         returns(Common.ContributorReturnValue memory) 
//     {
//         return _getContributor(target, unit);
//     }

//     function _replaceContributor(address liquidator, uint unitId, Common.Slot memory slot, address _defaulter) internal {
//         Common.Provider[] memory providers = unitProviders[unitId][_defaulter];
//         if(providers.length > 0) {
//             unitProviders[unitId][liquidator] = unitProviders[unitId][_defaulter];
//             delete unitProviders[unitId][_defaulter];
//         }
//         contributors[unitId][slot.value].id = liquidator;
//         _setSlot(liquidator, unitId, slot, false);
//         _setSlot(_defaulter, unitId, slot, true);
//     }

//     /**
//      * Returns the current debt of last paid acount i.e the contributor that last got finance
//      * @param unit : Unit contribution
//      * @param currentUser : Account for whom to query debt
//      * @notice For every contributor that provide liquidity through providers, they are required to 
//      * pay interest in proportion to the providers' rate. Every other contributors in the same pool 
//      * will pay interest to the same set of providers but the interest will be halved.
//      */
//     function _getCurrentDebt(uint unit, address currentUser) internal view returns (uint256 debt, Common.Pool memory pool) {
//         pool = _getPool(unit);
//         require(currentUser != address(0), '12');
//         Common.Contributor[] memory profiles = contributors[pool.big.unitId];
//         if(_getSlot(currentUser, pool.big.unitId).isMember){ 
//             if(profiles.length > 0) {
//                 for(uint i = 0; i < profiles.length; i++){
//                     Common.ContributorReturnValue memory data = _getContributor(profiles[i].id, unit);
//                     if(data.profile.id == currentUser) {
//                         debt += data.profile.loan;
//                     }
//                     if(data.providers.length > 0) {
//                         for(uint j = 0; j < data.providers.length; j++){
//                             unchecked { 
//                                 debt += data.providers[j].accruals.fullInterest;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }

//       /**
//    * @dev Return struct object with data if current beneficiary has defaulted otherwise an empty struct is returned.
//    * @param unit: Unit contribution
//    */
//     function _enquireLiquidation(uint unit) 
//         internal 
//         view 
//         returns (Common.Contributor memory _profile, bool isDefaulted, Common.Slot memory slot) 
//     {
//         Common.Pool memory pool = _getPool(unit);
//         assert(pool.addrs.lastPaid != address(0));
//         Common.ContributorReturnValue memory _default = _getContributor(pool.addrs.lastPaid, unit);
//         if(_now() > _default.profile.paybackTime) {
//             assert(pool.addrs.lastPaid == _default.profile.id);
//             (_profile, isDefaulted, slot) = (_default.profile, true, _default.slot);
//         } 
//     }

//     /**
//         * @dev Check liquidation opportunity in the pool
//         * @param unit : Unit contribution
//     */
//     function enquireLiquidation(uint unit) public view returns(Common.Contributor memory profile, bool defaulter, Common.Slot memory slot) {
//         return _enquireLiquidation(unit);
//     }

//     function _now() internal view returns(uint32 time) {
//         time = uint32(block.timestamp);
//     }
    
// }


// // File contracts/peripherals/Pool.sol

// // Original license: SPDX_License_Identifier: MIT
// pragma solidity 0.8.28;

// // import "hardhat/console.sol";
// /**
//  * ERROR CODE
//  * 3 - Invalid duration
//  * 4 - Invalid list
//  * 5 - Minimum of two participants
//  * 6 - Admin not in list
//  * 7 - Admin appeared twice
//  * 8 - Stage not ready
//  * 8+ - Adding user to safe failied
//  */

// abstract contract Pool is Contributor {
//     // ================ Constructor ==============
//     constructor(
//         address stateManager, 
//         address roleManager, 
//         address _safeFactory,
//         uint _minmumLiquidity
//     )
//         Contributor(stateManager, roleManager, _safeFactory, _minmumLiquidity)
//     {}

//     /**
//      * @dev Create a pool internally
//      * @param args : Parameters
//      * @param args.users : Participants
//      * @param args.unit : Unit contribution
//      * @param args.maxQuorum : Maximum number of contributors that can participate
//      * @param args.durationInHours : Maximum duration in hours each borrower can retain the loan
//      * @param args.colCoverage : Ration of collateral coverage or index required as cover for loan
//      * @param args.router : Router : PERMISSIOLESS or PERMISSIONED
//      * @param args.sender : msg.sender
//     */
//     function _createPool(
//         Common.CreatePoolParam memory args
//     ) 
//         internal
//         _requireUnitIsNotActive(args.unit) 
//         onlySupportedAsset(args.colAsset) 
//         returns(Common.Pool memory pool) 
//     {
//         require(args.durationInHours > 0 && args.durationInHours <= 720, '3');
//         if(args.router == Common.Router.PERMISSIONLESS){
//             require(args.users.length == 1, '4');
//         } else {
//             require(args.users.length >= 2, '5');
//         } 
//         require(args.sender == args.users[0], '6');
//         (uint96 unitId, uint96 recordId) = _generateIds(args.unit);
//         pool = _updatePool(Common.UpdatePoolData(args.unit, unitId, recordId, args.maxQuorum, args.colCoverage, IERC20(args.colAsset), args.durationInHours, args.users[0], args.router));   
//         pool = _addUserToPool(args.users, pool);
//         _setPool(pool, unitId);
//         _completeAddUser(args.users[0], pool);
//     }

//     /**
//      * @dev Add users to newly created pool
//      * @param users : List of contributors to add
//      * @param pool : Pool data. Must be an existing data relating to the unit contribution
//      */
//     function _addUserToPool(
//         address[] memory users,
//         Common.Pool memory pool 
//     ) internal returns(Common.Pool memory _pool) {
//         for(uint i = 0; i < users.length; i++) {
//             Common.ContributorReturnValue memory data;
//             if(i == 0) {
//                 data = _initializeContributor(pool, users[i], true, true, true);
//             } else {
//                 require(users[0] != users[i], '7');
//                 data = _initializeContributor(pool, users[i], false, true, false);
//             }
//             _setContributor(data.profile, pool.big.unitId, uint8(data.slot.value), false);
//         }
//         _pool = pool;
//     }

//     /**
//         * @dev Add user to existing pool
//         * @param unit : Unit contribution
//         * @param user : Contributors to add
//         * @param pool : Pool data. Must be an existing data relating to the unit contribution
//     */
//     function _joinAPool(
//         uint256 unit, 
//         address user,
//         Common.Pool memory pool
//     ) internal _requireUnitIsActive(unit) returns(Common.Pool memory _pool) {
//         require(pool.stage == Common.Stage.JOIN, '8');
//         require(_getVariables().verifier.isVerified(user), "Not verified");
//         Common.ContributorReturnValue memory data;
//         unchecked {
//             pool.big.currentPool += pool.big.unit;
//             pool.low.userCount += 1;
//         }
//         if(pool.router == Common.Router.PERMISSIONED) {
//             _checkStatus(user, unit, true);
//             data = _getContributor(user, unit);
//             data.profile.sentQuota = true;
//         } else {
//             _checkStatus(user, unit, false);
//             data = _initializeContributor(pool, user, false, true, true);
//         }
//         _setContributor(data.profile, pool.big.unitId, uint8(data.slot.value), false);
//         if(_isPoolFilled(pool, pool.router == Common.Router.PERMISSIONED)) {
//             _setTurnStartTime(address(0), unit, _now());
//             pool.stage = Common.Stage.GET;
//         }
//         _pool = pool;
//         _completeAddUser(user, pool);
//     }
    
//     /**
//         * @dev Complete the add task.
//         * @param user : Contributors to add
//         * @param pool : Pool data. Must be an existing data relating to the unit contribution
//     */
//     function _completeAddUser(address user, Common.Pool memory pool) internal {
//         _checkAndWithdrawAllowance(IERC20(_getVariables().baseAsset), user, pool.addrs.safe, pool.big.unit);
//         require(ISafe(pool.addrs.safe).addUp(user, pool.big.recordId), '8+'); 
//     }

//     /**
//      * @dev Update pool with relevant data
//      * @param data : Function argument of type Common.UpdatePoolData
//      */
//     function _updatePool(Common.UpdatePoolData memory data) internal returns(Common.Pool memory pool) {
//         unchecked {
//             pool.low = Common.Low(data.maxQuorum, 0, data.colCoverage, uint32(uint(data.durationInHours) * 1 hours), 0, 1);
//         }
//         pool.big = Common.Big(data.unit, data.unit, data.recordId, data.unitId);
//         pool.addrs = Common.Addresses(data.colAsset, address(0), _getSafe(data.unit), data.creator);
//         pool.router = data.router;
//         pool.status = Common.Status.TAKEN;
//         pool.stage = Common.Stage.JOIN;
//     }

//     /**
//      * Returns the current debt of target user.
//      * @param unit : Unit contribution
//      */
//     function getCurrentDebt(uint256 unit, address target) public view returns(uint256 debt) 
//     {
//        (debt,) = _getCurrentDebt(unit, target);
//        return debt;
//     }

// }


// // File @chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol@v1.3.0

// // Original license: SPDX_License_Identifier: MIT
// pragma solidity ^0.8.0;

// // solhint-disable-next-line interface-starts-with-i
// interface AggregatorV3Interface {
//   function decimals() external view returns (uint8);

//   function description() external view returns (string memory);

//   function version() external view returns (uint256);

//   function getRoundData(
//     uint80 _roundId
//   ) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

//   function latestRoundData()
//     external
//     view
//     returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
// }


// // File contracts/peripherals/priceGetter/CeloPriceGetter.sol

// // Original license: SPDX_License_Identifier: MIT

// pragma solidity 0.8.28;
// /**
//  * @title Price oracle contract that fetches price of a CELO/USD pair as default from the Pyth network. It has a 
//  * function to set a new asset pair to fetch price for.
//  * @author Written by Bobeu,inspired by the Chainlink team
//  * @notice Each asset has a priceFeed Id that ae parsed either during construction or using designated function. 
//  * 
//  * ERROR CODE
//  * ==========
//  * C1 - Data.feedAddr is zero
//  */ 
// abstract contract CeloPriceGetter is Pool {
//     using Utils for *;

//     struct PriceData {
//         string pair;
//         uint8 decimals;
//         address feedAddr;
//         uint any;
//     }

//     // Mapping of collateral assets to their corresponding price data
//     mapping (address => PriceData) private priceData;

//     /**
//      * @param _priceData Price retrieval info
//     */  
//     constructor(
//         address _roleManager,
//         address _stateManager,
//         address[] memory supportedAssets,
//         PriceData[] memory _priceData,
//         address _safeFactory,
//         uint _minmumLiquidity
//     ) Pool(_stateManager, _roleManager, _safeFactory, _minmumLiquidity) {
//         require(supportedAssets.length == _priceData.length);
//         for(uint i = 0; i < supportedAssets.length; i++) {
//             priceData[supportedAssets[i]] = _priceData[i];
//             (uint testPrice, ) = _getPrice(supportedAssets[i]);
//             priceData[supportedAssets[i]].any = testPrice; 
//         }
//     }
  
//     /**
//      * @dev Fetch the price of an asset from the Pyth network
//      * @param asset : The asset for which to fetch price
//      */
//     function _getPrice(address asset) internal view returns(uint price, uint8 decimals) {
//         assert(asset != address(0));
//         PriceData memory data = priceData[asset];
//         require(data.feedAddr != address(0), 'C1');
//         decimals = data.decimals;
//         (,int answer,,,) = AggregatorV3Interface(data.feedAddr).latestRoundData();
//         price = uint(answer);
//     }

//     /**
//      * @dev Sets a new price data
//      * @param supportedAsset : Asset to set price for. Should be a supported asset
//      * @param pair : Asset pair e.g CELO/USD
//      * @param pairAddress: Paired addresss/id
//      * @param priceDecimals : Price offset decimals/zeros
//      * @notice Only account with role permissioned is allowed to access this function
//     */
//     function setAssetData(address supportedAsset, string memory pair, address pairAddress, uint8 priceDecimals) public onlyRoleBearer returns(bool) {
//         priceData[supportedAsset] = PriceData(pair, priceDecimals, pairAddress, 0);
//         return true;
//     }
    
//     /**
//      * @dev Returns amount of collateral required in a pool.
//      * @param unit : EpochId
//      * @return collateral Collateral
//     */
//     function getCollateralQuote(uint256 unit)
//         public
//         view
//         returns(uint collateral) 
//     { 
//         Common.Pool memory pool = _getPool(unit);
//         (uint lastPrice, uint8 priceDecimals) = _getPrice(address(pool.addrs.colAsset));
//         if(pool.big.unit > 0) {
//             unchecked {
//                 collateral = Common.Price(
//                         lastPrice,
//                         priceDecimals
//                     ).computeCollateral(
//                         uint24(pool.low.colCoverage), 
//                         pool.big.unit * pool.low.maxQuorum
//                     );
//             }
//         }
//     }

//     /**
//      * @dev return price data object. 
//      * @param collateralAsset : Collateral asset
//      * @notice The key to parse is the mapped collateral asset
//      */
//     function getPriceData(address collateralAsset) public view returns(PriceData memory) {
//         return priceData[collateralAsset];
//     } 
 

// }


// // File contracts/standalone/flexpools/CeloBased.sol

// // Original license: SPDX_License_Identifier: MIT
// pragma solidity 0.8.28;
// // import { Analytics } from "../../peripherals/Analytics.sol";

// /**
//     * @title FlexpoolFactory
//     * @author Simplifi (Bobeu)
//     * @notice FlexpoolFactory enables peer-funding magic. Participants of each pool are referred to 
//     * contributors. There is no limit to the amount that can be contributed except for zer0 value. Users can single-handedly run
//     * a pool (where anyone is free to participate) or collectively with friends and family or peer operate a permissioned pool 
//     * where participation is restricted to the preset members only.
//     * Users can use providers strategy to finance their quota if they can't afford the unit contribution. They can select multiple
//     * providers if the provider balance cannot the amount they wish to borrow. If this is the case, the selected providers are 
//     * entitled to earn interest on the amount they provide.
//     * When paying back, the contributor will repay the full loan with interest but halved for other contributors.  
//     *
//     ERROR CODE
//     ==========
//     14 - Borrow not ready
//     15 - Pool fund incomplete
//     16 - TurnTime has not pass
//     17 - Not defaulted
//     18 - Only admin can close
//     19 - Closing pool time elapsed
//     20 - Epoch ended

// */
// contract CeloBased is IFactory, CeloPriceGetter {
//     using Utils for *;

//     /** 
//      * ================ Constructor ==============
//     */
//     constructor(
//         address _roleManager,
//         address _stateManager, 
//         address[] memory supportedAssets, 
//         PriceData[] memory priceData,
//         address _safeFactory,
//         uint _minmumLiquidity
//     ) 
//         CeloPriceGetter(
//             _roleManager, 
//             _stateManager, 
//             supportedAssets, 
//             priceData, 
//             _safeFactory,
//             _minmumLiquidity
//         )
//     {}

//     receive() external payable {}

//     /**
//         * @dev Create a pool internally
//         * @param users : List of participating accounts
//         * @param unit : Unit contribution
//         * @param maxQuorum : Maximum number of contributors that can participate
//         * @param durationInHours : Maximum duration in hours each borrower can retain the loan
//         * @param colCoverage : Ration of collateral coverage or index required as cover for loan
//         * @param isPermissionless : Whether to create a permissionless or permissioned pool.
//         * @param colAsset : An ERC20-compatible asset to use as collateral currency 
//         * @notice users list should be a list of participating accounts if it is permissioned including the
//         * creator being the first on the list. But the list can be empty if it is permissionless.
//     */
//     function createPool( 
//         address[] memory users,
//         uint unit,
//         uint8 maxQuorum,
//         uint16 durationInHours,
//         uint24 colCoverage,
//         bool isPermissionless,
//         address colAsset
//     ) public whenNotPaused returns(bool) {
//         Common.Pool memory pool = _createPool(Common.CreatePoolParam(users, _msgSender(), unit, maxQuorum, durationInHours, colCoverage, isPermissionless? Common.Router.PERMISSIONLESS : Common.Router.PERMISSIONED, colAsset));
//         _awardPoint(users[0], 0, 5, false);
//         // _updateAnalytics(0, unit, 0, isPermissionless);
//         emit Common.PoolCreated(pool);
      
//         return true;
//     }

//     /**
//      * @dev launch a default permissionless pool
//      * @param user : Target user
//      * @param unit : Unit contribution
//      * @param _providers : A list of external fund providers.
//      * @return pool : Current pool
//      * @notice Defaults value are set as
//      * - MaxQuorum - 2
//      * - Duration - 72 hours i.e 3 days
//      * - Collateral coverage - 120
//      */
//     function _launchDefault(address user, uint unit, Common.Provider[] memory _providers) internal returns(Common.Pool memory pool) {
//         address[] memory users = new address[](1);
//         users[0] = user;
//         address defaultColAsset = _getVariables().assetManager.getDefaultSupportedCollateralAsset(1);
//         pool = _createPool(Common.CreatePoolParam(users, user, unit, 2, 72, 120, Common.Router.PERMISSIONLESS, defaultColAsset));
//         ISafe(pool.addrs.safe).registerProvidersTo(_providers, user, pool.big.recordId); 
//         _awardPoint(users[0], 0, 5, false);
//         // _updateAnalytics(0, unit, 0, pool.router == Common.Router.PERMISSIONLESS);

//         emit Common.PoolCreated(pool);
//     }

//     /**
//      * @dev Contributors can join a pool through a provider is they wish to borrow to finance the unit contribution.
//      *      If the unit is not taken, we add them to the pool otherwise a new pool will be launched.
//      * @param providers : List of providers that lend to the borrower
//      * @param borrower : Account address of the borrower
//      * @param unit : Amount borrowed will automatically be the unit contribution
//      * @notice By default, maxQuorum is set to 2 using this method. Users can immediately change the quorum
//      * to desired value otherwise it will not be possible if another contributor joins to complete the quorum.
//      * - durationInHrs is set to 72 hours by default.
//      * - colCoverage is set to 120 by default.
//      * Only accounts with the roleBearer are allowed i.e Ex. Providers contract
//      * If an user is contributing via the provider, we ensure the privacy of permissioned group is preserved.
//      */
//     function contributeThroughProvider(
//         Common.Provider[] memory providers, 
//         address borrower, 
//         uint unit
//     ) external onlyRoleBearer whenNotPaused returns(bool)
//     {
//         Common.Pool memory pool; 
//         if(_getPool(unit).status == Common.Status.TAKEN){
//             pool = _getPool(unit);
//             pool = _joinAPool(unit, borrower, pool);
//             _setPool(pool, pool.big.unitId);
//             // _updateAnalytics(1, unit, 0, pool.router == Common.Router.PERMISSIONLESS);
//             emit Common.NewContributorAdded(pool);
//         } else {
//             pool = _launchDefault(borrower, unit, providers);
//         }
//         _setProviders(providers, borrower, pool.big.unitId);
//         return true;
//     }

//     /**
//      * @dev Add a contributor to a poool
//      * @param : Unit contribution
//      */
//     function contribute(uint unit) public whenNotPaused returns(bool) {
//         Common.Pool memory pool = _getPool(unit);
//         pool = _joinAPool(unit, _msgSender(), pool);
//         _setPool(pool, pool.big.unitId);
//         // _updateAnalytics(1, unit, 0, pool.router == Common.Router.PERMISSIONLESS);
//         emit Common.NewContributorAdded(pool);

//         return true;
//     }

//     /**
//      * @dev Get finance
//      * @param unit : Unit contribution
//      * @return bool : Success or Failure
//      * @notice : To get finance, the unit contribution must be active. In the event the expected contributor failed to 
//      * call, we swap their profile for the current msg.sender provided the grace period of 1hr has passed.
//     */
//     function getFinance(uint256 unit) public payable _requireUnitIsActive(unit) whenNotPaused returns(bool) {
//         _checkStatus(_msgSender(), unit, true);
//         Common.Pool memory pool = _getPool(unit);
//         uint collateral = getCollateralQuote(unit);
//         Common.Contributor memory profile = _getExpected(unit, pool.low.selector);
//         require(pool.stage == Common.Stage.GET, '14');
//         require(pool.low.allGh < pool.low.maxQuorum, '20');
//         unchecked {
//             require(pool.big.currentPool >= (pool.big.unit * pool.low.maxQuorum), '15');
//             if(_now() > profile.turnStartTime + 1 hours){
//                 if(_msgSender() != profile.id) {
//                     profile = _swapContributors(unit, _msgSender(), _getSlot(_msgSender(), pool.big.unitId), profile);
//                 }
//             } else {
//                 require(_msgSender() == profile.id, '16');
//             }
//             pool.low.allGh += 1;
//         }
//         pool.addrs.lastPaid = profile.id;
//         // _updateAnalytics(2, pool.big.currentPool, collateral, pool.router == Common.Router.PERMISSIONLESS);
//         IStateManager.StateVariables memory stm = _getVariables();
//         _checkAndWithdrawAllowance(IERC20(pool.addrs.colAsset), profile.id, pool.addrs.safe, stm.assetManager.isWrappedAsset(address(pool.addrs.colAsset))? unit : collateral);
//         ISafe(pool.addrs.safe).getFinance(profile.id, stm.baseAsset, pool.big.currentPool, pool.big.currentPool.computeFee(uint16(stm.makerRate)), collateral, pool.big.recordId);
//         (pool, profile) = _completeGetFinance(pool, collateral, profile);
//         _setContributor(profile, pool.big.unitId, uint8(_getSlot(pool.addrs.lastPaid, pool.big.unitId).value), false);
//         _setPool(pool, pool.big.unitId);

//         emit Common.GetFinanced(pool);

//         return true;
//     }

//     /**
//      * @dev Payback. For detailed documentation, see _payback
//      * @param unit : Unit contribution
//      */
//     function payback(uint unit) public whenNotPaused returns(bool) {
//         emit Common.Payback(
//             _payback(unit, _msgSender(), false, address(0))
//         );

//         return true;
//     }

//     /**
//         @dev Liquidates a borrower if they have defaulted in repaying their loan.
//         - If the current beneficiary defaults, they're liquidated.
//         - Their collateral balances is forwarded to the liquidator. Liquidator also takes the full 
//             responsibilities of the providers if any.
//         - Liquidator must not be a participant in pool at `unitId. We use this 
//             to avoid fatal error in storage.
//         @param unit : Unit contribution.
//     */
//     function liquidate(uint256 unit) public whenNotPaused returns(bool) {
//         (Common.Contributor memory _defaulter, bool isDefaulted, Common.Slot memory slot) = _enquireLiquidation(unit);
//         require(isDefaulted, '17');
//         address liquidator = _msgSender() ;
//         _checkStatus(liquidator, unit, false);
//         _replaceContributor(liquidator, _getPool(unit).big.unitId, slot, _defaulter.id);
//         assert(liquidator != _defaulter.id);
//         _setLastPaid(liquidator, unit); 
//         emit Common.Payback(
//             _payback(unit, liquidator, true, _defaulter.id)
//         );
//         return true;
//     }

//     /**
//         @dev Cancels a pool. Only pool with one contributor can be close.
//         @param unit : Unit contribution.
//         @notice : Only the creator of a pool can close it provided the number of contributors does not exceed one.
//     */
//     function closePool(uint256 unit) public whenNotPaused _requireUnitIsActive(unit) returns(bool){
//         Common.Pool memory pool = _getPool(unit);
//         address creator = _msgSender();
//         require(creator == pool.addrs.admin, '18');
//         bool isPermissionLess = pool.router == Common.Router.PERMISSIONLESS;
//         isPermissionLess? require(pool.low.userCount == 1, '19') : require(pool.big.currentPool == pool.big.unit, '19');
//         // _updateAnalytics(4, pool.big.unit, 0, isPermissionLess);
//         _awardPoint(creator, 0, 5, true);
//         pool.stage = Common.Stage.CANCELED;
//         _shufflePool(pool); 
//         ISafe(pool.addrs.safe).cancel(creator, _getVariables().baseAsset, pool.big.unit, pool.big.recordId);

//         emit Common.Cancellation(unit);
//         return true;
//     }
   
//     /**
//      * @dev Fetch current pool
//      * @param unit : Unit contribution
//      */
//     function getPool(uint unit) external view returns(Common.Pool memory) {
//        return _getPool(unit);
//     }

//     /**@dev Return contract data. At any point in time, currentEpoches will always equal pastEpoches*/
//     function getFactoryData() public view returns(Common.ViewFactoryData memory data) {
//         // data.analytics = _getAnalytics();
//         data.makerRate = uint16(_getVariables().makerRate);
//         data.pastPools = getRecords();
//         (uint96 currentEpoches, uint96 pastEpoches) = _getCounters();
//         data.currentEpoches = currentEpoches;
//         data.recordEpoches = pastEpoches;
//         Common.ReadPoolDataReturnValue[] memory rdrs = new Common.ReadPoolDataReturnValue[](currentEpoches);
//         for(uint96 i = 0; i < currentEpoches; i++){
//             rdrs[i] = _getPoolData(_getPoolWithUnitId(i + 1)); 
//         }
//         data.currentPools = rdrs;
//         return data;
//     }

// }
