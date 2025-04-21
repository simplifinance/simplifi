import { TransactionReceipt, zeroAddress } from 'viem';
import { Address, Analytics, Pool, Path, Profile, FormattedCData } from './interfaces';
import BigNumber from 'bignumber.js';

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

export const analytics : Analytics = {
  tvlCollateral: 0n,
  tvlBase: 0n,
  totalPermissioned: 0n,
  totalPermissionless: 0n
}

export const profileMock : Profile = {
  profile: {
    paybackTime: '0',
    turnStartTime: '0',
    getFinanceTime: '0',
    loan: '0',
    colBals: '0',
    id: '0',
    sentQuota: false
  },
  slot: {isAdmin: false, isMember: false, value: '0'},
  providers: [{
    account: zeroAddress,
    accruals: {intPerSec: '0', fullInterest: '0'},
    earnStartDate: '0',
    amount: '0',
    rate: '0',
    slot: '0'
  }]
};

export const poolMock : Pool = {
  big: { unit: 0n, currentPool: 0n, unitId: 0n, recordId: 0n },
  stage: 0n,
  low: {
    maxQuorum: 0n,
    selector: 0n,
    colCoverage: 0n,
    duration: 0n,
    allGh: 0n,
    userCount: 0n
  },
  addrs: { lastPaid: zeroAddress, admin: zeroAddress, colAsset: zeroAddress, safe: zeroAddress, },
  router: 'PERMISSIONLESS',
  status: 0n
}

export const formattedMockData : FormattedCData = {
  profile: {
    paybackTime: { inDate: '0', inSec: 0},
    getFinanceTime: { inDate: '0', inSec: 0},
    turnStartTime: { inDate: '0', inSec: 0},
    colBals: '0',
    loan: {inBN: BigNumber(0), inEther: '0'},
    id: zeroAddress,
    sentQuota: 'Not Sent'
  },
  providers: [],
  slot: {value: 0, isAdmin: false, isMember: false}
}

export const mockReceipt : TransactionReceipt = {
  blockHash: "" as Address,
  blockNumber: 0n,
  contractAddress: undefined,
  cumulativeGasUsed: 0n,
  effectiveGasPrice: 0n,
  from: "" as Address,
  gasUsed: 0n,
  logs: [],
  logsBloom: "" as Address,
  status: "success",
  to: null,
  transactionHash: "" as Address,
  transactionIndex: 0,
  type: "legacy"
};

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
export const supportedChainIds = [44787, 4157,];
export const currencies = ['CELO', 'XFI'] as const;
export const networks = ['ALFAJORES', 'CROSSFI'] as const;
export const pairs = ['CUSD/CELO', 'USDT/XFI'] as const;
// 0x4045FD2c1ce56Fe5C50c6F631EC5df8e6bcc4b00