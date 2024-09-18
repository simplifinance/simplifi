import { zeroAddress } from 'viem';
import { LiquidityPool, Profile } from './interfaces';

export const DONOTHING = () => null;
export const DRAWERWIDTH = 240;
export const ZERO_ADDR = zeroAddress;
export const STRINGS = ["Decentralized", "Secure", "Permissionless"];
export const INIT_ZOOM = '0%';
export const DEFAULT_ANIMATION_STEPS = ['50%', '100%'];
export const ERROR = [
  'execution reverted: No approval to spend', 
  'execution reverted: User denied transaction',
  "MetaMask Tx Signature: User denied transaction signature.",
  "Transaction could not be completed"
];
export const CONFIRMATIONS = 3;

export const flexCenter = "flex justify-center items-center";
export const flexStart = "flex justify-start items-center";
export const flexEnd = "flex justify-end items-center";
export const flexSpread = "flex justify-between items-center";
export const flexEven = "flex justify-evenly items-center";

export const ROUTE_ENUM = {
  DASHBOARD : 'dashboard',
  INVEST: 'invest',
  DAO: 'digdao',
  LIQUIDITY: 'liquidity',
  SPEEDDOC: 'speeddoc',
  CREATE: '/liquidity/create',
  OPEN: '/liquidity/open',
  CLOSED: '/liquidity/closed'
}

export const POOL_HEADER_CONTENT = ([
  'Epoch ID',
  'Quorum',
  'Unit Liquidity',
  'Int.Rate',
  'Initiator',
  'Asset',
  'Current Fill',
  'Type',
] as const);

export const PROFILE_MOCK : Profile = {
  cData: {
    id: zeroAddress,
    payDate: 0n,
    colBals: 0n,
    expInterest: 0n,
    durOfChoice: 0n,
    turnTime: 0n,
    loan: 0n
  },
  rank: {
    member: false,
    admin: false
  },
  slot: 0n
};

export const POOL_MOCK : LiquidityPool = {
  uint256s: {
    unit: 0n,
    currentPool: 0n,
    fullInterest: 0n,
    intPerSec: 0n,
    epochId: 0n
  },
  uints: {
    intRate: 0n,
    quorum: 0n,
    selector: 0n,
    colCoverage: 0n,
    duration: 0n
  },
  addrs: {
    lastPaid: zeroAddress,
    admin: zeroAddress,
    asset: zeroAddress,
    strategy: zeroAddress
  },
  isPermissionless: false,
  allGh: 0n
}

export const POOLS_MOCK : LiquidityPool[] = [
  {
    uint256s: {
      unit: 200000000000000000000n,
      currentPool: 200000000000000000000n,
      fullInterest: 20000000000000000n,
      intPerSec: 55555555555555n,
      epochId: 0n
    },
    uints: {
      intRate: 1n,
      quorum: 3n,
      selector: 0n,
      colCoverage: 150n,
      duration: 3600n
    },
    addrs: {
      lastPaid: zeroAddress,
      admin: zeroAddress,
      asset: zeroAddress,
      strategy: zeroAddress
    },
    isPermissionless: true,
    allGh: 0n
  },
  {
    uint256s: {
      unit: 200000000000000000000n,
      currentPool: 200000000000000000000n,
      fullInterest: 20000000000000000n,
      intPerSec: 55555555555555n,
      epochId: 0n
    },
    uints: {
      intRate: 1n,
      quorum: 3n,
      selector: 0n,
      colCoverage: 150n,
      duration: 3600n
    },
    addrs: {
      lastPaid: zeroAddress,
      admin: zeroAddress,
      asset: zeroAddress,
      strategy: zeroAddress
    },
    isPermissionless: true,
    allGh: 0n
  },
  {
    uint256s: {
      unit: 200000000000000000000n,
      currentPool: 200000000000000000000n,
      fullInterest: 20000000000000000n,
      intPerSec: 55555555555555n,
      epochId: 0n
    },
    uints: {
      intRate: 1n,
      quorum: 3n,
      selector: 0n,
      colCoverage: 150n,
      duration: 3600n
    },
    addrs: {
      lastPaid: zeroAddress,
      admin: zeroAddress,
      asset: zeroAddress,
      strategy: zeroAddress
    },
    isPermissionless: true,
    allGh: 0n
  },
  {
    uint256s: {
      unit: 200000000000000000000n,
      currentPool: 200000000000000000000n,
      fullInterest: 20000000000000000n,
      intPerSec: 55555555555555n,
      epochId: 0n
    },
    uints: {
      intRate: 1n,
      quorum: 3n,
      selector: 0n,
      colCoverage: 150n,
      duration: 3600n
    },
    addrs: {
      lastPaid: zeroAddress,
      admin: zeroAddress,
      asset: zeroAddress,
      strategy: zeroAddress
    },
    isPermissionless: true,
    allGh: 0n
  },
  
]