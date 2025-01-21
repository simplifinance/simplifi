import type { WagmiConfig, } from "@/interfaces";
import { readContract as read } from "wagmi/actions";
import { getFactoryAddress } from "../utils/contractAddress";
import { getFactoryDataAbi } from "../abis";

const address = getFactoryAddress();

export const getFactoryData = async({config} : {config: WagmiConfig}) => {
  return await read(config, {
    abi: getFactoryDataAbi,
    address, 
    functionName: 'getFactoryData',
    args: []
  });
}
