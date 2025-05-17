// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
 
import { IPyth } from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import { PythStructs } from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import { PythUtils } from "@pythnetwork/pyth-sdk-solidity/PythUtils.sol";
import { Utils } from "../../libraries/Utils.sol";
import { Pool, Common } from "../Pool.sol";

/**
 * @title Price oracle contract that fetches price of a CELO/USD pair as default from the Pyth network. It has a 
 * function to set a new asset pair to fetch price for.
 * @author Written by Bobeu, inspired by the Pyth network
 * @notice Each asset has a priceFeed Id that ae parsed either during construction or using designated function. 
 * For more infor about priceFeed Id, see https://docs.pyth.network/price-feeds/
 */ 
abstract contract CeloPriceGetter is Pool {
    using Utils for *;
    
    IPyth public pyth;

    struct PriceData {
        bytes32 priceFeedId;
        string pair;
        uint8 decimals;
        uint any;
    }

    // Mapping of collateral assets to their corresponding price data
    mapping (address => PriceData) public priceData;
 
    /**
     * @param _priceData Price retrieval info
     */  
    constructor(
        address _roleManager,
        address _stateManager,
        address _oracleAddress,
        address[] memory supportedAssets,
        PriceData[] memory _priceData
    ) Pool(_stateManager, _roleManager) {
        require(_oracleAddress != address(0));
        require(supportedAssets.length == _priceData.length);
        pyth = IPyth(_oracleAddress); 
        for(uint i = 0; i < supportedAssets.length; i++) {
            priceData[supportedAssets[i]] = _priceData[i];
        }
    }
  
    /**
     * @dev Fetch the price of an asset from the Pyth network
     * @param asset : The asset for which to fetch price
     */
    function _getPrice(address asset) internal returns(uint price, uint8 decimals) {
        bytes[] memory priceUpdate;
        pyth.updatePriceFeeds{ value: pyth.getUpdateFee(priceUpdate) }(priceUpdate);
        PriceData memory pd = priceData[asset];
        decimals = pd.decimals;
        PythStructs.Price memory priceStruct = pyth.getPriceNoOlderThan(pd.priceFeedId, 60);
        price = PythUtils.convertToUint(
            priceStruct.price,
            priceStruct.expo,
            18
        );
    }

    /**
     * @dev Sets a new price data
     * @param supportedAsset : Asset to set price for. Should be a supported asset
     * @param pair : Asset pair e.g CELO/USD
     * @param priceFeedId : Price feed Id. Visit the Pyth network for feed Id https://docs.pyth.network/price-feeds/
     * @param priceDecimals : Price offset decimals/zeros
     * @notice Only account with role permissioned is allowed to access this function
    */
    function setAssetData(address supportedAsset, string memory pair, bytes32 priceFeedId, uint8 priceDecimals) public onlyRoleBearer returns(bool) {
        priceData[supportedAsset] = PriceData(priceFeedId, pair, priceDecimals, 0);
        return true;
    }
    
    /**
     * @dev Returns amount of collateral required in a pool.
     * @param unit : EpochId
     * @return collateral Collateral
    */
    function _getCollateralQuote(uint256 unit)
        internal
        returns(uint collateral) 
    { 
        Common.Pool memory pool = _getPool(unit);
        (uint lastPrice, uint8 priceDecimals) = _getPrice(address(pool.addrs.colAsset));
        if(pool.big.unit > 0) {
            unchecked {
                collateral = Common.Price(
                        lastPrice,
                        priceDecimals
                    ).computeCollateral(
                        uint24(pool.low.colCoverage), 
                        pool.big.unit * pool.low.maxQuorum
                    );
            }
        }
    }

    

    /**
     * @dev  Updated state with the quotes so it can later be fetched.
     * @param unit : Unit contribution
     * @notice Only contributors in the pool with unit key can update quotes.
     */
    function updateQuote(uint unit, address colAsset) public returns(bool) {
        (uint lastPrice, uint8 priceDecimals) = _getPrice(colAsset);
        if(unit > 0) {
            unchecked { 
                uint collateral = Common.Price( 
                        lastPrice,
                        priceDecimals
                    ).computeCollateral(
                        uint24(150), 
                        unit * 4
                    );
                priceData[colAsset].any = collateral;
            }
        }
        return true;
    }
}