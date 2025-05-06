import type { CommonParam, CreatePermissionlessPoolParams, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract, } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { createPoolAbi } from "@/apis/utils/abis";
import { errorMessage } from "../formatError";
import assert from "assert";

/**rite
 * @dev Create a new permissionless pool
 * @param args : Arguments of type CreatePermissionlessPoolParams. See interfaces.ts
 * @returns : Transaction result
 */
export default async function createPermissionlessLiquidityPool(param: CreatePermissionlessPoolParams, commonParam: CommonParam) {
  const { quorum, durationInHours, colCoverage } = param;
  const { config, account, unit, contractAddress, callback } = commonParam;
  const { factory: address } = getContractData(config.state.chainId);
  const contributors = Array.from([account]);
  let returnValue : TrxResult = 'reverted';  
  assert(contractAddress !== undefined, "CreatePermissioned.ts: Contract address is undefined");
  callback?.({message: "Request to launch a permissionless flexPool"});
  await simulateContract(config, {
    address,
    account,
    abi: createPoolAbi,
    functionName: "createPool",
    args: [contributors, unit, quorum, durationInHours, colCoverage, true, contractAddress],
  }).then(async({request}) => {
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!, message: "Flexpool creation successful"});
    }).catch((e: any) => {
      callback?.({errorMessage: e})
    });

  return returnValue;
}
