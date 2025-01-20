import { 
    getBankDataAbi, 
    getFactoryDataAbi, 
    getPoolDataAbi, 
    getRecordAbi, 
    getUserDataAbi,
    allowanceAbi,
    symbolAbi,
    balanceOfAbi,
    getCollateralQuoteAbi
} from "@/apis/abis";
import { getFactoryAddress } from "@/apis/utils/contractAddress";
import { getTokenAddress } from "@/apis/utils/getTokenAddress";
import { Address } from "@/interfaces";

export const tokenAddr = getTokenAddress();
export const factoryAddr = getFactoryAddress();

export const readBankDataConfig = ({bank}: {bank: Address}) => {
    const contractConfig = {
        address: bank,
        abi: getBankDataAbi,
        functionName: "getData",
        args: [bank],
    } as const;
    return contractConfig;
}

export const readUserDataConfig = ({user, bank}: {user: Address, bank: Address}) => {
    const contractConfig = {
        address: bank,
        abi: getUserDataAbi,
        functionName: "getUserData",
        args: [user],
    } as const;
    return contractConfig;
}

export const readAllowanceConfig = ({owner, spender}: {owner: Address, spender: Address}) => {
    const contractConfig = {
        address: tokenAddr,
        abi: allowanceAbi,
        functionName: 'allowance',
        args: [owner, spender],
    } as const;
    return contractConfig;
} 

export const readSymbolConfig = () => {
    const contractConfig = {
        abi: symbolAbi,
        address: tokenAddr,
        functionName: 'symbol',
    } as const;
    return contractConfig;
}

export const readBalanceConfig = ({account}: {account: Address}) => {
    const contractConfig = {
        address: tokenAddr,
        abi: balanceOfAbi,
        functionName: 'balanceOf',
        args: [account],
    } as const;
    return contractConfig;
}

export const readPoolConfig = (unitId: bigint) => {
    const contractConfig = {
        address: factoryAddr,
        abi: getPoolDataAbi,
        functionName: "getPoolData",
        args: [unitId]
    } as const;
    return contractConfig;
}

export const readRecordConfig = (unit: bigint) => {
    const contractConfig = {
        address: factoryAddr,
        abi: getRecordAbi,
        functionName: "getRecord",
        args: [unit]
    } as const;
    return contractConfig;
}

export const collateralQuoteConfig = (unit: bigint) => {
    const contractConfig = {
        address: factoryAddr,
        abi: getCollateralQuoteAbi,
        functionName: "getCollaterlQuote",
        args: [unit]
    } as const;
    return contractConfig;
}

export const getFactoryDataConfig = () => {
    const contractConfig = {
        address: factoryAddr,
        abi: getFactoryDataAbi,
        functionName: 'getFactoryData',
        // query: {
        //     enabled: !!isConnected
        // },
    } as const;
    return contractConfig;
}

