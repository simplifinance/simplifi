import { Address, WagmiConfig } from "@/interfaces";
import { readContract } from "wagmi/actions";
import { getTokenAddress } from "../../utils/getTokenAddress";
import { allowanceAbi } from "@/apis/abis";

export default async function getAllowance(args: {owner: Address, account: Address, spender: Address, config: WagmiConfig}) {
  const { owner, spender, account, config } = args;
  return await readContract(config, {
    address: getTokenAddress(),
    abi: allowanceAbi,
    functionName: "allowance",
    account,
    args: [owner, spender]
  });
}

export interface GetBalanceArg {
  target: Address;
  account: Address;
  config: WagmiConfig;
}

