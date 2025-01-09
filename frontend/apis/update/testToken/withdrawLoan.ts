import { Address, Config } from "@/interfaces";
import { writeContract, simulateContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getTokenAddress  } from "../../utils/getTokenAddress";
import getAllowance from "./getAllowance";
import BigNumber from "bignumber.js";
import { formatEther } from "viem";

export default async function withdrawLoan(args: TransferFromParam) {
  const { callback, config, account: spender, strategy: owner} = args;
  const address = getTokenAddress();
  const allowance = await getAllowance({config, account: spender, spender, owner });
  if(new BigNumber(allowance.toString()).gt(0)) {
    callback?.({message: `Approving and withdrawal $${formatEther(allowance)} loan to wallet...`});
    const {request} = await simulateContract(config, {
        address,
        account: spender,
        abi: transferFromAbi,
        functionName: 'transferFrom', 
        args: [owner, spender, allowance]
    });
    const hash = await writeContract(config, { ...request });
    await waitForConfirmation({config, hash, fetch: true, callback});
  } else {
    callback?.({message: `${allowance} allowance found`});
  }
}

export const transferFromAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
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

export interface TransferFromParam extends Config {
  strategy: Address;
}
