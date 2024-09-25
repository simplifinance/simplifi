import { Address, Config } from "@/interfaces";
import { writeContract, simulateContract } from "wagmi/actions";
import { waitForConfirmation } from "../../waitForConfirmation";
import { getTokenAddress  } from "../../getAddress";
import { getFactoryAddress } from "../../contractAddress";
import { formatError } from "../formatError";

const factoryAddr = getFactoryAddress();

export const approve = async(args: ApproveParam) => {
    const { callback, config, account, amountToApprove } = args;
    const address = getTokenAddress();
    if(config) {        
        try {
          callback?.({message: "Approval in progress", txDone: false});
          const {request} = await simulateContract(config, {
              address,
              account,
              abi: approveAbi,
              functionName: "approve", 
              args: [factoryAddr, amountToApprove]
          });
          const hash = await writeContract(config, { ...request });
          await waitForConfirmation({config, hash, fetch: false, callback});
        } catch (error: any) {
            callback?.({message: formatError(error), txDone: true});
        }
    }
}

const approveAbi = [
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "approve",
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

export interface ApproveParam extends Config {
    amountToApprove: bigint;
}
