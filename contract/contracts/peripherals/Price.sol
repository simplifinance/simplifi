// // SPDX-License-Identifier: MIT

// pragma solidity 0.8.24;

// import { IDIAOracleV2 } from "../interfaces/IDIAOracleV2.sol";
// import { IERC20 } from "../interfaces/IERC20.sol";
// import { ErrorLib } from "../libraries/ErrorLib.sol";
// import { ERC20Manager, IERC20, ISupportedAsset, IRoleBase, ISafeFactory } from "./ERC20Manager.sol";

// abstract contract Price is ERC20Manager {
//     using ErrorLib for *;

//     // DIA oracle address
//     address public immutable diaOracleAddress;

//     // Mapping of supported collateral asset to price pair
//     mapping (IERC20 tokenAddress => string) private pairs;

//     // ============= constructor ============
//     constructor(
//         address _diaOracleAddress, 
//         ISupportedAsset _assetManager, 
//         IRoleBase _roleManager,
//         IERC20 _baseAsset,
//         ISafeFactory _safeFactory
//     ) 
//         ERC20Manager(_assetManager, _baseAsset, _roleManager, _safeFactory)
//     {
//         diaOracleAddress = _diaOracleAddress;
//     }

//     /**
//      * @dev Map collateral asset to their corresponding pair for price retrieval
//      * @param collateralAsset : ERC20 compatible asset
//      * @param pair : Price pair e.g cUSD/USDT
//      * @notice Collateral asset must be supported
//     */
//     function setPair(
//         IERC20 collateralAsset, 
//         string memory pair
//     ) 
//         public 
//         onlyRoleBearer
//         onlySupportedAsset(collateralAsset)
//         returns(bool) 
//     {
//         if(bytes(pair).length == 0) 'Invalid pair'._throw();
//         if(address(collateralAsset) == address(0)) 'Asset is zero'._throw();
//         pairs[collateralAsset] = pair;
//         return true;
//     }

//     /**
//      * @dev Get price of collateral token.
//      * @notice For now, if DIAOracle address is empty, its on Celo network otherwise we use a 
//      * dummy price pending when Price Oracle is full implemented on the Celo network
//      */
//     function _getCollateralTokenPrice(IERC20 colAsset) internal view returns (uint128 _price) {
//         string memory pair = pairs[colAsset];
//         if(diaOracleAddress != address(0)) {
//             (uint128 price,) = IDIAOracleV2(diaOracleAddress).getValue(pair); 
//             _price = price;
//         } else {
//             _price = 10000000000000000000;
//         }
//     }
// }






// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED
 * VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/**
 * If you are reading data feeds on L2 networks, you must
 * check the latest answer from the L2 Sequencer Uptime
 * Feed to ensure that the data is accurate in the event
 * of an L2 sequencer outage. See the
 * https://docs.chain.link/data-feeds/l2-sequencer-feeds
 * page for details.
 */

contract DataConsumerV3 {
    AggregatorV3Interface internal dataFeed;

    /**
     * Network: Sepolia
     * Aggregator: BTC/USD
     * Address: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     */
    constructor() {
        dataFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }
}
