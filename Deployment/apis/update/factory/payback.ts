import { CommonParam, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { paybackAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";

/**
 * @dev Payback loan
 * @param args : Arguments of type CommonParams. See interfaces.ts
 * @returns : Transaction result
 */
export default async function payback(args: CommonParam) {
  const { config, callback, account, unit } = args;
  const address = getContractData(config.state.chainId).factory;
  let returnValue : TrxResult = 'reverted'; 
  await simulateContract(config, {
    address,
    account,
    abi: paybackAbi,
    functionName: "payback",
    args: [unit]
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
    callback?.({message: "Paying back loan..."});
    returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
      
  return returnValue;
}

