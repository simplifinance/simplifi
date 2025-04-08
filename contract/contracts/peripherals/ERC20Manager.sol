// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { IERC20 } from "../apis/IERC20.sol";
import { ISupportedAsset } from "../apis/ISupportedAsset.sol";
import { ErrorLib } from "../libraries/ErrorLib.sol";
import { MsgSender } from "./OnlyRoleBase.sol";

abstract contract ERC20Manager is MsgSender {
    using ErrorLib for *;

    // Supportasset manager contract
    ISupportedAsset public immutable assetManager;

    // Base asset contract e.g cUSD
    IERC20 public immutable baseAsset;

    modifier onlySupportedAsset(IERC20 asset) {
        if(!ISupportedAsset(assetManager).isSupportedAsset(address(asset))) 'Unsupported Asset'._throw();
        _;
    }

    // ============= Constructor ================

    constructor(ISupportedAsset _assetManager, IERC20 _baseAsset) {
        if((_assetManager == assetManager)) "_assetManager is zero"._throw();
        if((_baseAsset == baseAsset)) "_baseAsset is zero"._throw();
        assetManager = _assetManager;
    }

    /**
     * @dev Validate allowance given by user against actual value
     * @param asset : ERC20 compatible contract
     * @param owner : Owner account
     * @param value : Value to compare allowance to
     */
    function _validateAllowance(
        IERC20 asset, 
        address owner, 
        uint value
    ) 
        onlySupportedAsset(asset)
        internal 
        view
        returns(uint allowance) 
    {
        assert(address(asset) != address(0));
        assert(owner != address(0));
        allowance = IERC20(asset).allowance(owner, address(this));
        if(allowance < value) 'Value exceed allowance'._throw();
    }

    /**
     * @dev Validate allowance given by user against actual value
     * @param asset : ERC20 compatible contract
     * @param owner : Owner account
     * @param beneficiary : Recipient of the allowance
     * @param value : Value to compare allowance to
    */
    function _checkAndWithdrawAllowance(IERC20 asset, address owner, address beneficiary, uint value) internal returns(uint allowance) {
        allowance = _validateAllowance(asset, owner, value);
        assert(beneficiary != address(0));
        assert(address(asset) != address(0));
        if(allowance > 0){
            if(!IERC20(asset).transferFrom(owner, beneficiary, allowance)) 'TrxFer failed'._throw();
        }
    }

    /**
     * @dev Approve an account to spend from the contract balance
     * @param asset : ERC20 compatible contract
     * @param spender : Recipient of the allowance
     * @param value : Amount to approve
    */
    function _setApprovalFor(IERC20 asset, address spender, uint value) internal {
        assert(spender != address(0));
        assert(address(asset) != address(0));
        if(!IERC20(asset).approve(spender, value)) 'Approval Failed'._throw();
    }

}