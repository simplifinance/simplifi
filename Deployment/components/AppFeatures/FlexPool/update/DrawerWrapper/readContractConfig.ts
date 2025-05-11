import { allowanceAbi, balanceOfAbi, getCollateralQuoteAbi, getFactoryDataAbi, getPointAbi, getPointsAbi, getPoolDataAbi, getPoolRecordAbi, getProfileAbi, getProvidersAbi, getSafeDataAbi, getSupportedAssetsAbi, getUserDataAbi, symbolAbi, } from "@/apis/utils/abis";
import { getContractData } from "@/apis/utils/getContractData";
import { Address } from "@/interfaces";

export default function getReadFunctions({chainId} : {chainId: number | undefined,}) {
    if(!chainId) chainId = 4157;
    const {factory, token, points, providers, supportAssetManager, ...rest }= getContractData(chainId);

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
    
    const readAllowanceConfig = ({owner, spender, asset}: {owner: Address, spender: Address, asset?: Address}) => {
        const contractConfig = {
            address: asset || token.address,
            abi: allowanceAbi,
            functionName: 'allowance',
            args: [owner, spender],
        } as const;
        return contractConfig;
    } 
    
    const readSymbolConfig = () => {
        const contractConfig = {
            abi: symbolAbi,
            address: token.address,
            functionName: 'symbol',
        } as const;
        return contractConfig;
    }

    const readBalanceConfig = ({account, contractAddress}: {account: Address, contractAddress: Address}) => {
        const contractConfig = {
            address: contractAddress,
            abi: balanceOfAbi,
            functionName: 'balanceOf',
            args: [account],
        } as const;
        return contractConfig;
    }
    
    const readPoolConfig = ({unitId} : {unitId: bigint}) => {
        const contractConfig = {
            address: factory.address,
            abi: getPoolDataAbi,
            functionName: 'getPoolData',
            args: [unitId]
        };
        return contractConfig;
    }
    
    const readRecordConfig = ({recordId} : {recordId: bigint}) => {
        const contractConfig = {
            address: factory.address,
            abi: getPoolRecordAbi,
            functionName: "getPoolRecord",
            args: [recordId]
        } as const;
        return contractConfig;
    }
    
    const collateralQuoteConfig = ({unit} : {unit: bigint}) => {
        const contractConfig = {
            address: factory.address,
            abi: getCollateralQuoteAbi,
            functionName: "getCollateralQuote",
            args: [unit]
        } as const;
        return contractConfig;
    }
    
    const getFactoryDataConfig = () => {
        const contractConfig = {
            address: factory.address,
            abi: getFactoryDataAbi,
            functionName: 'getFactoryData',
        } as const;
        return contractConfig; 
    }

    const getProvidersConfig = () => {
        const contractConfig = {
            address: providers.address,
            abi: getProvidersAbi,
            functionName: 'getProviders',
        } as const;
        return contractConfig;
    }

    const getSupportedAssetConfig = () => {
        const contractConfig = {
            address: supportAssetManager.address,
            abi: getSupportedAssetsAbi,
            functionName: 'getSupportedAssets',
        } as const;
        return contractConfig;
    }

    const getPointsConfig = () => {
        const contractConfig = {
            address: points.address,
            abi: getPointsAbi,
            functionName: 'getPoints',
        } as const;
        return contractConfig;
    }

    const getPointConfig = (user: Address) => {
        const contractConfig = {
            address: points.address,
            abi: getPointAbi,
            functionName: 'getPoint',
            args: [user]
        } as const;
        return contractConfig;
    }

    const getProfileConfig = (unit: bigint, user: Address) => {
        const contractConfig = {
            address: factory.address,
            abi: getProfileAbi,
            functionName: 'getProfile', 
            args: [unit, user]
        } as const;
        return contractConfig;
    }

    return {
        getSupportedAssetConfig,
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




