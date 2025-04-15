import type { CreatePermissionlessPoolParams, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { createPoolAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";

/**
 * @dev Create a new permissionless pool
 * @param args : Arguments of type CreatePermissionlessPoolParams. See interfaces.ts
 * @returns : Transaction result
 */
export default async function createPermissionlessLiquidityPool(param: CreatePermissionlessPoolParams) {
  const { config, account, quorum, unitLiquidity, callback, durationInHours, collateralAsset, colCoverage } = param;
  const { factory: address } = getContractData(config.state.chainId);
  const contributors = Array.from([account]);
  let returnValue : TrxResult = 'reverted';  
  await simulateContract(config, {
    address,
    account,
    abi: createPoolAbi,
    functionName: "createPool",
    args: [contributors, unitLiquidity, quorum, durationInHours, colCoverage, true, collateralAsset],
  }).then(async({request}) => {
      callback?.({message: "Launching a Permissionless flexPool..."});
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!});
    }).catch((error: any) => callback?.({message: errorMessage(error)}));

  return returnValue;
}
