import { CreatePermissionedPoolParams } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getTokenAddress } from "../../utils/getTokenAddress";
import { createPermissionedLiquidityPoolAbi } from "@/apis/abis";

const tokenAddr = getTokenAddress();

export default async function createPermissioned(param: CreatePermissionedPoolParams) {
  const { config, account, contributors, unitLiquidity, intRate, callback, durationInHours, colCoverage } = param;
  // console.log("param: ", param)
  const address = getFactoryAddress();
  callback?.({message: "Launching a permissioned flexPool..."});
  const { request } = await simulateContract(config, {
    address,
    account,
    abi: createPermissionedLiquidityPoolAbi,
    functionName: "createPermissionedPool",
    args: [intRate, durationInHours, colCoverage, unitLiquidity, tokenAddr, contributors],
  });
  const hash = await writeContract(config, request );
  return await waitForConfirmation({config, hash, fetch: true, callback: callback!});
}
