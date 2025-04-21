import { CommonParam, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getFinanceAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";

/**
 * @dev Send getFinance request
 * @param args : Arguments of type CommonParams. See interfaces.ts
 * @returns : Transaction result
 */
export default async function getFinance(args: CommonParam ) {
  const { unit, config, callback, account } = args;
  const address = getContractData(config.state.chainId).factory;
  let returnValue : TrxResult = 'success'; 
  callback?.({message: "Requesting to getFinance"});
  await simulateContract(config, {
    address,
    account,
    abi: getFinanceAbi,
    functionName: "getFinance",
    args: [unit],
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
        returnValue = await waitForConfirmation({config, hash, callback: callback!, message: "Get finance successful"});
      }).catch((error: any) => {
        returnValue = 'reverted';
        callback?.({errorMessage: errorMessage(error)});
      });
  
    return returnValue;
}

