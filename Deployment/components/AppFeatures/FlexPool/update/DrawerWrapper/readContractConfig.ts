import { 
    getSafeDataAbi, 
    getFactoryDataAbi, 
    getPoolDataAbi, 
    getPoolRecordAbi, 
    getProfileAbi,
    getProvidersAbi,
    getPointsAbi,
    getPointAbi,
    getUserDataAbi,
    allowanceAbi,
    symbolAbi,
    balanceOfAbi,
    getCollateralQuoteAbi
} from "@/apis/utils/abis";
import { getContractData } from "@/apis/utils/getContractData";
import { Address } from "@/interfaces";

export default function getReadFunctions({chainId} : {chainId: number | undefined,}) {
    if(!chainId) chainId = 4157;
    const {factory, token, points, providers, ...rest}= getContractData(chainId);

    const readSafeDataConfig = ({safe}: {safe: Address}) => {
        const contractConfig = {
            address: safe,
            abi: getSafeDataAbi,
            functionName: "getData",
            args: [safe],
        } as const;
        return contractConfig;
    }
    
    const readUserDataConfig = ({user, safe, recordId}: {user: Address, safe: Address, recordId: bigint}) => {
        const contractConfig = {
            address: safe,
            abi: getUserDataAbi,
            functionName: "getUserData",
            args: [user, recordId],
        } as const;
        return contractConfig;
    }
    
    const readAllowanceConfig = ({owner, spender}: {owner: Address, spender: Address}) => {
        const contractConfig = {
            address: token,
            abi: allowanceAbi,
            functionName: 'allowance',
            args: [owner, spender],
        } as const;
        return contractConfig;
    } 
    
    const readSymbolConfig = () => {
        const contractConfig = {
            abi: symbolAbi,
            address: token,
            functionName: 'symbol',
        } as const;
        return contractConfig;
    }

    const readBalanceConfig = ({account}: {account: Address}) => {
        const contractConfig = {
            address: token,
            abi: balanceOfAbi,
            functionName: 'balanceOf',
            args: [account],
        } as const;
        return contractConfig;
    }
    
    const readPoolConfig = ({unit} : {unit: bigint}) => {
        const contractConfig = {
            address: factory,
            abi: getPoolDataAbi,
            functionName: "getPoolData",
            args: [unit]
        } as const;
        return contractConfig;
    }
    
    const readRecordConfig = ({recordId} : {recordId: bigint}) => {
        const contractConfig = {
            address: factory,
            abi: getPoolRecordAbi,
            functionName: "getRecord",
            args: [recordId]
        } as const;
        return contractConfig;
    }
    
    const collateralQuoteConfig = ({unit} : {unit: bigint}) => {
        const contractConfig = {
            address: factory,
            abi: getCollateralQuoteAbi,
            functionName: "getCollateralQuote",
            args: [unit]
        } as const;
        return contractConfig;
    }
    
    const getFactoryDataConfig = () => {
        const contractConfig = {
            address: factory,
            abi: getFactoryDataAbi,
            functionName: 'getFactoryData',
            // query: {
            //     enabled: !!isConnected
            // },
        } as const;
        return contractConfig;
    }

    const getProvidersConfig = () => {
        const contractConfig = {
            address: providers,
            abi: getProvidersAbi,
            functionName: 'getProviders',
        } as const;
        return contractConfig;
    }

    const getPointsConfig = () => {
        const contractConfig = {
            address: points,
            abi: getPointsAbi,
            functionName: 'getPoints',
        } as const;
        return contractConfig;
    }

    const getPointConfig = (user: Address) => {
        const contractConfig = {
            address: points,
            abi: getPointAbi,
            functionName: 'getPoint',
            args: [user]
        } as const;
        return contractConfig;
    }

    const getProfileConfig = (unit: bigint, user: Address) => {
        const contractConfig = {
            address: points,
            abi: getProfileAbi,
            functionName: 'getProfile',
            args: [unit, user]
        } as const;
        return contractConfig;
    }

    return {
        collateralQuoteConfig,
        getFactoryDataConfig,
        readAllowanceConfig,
        readBalanceConfig,
        readRecordConfig,
        readPoolConfig,
        getPointsConfig,
        readSymbolConfig,
        readSafeDataConfig,
        getProvidersConfig,
        readUserDataConfig,
        getPointConfig,
        getProfileConfig,
        providers,
        factory,
        token,
        points,
        ...rest
    }
}




