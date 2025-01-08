import { Address, WagmiConfig } from "@/interfaces";
import { getFactoryAddress } from "../utils/contractAddress";
import { readContract } from "wagmi/actions";
import { getCurrentDebtAbi } from "../abis";

export const getCurrentDebt = async(args: {config: WagmiConfig, epochId: bigint, account: Address}) => {
  const { config, epochId, account } = args;
  return await readContract(config, {
    abi: getCurrentDebtAbi,
    address: getFactoryAddress(), 
    functionName: "getCurrentDebt",
    args: [epochId, account]
  });  
}

