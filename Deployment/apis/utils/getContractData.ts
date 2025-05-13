import factory_xfi from "@/deployments/crosstest/FlexpoolFactory.json";
import factory_celo from "@/deployments/alfajores/FlexpoolFactory.json";
import simpliToken_celo from "@/deployments/alfajores/SimpliToken.json";
import simpliToken_xfi from "@/deployments/crosstest/SimpliToken.json";
import providers_celo from "@/deployments/alfajores/Providers.json";
import providers_xfi from "@/deployments/crosstest/Providers.json";
import points_celo from "@/deployments/alfajores/Points.json";
import points_xfi from "@/deployments/crosstest/Points.json";
import faucet_celo from "@/deployments/alfajores/Faucet.json";
import faucet_xfi from "@/deployments/crosstest/Faucet.json";
import assetManager_celo from "@/deployments/alfajores/SupportedAssetManager.json";
import assetManager_xfi from "@/deployments/crosstest/SupportedAssetManager.json";
import distributor_celo from "@/deployments/alfajores/TokenDistributor.json";
import distributor_xfi from "@/deployments/crosstest/TokenDistributor.json";
import attorney_celo from "@/deployments/alfajores/Attorney.json";
import attorney_xfi from "@/deployments/crosstest/Attorney.json";
import wrapped_celo from "@/deployments/alfajores/WrappedNative.json";
import wrapped_xfi from "@/deployments/crosstest/WrappedNative.json";
import { Address } from "@/interfaces";
import { currencies, networks, pairs } from "@/constants";
import { zeroAddress } from "viem";

const collaterals = { abis: Array.from([simpliToken_celo.abi, simpliToken_xfi.abi]), contracts: Array.from([simpliToken_celo.address, simpliToken_xfi.address]) as Address[]};
const providers = { abis: Array.from([providers_celo.abi, providers_xfi.abi]), contracts: Array.from([providers_celo.address, providers_xfi.address]) as Address[]};
const points = { abis: Array.from([points_celo.abi, points_xfi.abi]), contracts: Array.from([points_celo.address, points_xfi.address]) as Address[]};
const faucets = { abis: Array.from([faucet_celo.abi, faucet_xfi.abi]), contracts: Array.from([faucet_celo.address, faucet_xfi.address]) as Address[]}; 
const factories = { abis: Array.from([factory_celo.abi, factory_xfi.abi]), contracts: Array.from([factory_celo.address, factory_xfi.address]) as Address[]};
const assetManagers = { abis: Array.from([assetManager_celo.abi, assetManager_xfi.abi]), contracts: Array.from([assetManager_celo.address, assetManager_xfi.address]) as Address[]};
const distributor = { abis: Array.from([distributor_celo.abi, distributor_xfi.abi]), contracts: Array.from([distributor_celo.address, distributor_xfi.address]) as Address[]};
const attorney = { abis: Array.from([attorney_celo.abi, attorney_xfi.abi]), contracts: Array.from([attorney_celo.address, attorney_xfi.address]) as Address[]};
const wrapped = { abis: Array.from([wrapped_celo.abi, wrapped_xfi.abi]), contracts: Array.from([wrapped_celo.address, wrapped_xfi.address]) as Address[]};

const supportedChainIds = [44787, 4157, 42220, 4157];
const supportedCollateralAssetsSymbols = ['CELO', 'XUSD', 'CELO', 'XUSD'];

/**
 * @dev Check if the current chain is supported
 * @param chainId : Chain Id from the current network
 * @returns : boolean value
 */
export const isSuportedChain = (chainId: number) => {
    return supportedChainIds.includes(chainId);
}

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
        token: {
            abi: collaterals.abis[index],
            address: collaterals.contracts[index],
            symbol: 'SIMPL'
        },
        faucets: {
            abi: faucets.abis[index],
            address: faucets.contracts[index]
        },
        points: {
            abi: points.abis[index],
            address: points.contracts[index]
        },
        providers: {
            abi: providers.abis[index],
            address: providers.contracts[index]
        },
        factory: {
            abi: factories.abis[index],
            address: factories.contracts[index]

        },
        supportAssetManager: {
            abi: assetManagers.abis[index],
            address: assetManagers.contracts[index]
        },
        distributor: {
            abi: distributor.abis[index],
            address: distributor.contracts[index]
        },
        attorney: {
            abi: attorney.abis[index],
            address: attorney.contracts[index]
        },
        wrapped: {
            abi: wrapped.abis[index],
            address: wrapped.contracts[index],
            symbol: supportedCollateralAssetsSymbols[index]
        },
        currency: currencies[index],
        network: networks[index],
        pair: pairs[index],
    };
}
