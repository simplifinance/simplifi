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
        oracleAddress: '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946',
        pair: 'CELO/USD'
    },
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0xc7A353BaE210aed958a1A2928b654938EC59DaB2',
        pair: 'USDC/USD'
    }
];

export const alfajoresOracleData : PriceData[] = [
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946',
        pair: 'CELO/USD'
    },
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x642Abc0c069dC5041dEA5bFC155D38D844779274',
        pair: 'USDC/USD'
    }
];

export const crossFiOracleData : PriceData[] = [
    {
        latestPrice: 0n,
        timestampOflatestPrice: 0n,
        oracleAddress: '0x859e221ada7cebdf5d4040bf6a2b8959c05a4233',
        pair: 'XFI/USD'
    },
];

export const getSupportedAssets = (newAsset?: string) => {
    let assets = [
        {
            address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
            symbol: 'USDC'
        },
    ];

    if(newAsset) assets.push({
        address: newAsset,
        symbol: ''
    });

    return assets.map(({address}) => address, assets);
} 

export const alfajoresKeys = [
    'CELO/USD',
    'USDC/USD',
    'NGN/USD'
] as const;

export const celoKeys = [
    'CELO/USD',
    'USDC/USD',
] as const;

export const alfajoresPairAddresses = [
    '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946',
    '0x642Abc0c069dC5041dEA5bFC155D38D844779274',
    '0xeDf0C69F723910750500A8136B971BE135775A07'
] as const;

export const celoPairAddresses = [
    '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946',
    '0xc7A353BaE210aed958a1A2928b654938EC59DaB2'
] as const;

