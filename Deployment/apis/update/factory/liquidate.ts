import { CommonParam, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { liquidateAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";

/**
 * @dev Send liquidation request
 * @param args : Arguments of type CommonParams. See interfaces.ts
 * @returns : Transaction result
 */
export default async function liquidate(args: CommonParam) {
  const { config, callback, account, unit } = args;
  const address = getContractData(config.state.chainId).factory;
  let returnValue : TrxResult = 'success'; 
  callback?.({message: "Requesting to liquidate"});
  await simulateContract(config, {
    address,
    account,
    abi: liquidateAbi,
    functionName: "liquidate",
    args: [unit]
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
    returnValue = await waitForConfirmation({config, hash, callback: callback!, message: 'Liquidation successful'});
  }).catch((error: any) => {
    returnValue = 'reverted';
    callback?.({errorMessage: error});
  });
    
  return returnValue;
}

