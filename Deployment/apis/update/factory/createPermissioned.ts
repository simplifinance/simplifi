import { CommonParam, CreatePermissionedPoolParams, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { createPoolAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";
import assert from "assert";

/**
 * @dev Create a new permissioned pool
 * @param args : Arguments of type CreatePermissionedPoolParams. See interfaces.ts
 * @returns : Transaction result
 */
export default async function createPermissioned(param: CreatePermissionedPoolParams, commonParam: CommonParam) {
  const { contributors, durationInHours, colCoverage } = param;
  const { config, account, unit, contractAddress, callback } = commonParam;
  const { factory: address } = getContractData(config.state.chainId);
  let returnValue : TrxResult = 'reverted';
  assert(contractAddress !== undefined, "CreatePermissioned.ts: Contract address is undefined");
  callback?.({message: "Request to launch a permissioned flexPool"});
  await simulateContract(config, {
    address,
    account, 
    abi: createPoolAbi,
    functionName: "createPool",
    args: [contributors, unit, contributors.length, durationInHours, colCoverage, false, contractAddress],
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
    returnValue = await waitForConfirmation({config, hash, callback: callback!, message: "Flexpool creation successful"});
  }).catch((error: any) => callback?.({errorMessage: errorMessage(error)}));
  
  return returnValue;
}
