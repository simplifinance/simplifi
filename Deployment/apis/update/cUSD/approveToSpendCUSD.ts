import StableTokenABI from "@/apis/utils/cusd.json";
import { celoAddresses, mockReceipt } from "@/constants";
import { Address, TransactionCallback } from "@/interfaces";
import { TransactionReceipt } from "viem";
import { createWalletClient, custom, } from "viem";
import { celoAlfajores } from "viem/chains";
import { configureCeloPublicClient } from "./sendCUSD";
import getAllowanceInCUSD from "./getAllowanceInCUSD";

/**
 * @dev Get the cUSD contract addreses from the different chains
 * @param chainId : Chain Id of the connected chain i.e Alfajores or Celo mainnet
 * @returns cUSD contract addresses
 */
export const getCUSD = (chainId: number) : Address => {
  return celoAddresses[chainId];
} 

/**
 * @dev Approve spender to spend amount of `amount` of cUSD from the owner's account 
 * @param spender : Spender address
 * @param amount : Amount to approve
 * @param callback : Callback function if any
*/
export default async function approveToSpendCUSD(spender: Address, amount: bigint, callback?: TransactionCallback) {
  const contractAddress = celoAddresses['44787'];
  let walletClient = createWalletClient({
    transport: custom(window.ethereum),
    chain: celoAlfajores,
  });
  let [currentUser] = await walletClient.getAddresses();
  let receipt : TransactionReceipt = mockReceipt;
  callback?.({message: 'Create approval transaction'});
  try {
    const { allowance }= await getAllowanceInCUSD(currentUser, spender);
    if(allowance < amount) {
      const tx = await walletClient.writeContract({
        address: contractAddress,
        abi: StableTokenABI.abi,
        functionName: "approve",
        account: currentUser,
        args: [spender, amount],
      });
      await configureCeloPublicClient().waitForTransactionReceipt({
        hash: tx,
      }).then((receipt) => {
        callback?.({message: 'Approval transaction completed'});
        console.log("receipt", receipt);
      });
    }    
  } catch (error: any) {
    const errorMessage = error?.message || error?.data?.message || error;
    callback?.({errorMessage});
  }

  return receipt;
}

