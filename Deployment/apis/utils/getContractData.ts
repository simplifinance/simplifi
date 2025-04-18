import factory_xfi from "@/deployments/alfajores/FlexpoolFactory.json";
import factory_celo from "@/deployments/alfajores/FlexpoolFactory.json";
import colToken_celo from "@/deployments/alfajores/SimpliToken.json";
import colToken_xfi from "@/deployments/alfajores/SimpliToken.json";
import providers_celo from "@/deployments/alfajores/Providers.json";
import providers_xfi from "@/deployments/alfajores/Providers.json";
import points_celo from "@/deployments/alfajores/Points.json";
import points_xfi from "@/deployments/alfajores/Points.json";
import faucet_celo from "@/deployments/alfajores/Faucet.json";
import faucet_xfi from "@/deployments/alfajores/Faucet.json";
import { Address } from "@/interfaces";
import { currencies, networks, pairs, supportedChainIds } from "@/constants";
import { isSuportedChain } from "@/utilities";
import { zeroAddress } from "viem";

const collaterals = [colToken_celo.address, colToken_xfi.address] as const as Address[];
const providers = [providers_celo.address, providers_xfi.address] as const as Address[];
const points = [points_celo.address, points_xfi.address] as const as Address[];
const faucets = [faucet_celo.address, faucet_xfi.address] as const as Address[];
const factories = [factory_celo.address, factory_xfi.address] as const as Address[];

export const formatAddr = (x: string | (Address | undefined)) : Address => {
    if(!x || x === "") return zeroAddress as Address;
    return x as Address;
};

/**
 * Return contracts addresses
 * @param chainId : Id of the connected chain
 * @returns object
 */
export const getContractData = (chainId: number) => {
    const index = !isSuportedChain(chainId)? supportedChainIds[0] : supportedChainIds.indexOf(chainId);
    return {
        token: collaterals[index],
        faucets: faucets[index],
        points: points[index],
        providers: providers[index],
        factory: factories[index],
        currency: currencies[index],
        network: networks[index],
        pair: pairs[index],
    };
}
