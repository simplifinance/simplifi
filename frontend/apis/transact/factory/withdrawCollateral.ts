import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";

export const withdrawCollateral = async(args: CommonParam) => {
  const { config, callback, account, epochId } = args;
  const address = getFactoryAddress();
  callback?.({message: "Withdrawing collateral"});
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

const withdrawCollateralAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "withdrawCollateral",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
] as const;
