import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";
import { formatError } from "../formatError";

export const addToPool = async(args: CommonParam ) => {
  const { epochId, config, callback, account } = args;
  const address = getFactoryAddress();
  if(config) {
    callback?.({message: "Adding provider", txDone: false});
    try {
      const { request } = await simulateContract(config, {
        address,
        account,
        abi: addToPoolAbi,
        functionName: "joinAPool",
        args: [epochId]
      });
      const hash = await writeContract(config, request );
      await waitForConfirmation({config, hash, fetch: true, setTrxnDone: true, callback: callback!});
    } catch (error: any) {
      callback?.({message: formatError(error), txDone: true});
    }
  }
}

const addToPoolAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "joinAPool",
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


