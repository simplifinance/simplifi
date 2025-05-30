import type { Analytics, Path, PointsReturnValue, ProviderResult, ReadDataReturnValue, SupportedAsset, TransactionCallback, VoidFunc } from "@/interfaces";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export interface DataContextProps {
    exitOnboardScreen: VoidFunc;
    toggleSidebar: (arg: boolean) => void;
    showSidebar: boolean;
    messages: string[];
    setmessage: (arg: string) => void;
    toggleDisplayOnboardUser: VoidFunc;
    displayOnboardUser: boolean;
    displayAppScreen: boolean;
    displayForm: boolean;
    closeDisplayForm: VoidFunc;
    openDisplayForm: VoidFunc;
    activePath: Path;
    setActivepath: (arg: Path) => void;
    analytics: Analytics;
    currentEpoches: bigint;
    recordEpoches: bigint;
    symbol: string;
    toggleProviders: (arg: bigint) => void;
    providersIds: bigint[];
    prevPaths: Path[];
    errorMessage: string;
    setError: (arg: string) => void;
    points: PointsReturnValue[];
    providers: ProviderResult[];
    supportedAssets: SupportedAsset[];
    pools: ReadDataReturnValue[]; 
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
    callback: TransactionCallback;
}
