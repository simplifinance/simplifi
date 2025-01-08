import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { removeLiquidityPoolAbi } from "@/apis/abis";

export const removePool = async(args: CommonParam) => {
  const { config, callback, account, epochId } = args;
  const address = getFactoryAddress();
  callback?.(`Removing Flexpool at ${epochId}`);
  const {request} = await simulateContract(config, {
    address,
    account,
    abi: removeLiquidityPoolAbi,
    functionName: "removeLiquidityPool",
    args: [epochId]
  });
  const hash = await writeContract(config, { ...request });
  return await waitForConfirmation({config, fetch: true, hash, callback});
}

