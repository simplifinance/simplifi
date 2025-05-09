import type { CommonParam, EditPoolParam, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract, } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { editPoolAbi } from "@/apis/utils/abis";

/**rite
 * @dev Edit pool
 * @param args : Arguments of type EditPoolParam. See interfaces.ts
 * @returns : Transaction result
 */
export default async function editPool(param: EditPoolParam, commonParam: CommonParam) {
  const { quorum, durationInHours, colCoverage } = param;
  const { config, account, unit, callback } = commonParam;
  const { factory: address } = getContractData(config.state.chainId);
  let returnValue : TrxResult = 'reverted';  
  callback?.({message: "Request to edit pool"});
  await simulateContract(config, {
    address,
    account,
    abi: editPoolAbi,
    functionName: 'editPool',
    args: [unit, quorum, durationInHours, colCoverage],
  }).then(async({request}) => {
      const hash = await writeContract(config, request );
      returnValue = await waitForConfirmation({config, hash, callback: callback!, message: "Successfully edited pool"});
    }).catch((e: any) => {
      callback?.({errorMessage: e})
    });

  return returnValue;
}
