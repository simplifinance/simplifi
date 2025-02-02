import { CreatePermissionedPoolParams, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { createPermissionedLiquidityPoolAbi } from "@/apis/abis";
import { errorMessage } from "../formatError";

export default async function createPermissioned(param: CreatePermissionedPoolParams) {
  const { config, account, contributors, unitLiquidity, intRate, callback, durationInHours, colCoverage } = param;
  const { factory: address, token } = getContractData(config.state.chainId);
  let returnValue : TrxResult = 'reverted';
  await simulateContract(config, {
    address,
    account,
    abi: createPermissionedLiquidityPoolAbi,
    functionName: "createPermissionedPool",
    args: [intRate, durationInHours, colCoverage, unitLiquidity, token, contributors],
  }).then(async({request}) => {
    callback?.({message: "Launching a permissioned flexPool..."});
    const hash = await writeContract(config, request );
    returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
  
  return returnValue;
}
