// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { ERC20Abstract } from "./ERC20Abstract.sol";

/*
    @title QToken is the native token of the Simplifinance platform.
            It is a utility token that gives its holders access to Simplifinance
            products.
        Standard: Customized and ERC20 compatible.
        Type: Deflationary.
        Max Supply: 1_000_000_000.
        Decimal: 18.
*/
contract SimpliToken is ERC20Abstract {
    event Locked(address from, uint256 amount);
    event UnLocked(address from, uint256 amount);

    constructor( 
        address attorney_,
        address reserve_,
        address initTokenReceiver,
        address _ownershipMgr
    ) ERC20Abstract(attorney_, reserve_, initTokenReceiver, _ownershipMgr) { }

    ///@dev Contract accepts no platform coin
    receive() external payable {
        revert("NA");
    }

    ///@dev See IERC20.sol {lockToken}
    function lockToken(address _routeTo, uint256 amount) public toggleFunc(Internal.LOCK) returns (bool) {
        _lock(_msgSender(), _routeTo, amount);

        emit Locked(_msgSender(), amount);
        return true;
    }

    ///@dev See IERC20.sol {unlock}
    function unlockToken(uint256 amount) public toggleFunc(Internal.UNLOCK) returns (bool) {
        _unlock(_msgSender(), amount);

        emit UnLocked(_msgSender(), amount);
        return true;
    }

    ///@dev Burns token of `amount`
    function burn(uint amount) public {
        _burn(_msgSender(), amount);
    }

    /**
        See IERC20.sol {batchTransfer}
        A dynamic transfer utility. 
        Note: The size of the amount array must match that of the 
        account's. Anothe benefit is that each of the addresses on the 
        list can be mapped to different amount dynamically.
     */
    function batchTransfer(
        uint[] memory amounts,
        address[] memory accounts
    ) public override toggleFunc(Internal.BATCH) returns (bool) {
        uint accountSize = accounts.length;
        require(accountSize == amounts.length, "Unequal list");
        for (uint i = 0; i < accountSize; i++) {
            address to = accounts[i];
            uint amount = amounts[i];
            _transfer(_msgSender(), to, amount);
        }
        return true;
    }

    /**
     * @dev See {ERC20-_beforeTokenTransfer}.
     *
     * Requirements:
     *
     * - the contract must not be paused.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "ERC20Pausable: token transfer while paused");
    }
}
