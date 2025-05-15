// // SPDX-License-Identifier: UNLICENSED
// pragma solidity 0.8.24;

// import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
// import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
// import "@pythnetwork/pyth-sdk-solidity/PythUtils.sol";
// import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// // Example oracle AMM powered by Pyth price feeds.
// //
// // The contract holds a pool of two ERC-20 tokens, the BASE and the QUOTE, and allows users to swap tokens
// // for the pair BASE/QUOTE. For example, the base could be WETH and the quote could be USDC, in which case you can
// // buy WETH for USDC and vice versa. The pool offers to swap between the tokens at the current Pyth exchange rate for
// // BASE/QUOTE, which is computed from the BASE/USD price feed and the QUOTE/USD price feed.
// //
// // This contract only implements the swap functionality. It does not implement any pool balancing logic (e.g., skewing the
// // price to reflect an unbalanced pool) or depositing / withdrawing funds. When deployed, the contract needs to be sent
// // some quantity of both the base and quote token in order to function properly (using the ERC20 transfer function to
// // the contract's address).
// contract PriceGetter {
//     // event Transfer(
//     //     address from,
//     //     address to,
//     //     uint256 amountUsd,
//     //     uint256 amountWei
//     // );

//     IPyth public pyth;

//     bytes32 baseTokenPriceId;
//     bytes32 quoteTokenPriceId;

//     // ERC20 public baseToken;
//     // ERC20 public quoteToken;

//     constructor(
//         address _pyth,
//         bytes32 _baseTokenPriceId,
//         bytes32 _quoteTokenPriceId,
//         // address _baseToken,
//         // address _quoteToken
//     ) {
//         pyth = IPyth(_pyth);
//         baseTokenPriceId = _baseTokenPriceId;
//         quoteTokenPriceId = _quoteTokenPriceId;
//         // baseToken = ERC20(_baseToken);
//         // quoteToken = ERC20(_quoteToken);
//     }

//     // Buy or sell a quantity of the base token. `size` represents the quantity of the base token with the same number
//     // of decimals as expected by its ERC-20 implementation. If `isBuy` is true, the contract will send the caller
//     // `size` base tokens; if false, `size` base tokens will be transferred from the caller to the contract. Some
//     // number of quote tokens will be transferred in the opposite direction; the exact number will be determined by
//     // the current pyth price. The transaction will fail if either the pool or the sender does not have enough of the
//     // requisite tokens for these transfers.
//     //
//     // `pythUpdateData` is the binary pyth price update data (retrieved from Pyth's price
//     // service); this data should contain a price update for both the base and quote price feeds.
//     // See the frontend code for an example of how to retrieve this data and pass it to this function.
//     function swap(
//         bool isBuy,
//         uint256 size,
//         bytes[] calldata pythUpdateData
//     ) external payable {
//         uint256 updateFee = pyth.getUpdateFee(pythUpdateData);
//         pyth.updatePriceFeeds{value: updateFee}(pythUpdateData);

//         // Get the prices if they are not older than 60 seconds.
//         PythStructs.Price memory currentBasePrice = pyth.getPriceNoOlderThan(
//             baseTokenPriceId,
//             60
//         );
//         PythStructs.Price memory currentQuotePrice = pyth.getPriceNoOlderThan(
//             quoteTokenPriceId,
//             60
//         );

//         // Note: this code does all arithmetic with 18 decimal points. This approach should be fine for most
//         // price feeds, which typically have ~8 decimals. You can check the exponent on the price feed to ensure
//         // this doesn't lose precision.
//         uint256 basePrice = PythUtils.convertToUint(
//             currentBasePrice.price,
//             currentBasePrice.expo,
//             18
//         );
//         uint256 quotePrice = PythUtils.convertToUint(
//             currentQuotePrice.price,
//             currentQuotePrice.expo,
//             18
//         );

//         // This computation loses precision. The infinite-precision result is between [quoteSize, quoteSize + 1]
//         // We need to round this result in favor of the contract.
//         uint256 quoteSize = (size * basePrice) / quotePrice;

//         // TODO: use confidence interval

//         if (isBuy) {
//             // (Round up)
//             quoteSize += 1;

//             quoteToken.transferFrom(msg.sender, address(this), quoteSize);
//             baseToken.transfer(msg.sender, size);
//         } else {
//             baseToken.transferFrom(msg.sender, address(this), size);
//             quoteToken.transfer(msg.sender, quoteSize);
//         }
//     }

//     // Get the number of base tokens in the pool
//     function baseBalance() public view returns (uint256) {
//         return baseToken.balanceOf(address(this));
//     }

//     // Get the number of quote tokens in the pool
//     function quoteBalance() public view returns (uint256) {
//         return quoteToken.balanceOf(address(this));
//     }

//     // Send all tokens in the oracle AMM pool to the caller of this method.
//     // (This function is for demo purposes only. You wouldn't include this on a real contract.)
//     function withdrawAll() external {
//         baseToken.transfer(msg.sender, baseToken.balanceOf(address(this)));
//         quoteToken.transfer(msg.sender, quoteToken.balanceOf(address(this)));
//     }

//     // Reinitialize the parameters of this contract.
//     // (This function is for demo purposes only. You wouldn't include this on a real contract.)
//     function reinitialize(
//         bytes32 _baseTokenPriceId,
//         bytes32 _quoteTokenPriceId,
//         address _baseToken,
//         address _quoteToken
//     ) external {
//         baseTokenPriceId = _baseTokenPriceId;
//         quoteTokenPriceId = _quoteTokenPriceId;
//         baseToken = ERC20(_baseToken);
//         quoteToken = ERC20(_quoteToken);
//     }

//     receive() external payable {}
// }











pragma solidity ^0.8.0;
 
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import {PythUtils} from "@pythnetwork/pyth-sdk-solidity/PythUtils.sol";
 
contract PriceGetter {
    IPyth public immutable pyth;

    struct PriceData {
        bytes32 priceFeedId;
        string pair;
    }

    // Mapping of collateral assets to their corresponding price data
    mapping (address => PriceData) public priceData;
 
    /**
     * @param pythContract The address of the Pyth contract
     */
    constructor(address pythContract) {
        pyth = IPyth(pythContract);
    }
 
    /**
         * This method is an example of how to interact with the Pyth contract.
         * Fetch the priceUpdate from Hermes and pass it to the Pyth contract to update the prices.
         * Add the priceUpdate argument to any method on your contract that needs to read the Pyth price.
         * See https://docs.pyth.network/price-feeds/fetch-price-updates for more information on how to fetch the priceUpdate.
         */
    function _getPrice(address asset) internal returns(uint price) {
        bytes[] memory priceUpdate;
        uint fee = pyth.getUpdateFee(priceUpdate);
        pyth.updatePriceFeeds{ value: fee }(priceUpdate);
        PriceData memory pd = priceData[asset];
        PythStructs.Price memory priceStruct = pyth.getPriceNoOlderThan(pd.priceFeedId, 60);
        price = PythUtils.convertToUint(
            priceStruct.price,
            priceStruct.expo,
            18
        );
    }
}