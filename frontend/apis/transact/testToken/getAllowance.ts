import { Address, WagmiConfig } from "@/interfaces";
import { readContract } from "wagmi/actions";
import { getTokenAddress } from "../../getAddress";
import { getFactoryAddress } from "../../contractAddress";

const factoryAddr = getFactoryAddress();

export const getAllowance = async(args: {account: Address, config: WagmiConfig}) => {
  const { account, config } = args;
  return await readContract(config, {
    address: getTokenAddress(),
    abi: allowanceAbi,
    functionName: "allowance",
    account,
    args: [account, factoryAddr]
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

