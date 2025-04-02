import factory_xfi from "@/deployments/crossTest/Factory.json";
import factory_celo from "@/deployments/alfajores/Factory.json";
import token_xfi from "@/deployments/crossTest/TestBaseAsset.json";
import token_celo from "@/deployments/alfajores/TestBaseAsset.json";
import { Address } from "@/interfaces";
import { currencies, networks, pairs, supportedChains } from "@/constants";
import { isSuportedChain } from "@/utilities";

const contract_addrs = [token_xfi.address, token_celo.address] as const;
const factories = [factory_xfi.address, factory_celo.address] as const;

export const formatAddr = (x: string | (Address | undefined)) : Address => {
    if(!x || x === "") return `0x${'0'.repeat(40)}`;
    return `0x${x.substring(2, 42)}`;
};

export const getContractData = (chainId: number) => {
    let index = supportedChains[1];
    if(!isSuportedChain(chainId)) index = supportedChains.indexOf(chainId);;
    return {
        token: formatAddr(contract_addrs[index]),
        factory: formatAddr(factories[index]),
        currency: currencies[index],
        network: networks[index],
        pair: pairs[index],
    };
}
// throw new Error('Unsupported chain')
