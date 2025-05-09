import { assert } from "chai";
import { zeroAddress } from "viem";

export enum Network { HARDHAT, CELO, CROSSFI };
export type NetworkName = 'crosstest' | 'celo' | 'alfajores' | 'hardhat';
type SupportedAsset = {
    address: string;
    symbol: string;
};
export type PriceData = {
    pair: string;
    oracleAddress: string;
    latestPrice: bigint;
    timestampOflatestPrice: bigint;
}

export const celoOracleData : PriceData[] = [
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0xc7A353BaE210aed958a1A2928b654938EC59DaB2',
        pair: 'USDC/USD'
    },
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946', // The oracle address is not correct since the token is yet to launch
        pair: 'SIMPL/USD'
    },
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x0568fD19986748cEfF3301e55c0eb1E729E0Ab7e',
        pair: 'CELO/USD'
    },
];

export const alfajoresOracleData : PriceData[] = [
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x642Abc0c069dC5041dEA5bFC155D38D844779274',
        pair: 'USDC/USD'
    },
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946', // The oracle address is not correct since the token is yet to launch
        pair: 'SIMPL/USD'
    },
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946',
        pair: 'CELO/USD'
    },
];

export const crossFiOracleData : PriceData[] = [
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x859e221ada7cebdf5d4040bf6a2b8959c05a4233', // The oracle address is not correct since the token is yet to launch
        pair: 'SIMPL/USD'
    },
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x859e221ada7cebdf5d4040bf6a2b8959c05a4233',
        pair: 'XFI/USD'
    }
];

export const getSupportedAssets = (network: Network, networkName: NetworkName, additionalSupportedAssets: string[]) => {
    const defaultCelosSupportedAsset :SupportedAsset = {
        address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
        symbol: 'USDC'
    };

    let assets : SupportedAsset[] = [];
    let priceData : PriceData[] = [];

    switch (network) {
        case Network.CROSSFI:
            additionalSupportedAssets.forEach((item) => {
                assets.push({address: item, symbol: 'None'});
            });
            priceData = crossFiOracleData;
            break;
        case Network.CELO:
            assets.concat([defaultCelosSupportedAsset]);
            additionalSupportedAssets.forEach((item) => {
                assets.push({address: item, symbol: 'None'});
            });
            priceData = networkName === 'alfajores'? alfajoresOracleData : celoOracleData;
            
        case Network.HARDHAT:
            additionalSupportedAssets.forEach((item) => {
                assets.push({address: item, symbol: 'None'});
            });
            priceData.push({latestPrice: 0n, timestampOflatestPrice: 0n, oracleAddress: zeroAddress, pair: "SIMPL/USD"})
            break;

        default:
            break;
    }
    return {
        assets: assets.map(({address}) => address, assets),
        priceData
    };
} 

// export const alfajoresKeys = [
//     'CELO/USD',
//     'USDC/USD',
//     'NGN/USD'
// ] as const;

// export const celoKeys = [
//     'CELO/USD',
//     'USDC/USD',
// ] as const;

// export const alfajoresPairAddresses = [
//     '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946',
//     '0x642Abc0c069dC5041dEA5bFC155D38D844779274',
//     '0xeDf0C69F723910750500A8136B971BE135775A07'
// ] as const;

// export const celoPairAddresses = [
//     '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946',
//     '0xc7A353BaE210aed958a1A2928b654938EC59DaB2'
// ] as const;

