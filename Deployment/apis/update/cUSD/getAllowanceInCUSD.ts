import { GetAllowanceParam, } from "@/interfaces";
import { readContract } from "wagmi/actions";
import { allowanceCUSDAbi } from "@/apis/utils/abis";
import { getBaseContract } from "./approveToSpendCUSD";

/**
 * @dev Get the spending limit of spender from the owner's account 
 * @param args : Argument of type ApproveParam See interfaces.ts
*/
export default async function getAllowanceInCUSD(args: GetAllowanceParam) {
  const { owner, spender, account, config, callback } = args;
  let allowance = 0n;
  const address = getBaseContract(config.state.chainId);
  // console.log("basecontract adress: ", address);
  // callback?.({message: 'Check existing spending limit'});
  await readContract(config, {
    address,
    abi: allowanceCUSDAbi,
    functionName: "allowance",
    account,
    args: [owner, spender]
  }).then((result) => {
    allowance = result;
    // callback?.({message: `${result >= requestedAmount? 'Previous spending limit detected' : 'No allowance detected'}`});
  })
  .catch((error: any) => callback?.({errorMessage: error?.message || error?.data?.message || error}));

  return { allowance, address };
}

// /**
//  * @dev Return allowance of owner given to the spender if any
//  * @param owner : Owner account
//  * @param spender : Address to receive the loan
//  * @returns Transaction receipt
//  */
// export default async function getAllowanceInCUSD(owner: Address, spender: Address) {
//   const contractAddress = celoAddresses['44787'];
//   let allowance : bigint = 0n;
//   let errored : boolean = false;
//   try {
//     allowance = await configureCeloPublicClient().readContract({
//       address: contractAddress,
//       abi: StableTokenABI.abi,
//       functionName: "allowance",
//       args: [owner, spender],
//     }) as bigint;
//   } catch (error: any) {
//     errored = true;
//     const errorMessage = error?.message || error?.data?.message || error;
//     console.log("Error: ", errorMessage);
//   }

//   return { allowance, errored };
// }