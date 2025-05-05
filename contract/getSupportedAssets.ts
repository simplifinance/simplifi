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
