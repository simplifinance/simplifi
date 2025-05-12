import { Address, WagmiConfig } from "@/interfaces";
import { getContractData } from "../utils/getContractData";
import { readContract } from "wagmi/actions";
import { getCurrentDebtAbi } from "../utils/abis";

export default async function getCurrentDebt(args: {config: WagmiConfig, unit: bigint}) {
  const { config, unit } = args;
  return await readContract(config, {
    abi: getCurrentDebtAbi,
    address: getContractData(config.state.chainId).factory.address, 
    functionName: "getCurrentDebt",
    args: [unit]
  });  
}

