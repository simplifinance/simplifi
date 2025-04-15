import React from "react";
import BigNumber from "bignumber.js";
import { BigNumberish, ethers } from "ethers";
import { Common } from "./typechain-types/Contributor";

export type Path = 'Yield' | 'Dao' | 'Flexpool' | 'CreateFlexpool' | 'AiAssist' | 'Faq' | 'Dashboard' | '';
export type WagmiConfig = import("wagmi").Config;
export type ViemClient = import('viem').Client;
export type TxnStatus = "Pending" | "Confirming" | "Confirmed" | "Reverted" | "Failed";
export type Str = string;
export type Address = `0x${string}`;
export type LiquidityInnerLinkEntry = 'Dashboard' | 'Create' | 'Open' | 'Closed' | string;
export type ActiveLink = 'Home' | 'Invest' | 'Dao' | 'Liquidity' | 'SpeedDoc' | '';
export type InputSelector = 'Quorum' | 'Duration' | 'CCR' | 'CollateralAsset' | 'UnitLiquidity' | 'address';
export type ButtonText = 'ADD LIQUIDITY' | 'GET FINANCE' | 'PAYBACK' | 'LIQUIDATE' | 'WAIT' | 'NOT ALLOWED' | 'APPROVE' | 'CREATE' | 'ENDED' | 'REMOVE';
export type Router = 'Permissioned' | 'Permissionless';
export type VoidFunc = () => void;
export type DrawerAnchor = 'permission' | 'confirmation' | 'poolDetails' | 'providers' | '';
export type ToggleDrawer = (value: number, setState: (value: number) => void) => (event: React.KeyboardEvent | React.MouseEvent) => void;
export type ButtonContent = 'Approve' | 'CreatePool' | 'Completed' | 'Failed';
export type PoolType = 'Permissioned' | 'Permissionless';
export type Anchor = 'top' | 'left' | 'bottom' | 'right';
export type Profile = Common.ContributorReturnValueStruct;
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
  low: Common.LowStruct;
  big: Common.BigStruct;
  addrs: Common.AddressesStruct;
  status: BigNumberish;
  router: BigNumberish;
  stage: BigNumberish;
}

export interface CreatePermissionedPoolParams extends Config{
  contributors: Address[];
  unitLiquidity: bigint;
  durationInHours: number;
  colCoverage: number;
  collateralAsset: Address;
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

// export interface FormattedData {
//   paybackTimeInDateFormat: string;
//   paybackTimeInSec: number;
//   turnStartTimeInDateFormat: string;
//   turnStartTimeInSec: number;
//   durOfChoiceInSec: number;
//   colBalsInEther: string;
//   loanInEther: string;
//   interestPaidInEther: string;
//   idLowerCase: string;
//   idToString: string;
//   loanInBN: BigNumber;
//   sentQuota: boolean;
// }

// export interface FormattedPoolContentProps {
//   unit: BigNumberish;
//   unit_bigint: bigint;
//   recordId: bigint;
//   // pair: string;
//   quorumToNumber: number;
//   userCountToNumber: number;
//   allGetBool: boolean;
//   allGhToNumber: number;
//   unitIdToNumber: number;
//   unitIdBigint: bigint;
//   stageToNumber: number;
//   expectedPoolAmtBigint: bigint;
//   unitInEther: string;
//   intPercentString: string;
//   durationToNumber: number;
//   poolFilled: boolean;
//   isPermissionless: boolean;
//   selectorToNumber: number;
//   colCoverageInString: string;
//   fullowerestInEther: string;
//   intPerSecInEther: string;
//   currentPoolInEther: string;
//   adminLowerCase: string;
//   assetLowerCase: string;
//   admin: ethers.AddressLike;
//   asset: ethers.AddressLike;
//   isAdmin: boolean;
//   isMember: boolean;
//   cDataFormatted: FormattedData[];
//   intPerSec: BigNumberish;
//   lastPaid: Address;
//   formattedSafe: Address;
//   unitInBN: BigNumber;
//   currentPoolInBN: BigNumber;
// }

export interface AmountToApproveParam {
  txnType: ButtonText;
  config: WagmiConfig;
  unit: bigint;
  account: Address;
  avgIntPerSec?: bigint;
  contractAddress: Address;
}

export interface HandleTransactionParam {
  otherParam: AmountToApproveParam;
  createPermissionlessPoolParam?: CreatePermissionlessPoolParams;
  createPermissionedPoolParam?: CreatePermissionedPoolParams;
  router?: Router;
  safe?: Address;
  collateralAsset?: Address;
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
  safeFactory: Address;
}

export interface CommonToolArg {
  wagmiConfig: WagmiConfig;
  callback: TransactionCallback;
  account: Address;
}

export interface ProviderProps {
  userData: Profile;
  index: number;
  isAdmin: boolean;
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
