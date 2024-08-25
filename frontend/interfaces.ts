
export type WagmiConfig = import("wagmi").Config;
export type TxnStatus = "Pending" | "Confirming" | "Confirmed" | "Reverted" | "Failed";
export type TransactionCallback = (arg: TransactionCallbackArg) => void;
export type Address = string;
export type SwitchChainReturn = number;
export type OxString = `0x${string}`;
export type HandleSetState = (callback: (arg: StateData) => StateData) => void;
export type HandleSendTrx = (callback: (arg: TxParam) => TxParam) => void;
