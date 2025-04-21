import React from "react";
import BigNumber from "bignumber.js";
// import { BigNumberish, ethers } from "ethers";
import { Common } from "./typechain-types/Contributor";
import { Common as Cmon } from "./typechain-types/FlexpoolFactory";

export type Path = 'Yield' | 'Flexpool' | 'CreateFlexpool' | 'AiAssist' | 'Faq' | 'Dashboard' | '';
export type WagmiConfig = import("wagmi").Config;
export type ViemClient = import('viem').Client;
export type TxnStatus = "Pending" | "Confirming" | "Confirmed" | "Reverted" | "Failed";
export type Str = string;
export type Address = `0x${string}`;
export type LiquidityInnerLinkEntry = 'Dashboard' | 'Create' | 'Open' | 'Closed' | string;
export type InputSelector = 'Quorum' | 'Duration' | 'CCR' | 'CollateralAsset' | 'UnitLiquidity' | 'address' | 'Interest';
export type ButtonText = 'Contribute' | 'GetFinance' | 'Payback' | 'Liquidate' | 'Wait' | 'Not Allowed' | 'Create' | 'Ended' | 'Remove' | 'ProvideLiquidity' | 'RemoveLiquidity' | 'Get Tokens' | 'SignUp' | 'Borrow' | 'Withdraw Collateral' | 'Cashout' | 'Rekey';
export type Router = 'Permissioned' | 'Permissionless';
export type VoidFunc = () => void;
export type DrawerAnchor = 'permission' | 'confirmation' | 'poolDetails' | 'providers' | '';
export type ToggleDrawer = (value: number, setState: (value: number) => void) => (event: React.KeyboardEvent | React.MouseEvent) => void;
export type ButtonContent = 'Approve' | 'CreatePool' | 'Completed' | 'Failed';
export type Anchor = 'top' | 'left' | 'bottom' | 'right';
export type Profile = Common.ContributorReturnValueStruct;
export type TransactionCallback = (arg: TrxState) => void;
export type Message = string;
export type TrxResult = 'success' | 'reverted';
export type RenderType = 'Back' | 'Current' | '';
export type Pool = Common.PoolStruct; 
export type Contributor = Common.ContributorReturnValueStruct;
export type SentQuota = 'Sent' | 'Not Sent';
export type FormattedProviders = FormattedProvider[];
export type Analytics = Cmon.AnalyticsStruct

interface DateAndSec {
  inSec: number;
  inDate: string;
}

interface BigNumberAndEther {
  inBN: BigNumber;
  inEther: string;
}

export interface FormattedSlot {
  value: number;
  isMember: boolean;
  isAdmin: boolean;
}

export interface FormattedPoolData {
  pool: {
    big: { 
      unit: {big: bigint, inEther: string}; 
      currentPool: {big:bigint, inEther: string};
      unitId: {big: bigint, str: string}; 
      recordId: {big: bigint, str: string};
    };
    low: { 
      maxQuorum: number; 
      allGh: number;
      userCount: number;
      duration: {inSec: number; inHour: number};
      colCoverage: number;
      selector : number;
    };
    addrs: { 
      admin: Address; 
      colAsset: Address;
      lastPaid: Address; 
      safe: Address
    };
    router: string;
    stage: {toNum: number, inStr: string};
    poolFilled: boolean;
    allGetFinance: boolean;
    isPermissionless: boolean;
    expectedPoolAmount: bigint;
  };
  cData: FormattedCData[];
}

export interface FormattedCData {
  profile: FormattedContributor;
  slot: FormattedSlot;
  providers: FormattedProviders;
}

export interface FormattedContributor {
  paybackTime: DateAndSec;
  turnStartTime: DateAndSec;
  getFinanceTime: DateAndSec;
  loan: BigNumberAndEther;
  id: Address;
  sentQuota: SentQuota;
  colBals: string;
}

export interface FormattedProvider {
  account: Address;
  accruals: { fullInterest: string, intPerSec: string };
  amount: string;
  earnStartDate: DateAndSec;
  rate: string;
  slot: number;
}

export interface TrxState {
  status?: TrxResult;
  message?: string;
  errorMessage?: string;
}

export interface CData {
  profile: Common.ContributorStruct;
  slot: Common.SlotStruct;
  providers: Readonly<Common.ProviderStruct[]>;
}

export interface ReadDataReturnValue  {
  pool: Common.PoolStruct;
  cData: Readonly<CData[]>;
}

export interface CreatePermissionedPoolParams {
  contributors: Address[];
  durationInHours: number;
  colCoverage: number;
  contractAddress?: Address;
}

export interface CreatePermissionlessPoolParams extends CreatePermissionedPoolParams {
  quorum: number;
}

export interface GetProfileParam {
  unit: bigint;
  user: Address;
}

export interface Config {
  config: WagmiConfig;
  account: Address;
  callback?: TransactionCallback;
  contractAddress?: Address;
}

export interface DepositCollateralParam extends Config {
  safe: Address;
  recordId: bigint;
}

export interface CommonParam extends Config {
  unit: bigint;
}

export interface ScreenUserResult{
  isMember: boolean;
  isAdmin: boolean;
  userData: Profile;
}

export interface HandleTransactionParam { 
  createPermissionlessPoolParam?: CreatePermissionlessPoolParams;
  createPermissionedPoolParam?: CreatePermissionedPoolParams;
  commonParam: CommonParam;
  router?: Router;
  safe?: Address;
  txnType: ButtonText;
  rate?: number;
  providersSlots?: bigint[];
}

export interface DrawerState {
  anchor: DrawerAnchor
  value: boolean;
}

export interface InputCategoryProp {
  selected: string;
  // isLargeScreen: boolean;
  handleChange: (value: string, tag: InputSelector) => void
}

export interface ButtonObj {
  value: ButtonText;
  disable: boolean;
}

export interface ContractData {
  feeTo: Address;
  assetAdmin: Address;
  makerRate: number;
  safeFactory: Address;
}

export interface CommonToolArg {
  wagmiConfig: WagmiConfig;
  callback: TransactionCallback;
  account: Address;
}

export interface ProviderProps {
  data: FormattedCData;
  // index: number;
}

export interface CustomNode {
  element: React.ReactNode; 
  path: Path;
  location: number;
}

export interface BorrowParam extends CommonParam {
  providersSlots: bigint[];
}

export interface ApproveParam extends Config {
  amountToApprove: bigint;
  // spender: Address;
}

export interface GetAllowanceParam extends Config {
  owner: Address;
  spender: Address;
}

export interface TransferFromParam extends Config {
  safe: Address;
}

export interface ProvideLiquidityParam extends CommonParam {
  rate: number;
}

export interface RekeyParam {
  colCoverage: number;
  contributors?: Address[];
  durationInHours: number;
  allGH: number;
}

export interface BalancesProps {
  safe: Address;
  isPermissionless: boolean;
  param: RekeyParam;
  collateralAsset: Address;
}

export interface ActionsButtonProps {
  buttonObj: ButtonObj;
  transactionArgs: HandleTransactionParam;
  confirmationDrawerOn: number;
  setDrawerState: (arg: number) => void
  back?: VoidFunc;
}

export interface SendTransactionResult {
  errored: boolean;
  error: any;
}
