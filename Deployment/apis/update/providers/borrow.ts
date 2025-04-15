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
  await simulateContract(config, {
    address: getContractData(config.state.chainId).providers,
    account,
    abi: borrowAbi,
    functionName: 'borrow',
    args: [providersSlots, unit],
  }).then(async({request}) => {
    callback?.({message: `Creating finance requests with providers`});
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
        
  return returnValue;
}

