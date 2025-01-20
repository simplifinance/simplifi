import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { removeLiquidityPoolAbi } from "@/apis/abis";
import { formatEther } from "viem";

export default async function removePool(args: CommonParam) {
  const { config, callback, account, unit } = args;
  const address = getFactoryAddress();
  callback?.({message: `Removing Flexpool at ${formatEther(unit)}`});
  const {request} = await simulateContract(config, {
    address,
    account,
    abi: removeLiquidityPoolAbi,
    functionName: "removeLiquidityPool",
    args: [unit]
  });
  const hash = await writeContract(config, { ...request });
  return await waitForConfirmation({config, hash, callback});
}

