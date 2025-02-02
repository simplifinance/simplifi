import React from "react";
import BigNumber from "bignumber.js";
import { BigNumberish, ethers } from "ethers";
import { C3 } from "../contract/typechain-types/contracts/apis/IFactory";

export type Path = '/dashboard' | '/yield' | '/simplidao' | '/flexpool' | 'faq';
export type WagmiConfig = import("wagmi").Config;
export type TxnStatus = "Pending" | "Confirming" | "Confirmed" | "Reverted" | "Failed";
export type Str = string;
export type Address = `0x${string}`;
export type LiquidityInnerLinkEntry = 'Dashboard' | 'Create' | 'Open' | 'Closed' | string;
export type ActiveLink = 'Home' | 'Invest' | 'Dao' | 'Liquidity' | 'SpeedDoc' | '';
export type InputSelector = 'Quorum' | 'Duration' | 'CCR' | 'Interest' | 'UnitLiquidity' | 'address';
export type ButtonText = 'ADD LIQUIDITY' | 'GET FINANCE' | 'PAYBACK' | 'LIQUIDATE' | 'WAIT' | 'NOT ALLOWED' | 'APPROVE' | 'CREATE' | 'ENDED' | 'REMOVE';
export type Router = 'Permissioned' | 'Permissionless';
export type VoidFunc = () => void;
export type DrawerAnchor = 'permission' | 'confirmation' | 'poolDetails' | 'providers' | '';
export type ToggleDrawer = (value: number, setState: (value: number) => void) => (event: React.KeyboardEvent | React.MouseEvent) => void;
export type ButtonContent = 'Approve' | 'CreatePool' | 'Completed' | 'Failed';
export type PoolType = 'Permissioned' | 'Permissionless';
export type Anchor = 'top' | 'left' | 'bottom' | 'right';
export type Profile = C3.ContributorStruct;
export type TransactionCallback = (arg: TrxState) => void;
export type Message = string;
export type TrxResult = 'success' | 'reverted';
export interface TrxState {
  status?: TrxResult;
  message: string;
}

export interface ReadDataReturnValue {
  pool: LiquidityPool;
  cData: Readonly<C3.ContributorStruct[]>;
}

export interface LiquidityPool {
  uints: C3.UintsStruct;
  uint256s: C3.Uint256sStruct;
  addrs: C3.AddressesStruct;
  status: BigNumberish;
  router: BigNumberish;
  stage: BigNumberish;
}
// cData: Readonly<C3.ContributorStruct[]>;

export interface CreatePermissionedPoolParams extends Config{
  intRate: number;
  durationInHours: number;
  colCoverage: number;
  unitLiquidity: bigint;
  contributors: Address[];
}

export interface CreatePermissionLessPoolParams extends Config{
  intRate: number;
  quorum: number;
  durationInHours: number;
  colCoverage: number;
  unitLiquidity: bigint;
}

export interface GetProfileParam {
  unit: bigint;
  user: Address;
}

export interface Config {
  config: WagmiConfig;
  account: Address;
  value?: bigint;
  callback?: TransactionCallback; 
}

export interface DepositCollateralParam extends Config {
  bank: Address;
  rId: bigint;
}

export interface CommonParam extends Config {
  unit: bigint;
}

export interface GetFinanceParam extends CommonParam {
  daysOfUseInHr: number;
  value: bigint;
}

export interface ScreenUserResult{
  isMember: boolean;
  isAdmin: boolean;
  data: FormattedData;
}

export interface FormattedData {
  payDate_InDateFormat: string;
  payDate_InSec: number;
  turnTime_InDateFormat: string;
  turnTime_InSec: number;
  durOfChoice_InSec: number;
  colBals_InEther: string;
  loan_InEther: string;
  expInterest_InEther: string;
  id_lowerCase: string;
  id_toString: string;
  loan_InBN: BigNumber;
  sentQuota: boolean;
}

export interface FormattedPoolContentProps {
  unit: BigNumberish;
  unit_bigint: bigint;
  rId: bigint;
  // pair: string;
  quorum_toNumber: number;
  userCount_toNumber: number;
  allGET_bool: boolean;
  allGh_toNumber: number;
  unitId_toNumber: number;
  unitId_bigint: bigint;
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
  isAdmin: boolean;
  isMember: boolean;
  cData_formatted: FormattedData[];
  intPerSec: BigNumberish;
  lastPaid: Address;
  formatted_bank: Address;
  unitInBN: BigNumber;
  currentPoolInBN: BigNumber;
}

export interface AmountToApproveParam {
  txnType: ButtonText;
  config: WagmiConfig;
  unit: bigint;
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
  bank?: Address;
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

export interface ButtonObj {
  value: ButtonText;
  disable: boolean;
  displayMessage?: string;
}

export interface Analytics {
  tvlInXFI: bigint;
  tvlInUsd: bigint;
  totalPermissioned: bigint;
  totalPermissionless: bigint;
}

export interface ContractData {
  feeTo: Address;
  assetAdmin: Address;
  makerRate: number;
  bankFactory: Address;
}

// export interface ViewFactoryData {
//   analytics: Analytics;
//   contractData: ContractData;
//   currentEpoches: bigint;
//   recordEpoches: bigint;
// }