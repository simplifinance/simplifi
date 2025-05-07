// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { ERC20, Context } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "../../interfaces/IERC20.sol";
import { OnlyRoleBase, IRoleBase, MsgSender } from "../../peripherals/OnlyRoleBase.sol";

/**
 * @title WrappedXFI is a supported collateral asset on the CrossFi network.
 * @author 
 * @notice Wrapped token denominated in XFI native coin. Contributors get finance by depositing XFI
 * coin as cover for the stable asset they're borrowing. To have more granular control over the deposited
 * XFI coin, we provide a wrapped version of the XFI coin. 
 */
contract WrappedXFI is ERC20, OnlyRoleBase {
    constructor(IRoleBase _roleManager) ERC20("WrappedXFI Token", "WXFI") OnlyRoleBase(_roleManager) {}

    /**
     * @dev Deposit collateral
     * @param to : Account to receive the deposit 
     */
    function deposit(address to) public payable returns(bool) {
        address sender = _msgSender();
        _mint(sender, msg.value);
        _approve(sender, to, msg.value, false);
        return true;
    }

    ///@dev Override _approval so user cannot accidentally or intentionally approve account to withdraw collateral deposit
    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal override {
        if(!_hasRole(owner)) {
            require(_hasRole(spender), "Approval forbidden");
        } else {
            require(!_hasRole(spender), "Approval forbidden");
        }
        super._approve(owner, spender, value, !emitEvent);
    }

    ///@dev Transfer is disbled indefinitely
    function transfer(address to, uint256 value) public override returns (bool) {
        if(to != address(0)) to = address(0);
        return super.transfer(to, value);
    }

    /**
     * @dev Override the transferFrom function so users get their XFI deposit when they withdraw
     * @param from : Owner account where approval was given
     * @param to : Account to withdraw to
     * @param value : Amount to withdraw
     * @notice If 'from' does not have a role with the roleManger, its an indication that the call 
     * is coming from a user hence withdrawal action, otherwise, its from the Flexpool factory or the Safe contract
     */
    function transferFrom(address from, address to, uint256 value) public override returns (bool done) {
        address spender = _msgSender();
        if(!_hasRole(from)) {
            _spendAllowance(from, spender, value);
            _burn(spender, value);
            (done,) = payable(to).call{value:value}('');
            require(done, "Failed");
        } else {
            done = super.transferFrom(from, to, value);
        }
        return done;
    }

    function _msgSender() internal view override(Context, MsgSender) returns(address sender) {
        sender = msg.sender;
    } 

}