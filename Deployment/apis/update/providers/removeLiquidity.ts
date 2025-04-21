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
  let returnValue : TrxResult = 'success';  
  callback?.({message: `Requesting to remove liquidity`});
  await simulateContract(config, {
    address: getContractData(config.state.chainId).providers,
    account,
    abi: removeLiquidityAbi,
    functionName: 'removeLiquidity',
    args: [],
  }).then(async({request}) => {
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!, message: "Liquidity successfully removed!"});
  }).catch((error: any) => {
    returnValue = 'reverted';
    callback?.({errorMessage: errorMessage(error)});
  });
        
  return returnValue;
}

