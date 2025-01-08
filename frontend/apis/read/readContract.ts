import type { WagmiConfig, Address, Pools} from "@/interfaces";
import { readContract as read } from "wagmi/actions";
import { getFactoryAddress } from "../utils/contractAddress";
import { getPoolsAbi, profileAbi } from "../abis";

const address = getFactoryAddress();

export async function getProfile({config, epochId, account} : {config: WagmiConfig, epochId: bigint, account: Address}) {
  console.log("EpochId", epochId);
  return await read(config, {
    abi: profileAbi,
    address, 
    functionName: "getProfile",
    args: [epochId, account]
  });
}

export async function getEpoches({config} : {config: WagmiConfig}): Promise<Pools> {
  return await read(config, {
    abi: getPoolsAbi,
    address, 
    functionName: "getPoolFromAllEpoches",
    args: []
  });
}
