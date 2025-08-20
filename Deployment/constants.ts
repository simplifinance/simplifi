import { zeroAddress } from 'viem';
import { Address, Path, } from './interfaces';
import { filterTransactionData, formatAddr } from './utilities';

export enum Stage { JOIN, GET, PAYBACK, CANCELED, ENDED }
export enum StageStr { 'JOIN', 'GET', 'PAYBACK', 'CANCELED', 'ENDED' }
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
  PROVIDERS: 'Providers',
  CREATE: 'CreateFlexpool',
  FAQ: 'Faq',
  AIASSIST: 'AiAssist',
  HOME: 'Home'
}

export const baseContracts : Record<string, Address> = {
  44787: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  42220: "0x765de816845861e75a25fca122bb6898b8b1282a",
  4157: zeroAddress,
  4158: zeroAddress
} as const;
export const chainIds = [44787, 4157, 42220, 4158];
export const currencies = ['CELO', 'XFI', 'CELO', 'XFI'] as const;
export const networks = ['ALFAJORES', 'CROSSFITESTNET', 'CELO', 'CROSSFIMAINNET'] as const;
export const baseCurrencies = ['CUSD', 'XUSD', 'CUSD', 'XUSD'] as const;
export const collateralCurrencies = ['TCELO', 'TUSD', 'WCELO', 'WXFI'] as const;
export const pairs = ['CUSD/TCELO', 'TUSD/XFI', 'CUSD/WCELO', 'XUSD/WXFI'] as const;

export const displayMessages : Record<string, {start: string, end: string}> = {
  'approve': {start: "Approving spending limit", end: 'Approval completed'},
  'deposit': {start: "Depositing collateral", end: 'Deposit successful'},
  'getFinance': {start: "Requesting to get finance", end: 'Get finance successful'},
  'transferFrom': {start: `Requesting withdrawal`, end: 'Withdrawal completed'},
  'contribute': {start: 'Contributing to pool', end: 'Successfully contributed'},
  'createPool': {start: 'Launching a new FlexPool', end: 'Successfully launched a pool'},
  'borrow': {start: 'Request to access credit from loan providers', end: 'Transaction success'},
  'claimTestTokens': {start: 'Claiming test tokens', end: 'Claim success'},
  'payback': {start: 'Returning funds back to pool', end: 'Payback was successful'},
  'liquidate': {start: 'Liquidation request', end: 'Liquidation was successful'},
  'closePool': {start: 'Removing a pool', end: 'Successfully removed a pool'},
  'registerToEarnPoints' : {start: 'Signing up for reward', end: 'Registration was successful'},
  'removeLiquidity': {start: 'Requesting to remove liquidity', end: 'Successfully removed liquidity'},
  'provideLiquidity': {start: 'Request to provide liquidity', end: 'You successully provided liquidity '},
  'setVerification': {start: "Verifying your humanity score", end: 'Verification successful'},
}

// We support only USDC and native platform token for now
export const getSupportedCollateralAsset = (chainId: number, symbol: string) => {
  const { contractAddresses: ca } = filterTransactionData({ chainId, filter: false });
  const supportedAsset = [
    {
      address: formatAddr(ca.WrappedNative),
      symbol: symbol,
      disabled: false
    },
    {
      address: formatAddr(ca.SimpliToken),
      symbol: 'SIMPL',
      disabled: true
    },
  ] as const;
  return supportedAsset;
}

export const getChainData = (chainId: number | undefined) => {
  const chainId_ = chainId? chainId : 44787;
  const index = chainIds.indexOf(chainId_);
  const currency = currencies[index];
  const network = networks[index];
  const baseCurrency = baseCurrencies[index];
  const collateralCurrency = collateralCurrencies[index];
  const pair = pairs[index];

  return { currency, network, baseCurrency, collateralCurrency, pair };
}

export const APP_NAME = 'Simplifinance';
export const APP_LOGO_URI = 'https://testnet.simplifinance.xyz/logoSimplifi.png';
export const APP_URI = 'https://testnet.simplifinance.xyz/'

// Assets with USDC pairs
// export const supportedConvertibleAssets = [
//   {
//     address: '0xE4D517785D091D3c54818832dB6094bcc2744545',
//     symbol: 'cREAL'
//   },
//   {
//     address: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
//     symbol: 'cEUR'
//   },
//   {
//     address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
//     symbol: 'cUSD'
//   },
//   {
//     address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
//     symbol: 'CELO'
//   },
//   {
//     address: '0x87D61dA3d668797786D73BC674F053f87111570d',
//     symbol: 'BridgedUSDC'
//   },
//   {
//     address: '0x6e673502c5b55F3169657C004e5797fFE5be6653',
//     symbol: 'BridgedEUROC'
//   },
//   {
//     address: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
//     symbol: 'cKES'
//   },
//   {
//     address: '0xBba91F588d031469ABCCA566FE80fB1Ad8Ee3287',
//     symbol: 'USDT'
//   },
//   {
//     address: '0x5E0E3c9419C42a1B04e2525991FB1A2C467AB8bF',
//     symbol: 'PUSO'
//   },
//   {
//     address: '0x84CBD49F5aE07632B6B88094E81Cce8236125Fe0',
//     symbol: 'cAUD'
//   },
//   {
//     address: '0xe6A57340f0df6E020c1c0a80bC6E13048601f0d4',
//     symbol: 'cCOP'
//   },
//   {
//     address: '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375',
//     symbol: 'cGHS'
//   },
//   {
//     address: '0x1e5b44015Ff90610b54000DAad31C89b3284df4d',
//     symbol: 'cZAR'
//   },
//   {
//     address: '0x02EC9E0D2Fd73e89168C1709e542a48f58d7B133',
//     symbol: 'cCAD'
//   },
//   {
//     address: '0x47f2Fb88105155a18c390641C8a73f1402B2BB12',
//     symbol: 'cGBP'
//   },
// ].concat(supportedCeloCollateralAsset);
