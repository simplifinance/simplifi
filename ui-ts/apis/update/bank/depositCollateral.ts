import type { DepositCollateralParam, TrxResult, } from "@/interfaces";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { depositCollateralAbi, } from "@/apis/utils/abis";
import { formatEther, zeroAddress } from "viem";
import assert from "assert";
import { errorMessage } from "../formatError";

export default async function depositCollateral(args: DepositCollateralParam ) {
  const { config, callback, account, value, bank, rId  } = args;
  assert(bank !== zeroAddress, "Bank address is undefined");
  let returnValue : TrxResult = 'reverted';  
  await simulateContract(config, {
    address: bank,
    account,
    abi: depositCollateralAbi,
    functionName: 'depositCollateral',
    args: [rId],
    value
  }).then(async({request}) => {
    const hash = await writeContract(config, request );
      callback?.({message: `Depositing collateral of ${formatEther(value || 0n)} XFI`});
      returnValue = await waitForConfirmation({config, hash, callback: callback!});
  }).catch((error: any) => callback?.({message: errorMessage(error)}));
        
  return returnValue;
}

