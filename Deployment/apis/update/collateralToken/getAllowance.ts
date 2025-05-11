import { GetAllowanceParam, } from "@/interfaces";
import { readContract } from "wagmi/actions";
import { allowanceAbi } from "@/apis/utils/abis";
import assert from "assert";

/**
 * @dev Get the spending limit of spender from the owner's account 
 * @param args : Argument of type ApproveParam See interfaces.ts
*/
export default async function getAllowance(args: GetAllowanceParam) {
  const { owner, spender, account, config, contractAddress } = args;
  assert(contractAddress !== undefined, "Collateral contract not provided");
  return await readContract(config, {
    address: contractAddress,
    abi: allowanceAbi,
    functionName: "allowance",
    account,
    args: [owner, spender]
  });
}
