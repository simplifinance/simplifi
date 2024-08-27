// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../apis/IAsset.sol";

contract Assets is IAsset, Ownable {
  uint public totalSupportedAssets;
  /**
   * @dev Mapping assets address to bool i.e Assets must be contract account
   * and must be supported
   */
  mapping(address => bool) private supportedAssets;

  /**
   * @dev Asset must be supported before they can be used.
   */
  modifier onlySupportedAsset(address _asset) {
    if(!supportedAssets[_asset]) revert UnSupportedAsset(_asset);
    _;
  }

  constructor(address _asset) {
    if(_asset != address(0)) {
      _supportAsset(_asset);
    }
  }

  /**
   * @dev Support a new asset
   * Note: OnlyOwner action
   * @param _asset : Asset to add to list of supported asset
   */
  function supportAsset(address _asset) public onlyOwner {
    if(!_isAssetSupported(_asset)){
      _supportAsset(_asset);
    }
  }

  function _supportAsset(address _asset) private {
    supportedAssets[_asset] = true;
    totalSupportedAssets ++;
  }

  /**
   * @dev Unsupports an asset
   * Note: Only-owner action
   * @param newAsset : Removes an asset from the list of supported asset
   */
  function unsupportAsset(address newAsset) public onlyOwner {
    supportedAssets[newAsset] = false;
    totalSupportedAssets --;
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
  function getSupportedAssets() external view returns(address[] memmory _assets) {
    uint totalAssets = totalSupportedAssets;
    for(uint i = 0; i < totalAssets; i++) {

    }
  }

}