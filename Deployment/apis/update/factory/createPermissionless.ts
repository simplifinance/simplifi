import type { CreatePermissionLessPoolParams, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { createPermissionlessLiquidityPoolAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";


export default async function createPermissionlessLiquidityPool(param: CreatePermissionLessPoolParams) {
  const { config, account, quorum, unitLiquidity, intRate, callback, durationInHours, colCoverage } = param;
  const { factory: address, token } = getContractData(config.state.chainId);
  let returnValue : TrxResult = 'reverted';  
  await simulateContract(config, {
    address,
    account,
    abi: createPermissionlessLiquidityPoolAbi,
    functionName: "createPermissionlessPool",
    args: [intRate, quorum, durationInHours, colCoverage, unitLiquidity, token],
  }).then(async({request}) => {
      callback?.({message: "Launching a Permissionless flexPool..."});
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!});
    }).catch((error: any) => callback?.({message: errorMessage(error)}));

  return returnValue;
}
