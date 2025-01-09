import { analyticAbi, getPoolsAbi } from "@/apis/abis";
import { allowanceAbi } from "@/apis/update/testToken/getAllowance";
import { balanceOfAbi, symbolAbi } from "@/apis/update/testToken/getBalance";
import { getFactoryAddress } from "@/apis/utils/contractAddress";
import { getTokenAddress } from "@/apis/utils/getTokenAddress";
import { Address } from "@/interfaces";

export const tokenAddr = getTokenAddress();
export const factoryAddr = getFactoryAddress();

export const readAllowanceConfig = ({owner, spender, isConnected}: {owner: Address, spender: Address, isConnected: boolean}) => {
    const contractConfig = {
        address: tokenAddr,
        abi: allowanceAbi,
        functionName: 'allowance',
        args: [owner, spender],
        // query: {
        //     enabled: !!isConnected
        // }
    } as const;
    return contractConfig;
} 

export const readSymbolConfig = () => {
    const contractConfig = {
        abi: symbolAbi,
        address: tokenAddr,
        functionName: 'symbol',
        // query: {
        //     enabled: !!isConnected
        // }
    } as const;
    return contractConfig;
}

export const readBalanceConfig = ({account, isConnected}: {account: Address, isConnected: boolean}) => {
    const contractConfig = {
        address: tokenAddr,
        abi: balanceOfAbi,
        functionName: 'balanceOf',
        args: [account],
        // query: {
        //     enabled: !!isConnected
        // }
    } as const;
    return contractConfig;
}

export const readPoolConfig = () => {
    const contractConfig = {
        address: factoryAddr,
        abi: getPoolsAbi,
        functionName: 'getPoolFromAllEpoches',
        // query: {
        //     enabled: !!isConnected
        // },
    } as const;
    return contractConfig;
}

export const readAnalyticsConfig = () => {
    const contractConfig = {
        address: factoryAddr,
        abi: analyticAbi,
        functionName: 'analytics',
        // query: {
        //     enabled: !!isConnected
        // },
    } as const;
    return contractConfig;
}

