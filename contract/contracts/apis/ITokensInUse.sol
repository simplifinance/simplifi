// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IERC20 } from "./IERC20.sol";

interface ITokensInUse {
  error UnSupportedAsset(address);
  error Locked();
  error InvalidTokenAddress();
  error TokenAddressIsTheSame();
  error TokenIsAddressZero();
  error OwnershipManagerIsZeroAddress();
  error AssetIsNotListed();
  error InsufficientAllowance();
  error TransferFromFailed();
  // error InvalidId();

  struct BaseAsset {
    IERC20 contractAddress;
    bool isSupported;
    uint assetId;
  }
  
  function isSupportedAsset(
    address _asset
  ) 
    external 
    view returns(bool);
  
}