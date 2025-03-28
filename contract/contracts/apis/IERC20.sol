// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

pragma solidity 0.8.24;

import "./IERC20Metadata.sol";

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

    // /**
    //  * @dev Same as lockToken except that this function is called by the Factory contract to 
    //  * lock collateral amount to user's wallet
    //  * @param target : Account to lock to token to.
    //  * @param _routeTo : Escape address.
    //  * @param amount : Amount to lock
    //  */
    // function lockSpecial(
    //     address target, 
    //     address _routeTo, 
    //     uint256 amount
    // ) external returns(bool);

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
