import type { DepositCollateralParam } from "@/interfaces";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { withdrawCollateralAbi } from "@/apis/abis";
import { zeroAddress } from "viem";
import assert from "assert";

export default async function withdrawCollateral(args: DepositCollateralParam ) {
  const { config, callback, account, bank, rId  } = args;
  assert(bank !== zeroAddress, "Bank address is undefined");
  callback?.({message: `Withdrawing collateral from the bank`});
  const { request } = await simulateContract(config, {
    address: bank,
    account,
    abi: withdrawCollateralAbi,
    functionName: 'withdrawCollateral',
    args: [rId],
  });
  const hash = await writeContract(config, request );
  return await waitForConfirmation({config, hash, callback});
}

