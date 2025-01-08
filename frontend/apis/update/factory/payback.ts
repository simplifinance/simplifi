import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { paybackAbi } from "@/apis/abis";

export const payback = async(args: CommonParam) => {
  const { config, callback, account, epochId } = args;
  const address = getFactoryAddress();
  callback?.("Paying back loan...");
  const {request} = await simulateContract(config, {
    address,
    account,
    abi: paybackAbi,
    functionName: "payback",
    args: [epochId]
  });
  const hash = await writeContract(config, { ...request });
  return await waitForConfirmation({config, fetch: false, hash, callback});
}

