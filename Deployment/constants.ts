import { Address, Path, } from './interfaces';

export enum Stage { JOIN, GET, PAYBACK, WITHDRAW, CANCELED, ENDED }
export enum StageStr { 'JOIN', 'GET', 'PAYBACK', 'WITHDRAW', 'CANCELED', 'ENDED' }
export enum Router { NONE, PERMISSIONLESS, PERMISSIONED }

// 3 block confirmation
export const confirmationBlocks = 3; 

export const flexCenter = "flex justify-center items-center";
export const flexStart = "flex justify-start items-center";
export const flexEnd = "flex justify-end items-center";
export const flexSpread = "flex justify-between items-center";
export const flexEven = "flex justify-evenly items-center";

export const routeEnum : Record<string, Path> = {
  DASHBOARD: 'Dashboard',
  FLEXPOOL: 'Flexpool',
  YIELD: 'Yield',
  CREATE: 'CreateFlexpool',
  FAQ: 'Faq',
  AIASSIST: 'AiAssist'
}

export const celoAddresses : Record<string, Address> = {
  44787: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  42220: "0x765de816845861e75a25fca122bb6898b8b1282a"
} as const;
export const currencies = ['CELO', 'XFI'] as const;
export const networks = ['ALFAJORES', 'CROSSFI'] as const;
export const pairs = ['CUSD/CELO', 'USDT/XFI'] as const;

// We support only USDC and native platform token for now
export const supportedCeloCollateralAsset = [
  {
    address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
    symbol: 'USDC'
  },
  {
    address: "0x962289B0F4f0Aa00d84D7a55DAFC68F28C54fAC0",
    symbol: 'TSFT'
  }
] as const;

// Assets with USDC pairs
export const supportedConvertibleAssets = [
  // {
  //   address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
  //   symbol: 'USDC'
  // },
  {
    address: '0xE4D517785D091D3c54818832dB6094bcc2744545',
    symbol: 'cREAL'
  },
  {
    address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
    symbol: 'cEUR'
  },
  {
    address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
    symbol: 'cUSD'
  },
  {
    address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    symbol: 'CELO'
  },
  {
    address: '0x87D61dA3d668797786D73BC674F053f87111570d',
    symbol: 'BridgedUSDC'
  },
  {
    address: '0x6e673502c5b55F3169657C004e5797fFE5be6653',
    symbol: 'BridgedEUROC'
  },
  {
    address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
    symbol: 'cKES'
  },
  {
    address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
    symbol: 'USDT'
  },
  {
    address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
    symbol: 'PUSO'
  },
  {
    address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
    symbol: 'cAUD'
  },
  {
    address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
    symbol: 'cCOP'
  },
  {
    address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
    symbol: 'cGHS'
  },
  {
    address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
    symbol: 'cZAR'
  },
  {
    address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
    symbol: 'cCAD'
  },
  {
    address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
    symbol: 'cGBP'
  },
].concat(supportedCeloCollateralAsset);


// [
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
//       symbol: 'cEUR'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0xE4D517785D091D3c54818832dB6094bcc2744545',
//       symbol: 'cREAL'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0xE4D517785D091D3c54818832dB6094bcc2744545',
//       symbol: 'cREAL'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
//       symbol: 'cEUR'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0xE4D517785D091D3c54818832dB6094bcc2744545',
//       symbol: 'cREAL'
//     }
//   ],
//   [
//     {
//       address: '0x6e673502c5b55F3169657C004e5797fFE5be6653',
//       symbol: 'BridgedEUROC'
//     },
//     {
//       address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
//       symbol: 'cEUR'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0xB0FA15e002516d0301884059c0aaC0F0C72b019D',
//       symbol: 'eXOF'
//     }
//   ],
//   [
//     {
//       address: '0x6e673502c5b55F3169657C004e5797fFE5be6653',
//       symbol: 'BridgedEUROC'
//     },
//     {
//       address: '0xB0FA15e002516d0301884059c0aaC0F0C72b019D',
//       symbol: 'eXOF'
//     }
//   ],
//   [
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
//       symbol: 'cEUR'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     }
//   ],
//   [
//     {
//       address: '0x6e673502c5b55F3169657C004e5797fFE5be6653',
//       symbol: 'BridgedEUROC'
//     },
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//       symbol: 'CELO'
//     },
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     }
//   ],
//   [
//     {
//       address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
//       symbol: 'cEUR'
//     },
//     {
//       address: '0xE4D517785D091D3c54818832dB6094bcc2744545',
//       symbol: 'cREAL'
//     }
//   ],
//   [
//     {
//       address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
//       symbol: 'cEUR'
//     },
//     {
//       address: '0xB0FA15e002516d0301884059c0aaC0F0C72b019D',
//       symbol: 'eXOF'
//     }
//   ],
//   [
//     {
//       address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
//       symbol: 'cEUR'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0xE4D517785D091D3c54818832dB6094bcc2744545',
//       symbol: 'cREAL'
//     },
//     {
//       address: '0xB0FA15e002516d0301884059c0aaC0F0C72b019D',
//       symbol: 'eXOF'
//     }
//   ],
//   [
//     {
//       address: '0xE4D517785D091D3c54818832dB6094bcc2744545',
//       symbol: 'cREAL'
//     },
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     }
//   ],
//   [
//     {
//       address: '0x6e673502c5b55F3169657C004e5797fFE5be6653',
//       symbol: 'BridgedEUROC'
//     },
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
//       symbol: 'USDC'
//     },
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     }
//   ],
//   [
//     {
//       address: '0x6e673502c5b55F3169657C004e5797fFE5be6653',
//       symbol: 'BridgedEUROC'
//     },
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//       symbol: 'BridgedUSDC'
//     },
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     }
//   ],
//   [
//     {
//       address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//       symbol: 'cUSD'
//     },
//     {
//       address: '0xB0FA15e002516d0301884059c0aaC0F0C72b019D',
//       symbol: 'eXOF'
//     }
//   ],
//   [
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     },
//     {
//       address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//       symbol: 'cKES'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     }
//   ],
//   [
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     },
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     }
//   ],
//   [
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     },
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     }
//   ],
//   [
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     },
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     }
//   ],
//   [
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     },
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     }
//   ],
//   [
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//       symbol: 'USDT'
//     },
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//       symbol: 'PUSO'
//     },
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     }
//   ],
//   [
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     },
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     }
//   ],
//   [
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     },
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     }
//   ],
//   [
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     },
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     }
//   ],
//   [
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//       symbol: 'cAUD'
//     },
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     }
//   ],
//   [
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     },
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     }
//   ],
//   [
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     },
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     }
//   ],
//   [
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     },
//     {
//       address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//       symbol: 'cCOP'
//     }
//   ],
//   [
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     },
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     }
//   ],
//   [
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     },
//     {
//       address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//       symbol: 'cGHS'
//     }
//   ],
//   [
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ],
//   [
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     },
//     {
//       address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//       symbol: 'cGBP'
//     }
//   ],
//   [
//     {
//       address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//       symbol: 'cCAD'
//     },
//     {
//       address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//       symbol: 'cZAR'
//     }
//   ]
// ]
