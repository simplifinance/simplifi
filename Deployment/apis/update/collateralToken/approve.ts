import { ApproveParam, } from "@/interfaces";
import { writeContract, simulateContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { errorMessage } from "../formatError";
import { approveAbi } from "@/apis/utils/abis";
import { getContractData } from "@/apis/utils/getContractData";
import { formatAddr } from "@/utilities";

/**
 * @dev Approve to spend some token from the owner's account
 * @param args : Argument of type ApproveParam See interfaces.ts
 */
export default async function approve(args: ApproveParam) {
  const { callback, config, account, amountToApprove, contractAddress } = args;
  const { factory } = getContractData(config.state.chainId);
  callback?.({message: "Request to approve spend limit"});
  await simulateContract(config, {
    address: formatAddr(contractAddress),
    account,
    abi: approveAbi,
    functionName: "approve", 
    args: [factory, amountToApprove]
  })
  .then(async({request}) => {
    const hash = await writeContract(config, request );
    await waitForConfirmation({config, hash, callback: callback!, message: "Spend limit Approval completed"});
  }).catch((error: any) => callback?.({errorMessage: errorMessage(error)}));  
}
