import { CreatePermissionedPoolParams, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { createPoolAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";

/**
 * @dev Create a new permissioned pool
 * @param args : Arguments of type CreatePermissionedPoolParams. See interfaces.ts
 * @returns : Transaction result
 */
export default async function createPermissioned(param: CreatePermissionedPoolParams) {
  const { config, account, contributors, unitLiquidity, collateralAsset, callback, durationInHours, colCoverage } = param;
  const { factory: address } = getContractData(config.state.chainId);
  let returnValue : TrxResult = 'reverted';
  await simulateContract(config, {
    address,
    account,
    abi: createPoolAbi,
    functionName: "createPool",
    args: [contributors, unitLiquidity, contributors.length, durationInHours, colCoverage, false, collateralAsset],
  }).then(async({request}) => {
    callback?.({message: "Launching a permissioned flexPool..."});
    const hash = await writeContract(config, request );
    returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
  
  return returnValue;
}
