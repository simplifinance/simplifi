import { CommonParam, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { removeLiquidityPoolAbi } from "@/apis/abis";
import { formatEther } from "viem";
import { errorMessage } from "../formatError";

export default async function removePool(args: CommonParam) {
  const { config, callback, account, unit } = args;
  const address = getContractData(config.state.chainId).factory;
  let returnValue : TrxResult = 'reverted'; 
  await simulateContract(config, {
    address,
    account,
    abi: removeLiquidityPoolAbi,
    functionName: "removeLiquidityPool",
    args: [unit]
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
    callback?.({message: `Removing Flexpool at ${formatEther(unit)}`});
    returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
        
  return returnValue;
}

