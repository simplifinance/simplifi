import { TrxnResult, VoidFunc } from "@/interfaces";

export interface DataContextProps {
    storage: TrxnResult;
    setstate: (arg: TrxnResult) => void;
    exitOnboardScreen: VoidFunc;
}
