import { CommonParam, TrxResult } from "@/interfaces";
import { getContractData } from "../../utils/getContractData";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
// import { getEllipsisTxt } from "@/components/utilities/AddressFormatter/stringFormatter";
import { contributeAbi } from "@/apis/utils/abis";
import { formatEther } from "viem";
import { errorMessage } from "../formatError";
import { decodeErrorResult } from "viem";

/**
 * @dev Add contributor to a pool
 * @param args : Arguments of type CommonParam. See interfaces.ts
 * @returns : Transaction result
 */
export default async function addToPool(args: CommonParam) : Promise<TrxResult> {
  const { unit, config, callback, account } = args;
  const address = getContractData(config.state.chainId).factory;
  let returnValue : TrxResult = 'reverted';
  callback?.({message: `Request to add contributor to Flexpool. Amount: ${formatEther(unit)}`});
  await simulateContract(config, {
    address,
    account,
    abi: contributeAbi,
    functionName: "contribute",
    args: [unit]
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
    returnValue = await waitForConfirmation({config, hash, callback, message: 'Successfully contributed!'})
  }).catch((error: any) => {
    callback?.({errorMessage: errorMessage(error)});
  });

  return returnValue;
}
