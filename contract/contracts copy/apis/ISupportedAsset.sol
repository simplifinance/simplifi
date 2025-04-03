// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

interface ISupportedAsset {
  error UnSupportedAsset(address);
  error Locked();
  
  function isSupportedAsset(
    address _asset
  ) 
    external 
    view returns(bool);
}