import { GetFinanceParam } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getFinanceAbi } from "@/apis/abis";

export const getFinance = async(args: GetFinanceParam ) => {
  const { epochId, daysOfUseInHr, config, callback, account, value } = args;
  const address = getFactoryAddress();
  callback?.("Creating get-Finance request...");
  const { request } = await simulateContract(config, {
    address,
    account,
    abi: getFinanceAbi,
    functionName: "getFinance",
    args: [epochId, daysOfUseInHr],
    value
  });
  const hash = await writeContract(config, request );
  return await waitForConfirmation({config, hash, fetch: false, callback});
}

