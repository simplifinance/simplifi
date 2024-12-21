import { GetFinanceParam } from "@/interfaces";
import { getFactoryAddress } from "../../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";
import { formatError } from "../formatError";

export const getFinance = async(args: GetFinanceParam ) => {
  const { epochId, daysOfUseInHr, config, callback, account, value } = args;
  const address = getFactoryAddress();
  let result: boolean = false;
  if(config) {
    try {
      callback?.({message: "Getting Finance", loading: true});
      const { request } = await simulateContract(config, {
        address,
        account,
        abi: setForwarderAbi,
        functionName: "getFinance",
        args: [epochId, daysOfUseInHr],
        value
      });
      const hash = await writeContract(config, request );
      await waitForConfirmation({config, hash, fetch: false, setTrxnDone: false, callback: callback!})
        .then(() => result = true);
    } catch (error: any) {
      callback?.({message: formatError(error), loading: false, buttonText: 'Failed'});
    }
  }
  return result;
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


