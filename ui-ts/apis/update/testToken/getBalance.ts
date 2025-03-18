import { Address, WagmiConfig } from "@/interfaces";
import { readContract } from "wagmi/actions";
import { getContractData } from "../../utils/getContractData";
import { balanceOfAbi, symbolAbi } from "@/apis/utils/abis";

export default async function getTestTokenBalance(args: GetBalanceArg) {
  const { account, config, target } = args;
  const { token: address } = getContractData(config.state.chainId);
  const name = await readContract(config, {
    address,
    abi: symbolAbi,
    functionName: "symbol",
    account,
    args: []
  });
  const balances = await readContract(config, {
    address,
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

