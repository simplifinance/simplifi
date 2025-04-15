import { TransactionReceipt, zeroAddress } from 'viem';
import { Address, Analytics, FormattedData, LiquidityPool, Path, Profile } from './interfaces';
import BigNumber from 'bignumber.js';
import type { SafeVersion } from '@safe-global/types-kit';

export enum FuncTag { 
  JOIN,
  GET, 
  PAYBACK, 
  WITHDRAW,
  CANCELED,
  ENDED
}
export const safeVersion : SafeVersion = '1.4.1';
export enum Router { PERMISSIONLESS, PERMISSIONED }
export const initialZoom = '0%';
export const defaultAnimationSteps = ['50%', '100%'];
export const confirmationBlocks = 3; // 3 blocks
export const flexCenter = "flex justify-center items-center";
export const flexStart = "flex justify-start items-center";
export const flexEnd = "flex justify-end items-center";
export const flexSpread = "flex justify-between items-center";
export const flexEven = "flex justify-evenly items-center";
export const analytics : Analytics = {
  tvlInXFI: 0n,
  tvlInUsd: 0n,
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
  slot: '0',
  providers: [{
    account: zeroAddress,
    accruals: {intPerSec: '0', fullInterest: '0'},
    earnStartDate: '0',
    amount: '0',
    rate: '0',
    slot: '0'
  }]
};

export const poolMock : LiquidityPool = {
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

export const formattedMockData : FormattedData = {
  paybackTimeInDateFormat: '',
  paybackTimeInSec: 0,
  turnStartTimeInDateFormat: '',
  turnStartTimeInSec: 0,
  durOfChoiceInSec: 0,
  colBalsInEther: '',
  loanInEther: '',
  interestPaidInEther: '',
  idLowerCase: '',
  idToString: '',
  loanInBN: new BigNumber(0),
  sentQuota: false
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
  DAO: 'Dao',
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