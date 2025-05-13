// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { SupportedAssetManager, IRoleBase } from "../../peripherals/SupportedAssetManager.sol";

contract HardhatSupportedAssetManager is SupportedAssetManager {

  /**
   * @notice Each asset pair on chainlink maintains a price oracle contract address
  */
  mapping(address => PriceData) private data;

  /**
   * 
   * @param _assets : Supported assets
   * @param _roleManager : Role manager contract
   * @notice Ensure the length of _assets including the key-value pair matches that of oracleData.
  */
  constructor(
    address[] memory _assets, 
    IRoleBase _roleManager
  )
    SupportedAssetManager(_assets, _roleManager) 
  {
    for(uint i = 0; i < _assets.length; i++) {
      address asset = _assets[i];
      _updatePriceFeed(asset);
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
    (uint128 latestPrice, uint128 timestampOflatestPrice) = (uint128(1e16), uint128(block.timestamp));
    _data.latestPrice = latestPrice;
    _data.timestampOflatestPrice = timestampOflatestPrice;
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
    return (price, inTime, 18); 
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