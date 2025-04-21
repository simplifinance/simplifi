import StableTokenABI from "@/apis/utils/cusd.json";
import { celoAddresses } from "@/constants";
import { Address, TransactionCallback } from "@/interfaces";
import { createPublicClient, createWalletClient, custom, parseEther, http } from "viem";
import { celoAlfajores } from "viem/chains";

/**
 * @dev COnfigure a public client for reading data from the blockchain
 * @param chainId : Chain Id of the connected chain
 * @returns : Viem Client
 */
export const configureCeloPublicClient = () => {
  return createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  });
}

/**
 * @dev Send an 'amount' of cUSD to 'to'
 * @param to : Recipient
 * @param amount : Amount to send
 * @param callback : Callback function
 * @returns Transaction receipt
*/
export default async function sendCUSD(to: Address, amount: bigint, callback: TransactionCallback) {
  let walletClient = createWalletClient({
    transport: custom(window.ethereum),
    chain: celoAlfajores,
  });
  
  const contractAddress = celoAddresses['44787'];
  let [address] = await walletClient.getAddresses();
  callback({message: `Sending ${parseEther(amount.toString())} cUSD to ${to}`});
  const tx = await walletClient.writeContract({
    address: contractAddress,
    abi: StableTokenABI.abi,
    functionName: "transfer",
    account: address,
    args: [to, amount],
  });

  await configureCeloPublicClient().waitForTransactionReceipt({
    hash: tx,
  }).then((receipt) => {
    callback({message: `Transaction ${receipt.status}`});
  });
}