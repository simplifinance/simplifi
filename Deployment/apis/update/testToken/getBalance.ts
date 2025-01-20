import { Address, WagmiConfig } from "@/interfaces";
import { readContract } from "wagmi/actions";
import { getTokenAddress } from "../../utils/getTokenAddress";
import { balanceOfAbi, symbolAbi } from "@/apis/abis";

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

export interface GetBalanceArg {
  target: Address;
  account: Address;
  config: WagmiConfig;
}

