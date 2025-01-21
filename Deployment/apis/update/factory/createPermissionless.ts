import type { CreatePermissionLessPoolParams, TrxResult } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getTokenAddress } from "../../utils/getTokenAddress";
import { createPermissionlessLiquidityPoolAbi } from "@/apis/abis";
import { errorMessage } from "../formatError";

const tokenAddr = getTokenAddress();

export default async function createPermissionlessLiquidityPool(param: CreatePermissionLessPoolParams) {
  const { config, account, quorum, unitLiquidity, intRate, callback, durationInHours, colCoverage } = param;
  const address = getFactoryAddress();
  let returnValue : TrxResult = 'reverted';  
  await simulateContract(config, {
    address,
    account,
    abi: createPermissionlessLiquidityPoolAbi,
    functionName: "createPermissionlessPool",
    args: [intRate, quorum, durationInHours, colCoverage, unitLiquidity, tokenAddr],
  }).then(async({request}) => {
      callback?.({message: "Launching a Permissionless flexPool..."});
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!});
    }).catch((error: any) => callback?.({message: errorMessage(error)}));

  return returnValue;
}
