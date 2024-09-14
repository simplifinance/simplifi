import { Common } from "../contract/typechain-types/contracts/apis/IFactory";

export type WagmiConfig = import("wagmi").Config;
export type TxnStatus = "Pending" | "Confirming" | "Confirmed" | "Reverted" | "Failed";
export type Str = string;
export type Address = `0x${string}`;
export type LiquidityInnerLinkEntry = 'Dashboard' | 'Create' | 'Open' | 'Closed';
export type ActiveLink = 'Home' | 'Invest' | 'Dao' | 'Liquidity' | 'SpeedDoc' | '';
export enum FuncTag { 
    JOIN, 
    GET, 
    PAYBACK, 
    WITHDRAW
}

export type LiquidityPool = Common.PoolStructOutput;
export type Pools = Readonly<LiquidityPool[]>;
export type Provider = Common.ContributorStructOutput;
export type Profile = Common.ContributorDataStructOutput;
