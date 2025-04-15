import { ApproveParam, } from "@/interfaces";
import { writeContract, simulateContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { errorMessage } from "../formatError";
import { approveAbi } from "@/apis/utils/abis";
import getAllowance from "./getAllowance";
import { getContractData } from "@/apis/utils/getContractData";

/**
 * @dev Approve to spend some token from the owner's account
 * @param args : Argument of type ApproveParam See interfaces.ts
 */
export default async function approve(args: ApproveParam) {
  const { callback, config, account, amountToApprove, contractAddress } = args;
  const { factory } = getContractData(config.state.chainId);
  await getAllowance({
    owner: account,
    account,
    spender: factory,
    config
  }).then(async(allowance) => {
    if(amountToApprove > allowance) {
      await simulateContract(config, {
        address: contractAddress!,
        account,
        abi: approveAbi,
        functionName: "approve", 
        args: [factory, amountToApprove]
      })
      .then(async({request}) => {
        callback?.({message: "Approving spending limit"});
        const hash = await writeContract(config, request );
        await waitForConfirmation({config, hash, callback: callback!});
      }).catch((error: any) => callback?.({message: errorMessage(error)}));       
    }
  }).catch((error: any) => callback?.({message: errorMessage(error)})); 
}
