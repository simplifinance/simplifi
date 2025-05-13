import { WagmiConfig } from "@/interfaces";
import { getContractData } from "../utils/getContractData";
import { readContract } from "wagmi/actions";
import { getCollateralQuoteAbi } from "../utils/abis";

export default async function getCollateralQuote(args: {config: WagmiConfig, unit: bigint}) {
  const { config, unit } = args;
  return await readContract(config, {
    abi: getCollateralQuoteAbi,
    address: getContractData(config.state.chainId).factory.address, 
    functionName: "getCollateralQuote",
    args: [unit]
  });  
}

