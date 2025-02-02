import factory_xfi from "../../../contract/deployments/crossTest/Factory.json";
import factory_celo from "../../../contract/deployments/alfajores/Factory.json";
import token_xfi from "../../../contract/deployments/crossTest/TestAsset.json";
import token_celo from "../../../contract/deployments/alfajores/TestAsset.json";
import { Address } from "@/interfaces";

const indexes = [4157, 44787];
const currencies = ['XFI', 'CELO'];
const networks = ['CROSSFI', 'ALFAJORES'];
const pairs = ['USDT/XFI', "USDT/CELO"];
const contract_addrs = [token_xfi.address, token_celo.address] as const;
const factories = [factory_xfi.address, factory_celo.address] as const;

export const formatAddr = (x: string | (Address | undefined)) : Address => {
    if(!x || x === "") return `0x${'0'.repeat(40)}`;
    return `0x${x.substring(2, 42)}`;
};

export const getContractData = (chainId: number) => {
    const isInList = indexes.includes(chainId);
    if(!isInList) throw new Error('Unsupported chain');
    const index = indexes.indexOf(chainId);
    return {
        token: formatAddr(contract_addrs[index]),
        factory: formatAddr(factories[index]),
        currency: currencies[index],
        network: networks[index],
        pair: pairs[index],
    };
}
