import type { WagmiConfig, } from "@/interfaces";
import { readContract as read } from "wagmi/actions";
import { getContractData } from "../utils/getContractData";
import { getFactoryDataAbi } from "../abis";

export const getFactoryData = async({config} : {config: WagmiConfig}) => {
  return await read(config, {
    abi: getFactoryDataAbi,
    address: getContractData(config.state.chainId).factory, 
    functionName: 'getFactoryData',
    args: []
  });
}
