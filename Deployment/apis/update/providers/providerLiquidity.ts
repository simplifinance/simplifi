import type { ProvideLiquidityParam, TrxResult, } from "@/interfaces";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { provideLiquidityAbi, } from "@/apis/utils/abis";
import { formatEther } from "viem";
import { errorMessage } from "../formatError";
import { getContractData } from "@/apis/utils/getContractData";

/**
 * @dev Send provide liqidity request
 * @param args : Arguments of type ProvideLiquidityParam. See interfaces.ts
 * @returns : Transaction result
*/
export default async function provideLiquidity(args: ProvideLiquidityParam) {
  const { config, callback, account, unit, rate } = args;
  let returnValue : TrxResult = 'reverted';
  const providerContract = getContractData(config.state.chainId).providers;
  // await approveToSpendCUSD(providerContract, unit, callback);
  callback?.({message: `Requesting to provide liquidity in amount ${formatEther(unit || 0n)} USD`});
  await simulateContract(config, {
    address: providerContract,
    account,
    abi: provideLiquidityAbi,
    functionName: 'provideLiquidity',
    args: [rate]
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!, message: "Successfully provided liquidity"});
  }).catch((error: any) => callback?.({errorMessage: errorMessage(error)}));
        
  return returnValue;
}
