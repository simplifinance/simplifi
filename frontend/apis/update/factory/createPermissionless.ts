import type { CreatePermissionLessPoolParams } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getTokenAddress } from "../../utils/getTokenAddress";
import { createPermissionlessLiquidityPoolAbi } from "@/apis/abis";

const tokenAddr = getTokenAddress();

export const createPermissionlessLiquidityPool = async(param: CreatePermissionLessPoolParams) => {
  const { config, account, quorum, unitLiquidity, intRate, callback, durationInHours, colCoverage } = param;
  const address = getFactoryAddress();
  callback?.("Launching a Pprmissionless flexPool...");
  const { request } = await simulateContract(config, {
    address,
    account,
    abi: createPermissionlessLiquidityPoolAbi,
    functionName: "createPermissionlessPool",
    args: [intRate, quorum, durationInHours, colCoverage, unitLiquidity, tokenAddr],
  });
  const hash = await writeContract(config, request );
  return await waitForConfirmation({config, hash, fetch: true, callback: callback!});
}

