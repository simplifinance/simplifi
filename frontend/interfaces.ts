import { Common } from "../contract/typechain-types/contracts/apis/IFactory";

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
