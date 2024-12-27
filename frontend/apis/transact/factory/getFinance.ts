import { GetFinanceParam } from "@/interfaces";
import { getFactoryAddress } from "../../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";

export const getFinance = async(args: GetFinanceParam ) => {
  const { epochId, daysOfUseInHr, config, callback, account, value } = args;
  const address = getFactoryAddress();
  callback?.({message: "Getting Finance"});
  const { request } = await simulateContract(config, {
    address,
    account,
    abi: setForwarderAbi,
    functionName: "getFinance",
    args: [epochId, daysOfUseInHr],
    value
  });
  const hash = await writeContract(config, request );
  return await waitForConfirmation({config, hash, fetch: false, callback});
}

const setForwarderAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "daysOfUseInHr",
        "type": "uint8"
      }
    ],
    "name": "getFinance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
] as const;


