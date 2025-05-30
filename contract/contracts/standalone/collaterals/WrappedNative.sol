// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { ERC20, Context } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "../../interfaces/IERC20.sol";
import { Pausable } from "../../peripherals/Pausable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title WrappedNative is a supported collateral asset on the connected network e.g. Celo or XFI can be used
 * used as collateral in Flexpool.
 * @author 
 * @notice Wrapped token denominated in native coin. Contributors can get finance by depositing a native or corresponding
 * stablecoin as cover for the asset they're borrowing. To have more granular control over the deposited
 * XFI coin, we provide a wrapped version of the native coin. 
*/
contract WrappedNative is ERC20, Pausable, ReentrancyGuard {
    mapping(address => uint) public beneficiaries;

    mapping(address => mapping(address => uint)) public deposits;

    constructor(address _roleManager, string memory _name, string memory _symbol) ERC20(_name, _symbol) Pausable(_roleManager) {}

    /**
     * @dev Deposit collateral
     * @param to : Account to receive the deposit
    */
    function deposit(address to) public payable whenNotPaused returns(bool) {
        address sender = _msgSender();
        unchecked {
            deposits[sender][to] += msg.value;
        }
        _mint(sender, msg.value);
        _approve(sender, to, msg.value, false);
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
        _transfer(from, to, value);
        if(_hasRole(spender)){
            uint wBalance = deposits[from][spender];
            require(wBalance >= value && address(this).balance >= value, "Deposit or balance too low");
            unchecked {
                deposits[from][spender] = wBalance - value;
            } 
            (bool s,) = to.call{value: value}('');
            require(s, "Failed");
            
        }
       
        return true;
    }

    function transfer(address to, uint amount) public override returns(bool) {
        _transfer(_msgSender(), to, amount);
        _burn(to, amount);

        return true;
    }

    function _msgSender() internal view override(Context, MsgSender) returns(address sender) {
        sender = msg.sender;
    } 

}