import StableTokenABI from "@/apis/utils/cusd.json";
import { celoAddresses, mockReceipt } from "@/constants";
import { Address } from "@/interfaces";
import { TransactionReceipt } from "viem";
import { getContractData } from "@/apis/utils/getContractData";
import { createWalletClient, custom, } from "viem";
import { celoAlfajores } from "viem/chains";
import { configureCeloPublicClient } from "./sendCUSD";


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
*/
export const getAllowanceInCUSD = async() => {
  const contractAddress = celoAddresses['44787'];
  let walletClient = createWalletClient({
    transport: custom(window.ethereum),
    chain: celoAlfajores,
  });
  let [address] = await walletClient.getAddresses();
  const spender = getContractData(44787).factory;
  let allowance : bigint = 0n;
  try {
    allowance = await configureCeloPublicClient().readContract({
      address: contractAddress,
      abi: StableTokenABI.abi,
      functionName: "allowance",
      account: address,
      args: [address, spender],
    }) as bigint;
  } catch (error: any) {
    const errorMessage = error?.message || error?.data?.message || error;
    console.log("Error: ", errorMessage);
  }

  return allowance;
}

/**
 * @dev Approve spender to spend amount of `amount` of cUSD from the owner's account 
 * @param spender : Spender address
 * @param amount : Amount to approve
*/
export default async function approveToSpendCUSD(amount: bigint) {
  const contractAddress = celoAddresses['44787'];
  let walletClient = createWalletClient({
    transport: custom(window.ethereum),
    chain: celoAlfajores,
  });
  let [address] = await walletClient.getAddresses();
  const spender = getContractData(44787).factory;
  let receipt : TransactionReceipt = mockReceipt;
  try {
    const allowance = await  configureCeloPublicClient().readContract({
      address: contractAddress,
      abi: StableTokenABI.abi,
      functionName: "allowance",
      account: address,
      args: [address, spender],
    }) as bigint;
    if(allowance < amount) {
      const tx = await walletClient.writeContract({
        address: contractAddress,
        abi: StableTokenABI.abi,
        functionName: "approve",
        account: address,
        args: [spender, amount],
      });
      receipt = await configureCeloPublicClient().waitForTransactionReceipt({
        hash: tx,
      });
    }    
  } catch (error: any) {
    const errorMessage = error?.message || error?.data?.message || error;
    console.log("Error: ", errorMessage);
  }

  return receipt;
}

