import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { withdrawCollateralAbi } from "@/apis/abis";

export default async function withdrawCollateral(args: CommonParam) {
  const { config, callback, account, epochId } = args;
  const address = getFactoryAddress();
  callback?.({message: "Getting back your collateral..."});
  const {request} = await simulateContract(config, {
    address,
    account,
    abi: withdrawCollateralAbi,
    functionName: 'withdrawCollateral',
    args: [epochId]
  });
  const hash = await writeContract(config, { ...request });
  return await waitForConfirmation({config, fetch: true, hash, callback});
}
