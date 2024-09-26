import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";
import { formatError } from "../formatError";

export const payback = async(args: CommonParam) => {
  const { config, callback, account, epochId } = args;
  const address = getFactoryAddress();
  let result: boolean = false;
  if(config) {
    callback?.({message: "Paying back loan", txDone: false});
    try {
      const {request} = await simulateContract(config, {
        address,
        account,
        abi: paybackAbi,
        functionName: "payback",
        args: [epochId]
      });
      const hash = await writeContract(config, { ...request });
      await waitForConfirmation({config, fetch: false, setTrxnDone: false, hash, callback:callback!})
        .then(() => result = true);
    } catch (error: any) {
      callback?.({message: formatError(error), txDone: true});
    }
  }
  return result;
}

const paybackAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epochId",
        "type": "uint256"
      }
    ],
    "name": "payback",
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



