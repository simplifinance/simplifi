import { Analytics, LiquidityPool, Path, TrxState, VoidFunc } from "@/interfaces";

export interface DataContextProps {
    exitOnboardScreen: VoidFunc;
    toggleSidebar: (arg: boolean) => void;
    showSidebar: boolean;
    message: string;
    openPopUp: number;
    setmessage: (arg: string) => void;
    toggleDisplayOnboardUser: VoidFunc;
    togglePopUp: (arg: number) => void;
    displayOnboardUser: boolean;
    displayAppScreen: boolean;
    setstorage: (arg: TrxState) => void;
    displayForm: boolean;
    closeDisplayForm: VoidFunc;
    openDisplayForm: VoidFunc;
    // open: LiquidityPool[];
    // closed: LiquidityPool[];
    // permissioned: LiquidityPool[];
    // permissionless: LiquidityPool[];
    activePath: Path;
    setActivepath: (arg: Path) => void;
    analytics: Analytics;
    currentEpoches: bigint;
    recordEpoches: bigint;
    symbol: string;
}
