import type { TrxResult, CommonParam } from "@/interfaces";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { removeLiquidityAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";
import { getContractData } from "@/apis/utils/getContractData";

/**
 * @dev Send remove liqidity request
 * @param args : Arguments of type CommonParam. See interfaces.ts
 * @returns : Transaction result
*/
export default async function removeLiquidity(args: CommonParam) {
  const { config, callback, account, } = args;
  let returnValue : TrxResult = 'reverted';  
  await simulateContract(config, {
    address: getContractData(config.state.chainId).providers,
    account,
    abi: removeLiquidityAbi,
    functionName: 'removeLiquidity',
    args: [],
  }).then(async({request}) => {
    callback?.({message: `Removing liquidity`});
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
        
  return returnValue;
}

