import { Analytics, Path, TrxState, VoidFunc } from "@/interfaces";
import { Common } from "@/typechain-types/FlexpoolFactory";

export interface DataContextProps {
    exitOnboardScreen: VoidFunc;
    toggleSidebar: (arg: boolean) => void;
    showSidebar: boolean;
    messages: string[];
    openPopUp: number;
    setmessage: (arg: string) => void;
    toggleDisplayOnboardUser: VoidFunc;
    togglePopUp: (arg: number) => void;
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
    errorMessage: string;
    setError: (arg: string) => void;
    
}
