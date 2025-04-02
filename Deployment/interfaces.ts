import React from "react";
import BigNumber from "bignumber.js";
import { BigNumberish, ethers } from "ethers";
import { Common } from "../contract/typechain-types/contracts/apis/IFactory";

export type Path = 'Yield' | 'Dao' | 'Flexpool' | 'CreateFlexpool' | 'AiAssist' | 'Faq' | 'Dashboard' | '';
export type WagmiConfig = import("wagmi").Config;
export type ViemClient = import('viem').Client;
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
export type Profile = Common.ContributorStruct;
export type TransactionCallback = (arg: TrxState) => void;
export type Message = string;
export type TrxResult = 'success' | 'reverted';
// export type SimpliFC = () => CustomNode;
export type RenderType = 'Back' | 'Current' | '';

export interface TrxState {
  status?: TrxResult;
  message: string;
}

export interface ReadDataReturnValue {
  pool: LiquidityPool;
  cData: Readonly<Common.ContributorStruct[]>;
}

export interface LiquidityPool {
  lInt: Common.LIntStruct;
  bigInt: Common.BigIntStruct;
  addrs: Common.AddressesStruct;
  status: BigNumberish;
  router: BigNumberish;
  stage: BigNumberish;
  interest: Common.InterestStruct;
}
// cData: Readonly<Common.ContributorStruct[]>;

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
  paybackTimeInDateFormat: string;
  paybackTimeInSec: number;
  turnStartTimeInDateFormat: string;
  turnStartTimeInSec: number;
  durOfChoiceInSec: number;
  colBalsInEther: string;
  loanInEther: string;
  interestPaidInEther: string;
  idLowerCase: string;
  idToString: string;
  loanInBN: BigNumber;
  sentQuota: boolean;
}

export interface FormattedPoolContentProps {
  unit: BigNumberish;
  unit_bigint: bigint;
  rId: bigint;
  // pair: string;
  quorumToNumber: number;
  userCountToNumber: number;
  allGetBool: boolean;
  allGhToNumber: number;
  unitIdToNumber: number;
  unitIdBigint: bigint;
  stageToNumber: number;
  expectedPoolAmtBigint: bigint;
  unitInEther: string;
  intPercentString: string;
  durationToNumber: number;
  poolFilled: boolean;
  isPermissionless: boolean;
  selectorToNumber: number;
  colCoverageInString: string;
  fullInterestInEther: string;
  intPerSecInEther: string;
  currentPoolInEther: string;
  adminLowerCase: string;
  assetLowerCase: string;
  admin: ethers.AddressLike;
  asset: ethers.AddressLike;
  isAdmin: boolean;
  isMember: boolean;
  cDataFormatted: FormattedData[];
  intPerSec: BigNumberish;
  lastPaid: Address;
  formattedSafe: Address;
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

export interface CommonToolArg {
  wagmiConfig: WagmiConfig;
  callback: TransactionCallback;
  account: Address;
}

export interface ProviderProps {
  formattedData: FormattedData;
  index: number;
  isAdmin: boolean;
}

export interface CustomNode {
  element: React.ReactNode; 
  path: Path;
  location: number;
}
