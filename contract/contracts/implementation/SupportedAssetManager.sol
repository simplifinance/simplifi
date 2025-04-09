// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { OnlyRoleBase, IRoleBase } from "../peripherals/OnlyRoleBase.sol";
import { ISupportedAsset } from "../apis/ISupportedAsset.sol"; 
import { ErrorLib } from "../libraries/ErrorLib.sol";

contract SupportedAssetManager is ISupportedAsset, OnlyRoleBase {
  using ErrorLib for *;

  // Supported assets
  address[] private assets;

  /**
   * @dev Mapping assets address to bool i.e Assets must be contract account
   * and must be supported
   */
  mapping(address => bool) private supportedAssets;

  mapping(address => bool) public listed;

  /**
   * @dev Asset must be supported before they can be used.
   */
  modifier onlySupportedAsset(address _asset) {
    if(!supportedAssets[_asset]) 'Unsupported asset'._throw();
    _;
  }

  /**
   * @dev Initialize state variables
   * @param _asset : Initial supported asset
   */
  constructor(
    address _asset,
    IRoleBase _roleManager
  ) 
    OnlyRoleBase(_roleManager) 
  {
    if(_asset == address(0)) 'Default asset is empty'._throw();
    _supportAsset(_asset);
  }

  /**
   * @dev Support a new asset
   * Note: OnlyRoleBase action
   * @param _asset : Asset to add to list of supported asset
   */
  function supportAsset(
    address _asset
  ) 
    public 
    onlyRoleBearer
  {
    _supportAsset(_asset); 
  }

  function _supportAsset(address _asset) private {
    
    if(!listed[_asset]){
      listed[_asset] = true;
      assets.push(_asset);
    }
    if(!_isAssetSupported(_asset)){
      supportedAssets[_asset] = true;
    }
  }

  /**
   * @dev Unsupports an asset
   * Note: Only-owner action
   * @param newAsset : Removes an asset from the list of supported asset
   */
  function unsupportAsset(
    address newAsset
  ) 
    public 
    onlyRoleBearer
  {
    supportedAssets[newAsset] = false;
  }

  function _isAssetSupported(address _asset) internal view returns(bool) {
    return supportedAssets[_asset];
  }

  /**
   * @dev Check if an asset is supported
   */
  function isSupportedAsset(address _asset) external view returns(bool) {
    return _isAssetSupported(_asset);
  }

  /**
   * @dev Returns a list of supported assets
   */
  function getSupportedAssets() public view returns(address[] memory _assets) {
    _assets = assets;
    return _assets;
  }

  /// @dev Returns the default supported asset
  function getDefaultSupportedCollateralAsset() external view returns(address _default) {
    _default = assets[0];
    assert(_default != address(0));
    return _default;
  }

}