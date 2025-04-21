import type { Config, TrxResult } from "@/interfaces";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { faucetAbi } from "@/apis/utils/abis";
import { getContractData } from "@/apis/utils/getContractData";
import { errorMessage } from "../formatError";

/**
 * @dev Users claim test tokens
 * @param args : Arguments of type Configs. See interfaces.ts
 * @returns : Transaction result
 */
export default async function claimTestTokens(args: Config ) {
  const { config, callback, account } = args;
  let returnValue : TrxResult = 'reverted';  
  callback?.({message: `Requesting test tokens`});
  await simulateContract(config, {
    address: getContractData(config.state.chainId).providers,
    account,
    abi: faucetAbi,
    functionName: 'claimTestTokens',
    args: [],
  }).then(async({request}) => {
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!, message: 'Test tokens sent!'});
  }).catch((error: any) => callback?.({errorMessage: errorMessage(error)}));
        
  return returnValue;
}

