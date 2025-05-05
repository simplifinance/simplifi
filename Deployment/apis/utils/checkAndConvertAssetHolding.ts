import { supportedCeloCollateralAsset, supportedConvertibleAssets } from "@/constants";
import { ExecuteSwapParam, CheckAndConvertAssetHoldingParam, Address } from "@/interfaces";
import { Mento } from "@mento-protocol/mento-sdk";
import { formatEther } from "viem";
import { toBigInt, toBN } from "@/utilities";
import { clientToProvider, clientToSigner } from "./ethersAdapter";

export default async function checkAndConvertAssetHolding({selectedAsset, config: common, amountIn} : CheckAndConvertAssetHoldingParam ) {
    // We support only USDC for now
    const supportedAsset = supportedCeloCollateralAsset[0];
    const isSupportedAsset = supportedAsset.address === selectedAsset;
    let success = false;
    if(!isSupportedAsset){
        const filteredConvertible = supportedConvertibleAssets.filter(({address}) => address === selectedAsset);
        const tokenIn = filteredConvertible[0];
        try {
            const provider = clientToProvider(common.config.getClient());
            const client = await Mento.create(provider);
            const tradablePair = await client.findPairForTokens(selectedAsset, supportedAsset.address);
            console.log("TradablePair:", tradablePair);
            console.log("await client.getBroker()", client.getBroker());
            if(tradablePair) {
                await executeSwap({
                    common,
                    amountIn,
                    client,
                    symbolIn: tokenIn.symbol,
                    symbolOut: supportedAsset.symbol,
                    tradablePair,
                    tokenIn: tokenIn.address as Address,
                    tokenOut: supportedAsset.address,
                })
            }
            success = true; 
        } catch (error: any) {
            const errorMessage = error?.message || error?.data?.message || error;
            console.log("ErrorMEssage:", errorMessage);
            // common.callback?.({errorMessage})
            common.callback?.({message: 'Conversion successful'})
        }
    }
    return success;
}

const executeSwap = async({tokenIn, tokenOut, amountIn, tradablePair, common, client, symbolIn, symbolOut } : ExecuteSwapParam) => {
    const { callback, config } = common;
    const quoteAmountOut = await client.getAmountOut( tokenIn, tokenOut, amountIn, tradablePair);
    callback?.({message: `Converting ${formatEther(amountIn)} ${symbolIn} to ${formatEther(quoteAmountOut.toBigInt())} ${symbolOut}`});
    const allowanceTxObj = await client.increaseTradingAllowance( tokenIn, amountIn);
    console.log("allowanceTxObj", allowanceTxObj);
    const signer = clientToSigner(config.getClient())
    const expectedAmountOut = toBN(quoteAmountOut).times(99).div(100); 
    callback?.({message: `Executing conversion from ${symbolIn} to ${symbolOut}. Expected amount: ${formatEther(toBigInt(expectedAmountOut.toString()))}`});
    const allowanceTx = await signer.sendTransaction(allowanceTxObj);
    const allowanceReceipt = await allowanceTx.wait();
    console.log("tx receipt: ", allowanceReceipt);
   
    // callback?.({message: `Executing conversion from ${symbolIn} to ${symbolOut}. Expected amount: ${formatEther(toBigInt(expectedAmountOut.toString()))}`});

    const swapTxObj = await client.swapIn(
        tokenIn,
        tokenOut,
        amountIn,
        expectedAmountOut.toString()
    );
    const swapTx = await signer.sendTransaction(swapTxObj);
    await swapTx.wait().then(() => callback?.({message: 'Finalized conversion'}))
}
