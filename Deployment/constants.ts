import { TransactionReceipt, zeroAddress } from 'viem';
import { Address, Analytics, Pool, Path, Profile, FormattedCData, ProviderResult, Point, SupportedAsset } from './interfaces';
import BigNumber from 'bignumber.js';
import { getContractData } from './apis/utils/getContractData';

export enum Stage { JOIN, GET, PAYBACK, WITHDRAW, CANCELED, ENDED }
export enum StageStr { 'JOIN', 'GET', 'PAYBACK', 'WITHDRAW', 'CANCELED', 'ENDED' }
export enum Router { PERMISSIONLESS, PERMISSIONED }

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
// 0x4045FD2c1ce56Fe5C50c6F631EC5df8e6bcc4b00
