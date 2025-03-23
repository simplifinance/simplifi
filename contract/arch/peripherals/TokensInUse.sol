// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IERC20 } from "../apis/IERC20.sol";
import { OnlyOwner } from "../abstracts/OnlyOwner.sol";
import { IOwnerShip } from "../apis/IOwnerShip.sol"; 
import { Pools, Common } from "./Pools.sol";

abstract contract TokensInUse is Pools {
    // Collateral token i.e SFToken
    IERC20 public collateralToken;

    // List of supported assets
    IERC20[] private baseAssets;
    
    /**
     * @dev Mapping assets address to ids i.e Assets must be IERC20 compatible contract account
     * and must be supported
     */
    mapping(IERC20 => Common.BaseAsset) private assets;

    /**
     * @dev Asset must be supported before they can be used.
     */
    modifier onlySupportedAsset(IERC20 _asset) {
        if(!assets[_asset].isSupported) revert UnSupportedAsset(address(_asset));
        _;
    }

    /**
     * @dev Initialize state variables
     * @param _asset : Initial supported asset
    */
    constructor(
        IERC20 _asset,
        IOwnerShip _ownershipMgr,
        IERC20 _collateralToken,
        uint16 _makerRate,
        address _feeTo
    ) 
        Pools(_ownershipMgr, _makerRate, _feeTo)
    {
        if(address(_collateralToken) == address(0) || address(_asset) == address(0)) revert TokenIsAddressZero();
        if(address(_ownershipMgr) == address(0)) revert OwnershipManagerIsZeroAddress();
        _setCollateralToken(_collateralToken);
        _supportAsset(_asset);
    }

    function _setCollateralToken(IERC20 newToken) internal {
        if(address(newToken) == address(0)) revert InvalidTokenAddress();
        if(newToken == collateralToken) revert TokenAddressIsTheSame();
        collateralToken = newToken;
    }

    // /**
    //  * @dev Update collateralToken
    //  * @param newToken : new token address
    //  */
    // function _updateCollateralToken(IERC20 newToken) internal virtual {
       
    //     collateralToken = newToken;
    // }

    // // Return collateralToken in storage
    // function _getCollateralToken() internal view returns(IERC20 _token) {
    //     _token = collateralToken;
    // }

    /**
     * @dev Support a new asset
     * Note: OnlyOwner action
     * @param _asset : Asset to add to list of supported asset
     */
    function supportAsset(IERC20 _asset) public onlyOwner{
        _supportAsset(_asset); 
    }

    /**
     * @dev Supports new asset
     * @param _asset : New asset to support
    */
    function _supportAsset(IERC20 _asset) private {
        IERC20[] memory _baseAssets = baseAssets;
        uint size = _baseAssets.length;
        Common.BaseAsset memory asset;
        if(size > 0) {
            for(uint i = 0; i < size; i++){
                IERC20 item = _baseAssets[i];
                if(item == _asset){
                    if(!asset.isSupported){
                        asset.isSupported = true;
                        if(asset.assetId != i) asset.assetId = i;
                    } else revert AssetIsSupported();
                } else {
                    asset = Common.BaseAsset(true, size);
                    baseAssets.push(_asset);
                }
            }
        } else {
            asset = Common.BaseAsset(true, size);
            baseAssets.push(_asset);
        }
        assets[_asset] = asset;
    }

    /**
     * @dev Removes an asset from the list of supported asset
     * Note: Only-owner action
     * @param _asset : Asset to remove
     */
    function unsupportAsset(
        IERC20 _asset
    ) 
        public 
        onlyOwner
    {
        Common.BaseAsset memory asset = assets[_asset];
        IERC20[] memory _baseAssets = baseAssets;
        if(!asset.isSupported) revert AssetIsNotListed();
        assets[_asset].isSupported = false;
        for(uint i = 0; i < _baseAssets.length; i++){
            if(_baseAssets[i] == _asset){
                baseAssets[i] = IERC20(address(0));
            }
        }
    }

    /**
     * @dev Check if asset is supported or not
     * @param _asset : Target asset
     */
    function _isAssetSupported(address _asset) internal view returns(bool isSupported) {
        isSupported = assets[IERC20(_asset)].isSupported;
    }

    // /**
    //  * @dev Check if an asset is supported 
    //  */
    // function isSupportedAsset(address _asset) external override view returns(bool) {
    //     return _isAssetSupported(_asset);
    // }

    /**
     * @dev Returns a list of supported assets
     */
    function getSupportedAssets() public view returns(IERC20[] memory _assets) {
        _assets = baseAssets;
        return _assets;
    }

    /**
     * @dev Check for approval, ensure it corresponds to the expected value and transfer to the beneficiary
     * @param asset : Base asset used for contribution
     * @param unit : Unit contribution
     * @param owner : Owner of base token
     * @param spender : Spender of base token
     * @param beneficiary : Account to receive the allowance to.
     */
    function _checkAndWithdrawToken(
        IERC20 asset, 
        uint256 unit, 
        address owner, 
        address spender,
        address beneficiary
    ) internal {
        uint256 allowance = IERC20(asset).allowance(owner, spender);
        if(allowance < unit) revert InsufficientAllowance();
        if(!IERC20(asset).transferFrom(owner, beneficiary, unit)) revert TransferFromFailed();
    }

    // Update collateral asset if need be
    function setCollateralToken(IERC20 newToken) public onlyOwner {
        _setCollateralToken(newToken);
    } 

}