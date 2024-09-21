import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";

export const liquidate = async(args: CommonParam) => {
  const { config, callback, account, epochId } = args;
  const address = getFactoryAddress();
  if(config) {
    callback?.({message: "Liquidating In Progress", txDone: false});
    try {
      const {request} = await simulateContract(config, {
        address,
        account,
        abi: liquidateAbi,
        functionName: "liquidate",
        args: [epochId]
      });
      const hash = await writeContract(config, { ...request });
      await waitForConfirmation({config, fetch: true, epochId, hash, callback:callback!, account});
    } catch (error: any) {
      console.log("contract error", error);
      callback?.({message: "Transaction Failed", txDone: true});
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
