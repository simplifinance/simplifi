// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SupportedAssetManager, IRoleBase } from "../../peripherals/SupportedAssetManager.sol";
import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract CeloSupportedAssetManager is SupportedAssetManager {
  /**
   * @notice Each asset pair on chainlink maintains a price oracle contract address
   */
  mapping(address => PriceData) private data;

  /**
   * 
   * @param collateralAssets : Supported assets
   * @param _roleManager : Role manager contract
   * @param oracleData : Celo oracle data: optional 
   * @notice Ensure the length of collateralAssets matches that of celoOracleData.
  */
  constructor(
    address[] memory collateralAssets,
    IRoleBase _roleManager,
    PriceData[] memory oracleData
  )
    SupportedAssetManager(collateralAssets, _roleManager) 
  {
    require(collateralAssets.length == oracleData.length, "Oracle keys & values mismatch");
    for(uint i = 0; i < collateralAssets.length; i++) {
      address asset = collateralAssets[i];
      data[asset] = oracleData[i];
      // if(i == 1) {
      //   // _updatePriceFeed(asset);
      // }
    }
  }

  /**
  * @dev A function that retreives the price and the corresponding timestamp
  * from the price oracle and save it in the state
  * @param asset : Asset
  * @param _data : Mutable oracle data.
  */ 
  function _getPriceInfo(address asset, PriceData memory _data) internal returns(uint128 price) {
    assert(asset != address(0));
    (,int256 answer,,uint256 timestampOflatestPrice,) = AggregatorV3Interface(_data.oracleAddress).latestRoundData();
    _data.latestPrice = uint128(uint(answer));
    _data.timestampOflatestPrice = uint128(uint(timestampOflatestPrice));
    data[asset] = _data;
    price = _data.latestPrice;
  }

  /**
  * @dev A function that checks if the timestamp of the saved price
  * is older than maxTimePassed.
  * @param timestampOflatestPrice: The time price was last updated. 
  * @return inTime - A bool that will be true if the price was updated
  * at most maxTimePassed seconds ago, otherwise false.
  */ 
  function _checkPriceAge(uint128 timestampOflatestPrice) internal view returns (bool inTime){
    inTime = (block.timestamp - timestampOflatestPrice) < maxTimePassed;
  } 

  /**
   * @dev Get price data into external contracts
   * @param asset : Asset for which to fetch price. 
   */
  function getPriceQuote(address asset) external view returns(uint128 price, bool inTime, uint8) {
    PriceData memory _data = data[asset];
    (price, inTime) = (_data.latestPrice, _checkPriceAge(uint128(_data.timestampOflatestPrice)));
    return (price, inTime, _data.decimals);
  }

  /**
   * @dev Get price data into external contracts
   * @param asset : Asset for which to fetch price.
   */
  function _updatePriceFeed(address asset) internal returns(uint128 price) {
    price = _getPriceInfo(asset, data[asset]);
  }

  /**
   * @dev Get price data into external contracts
   * @param asset : Asset for which to fetch price.
   * @notice Only permitted account can update the price feed
   */
  function updatePriceFeed(address asset) external onlyRoleBearer {
    _updatePriceFeed(asset);
  }

}