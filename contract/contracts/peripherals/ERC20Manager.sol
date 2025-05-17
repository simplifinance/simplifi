// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { IERC20 } from "../interfaces/IERC20.sol";
import { IStateManager } from "../interfaces/IStateManager.sol";
import { Pausable } from "./Pausable.sol";

/**
 * ERROR CODE
 * =========
 * 13 - Not supported
 * 14 - Value exceed allowance
 */
abstract contract ERC20Manager is Pausable {
    // Storage contract
    IStateManager public stateManager;

    modifier onlySupportedAsset(address asset) {
        IStateManager.StateVariables memory state = _getVariables();
        if(asset != address(state.baseAsset)){
            require(state.assetManager.isSupportedAsset(asset), '13');
        }
        _;
    }

    // ============= Constructor ================

    constructor(address _stateManager, address _roleManager) Pausable(_roleManager) {
        require(_stateManager != address(0));
        stateManager = IStateManager(_stateManager);
    }

    /**
     * @dev Validate allowance given by user against actual value
     * @param asset : ERC20 compatible contract
     * @param owner : Owner account
     * @param value : Value to compare allowance to
     */
    function _validateAllowance(
        address asset, 
        address owner, 
        uint value
    ) 
        onlySupportedAsset(asset)
        internal 
        view
        returns(uint allowance) 
    {
        // assert(address(asset) != address(0));
        // assert(owner != address(0));
        allowance = IERC20(asset).allowance(owner, address(this));
        require(allowance >= value,  '14');
    }

    /**
     * @dev Validate allowance given by user against actual value
     * @param asset : ERC20 compatible contract
     * @param owner : Owner account
     * @param beneficiary : Recipient of the allowance
     * @param value : Value to compare allowance to
    */
    function _checkAndWithdrawAllowance(IERC20 asset, address owner, address beneficiary, uint value) internal returns(uint allowance) {
        address _owner = owner == _msgSender()? owner : _msgSender();
        allowance = _validateAllowance(address(asset), _owner, value);
        IERC20(asset).transferFrom(_owner, beneficiary, allowance);
        // assert(address(asset) != address(0) && beneficiary != address(0));
        // if(allowance > 0){
        // }
    }

    /**
     * @dev Approve an account to spend from the contract balance
     * @param asset : ERC20 compatible contract
     * @param spender : Recipient of the allowance
     * @param value : Amount to approve
    */
    function _setApprovalFor(IERC20 asset, address spender, uint value) internal {
        // assert(spender != address(0));
        // assert(address(asset) != address(0));
        uint prevAllowance = IERC20(asset).allowance(address(this), spender);
        unchecked {
            IERC20(asset).approve(spender, value + prevAllowance);
        }
    }

    // Get all state variables internally from the state manager
    function _getVariables() internal view returns(IStateManager.StateVariables memory result) {
        result = stateManager.getStateVariables();
    }

}