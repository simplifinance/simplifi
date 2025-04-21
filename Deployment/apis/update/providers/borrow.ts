import type { BorrowParam, TrxResult } from "@/interfaces";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { borrowAbi } from "@/apis/utils/abis";
import { getContractData } from "@/apis/utils/getContractData";
import { errorMessage } from "../formatError";

/**
 * @dev Send borrow request to the providers contract. Contributors can finance unit contribution
 * through the providers if they can't afford it individualy
 * @param args : Arguments of type BorrowParam. See interfaces.ts
 * @returns : Transaction result
*/
export default async function borrow(args: BorrowParam ) {
  const { config, callback, account, providersSlots, unit  } = args;
  let returnValue : TrxResult = 'reverted';  
  callback?.({message: `Requesting external loan from providers`});
  await simulateContract(config, {
    address: getContractData(config.state.chainId).providers,
    account,
    abi: borrowAbi,
    functionName: 'borrow',
    args: [providersSlots, unit],
  }).then(async({request}) => {
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!, message: 'Succesfully borrowed to contribute'});
  }).catch((error: any) => callback?.({errorMessage: errorMessage(error)}));
        
  return returnValue;
}

