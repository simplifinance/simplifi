import { CreatePermissionedPoolParams, TrxResult } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getTokenAddress } from "../../utils/getTokenAddress";
import { createPermissionedLiquidityPoolAbi } from "@/apis/abis";
import { errorMessage } from "../formatError";

const tokenAddr = getTokenAddress();

export default async function createPermissioned(param: CreatePermissionedPoolParams) {
  const { config, account, contributors, unitLiquidity, intRate, callback, durationInHours, colCoverage } = param;
  const address = getFactoryAddress();
  let returnValue : TrxResult = 'reverted';
  await simulateContract(config, {
    address,
    account,
    abi: createPermissionedLiquidityPoolAbi,
    functionName: "createPermissionedPool",
    args: [intRate, durationInHours, colCoverage, unitLiquidity, tokenAddr, contributors],
  }).then(async({request}) => {
    callback?.({message: "Launching a permissioned flexPool..."});
    const hash = await writeContract(config, request );
    returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
  
  return returnValue;
}
