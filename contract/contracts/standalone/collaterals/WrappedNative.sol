// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { ERC20, Context } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "../../interfaces/IERC20.sol";
import { OnlyRoleBase, MsgSender } from "../../peripherals/OnlyRoleBase.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title WrappedNative is a supported collateral asset on the connected network e.g. Celo or XFI can be used
 * used as collateral in Flexpool.
 * @author 
 * @notice Wrapped token denominated in native coin. Contributors can get finance by depositing a native or corresponding
 * stablecoin as cover for the asset they're borrowing. To have more granular control over the deposited
 * XFI coin, we provide a wrapped version of the native coin. 
 */
contract WrappedNative is ERC20, OnlyRoleBase, ReentrancyGuard {
    address public immutable deployer;
    constructor(address _roleManager, string memory _name, string memory _symbol) ERC20(_name, _symbol) OnlyRoleBase(_roleManager) {
        deployer = _msgSender();
    }

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

    ///@dev Transfer is disbled indefinitely
    function transfer(address to, uint256 value) public override returns (bool) {
        if(to != address(0)) to = address(0);
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    /**
     * @dev Override the transferFrom function so users get their XFI deposit when they withdraw
     * @param from : Owner account where approval was given
     * @param to : Account to withdraw to
     * @param value : Amount to withdraw
     * @notice If 'from' does not have a role with the roleManger, its an indication that the call 
     * is coming from a user hence withdrawal action, otherwise, its from the Flexpool factory or the Safe contract.
     * Caution:
     *          An account with a role permission should not participate in a Flexpool except for the deployer
     */
    function transferFrom(address from, address to, uint256 value) public override nonReentrant returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _burn(from, value);
        if(!_hasRole(spender) || spender == deployer) {
            payable(to).transfer(value); 
        }
        return true;
    }

    function _msgSender() internal view override(Context, MsgSender) returns(address sender) {
        sender = msg.sender;
    } 

}