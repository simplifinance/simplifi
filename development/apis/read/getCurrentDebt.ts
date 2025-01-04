import { Address, WagmiConfig } from "@/interfaces";
import { getFactoryAddress } from "../utils/contractAddress";
import { readContract } from "wagmi/actions";

export const getCurrentDebt = async(args: {config: WagmiConfig, epochId: bigint, account: Address}) => {
  const { config, epochId, account } = args;
  return await readContract(config, {
    abi: getCurrentDebtAbi,
    address: getFactoryAddress(), 
    functionName: "getCurrentDebt",
    args: [epochId, account]
  });  
}

const getCurrentDebtAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "getCurrentDebt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;
