import { GetFinanceParam, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getFinanceAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";

export default async function getFinance(args: GetFinanceParam ) {
  const { unit, daysOfUseInHr, config, callback, account, value } = args;
  const address = getContractData(config.state.chainId).factory;
  let returnValue : TrxResult = 'success'; 
  await simulateContract(config, {
    address,
    account,
    abi: getFinanceAbi,
    functionName: "getFinance",
    args: [unit, daysOfUseInHr],
    value
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
    callback?.({message: "Creating get-Finance request..."});
        returnValue = await waitForConfirmation({config, hash, callback: callback!});
      }).catch((error: any) => {
        returnValue = 'reverted';
        callback?.({message: errorMessage(error)});
      });
  
    return returnValue;
}

