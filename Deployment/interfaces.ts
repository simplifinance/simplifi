import React from "react";
import BigNumber from "bignumber.js";
import { TransactionReceipt, zeroAddress } from "viem";
import { Mento, TradablePair } from "@mento-protocol/mento-sdk";
// import { BigNumberish } from "ethers";
import { Transaction } from "./components/AppFeatures/FlexPool/update/ActionButton/Confirmation";
import { filterTransactionData } from "./utilities";

export type Path = 'Providers' | 'Flexpool' | 'CreateFlexpool' | 'Home' | 'AiAssist' | 'Faq' | 'Dashboard' | '';
export type WagmiConfig = import("wagmi").Config;
export type ViemClient = import('viem').Client;
export type TxnStatus = "Pending" | "Confirming" | "Confirmed" | "Reverted" | "Failed";
export type Str = string;
export type Address = `0x${string}`;
export type LiquidityInnerLinkEntry = 'Dashboard' | 'Create' | 'Open' | 'Closed' | string;
export type InputSelector = 'Quorum' | 'Duration' | 'CCR' | 'CollateralAsset' | 'UnitLiquidity' | 'address' | 'Interest' | 'SelectBaseAssetHolding';
export type ButtonText = 'Contribute' | 'GetFinance' | 'Payback' | 'Liquidate' | 'Wait' | 'Not Allowed' | 'Create' | 'Ended' | 'Remove' | 'ProvideLiquidity' | 'RemoveLiquidity' | 'Get Tokens' | 'SignUp' | 'Borrow' | 'Withdraw Collateral' | 'Cashout' | 'Rekey' | 'Edit' | 'Approve';
export type FunctionName = 'createPool'|'getFinance'|'deposit'| 'deposits' | 'getProviders' | 'payback'|'liquidate'|'editPool'|'closePool'|'contribute'|'registerToEarnPoints'|'provideLiquidity'|'removeLiquidity'|'borrow'|'claimTestTokens'|'setBaseToken'|'setCollateralToken'|'panicUnlock'|'unlockToken'|'lockToken'|'transferFrom'|'approve'|'getCollateralQuote'|'getCurrentDebt'|'allowance'|'balanceOf' | 'symbol' | 'getFactoryData' | 'getPoints' | 'getSupportedAssets' | 'getPoolData' | 'getPoolRecord' | 'isVerified' | 'getDeposit' | 'setVerification' | ButtonText;
export type Router = 'Permissioned' | 'Permissionless';
export type VoidFunc = () => void;
export type DrawerAnchor = 'permission' | 'confirmation' | 'poolDetails' | 'providers' | '';
export type ToggleDrawer = (value: number, setState: (value: number) => void) => (event: React.KeyboardEvent | React.MouseEvent) => void;
export type ButtonContent = 'Approve' | 'CreatePool' | 'Completed' | 'Failed';
export type Anchor = 'top' | 'left' | 'bottom' | 'right';
export type TransactionCallback = (arg: TrxState) => void;
export type Message = string;
export type TrxResult = 'success' | 'reverted';
export type RenderType = 'Back' | 'Current' | '';
export type SentQuota = 'Sent' | 'Not Sent';
export type FormattedProviders = FormattedProvider[];

export type TransactionData = {
  contractAddress: string;
  inputCount: number;
  functionName: string;
  abi: any;
  requireArgUpdate: boolean;
};

export type FilterTransactionDataProps = {
  chainId: number | undefined;
  functionNames?: FunctionName[];
  callback?: TransactionCallback;
  filter: boolean;
}

export type Contributor = {
  profile: ContributorStruct;
  slot: SlotStruct;
  providers: ProviderStruct[];
}

export type ContributorStruct = {
  paybackTime: bigint;
  turnStartTime: bigint;
  getFinanceTime: bigint;
  loan: bigint;
  colBals: bigint;
  id: Address;
  sentQuota: boolean;
}

export type LowStruct = {
  maxQuorum: bigint;
  selector: bigint;
  colCoverage: bigint;
  duration: bigint;
  allGh: bigint;
  userCount: bigint;
}

export type BigStruct = {
  unit: bigint;
  currentPool: bigint;
  recordId: bigint;
  unitId: bigint;
}

export type AddressesStruct = {
  colAsset: Address;
  lastPaid: Address;
  safe: Address;
  admin: Address;
}

export type Pool = {
  low: LowStruct;
  big: BigStruct;
  addrs: AddressesStruct;
  router: number;
  stage: number;
  status: number;
}

export type SlotStruct = {
  value: bigint;
  isMember: boolean;
  isAdmin: boolean;
}

export type CommonInterestStruct = {
  fullInterest: bigint;
  intPerSec: bigint;
}

export type ProviderStruct = {
  slot: bigint;
  amount: bigint;
  rate: bigint;
  earnStartDate: bigint;
  account: Address;
  accruals: CommonInterestStruct;
}

export type Profile = {
  profile: ContributorStruct;
  slot: SlotStruct;
  providers: ProviderStruct[];
}

export type Analytics = {
  tvlCollateral: bigint;
  tvlBase: bigint;
  totalPermissioned: bigint;
  totalPermissionless: bigint;
}

export type DataTableProps = {
  currentUser: Address;
  providerSlots: bigint[];
  onCheckboxClicked: (slot: bigint, amount: bigint, isClicked: boolean) => void;
}
export type ToMutable<T> = {
  -readonly [P in keyof T]: T[P];
}

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
  errorMessage?: any;
}

export interface CData {
  profile: ContributorStruct;
  slot: SlotStruct;
  providers: Readonly<ProviderStruct[]>;
}

