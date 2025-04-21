import StableTokenABI from "@/apis/utils/cusd.json";
import { celoAddresses, mockReceipt } from "@/constants";
import { Address, TransactionCallback } from "@/interfaces";
import { createWalletClient, TransactionReceipt, custom, } from "viem";
import { celoAlfajores } from "viem/chains";
import { configureCeloPublicClient } from "./sendCUSD";
import getAllowanceInCUSD from "./getAllowanceInCUSD";

/**
 * @dev Withdraw loan denominated in cUSD given as approval from the 'owner'
 * @param owner : Owner account
 * @param callback : Callback function
 * @returns Transaction receipt
 */
export default async function withdrawLoanInCUSD(owner: Address, callback: TransactionCallback) {
  const contractAddress = celoAddresses['44787'];
  let walletClient = createWalletClient({
    transport: custom(window.ethereum),
    chain: celoAlfajores,
  });
  let [currentUser] = await walletClient.getAddresses();
  let receipt : TransactionReceipt = mockReceipt;
  callback({message: "Loan withdrawal request sent"})
  try {
    const { allowance } = await getAllowanceInCUSD(owner, currentUser)
    if(allowance > 0n) {
      const tx = await walletClient.writeContract({
        address: contractAddress,
        abi: StableTokenABI.abi,
        functionName: "transferFrom",
        account: currentUser,
        args: [owner, currentUser, allowance],
      });
      await configureCeloPublicClient().waitForTransactionReceipt({
        hash: tx,
      }).then((result) => {
        receipt = result;
        callback({message: "Loan withdrawal completed"});
      })
    }    
  } catch (error: any) {
    const errorMessage = error?.message || error?.data?.message || error;
    callback({errorMessage});
  }

  return receipt;
}