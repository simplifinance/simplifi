import { Address, WagmiConfig } from "@/interfaces";
import { readContract } from "wagmi/actions";
import { getTokenAddress } from "../../getAddress";

export const getTestTokenBalance = async(args: GetBalanceArg) => {
  const { account, config, target } = args;
  return await readContract(config, {
    address: getTokenAddress(),
    abi: balanceOfAbi,
    functionName: "balanceOf",
    account,
    args: [target]
  });
}

const balanceOfAbi = [
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

export interface GetBalanceArg {
  target: Address;
  account: Address;
  config: WagmiConfig;
}

