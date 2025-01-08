import { WagmiConfig } from "@/interfaces";
import { getFactoryAddress } from "../utils/contractAddress";
import { readContract } from "wagmi/actions";
import { getCollateralQuoteAbi } from "../abis";

export const getCollateralQuote = async(args: {config: WagmiConfig, epochId: bigint}) => {
  const { config, epochId } = args;
  return await readContract(config, {
    abi: getCollateralQuoteAbi,
    address: getFactoryAddress(), 
    functionName: "getCollaterlQuote",
    args: [epochId]
  });  
}

