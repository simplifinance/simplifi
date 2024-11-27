import { POOLS_MOCK } from "./constants";
import { TrxnResult, VoidFunc } from "./interfaces"

export interface StorageContextProps {
    storage: TrxnResult;
    exitOnboardScreen: VoidFunc;
    setstate: (arg: TrxnResult) => void;
}

export const storageInitialValueType : StorageContextProps = {
    storage: { pools: POOLS_MOCK},
    exitOnboardScreen: function (): void {
        throw new Error("Function not implemented.");
    },
    setstate: function (arg: TrxnResult): void {
        throw new Error("Function not implemented.");
    }
}