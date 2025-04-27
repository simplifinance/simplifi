import { Path, PointsReturnValue, ProviderResult, SupportedAsset, VoidFunc } from "@/interfaces";
import { Common } from "@/typechain-types/contracts/standalone/celo/FlexpoolFactory";

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
    analytics: Common.AnalyticsStruct;
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
}
