import { CommonParam } from "@/interfaces";
import { getFactoryAddress } from "../../utils/contractAddress";
import { simulateContract, writeContract } from "wagmi/actions";
import { waitForConfirmation } from "../../utils/waitForConfirmation";
import { getEllipsisTxt } from "@/components/AddressFormatter/stringFormatter";
import { addToPoolAbi } from "@/apis/abis";
import { formatEther } from "viem";

export default async function addToPool(args: CommonParam ){
  const { unit, config, callback, account } = args;
  const address = getFactoryAddress();
  callback?.({message: `Adding user ${getEllipsisTxt(account)} to pool at ${formatEther(unit)}`});
  const { request } = await simulateContract(config, {
    address,
    account,
    abi: addToPoolAbi,
    functionName: "joinAPool",
    args: [unit]
  });
  const hash = await writeContract(config, request );
  return await waitForConfirmation({config, hash, callback});
}



