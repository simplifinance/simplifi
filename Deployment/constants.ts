import { zeroAddress } from 'viem';
import { Analytics, FormattedData, LiquidityPool, Profile } from './interfaces';
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
export const SAFE_VERSION : SafeVersion = '1.4.1';
export enum ROUTER { PERMISSIONLESS, PERMISSIONED }
export const DRAWERWIDTH = 240;
export const ZERO_ADDR = zeroAddress;
export const STRINGS = ["Decentralized", "Secure", "Permissionless"];
export const INIT_ZOOM = '0%';
export const DEFAULT_ANIMATION_STEPS = ['50%', '100%'];
export const CONFIRMATIONS = 3; // 3 blocks
export const flexCenter = "flex justify-center items-center";
export const flexStart = "flex justify-start items-center";
export const flexEnd = "flex justify-end items-center";
export const flexSpread = "flex justify-between items-center";
export const flexEven = "flex justify-evenly items-center";
export const ANALYTICS : Analytics = {
  tvlInXFI: 0n,
  tvlInUsd: 0n,
  totalPermissioned: 0n,
  totalPermissionless: 0n
}

export const PROFILE_MOCK : Profile = {
  id: zeroAddress,
  payDate: 0n,
  colBals: 0n,
  expInterest: 0n,
  durOfChoice: 0n,
  turnTime: 0n,
  loan: 0n,
  sentQuota: false
};

export const POOL_MOCK : LiquidityPool = {
  uint256s: {
    unit: 0n,
    currentPool: 0n,
    fullInterest: 0n,
    intPerSec: 0n,
    unitId: 0n,
    rId: 0n
  },
  stage: 0n,
  uints: {
    intRate: 0n,
    quorum: 0n,
    selector: 0n,
    colCoverage: 0n,
    duration: 0n,
    cSlot: 0n,
    allGh: 0n,
    userCount: 0n
  },
  addrs: {
    lastPaid: zeroAddress,
    admin: zeroAddress,
    asset: zeroAddress,
    bank: zeroAddress,
  },
  router: 'PERMISSIONLESS',
  status: 0n
}

export const FORMATTEDDATA_MOCK : FormattedData = {
  payDate_InDateFormat: '',
  payDate_InSec: 0,
  turnTime_InDateFormat: '',
  turnTime_InSec: 0,
  durOfChoice_InSec: 0,
  colBals_InEther: '',
  loan_InEther: '',
  expInterest_InEther: '',
  id_lowerCase: '',
  id_toString: '',
  loan_InBN: new BigNumber(0),
  sentQuota: false
}

export const ROUTE_ENUM = {
  DASHBOARD: '/',
  FLEXPOOL: '/flexpool',
  YIELD: '/yield',
  DAO: '/dao',
  CREATE: '/flexpool/create',
  POOLS: '/flexpool/pools',
  FAQ: '/faq',
  AIASSIST: '/aiassist'
}