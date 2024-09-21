import { WagmiConfig } from "@/interfaces";
import { getFactoryAddress } from "../contractAddress";
import { readContract } from "wagmi/actions";

export const getCollateralQuote = async(args: {config: WagmiConfig, epochId: bigint}) => {
  const { config, epochId } = args;
  return await readContract(config, {
    abi: getCollateralQuoteAbi,
    address: getFactoryAddress(), 
    functionName: "getCollaterlQuote",
    args: [epochId]
  });  
}

const getCollateralQuoteAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "getCollaterlQuote",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      },
      {
        "internalType": "uint24",
        "name": "colCoverage",
        "type": "uint24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;
