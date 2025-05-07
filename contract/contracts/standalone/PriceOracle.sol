// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import { IPriceOracle } from "../interfaces/IPriceOracle.sol";
import { Common } from "../interfaces/Common.sol";
import { OnlyRoleBase, IRoleBase } from "../peripherals/OnlyRoleBase.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

interface IDIAOracleV2{
    function getValue(string memory) external returns (uint128, uint128);
}

/**
* @title A standalone oracle contract.
*/
contract PriceOracle is IPriceOracle, OnlyRoleBase {
    // Chainlink price feed contract on Celo
    AggregatorV3Interface internal priceFeed;


    // Mapping of oracle addresses to networks i.e Celo or CrossFi
    mapping(Common.Network => Oracle) public oracles;

    constructor(
        uint networkSelector,
        IRoleBase _roleManager,
        address _priceFeed
    ) OnlyRoleBase(_roleManager) {
        require(networkSelector < 2, "Invalid network selector");
        if(Common.Network(networkSelector) == Common.Network.CELO){
            require(_priceFeed != address(0), "Price feed contract is undefined");
            priceFeed = _priceFeed;
        }
        oracles[Common.Network.CROSSFI].oracle = 0xa93546947f3015c986695750b8bbEa8e26D65856;
    }

    /**
    * @dev A function that retreives the price and the corresponding timestamp
    * from the DIA oracle and saves them in storage variables on the crossFi Network.
    * @param key - A string specifying the asset.
    */ 
    function _getPriceInfo(string memory key, Common.Network network) internal {
        Oracle memory crossFi = oracles[network];
        (crossFi.latestPrice, crossFi.timestampOflatestPrice) = IDIAOracleV2(crossFi.oracle).getValue(key);
        oracles[network] = crossFi;
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
     * @param key : Asset pair for which to get price
     * @param network : Network key.
     */
    function getPriceQuote(string memory key, Common.Network network) external onlyRoleBearer returns(uint128 price) {
        if(network == Common.Network.CROSSFI){
            Oracle memory crossFi = oracles[network];
            if(!_checkPriceAge(1 minutes, crossFi.timestampOflatestPrice)) {
                _getPriceInfo(key, network);
            }
            price = crossFi.latestPrice;
        } else {
            price = 10000000000000000000;
        }
    }
}