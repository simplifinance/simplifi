import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";

export const payback = async(args: CommonParam) => {
  const { config, callback, account, epochId } = args;
  const address = getFactoryAddress();
  callback?.({message: "Paying back loan..."});
  const {request} = await simulateContract(config, {
    address,
    account,
    abi: paybackAbi,
    functionName: "payback",
    args: [epochId]
  });
  const hash = await writeContract(config, { ...request });
  return await waitForConfirmation({config, fetch: false, hash, callback});
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



