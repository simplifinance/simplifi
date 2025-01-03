import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getEllipsisTxt } from "@/components/AddressFormatter/stringFormatter";

export const addToPool = async(args: CommonParam ) => {
  const { epochId, config, callback, account } = args;
  const address = getFactoryAddress();
  callback?.({message: `Adding user ${getEllipsisTxt(account)} to pool ${epochId.toString()}`});
  const { request } = await simulateContract(config, {
    address,
    account,
    abi: addToPoolAbi,
    functionName: "joinAPool",
    args: [epochId]
  });
  const hash = await writeContract(config, request );
  return await waitForConfirmation({config, hash, fetch: true, callback});
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


