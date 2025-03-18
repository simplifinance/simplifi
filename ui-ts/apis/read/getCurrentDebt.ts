import { Address, WagmiConfig } from "@/interfaces";
import { getContractData } from "../utils/getContractData";
import { readContract } from "wagmi/actions";
import { getCurrentDebtAbi } from "../utils/abis";

export default async function getCurrentDebt(args: {config: WagmiConfig, unit: bigint, account: Address}) {
  const { config, unit, account } = args;
  return await readContract(config, {
    abi: getCurrentDebtAbi,
    address: getContractData(config.state.chainId).factory, 
    functionName: "getCurrentDebt",
    args: [unit, account]
  });  
}

