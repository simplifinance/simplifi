import { Address, ButtonContent, Config } from "@/interfaces";
import { writeContract, simulateContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getTokenAddress  } from "../../utils/getTokenAddress";
import { getFactoryAddress } from "../../utils/contractAddress";

const factoryAddr = getFactoryAddress();

export default async function approve(args: ApproveParam) {
    const { callback, config, account, amountToApprove } = args;
    const address = getTokenAddress();
    callback?.({message: "Approving spending limit..."});
    const {request} = await simulateContract(config, {
        address,
        account,
        abi: approveAbi,
        functionName: "approve", 
        args: [factoryAddr, amountToApprove]
    });
    const hash = await writeContract(config, { ...request });
    await waitForConfirmation({config, hash,  callback});
}

export const approveAbi = [
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
  // buttonText: ButtonContent; 
}
