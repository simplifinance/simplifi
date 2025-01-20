import { Address, WagmiConfig } from "@/interfaces";
import { getFactoryAddress } from "../utils/contractAddress";
import { readContract } from "wagmi/actions";
import { getCurrentDebtAbi } from "../abis";

export default async function getCurrentDebt(args: {config: WagmiConfig, unit: bigint, account: Address}) {
  const { config, unit, account } = args;
  return await readContract(config, {
    abi: getCurrentDebtAbi,
    address: getFactoryAddress(), 
    functionName: "getCurrentDebt",
    args: [unit, account]
  });  
}

