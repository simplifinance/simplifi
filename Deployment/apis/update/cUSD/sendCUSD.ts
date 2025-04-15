import StableTokenABI from "@/apis/utils/cusd.json";
import { celoAddresses } from "@/constants";
import { Address, TransactionCallback } from "@/interfaces";
import { publicClients, walletClients } from "../../viemClient";
import { parseEther } from "viem";

/**
 * @dev Send an 'amount' of cUSD to 'to'
 * @param to : Recipient
 * @param amount : Amount to send
 * @returns Transaction receipt
 */
export default async function sendCUSD(to: Address, amount: bigint, callback: TransactionCallback) {
  const contractAddress = celoAddresses['44787'];
  let walletClient = walletClients[0];
  let [address] = await walletClient.getAddresses();
  callback({message: `Sending ${parseEther(amount.toString())} cUSD to ${to}`});
  const tx = await walletClient.writeContract({
    address: contractAddress,
    abi: StableTokenABI.abi,
    functionName: "transfer",
    account: address,
    args: [to, amount],
  });

  let receipt = await publicClients[0].waitForTransactionReceipt({
    hash: tx,
  });
  callback({message: "Transaction completed"});
  return receipt;
}