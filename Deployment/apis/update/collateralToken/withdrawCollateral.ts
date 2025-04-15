import { Address, Config, TransferFromParam } from "@/interfaces";
import { writeContract, simulateContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getContractData  } from "../../utils/getContractData";
import getAllowance from "./getAllowance";
import BigNumber from "bignumber.js";
import { formatEther } from "viem";
import { transferFromAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";
import assert from "assert";

/**
 * @dev Withdraw allowance of spender from the safe 
 * @param args : Argument of type TransferFromParam See interfaces.ts
*/
export default async function withdrawCollateral(args: TransferFromParam) {
  const { callback, config, account: spender, safe: owner, contractAddress} = args;
  assert(contractAddress);
  const allowance = await getAllowance({config, account: spender, spender, owner, contractAddress });
  if(new BigNumber(allowance.toString()).gt(0)) {
    await simulateContract(config, {
      address: contractAddress!,
      account: spender,
      abi: transferFromAbi,
      functionName: 'transferFrom', 
      args: [owner, spender, allowance]
    })
    .then(async({request}) => {
      callback?.({message: `Approving and withdrawal $${formatEther(allowance)} loan to wallet...`});
      const hash = await writeContract(config, request );
      await waitForConfirmation({config, hash, callback: callback!});
    }).catch((error: any) => callback?.({message: errorMessage(error)}));
            
  } else {
    callback?.({message: `${allowance} allowance found`});
  }
}
