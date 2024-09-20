import { POOLS_MOCK } from "./constants";
import { TrxnResult } from "./interfaces"

export interface StorageContextProps {
    storage: TrxnResult;
    setstate: (arg: TrxnResult) => void;
}

export const storageInitialValueType : StorageContextProps = {
    storage: { pools: POOLS_MOCK},
    setstate: function (arg: TrxnResult): void {
        throw new Error("Function not implemented.");
    }
}