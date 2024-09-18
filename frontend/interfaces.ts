import { Common } from "../contract/typechain-types/contracts/apis/IFactory";
import { WaitForTransactionReceiptReturnType } from "wagmi/actions";
export type WagmiConfig = import("wagmi").Config;
export type TxnStatus = "Pending" | "Confirming" | "Confirmed" | "Reverted" | "Failed";
export type Str = string;
export type Address = `0x${string}`;
export type LiquidityInnerLinkEntry = 'Dashboard' | 'Create' | 'Open' | 'Closed' | string;
export type ActiveLink = 'Home' | 'Invest' | 'Dao' | 'Liquidity' | 'SpeedDoc' | '';
export type InputSelector = 'Quorum' | 'Duration' | 'CCR' | 'Interest' | 'UnitLiquidity' | 'address';
export type VoidFunc = () => void;
export enum FuncTag { 
    JOIN, 
    GET, 
    PAYBACK, 
    WITHDRAW
}

export type LiquidityPool = Common.PoolStruct;
export type Pools = Readonly<LiquidityPool[]>;
export type Provider = Common.ContributorStruct;
export type Profile = Common.ContributorDataStruct;
export type TransactionCallback = (arg: TransactionCallbackArg) => void;
export type Message = "Preparing trxn" | "Creating Liquidity Pool" | "Completing Trxn" | "Approval Completed" | "Transaction Completed" | "Adding provider" | "Initiating borrowing" | "Paying back loan" | "Liquidating In Progress" | "Removing Pool" | "Withdrawing Collateral" | "Approving Factory" | "Transaction reverted" | "Transaction Failed" | "Transaction Completed" | "Approval Failed" | TxnStatus;
export interface TransactionCallbackArg {
  message?: Message; 
  result?: TrxnResult;
  txDone: boolean;
}

export interface LiquidityChildrenProps {
  storage: TrxnResult;
  // setStorage: (arg: TrxnResult) => void;
}

export interface TrxnResult {
  wait?: WaitForTransactionReceiptReturnType;
  pools: Pools;
  profile: Profile;
}

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

// export type Theme = {
//     colors: {
//       accentButtonBg: string;
//       accentButtonText: string;
//       accentText: string;
//       borderColor: string;
//       connectedButtonBg: string;
//       connectedButtonBgHover: string;
//       danger: string;
//       inputAutofillBg: string;
//       modalBg: string;
//       modalOverlayBg: string;
//       primaryButtonBg: string;
//       primaryButtonText: string;
//       primaryText: string;
//       scrollbarBg: string;
//       secondaryButtonBg: string;
//       secondaryButtonHoverBg: string;
//       secondaryButtonText: string;
//       secondaryIconColor: string;
//       secondaryIconHoverBg: string;
//       secondaryIconHoverColor: string;
//       secondaryText: string;
//       selectedTextBg: string;
//       selectedTextColor: string;
//       separatorLine: string;
//       skeletonBg: string;
//       success: string;
//       tertiaryBg: string;
//       tooltipBg: string;
//       tooltipText: string;
//     };
//     fontFamily: string;
//     type: "light" | "dark";
// };