export interface ReadDataReturnValue  {
  pool: Pool;
  cData: Readonly<CData[]>;
}

export interface EditPoolParam {
  durationInHours: number;
  colCoverage: number;
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
  commonParam: CommonParam;
  router?: Router;
  safe?: Address;
  collateralAsset?: Address;
}

export interface DrawerState {
  anchor: DrawerAnchor
  value: boolean;
}

export interface InputCategoryProp {
  selected: string | number;
  handleChange: (value: string, tag: InputSelector) => void
}

export interface ButtonObj {
  value: FunctionName;
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
  contractAddress?: Address;
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
  getButtonObj: () => {buttonObj: ButtonObj, };
  confirmationDrawerOn: number;
  setDrawerState: (arg: number) => void
  back?: VoidFunc;
  getTransactions: () => Transaction[];
}

export interface SendTransactionResult {
  errored: boolean;
  error: any;
}

export type InterestStruct = {
  fullInterest: bigint;
  intPerSec: bigint;
}

export type ProviderResult = {
  slot: bigint;
  amount: bigint;
  rate: bigint;
  earnStartDate: bigint;
  account: Address;
  accruals: InterestStruct;
}

export interface GetAmountToApprove extends Config {
  functionName: FunctionName,
  unit: bigint,
  factory: Address;
  providers: Address;
  safe?: Address;
  collateralContractAddress?: Address;
}

export type Point = {
  contributor: bigint;
  creator: bigint;
  referrals: bigint;
  user: Address;
  phase: number;
}

export interface PointsReturnValue {
  key: string;
  value: Point[] | undefined;
}

export type SupportedAsset = {
  id: Address;
  name: string;
  symbol: string;
}

export const analytics : Analytics = {
  tvlCollateral: 0n,
  tvlBase: 0n,
  totalPermissioned: 0n,
  totalPermissionless: 0n
}

export type FactoryData = {
  analytics: {
    tvlCollateral: bigint;
    tvlBase: bigint;
    totalPermissioned: bigint;
    totalPermissionless: bigint;
  };
  makerRate: number;
  currentEpoches: bigint;
  recordEpoches: bigint;
  currentPools: Readonly<ReadDataReturnValue[]>;
  pastPools: Readonly<ReadDataReturnValue[]>;
}

export interface ExecuteSwapParam {
  common: Config;
  client: Mento;
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  symbolIn: string;
  symbolOut: string;
  tradablePair: TradablePair;
}

export interface CheckAndConvertAssetHoldingParam {
  amountIn: bigint;
  selectedAsset: Address;
  config: Config;
}

export type AppState = [
  string, 
  FactoryData, 
  PointsReturnValue[], 
  ProviderResult[], 
  SupportedAsset[]
];

// MOCK DATA

export const mockFactoryData : FactoryData = {
  analytics: {
    tvlCollateral: 0n,
    tvlBase: 0n,
    totalPermissioned: 0n,
    totalPermissionless: 0n
  },
  makerRate: 0,
  currentEpoches: 0n,
  recordEpoches: 0n,
  currentPools: [],
  pastPools: []
}

export const profileMock : Profile = {
  profile: {
    paybackTime: 0n,
    turnStartTime: 0n,
    getFinanceTime: 0n,
    loan: 0n,
    colBals: 0n,
    id: zeroAddress,
    sentQuota: false
  },
  slot: {isAdmin: false, isMember: false, value: 0n},
  providers: [{
    account: zeroAddress,
    accruals: {intPerSec: 0n, fullInterest: 0n},
    earnStartDate: 0n,
    amount: 0n,
    rate: 0n,
    slot: 0n
  }]
};

const mockProvider : ProviderResult = {
  account: zeroAddress,
  accruals: {fullInterest: 0n, intPerSec: 0n},
  amount: 14000000000000000n,
  earnStartDate: 0n,
  rate: 15n,
  slot: 0n
}

export const mockPoint : Point = {
  contributor: 2n,
  creator: 5n,
  referrals: 0n,
  user: zeroAddress,
  phase: 0
}
export const emptyMockPoint : Point = {
  contributor: 0n,
  creator: 0n,
  referrals: 0n,
  user: zeroAddress,
  phase: 0
}

const mockAsset : SupportedAsset = {
  id: filterTransactionData({chainId: 44787, filter: false,}).contractAddresses.SimpliToken as Address,
  name: "Simplfinance Token",
  symbol: "TSFT"
}

export const phases = [
  {
    phase: 'beta',
    active: true 
  },
  {
    phase: 'alpha',
    active: false
  },
  {
    phase: 'mainnet',
    active: false
  },
] as const;
export const mockProviders : ProviderResult[] = [1, 2, 3].map(() => mockProvider);
export const mockPointsReturnValue : PointsReturnValue[] = phases.map(({phase}) => {
  return {
    key: phase,
    value: [1, 2, 3].map(() => mockPoint)
  }
});
export const mockAssets : SupportedAsset[] = [1].map(() => mockAsset);
export const appData : AppState = [
  'USD', 
  mockFactoryData, 
  mockPointsReturnValue, 
  mockProviders, 
  mockAssets
];

export const poolMock : Pool = {
  big: { unit: 0n, currentPool: 0n, unitId: 0n, recordId: 0n },
  stage: 0,
  low: {
    maxQuorum: 0n,
    selector: 0n,
    colCoverage: 0n,
    duration: 0n,
    allGh: 0n,
    userCount: 0n
  },
  addrs: { lastPaid: zeroAddress, admin: zeroAddress, colAsset: zeroAddress, safe: zeroAddress, },
  router: 0,
  status: 0
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

