import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";
import { formatError } from "../formatError";

export const liquidate = async(args: CommonParam) => {
  const { config, callback, account, epochId } = args;
  const address = getFactoryAddress();
  if(config) {
    callback?.({message: "Liquidating In Progress", loading: true});
    try {
      const {request} = await simulateContract(config, {
        address,
        account,
        abi: liquidateAbi,
        functionName: "liquidate",
        args: [epochId]
      });
      const hash = await writeContract(config, { ...request });
      await waitForConfirmation({config, fetch: true, setTrxnDone: true, hash, callback:callback!});
    } catch (error: any) {
      callback?.({message: formatError(error), loading: false, buttonText: 'Failed'});
    }
  }
}

const liquidateAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "liquidate",
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
