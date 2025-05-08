// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { OnlyRoleBase, IRoleBase } from "../peripherals/OnlyRoleBase.sol";
import { ISupportedAsset } from "../interfaces/ISupportedAsset.sol"; 
import { IERC20 } from "../interfaces/IERC20.sol"; 
import { ErrorLib } from "../libraries/ErrorLib.sol";
import { IPriceOracle } from "../interfaces/IPriceOracle.sol";
import { IDIAOracleV2 } from "../interfaces/IDIAOracleV2.sol";
import { Common } from "../interfaces/Common.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract SupportedAssetManager is ISupportedAsset, OnlyRoleBase {
  using ErrorLib for *;

  struct PriceData {
    string pair;
    address oracleAddress;
    uint256 latestPrice;
    uint256 timestampOflatestPrice;
  }

  struct SupportedAsset {
    address id;
    string name;
    string symbol;
  }

  address public immutable diaOracleAddress;

  PriceData private crossFiPriceData;

  mapping(address => PriceData) public celoPriceData;

  // Supported assets
  SupportedAsset[] private assets;

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
   * 
   * @param _assets : Supported assets
   * @param _roleManager : Role manager contract
   * @param networkSelector : Network selector i.e 0 or 1 or 2
   * @param oracleData : Celo oracle data: optional
   * @notice Ensure the length of _assets matches that of celoOracleData.
  */
  constructor(
    address[] memory _assets,
    IRoleBase _roleManager,
    uint networkSelector,
    PriceData[] memory oracleData
  )
    OnlyRoleBase(_roleManager) 
  {
    require(_assets.length == oracleData.length, "Oracle keys & values mismatch");
    for(uint i = 0; i < _assets.length; i++) {
      if(_assets[i] != address(0)) _supportAsset(_assets[i]);
    }
    if(networkSelector >= 3) "Invalid network selector"._throw();
    if(Common.Network(networkSelector) == Common.Network.CROSSFI){
      crossFiPriceData.oracleAddress = oracleData[0].oracleAddress;
      crossFiPriceData.pair = oracleData[0].pair;
    } else {
      for(uint8 i = 0; i < oracleData.length; i++) {
        celoPriceData[_assets[i]] = oracleData[i];
      }
    }
  }

  /**
   * @dev Support a new asset
   * Note: OnlyRoleBase action
   * @param _asset : Asset to add to list of supported asset
   */
  function supportAsset(address _asset) 
    public 
    onlyRoleBearer
  {
    _supportAsset(_asset); 
  }

  function _supportAsset(address _asset) private {
    if(!listed[_asset]){
      listed[_asset] = true;
      assets.push(SupportedAsset(
        _asset, 
        IERC20(_asset).name(), 
        IERC20(_asset).symbol()
      ));
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
  function getSupportedAssets() public view returns(SupportedAsset[] memory _assets) {
    _assets = assets;
    return _assets;
  }

  /**
  * @dev A function that retreives the price and the corresponding timestamp
  * from the DIA oracle and saves them in storage variables on the crossFi Network.
  * @param network : Network key.
  * @param data : Mutable oracle data.
  */ 
  function _getPriceInfo(Common.Network network, address asset, PriceData memory data) internal returns(uint price) {
    if(network == Common.Network.CROSSFI) {
      (data.latestPrice, data.timestampOflatestPrice) = IDIAOracleV2(diaOracleAddress).getValue(data.pair);
      crossFiPriceData = data;
    } else {
      assert(asset != address(0));
      (,int256 answer,,uint256 timestampOflatestPrice,) = AggregatorV3Interface(data.oracleAddress).latestRoundData();
      data.latestPrice = uint(answer);
      data.timestampOflatestPrice = timestampOflatestPrice;
      celoPriceData[asset] = data;
    }
    price = data.latestPrice;
  }

  /**
  * @dev A function that checks if the timestamp of the saved price
  * is older than maxTimePassed.
  * @param maxTimePassed - The max acceptable amount of time passed since the
  * oracle price was last updated.
  * @param timestampOflatestPrice: The time price was last updated. 
  * @return inTime - A bool that will be true if the price was updated
  * at most maxTimePassed seconds ago, otherwise false.
  */ 
  function _checkPriceAge(uint128 maxTimePassed, uint128 timestampOflatestPrice) internal view returns (bool inTime){
      if((block.timestamp - timestampOflatestPrice) < maxTimePassed){
          inTime = true;
      } else {
          inTime = false;
      }
  } 

  /**
   * @dev Get price data into external contracts
   * @param network : Network key. 
   * @param asset : Asset to get price for. If request is on CrossFi network, asset can be zero since we're only dealing with 
   * XFI coin as collateral on the CrossFi network.
   */
  function getPriceQuote(Common.Network network, address asset) external onlyRoleBearer returns(uint price) {
    if(network != Common.Network.HARDHAT){
      PriceData memory data;
      if(network == Common.Network.CROSSFI) data = crossFiPriceData;
      else data = celoPriceData[asset];
      if(_checkPriceAge(1 minutes, uint128(data.timestampOflatestPrice))) {
        price = _getPriceInfo(network, asset, data);
      } else {
        price = data.latestPrice;
      }
    } else {
      price = 1e16;
    }
    return price;
  }

  /**
   * @dev Get price data without updating the storage
   * @param asset : Asset contract address. Only on CrossFi network
   * @param network : Connected Network
   */
  function getPriceWithoutUpdating(address asset, Common.Network network) external view returns(uint128 price) {
    if(network == Common.Network.CROSSFI){
      price = uint128(crossFiPriceData.latestPrice);
    } else if(network == Common.Network.CELO) {
      assert(asset != address(0));
      price = uint128(celoPriceData[asset].latestPrice);
    } else {
      price = uint128(1e16);
    }
    return price;
  }

  function getDefaultSupportedCollateralAsset() external view returns(address){
    return assets[0].id;
  }

}