import { Address, WagmiConfig } from "@/interfaces";
import { readContract } from "wagmi/actions";
import { getTokenAddress } from "../../utils/getTokenAddress";

export const getAllowance = async(args: {owner: Address, account: Address, spender: Address, config: WagmiConfig}) => {
  const { owner, spender, account, config } = args;
  return await readContract(config, {
    address: getTokenAddress(),
    abi: allowanceAbi,
    functionName: "allowance",
    account,
    args: [owner, spender]
  });
}

const allowanceAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
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

export interface GetBalanceArg {
  target: Address;
  account: Address;
  config: WagmiConfig;
}

