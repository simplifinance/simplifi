import { CommonParam, TrxResult } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { liquidateAbi } from "@/apis/abis";
import { errorMessage } from "../formatError";

export default async function liquidate(args: CommonParam) {
  const { config, callback, account, unit } = args;
  const address = getFactoryAddress();
  let returnValue : TrxResult = 'reverted'; 
  await simulateContract(config, {
    address,
    account,
    abi: liquidateAbi,
    functionName: "liquidate",
    args: [unit]
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
    callback?.({message: "Sending liquidation request..."});
    returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
    
  return returnValue;
}

