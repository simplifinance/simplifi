import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { liquidateAbi } from "@/apis/abis";

export const liquidate = async(args: CommonParam) => {
  const { config, callback, account, epochId } = args;
  const address = getFactoryAddress();
  callback?.("Creating liquidation request...");
  const {request} = await simulateContract(config, {
    address,
    account,
    abi: liquidateAbi,
    functionName: "liquidate",
    args: [epochId]
  });
  const hash = await writeContract(config, { ...request });
  return await waitForConfirmation({config, fetch: true, hash, callback});
}

