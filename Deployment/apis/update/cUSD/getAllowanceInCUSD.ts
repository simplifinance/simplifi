import StableTokenABI from "@/apis/utils/cusd.json";
import { celoAddresses } from "@/constants";
import { Address } from "@/interfaces";
import { configureCeloPublicClient } from "./sendCUSD";

/**
 * @dev Return allowance of owner given to the spender if any
 * @param owner : Owner account
 * @param spender : Address to receive the loan
 * @returns Transaction receipt
 */
export default async function getAllowanceInCUSD(owner: Address, spender: Address) {
  const contractAddress = celoAddresses['44787'];
  let allowance : bigint = 0n;
  let errored : boolean = false;
  try {
    allowance = await configureCeloPublicClient().readContract({
      address: contractAddress,
      abi: StableTokenABI.abi,
      functionName: "allowance",
      args: [owner, spender],
    }) as bigint;
  } catch (error: any) {
    errored = true;
    const errorMessage = error?.message || error?.data?.message || error;
    console.log("Error: ", errorMessage);
  }

  return { allowance, errored };
}