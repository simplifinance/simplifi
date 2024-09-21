import { zeroAddress } from 'viem';
import { FormattedData, LiquidityPool, Profile } from './interfaces';
import BigNumber from 'bignumber.js';

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
  'Liquidity/head',
  'Int.Rate',
  'Pair',
  'Fill',
  'Type',
  'Action'
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
    epochId: 0n,
  },
  stage: 0n,
  userCount: {
    _value: 0n
  },
  cData: [{...PROFILE_MOCK}],
  uints: {
    intRate: 0n,
    quorum: 0n,
    selector: 0n,
    colCoverage: 0n,
    duration: 0n,
  },
  addrs: {
    lastPaid: zeroAddress,
    admin: zeroAddress,
    asset: zeroAddress,
    strategy: zeroAddress,
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
    allGh: 0n,
    cData: [{...PROFILE_MOCK}],
    stage: 0n,
    userCount: {
      _value: 0n
    }
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
    allGh: 0n,
    cData: [{...PROFILE_MOCK}],
    stage: 0n,
    userCount: {
      _value: 0n
    }
  },
  {
    uint256s: {
      unit: 200000000000000000000n,
      currentPool: 200000000000000000000n,
      fullInterest: 20000000000000000n,
      intPerSec: 55555555555555n,
      epochId: 0n,
    },
    cData: [{...PROFILE_MOCK}],
    stage: 0n,
    userCount: {
      _value: 3n
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
      epochId: 0n,
    },
    cData: [{...PROFILE_MOCK}],
    stage: 0n,
    userCount: {
      _value: 0n
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
  
];

export const FORMATTEDDATA_MOCK : FormattedData = {
  payDate_InDateFormat: '',
  payDate_InSec: 0,
  slot_toNumber: 0,
  turnTime_InDateFormat: '',
  turnTime_InSec: 0,
  durOfChoice_InSec: 0,
  colBals_InEther: '',
  loan_InEther: '',
  expInterest_InEther: '',
  id_lowerCase: '',
  isMember: false,
  isAdmin: false,
  id_toString: '',
  loan_InBN: new BigNumber(0)
}