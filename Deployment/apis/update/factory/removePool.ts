import { CommonParam, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { removeLiquidityPoolAbi } from "@/apis/utils/abis";
import { formatEther } from "viem";
import { errorMessage } from "../formatError";

/**
 * @dev Send removePool request
 * @param args : Arguments of type CommonParams. See interfaces.ts
 * @returns : Transaction result
 */
export default async function removePool(args: CommonParam) {
  const { config, callback, account, unit } = args;
  const address = getContractData(config.state.chainId).factory;
  let returnValue : TrxResult = 'reverted'; 
  await simulateContract(config, {
    address,
    account,
    abi: removeLiquidityPoolAbi,
    functionName: "closePool",
    args: [unit]
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
    callback?.({message: `Removing Flexpool at ${formatEther(unit)}`});
    returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
        
  return returnValue;
}

