import { zeroAddress } from 'viem';
import { Analytics, FormattedData, LiquidityPool, Path, Profile } from './interfaces';
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
  id: zeroAddress,
  paybackTime: 0n,
  colBals: 0n,
  interestPaid: 0n,
  durOfChoice: 0n,
  turnStartTime: 0n,
  loan: 0n,
  sentQuota: false,
  getFinanceTime: 0n
};

export const poolMock : LiquidityPool = {
  bigInt: { unit: 0n, currentPool: 0n, unitId: 0n, recordId: 0n },
  stage: 0n,
  lInt: {
    intRate: 0n,
    quorum: 0n,
    selector: 0n,
    colCoverage: 0n,
    duration: 0n,
    cSlot: 0n,
    allGh: 0n,
    userCount: 0n
  },
  addrs: { lastPaid: zeroAddress, admin: zeroAddress, asset: zeroAddress, bank: zeroAddress, },
  interest: {fullInterest: 0n, intPerSec: 0n,intPerChoiceOfDur: 0n},
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

export const routeEnum : Record<string, Path> = {
  DASHBOARD: 'Dashboard',
  FLEXPOOL: 'Flexpool',
  YIELD: 'Yield',
  DAO: 'Dao',
  CREATE: 'CreateFlexpool',
  FAQ: 'Faq',
  AIASSIST: 'AiAssist'
}

export const supportedChains = [4157, 44787];
export const currencies = ['XFI', 'CELO'];
export const networks = ['CROSSFI', 'ALFAJORES'];
export const pairs = ['USDT/XFI', "CUSD/CELO"];