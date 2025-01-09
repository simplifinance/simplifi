import { Address, WagmiConfig } from "@/interfaces";
import { readContract } from "wagmi/actions";
import { getTokenAddress } from "../../utils/getTokenAddress";

export default async function getTestTokenBalance(args: GetBalanceArg) {
  const { account, config, target } = args;
  const name = await readContract(config, {
    address: getTokenAddress(),
    abi: symbolAbi,
    functionName: "symbol",
    account,
    args: []
  });
  const balances = await readContract(config, {
    address: getTokenAddress(),
    abi: balanceOfAbi,
    functionName: "balanceOf",
    account,
    args: [target]
  });
  return {
    name,
    balances
  }
}

export const balanceOfAbi = [
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
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

export const symbolAbi = [
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

export interface GetBalanceArg {
  target: Address;
  account: Address;
  config: WagmiConfig;
}

