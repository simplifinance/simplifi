import type { CommonParam, TrxResult } from "@/interfaces";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { registerToEarnPointAbi } from "@/apis/utils/abis";
import { getContractData } from "@/apis/utils/getContractData";
import { errorMessage } from "../formatError";

/**
 * @dev Users must register in order to earn points 
 * @param args : Arguments of type CommonParams. See interfaces.ts
 * @returns : Transaction result
*/
export default async function registerToEarnPoints(args: CommonParam) {
  const { config, callback, account } = args;
  let returnValue : TrxResult = 'reverted';  
  callback?.({message: `Request to sign to earn reward`});
  await simulateContract(config, {
    address: getContractData(config.state.chainId).points,
    account,
    abi: registerToEarnPointAbi,
    functionName: 'registerToEarnPoints',
    args: [],
  }).then(async({request}) => {
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!, message: 'Sign up successful'});
  }).catch((error: any) => callback?.({errorMessage: errorMessage(error)}));
  
  return returnValue;
}

