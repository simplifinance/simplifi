// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IERC20 } from "../apis/IERC20.sol";
import { OnlyOwner } from "../abstracts/OnlyOwner.sol";
import { ITokensInUse } from "../apis/ITokensInUse.sol"; 
import { IOwnerShip } from "../apis/IOwnerShip.sol"; 

contract TokensInUse is ITokensInUse, OnlyOwner {
    // Collateral token i.e SFToken
    IERC20 public collateralToken;

    // List of supported assets
    BaseAsset[] private baseAssets;
    
    /**
     * @dev Mapping assets address to ids i.e Assets must be IERC20 compatible contract account
     * and must be supported
     */
    mapping(IERC20 => uint) private assetIds;

    // mapping(address => bool) public listed;

    /**
     * @dev Asset must be supported before they can be used.
     */
    modifier onlySupportedAsset(IERC20 _asset) {
        uint id = assetIds[_asset];
        assert(id >= baseAssets.length);
        if(!baseAssets[id].isSupported) revert UnSupportedAsset(address(_asset));
        _;
    }

    /**
     * @dev Initialize state variables
     * @param _asset : Initial supported asset
     */
    constructor(
        IERC20 _asset,
        IOwnerShip _ownershipMgr,
        IERC20 _collateralToken
    ) 
        OnlyOwner(address(_ownershipMgr)) 
    {
        if(address(_collateralToken) == address(0) || address(_asset) == address(0)) revert TokenIsAddressZero();
        if(address(_ownershipMgr) == address(0)) revert OwnershipManagerIsZeroAddress();
        collateralToken = _collateralToken;
        _supportAsset(address(_asset));
    }

        /**
     * @dev Update collateralToken
     * @param newToken : new token address
     */
    function _updateCollateralToken(IERC20 newToken) internal virtual {
        if(address(newToken) == address(0)) revert InvalidTokenAddress();
        if(newToken == collateralToken) revert TokenAddressIsTheSame();
        collateralToken = newToken;
    }

    // Return collateralToken in storage
    function _getCollateralToken() internal view returns(IERC20 _token) {
        _token = collateralToken;
    }

    /**
     * @dev Support a new asset
     * Note: OnlyOwner action
     * @param _asset : Asset to add to list of supported asset
     */
    function supportAsset(
        address _asset
    ) 
        public 
        onlyOwner
    {
        _supportAsset(_asset); 
    }

    /**
     * @dev Supports new asset
     * @param _asset : New asset to support
     */
    function _supportAsset(address _asset) private {
        uint id = assetIds[IERC20(_asset)];
        BaseAsset memory ba = baseAssets[id];
        if(!ba.isSupported){
            id = baseAssets.length;
            baseAssets.push(BaseAsset(IERC20(_asset), true, id));
        }
    }

    /**
     * @dev Removes an asset from the list of supported asset
     * Note: Only-owner action
     * @param _asset : Asset to remove
     */
    function unsupportAsset(
        address _asset
    ) 
        public 
        onlyOwner
    {
        uint id = assetIds[IERC20(_asset)];
        BaseAsset memory ba = baseAssets[id];
        if(!ba.isSupported) revert AssetIsNotListed();
        baseAssets[id].isSupported = false;
    }

    /**
     * @dev Check if asset is supported or not
     * @param _asset : Target asset
     */
    function _isAssetSupported(address _asset) internal view returns(bool) {
        uint id = assetIds[IERC20(_asset)];
        return baseAssets[id].isSupported;
    }

    /**
     * @dev Check if an asset is supported
     */
    function isSupportedAsset(address _asset) external override view returns(bool) {
        return _isAssetSupported(_asset);
    }

    /**
     * @dev Returns a list of supported assets
     */
    function getSupportedAssets() public view returns(BaseAsset[] memory _assets) {
        _assets = baseAssets;
        return _assets;
    }

    function _checkAndWithdrawToken(
        IERC20 asset, 
        uint256 unit, 
        address owner, 
        address spender,
        address beneficiary
    ) internal {
        uint256 allowance = IERC20(asset).allowance(owner, spender);
        if(allowance < unit) revert InsufficientAllowance();
        IERC20(asset).transferFrom(owner, beneficiary, unit);
    }

}