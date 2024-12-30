import { BigNumberish, ethers } from "ethers";
import { Common, Counters } from "../contract/typechain-types/contracts/apis/IFactory";
// import { WaitForTransactionReceiptReturnType } from "wagmi/actions";
import BigNumber from "bignumber.js";

export type Path = '/dashboard' | '/yield' | '/simplidao' | '/flexpool' | 'faq';
export type WagmiConfig = import("wagmi").Config;
export type TxnStatus = "Pending" | "Confirming" | "Confirmed" | "Reverted" | "Failed";
export type Str = string;
export type Address = `0x${string}`;
export type LiquidityInnerLinkEntry = 'Dashboard' | 'Create' | 'Open' | 'Closed' | string;
export type ActiveLink = 'Home' | 'Invest' | 'Dao' | 'Liquidity' | 'SpeedDoc' | '';
export type InputSelector = 'Quorum' | 'Duration' | 'CCR' | 'Interest' | 'UnitLiquidity' | 'address';
export type ButtonText = 'ADD LIQUIDITY' | 'GET FINANCE' | 'PAYBACK' | 'LIQUIDATE' | 'WAIT' | 'DISABLED' | 'APPROVE' | 'CREATE' | 'ENDED' | 'REMOVE';
export type Router = 'Permissioned' | 'Permissionless';
export type VoidFunc = () => void;
export type DrawerAnchor = 'permission' | 'confirmation' | 'poolDetails' | 'providers' | '';
export enum FuncTag { 
  JOIN,
  GET, 
  PAYBACK, 
  WITHDRAW,
  ENDED
}
export type ButtonContent = 'Approve' | 'CreatePool' | 'Completed' | 'Failed';
export type PoolType = 'Permissioned' | 'Permissionless';
export type Anchor = 'top' | 'left' | 'bottom' | 'right';
export type Pools = Readonly<LiquidityPool[]>;
// export type Provider = Common.ContributorStruct;
export type Profile = Common.ContributorDataStruct;
export type TransactionCallback = (arg: TrxState) => void;
export type Message = string;
export type TrxResult = 'success' | 'reverted';
export interface TrxState {
  status?: TrxResult;
  message: string;
  // buttonText?: ButtonContent;
  contractState?: Pools
}

// export interface TransactionCallbackArg {
//   message?: Message; 
//   contractState?: Pools;
//   status?: TrxResult;
//   // loading: boolean;
//   // buttonText?: ButtonContent;
//   // loading: boolean;
// }

// export interface TransactionResult {
//   loading: boolean; 
//   message: string;
//   txResult?: TrxnResult;
//   buttonText?: ButtonContent;
// }

export type LiquidityPool = {
  userCount: Counters.CounterStruct;
  uints: Common.UintsStruct;
  uint256s: Common.Uint256sStruct;
  addrs: Common.AddressesStruct;
  allGh: BigNumberish;
  isPermissionless: boolean;
  cData: Readonly<Common.ContributorDataStruct[]>;
  stage: BigNumberish;
}

export interface LiquidityChildrenProps {
  storage: Pools;
  // setStorage: (arg: TrxnResult) => void;
}

// export interface TrxnResult {
//   // wait?: WaitForTransactionReceiptReturnType;
//   // pools: Pools;
//   // profile: Profile;
// }

export interface CreatePermissionedPoolParams extends Config{
  intRate: number;
  durationInHours: number;
  colCoverage: number;
  unitLiquidity: bigint;
  // liquidAsset: Address;
  contributors: Address[];
}

export interface CreatePermissionLessPoolParams extends Config{
  intRate: number;
  quorum: number;
  durationInHours: number;
  colCoverage: number;
  unitLiquidity: bigint;
  // liquidAsset: Address;
}

export interface GetProfileParam {
  epochId: bigint;
  user: Address;
}

export interface Config {
  config: WagmiConfig;
  account: Address;
  callback?: TransactionCallback; 
}

export interface CommonParam extends Config {
  epochId: bigint;
}

export interface GetFinanceParam extends CommonParam {
  daysOfUseInHr: number;
  value: bigint;
}

export interface PoolColumnProps {
  pool: LiquidityPool;
}

export interface ScreenUserResult{
  isMember: boolean;
  isAdmin: boolean;
  data: FormattedData;
}

export interface FormattedData {
  payDate_InDateFormat: string;
  payDate_InSec: number;
  slot_toNumber: number;
  turnTime_InDateFormat: string;
  turnTime_InSec: number;
  durOfChoice_InSec: number;
  colBals_InEther: string;
  loan_InEther: string;
  expInterest_InEther: string;
  id_lowerCase: string;
  id_toString: string;
  isMember: boolean;
  isAdmin: boolean;
  loan_InBN: BigNumber;
  sentQuota: boolean;
}

export interface FormattedPoolContentProps {
  unit: BigNumberish;
  pair: string;
  quorum_toNumber: number;
  userCount_toNumber: number;
  allGET_bool: boolean;
  allGh_toNumber: number;
  epochId_toNumber: number;
  epochId_bigint: bigint;
  stage_toNumber: number;
  expectedPoolAmt_bigint: bigint;
  unit_InEther: string;
  intPercent_string: string;
  duration_toNumber: number;
  poolFilled: boolean;
  isPermissionless: boolean;
  selector_toNumber: number;
  colCoverage_InString: string;
  fullInterest_InEther: string;
  intPerSec_InEther: string;
  currentPool_InEther: string;
  admin_lowerCase: string;
  asset_lowerCase: string;
  admin: ethers.AddressLike;
  asset: ethers.AddressLike;
  cData_formatted: FormattedData[];
  intPerSec: BigNumberish;
  lastPaid: Address;
  formatted_strategy: Address;
  unitInBN: BigNumber;
  currentPoolInBN: BigNumber;
}

export interface AmountToApproveParam {
  txnType: ButtonText;
  unit: BigNumberish | bigint;
  config: WagmiConfig;
  epochId?: bigint;
  account: Address;
  intPerSec?: BigNumberish | bigint;
  lastPaid?: Address;
}

export interface HandleTransactionParam {
  otherParam: AmountToApproveParam;
  preferredDuration?: string; 
  createPermissionlessPoolParam?: CreatePermissionLessPoolParams;
  createPermissionedPoolParam?: CreatePermissionedPoolParams;
  router?: Router;
  strategy?: Address;
  callback: TransactionCallback;
}
export interface DrawerState {
  anchor: DrawerAnchor
  value: boolean;
}

export interface InputProp {
  value: string;
  open: boolean;
}

export interface InputCategoryProp {
  inputProp: InputProp;
  isLargeScreen: boolean;
  handleChange: (value: InputProp, tag: InputSelector) => void
}

