import StableTokenABI from "@/apis/utils/cusd.json";
import { celoAddresses, mockReceipt } from "@/constants";
import { Address, TransactionCallback } from "@/interfaces";
import { createWalletClient, TransactionReceipt, custom, } from "viem";
import { celoAlfajores } from "viem/chains";
import { configureCeloPublicClient } from "./sendCUSD";

/**
 * @dev Withdraw loan denominated in cUSD given as approval from the 'owner'
 * @param owner : Owner account
 * @param recipient : Address to receive the loan
 * @param amount : Amount to send
 * @returns Transaction receipt
 */
export default async function withdrawLoanInCUSD(owner: Address, callback: TransactionCallback) {
  const contractAddress = celoAddresses['44787'];
  let walletClient = createWalletClient({
    transport: custom(window.ethereum),
    chain: celoAlfajores,
  });
  let [address] = await walletClient.getAddresses();
  let receipt : TransactionReceipt = mockReceipt;
  callback({message: "Withdrawing loan from safe"})
  try {
    const allowance = await configureCeloPublicClient().readContract({
      address: contractAddress,
      abi: StableTokenABI.abi,
      functionName: "allowance",
      account: address,
      args: [owner, address],
    }) as bigint;
    if(allowance < 0n) {
      const tx = await walletClient.writeContract({
        address: contractAddress,
        abi: StableTokenABI.abi,
        functionName: "transferFrom",
        account: address,
        args: [owner, allowance],
      });
      await configureCeloPublicClient().waitForTransactionReceipt({
        hash: tx,
      }).then((result) => {
        receipt = result;
        callback({message: "Withdrawal completed"})
      })
    }    
  } catch (error: any) {
    const errorMessage = error?.message || error?.data?.message || error;
    console.log("Error: ", errorMessage);
  }

  return receipt;
}