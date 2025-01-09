import { WagmiConfig } from "@/interfaces";
import { getFactoryAddress } from "../utils/contractAddress";
import { readContract } from "wagmi/actions";
import { getCollateralQuoteAbi } from "../abis";

export default async function getCollateralQuote(args: {config: WagmiConfig, epochId: bigint}) {
  const { config, epochId } = args;
  return await readContract(config, {
    abi: getCollateralQuoteAbi,
    address: getFactoryAddress(), 
    functionName: "getCollaterlQuote",
    args: [epochId]
  });  
}

