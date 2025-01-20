import type { DepositCollateralParam, } from "@/interfaces";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { depositCollateralAbi, } from "@/apis/abis";
import { formatEther, zeroAddress } from "viem";
import assert from "assert";
import { revalidateTag } from "next/cache";

export default async function depositCollateral(args: DepositCollateralParam ) {
  const { config, callback, account, value, bank, rId  } = args;
  assert(bank !== zeroAddress, "Bank address is undefined");
  callback?.({message: `Depositing collateral of ${formatEther(value || 0n)} XFI`});
  const { request } = await simulateContract(config, {
    address: bank,
    account,
    abi: depositCollateralAbi,
    functionName: 'depositCollateral',
    args: [rId],
    value
  });
  const hash = await writeContract(config, request );
  return await waitForConfirmation({config, hash, callback});
}

