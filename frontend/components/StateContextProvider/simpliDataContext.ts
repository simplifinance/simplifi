import { LiquidityPool, Path, Pools, VoidFunc } from "@/interfaces";

export interface DataContextProps {
    storage: Pools;
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
    // tvl: string;
    open: LiquidityPool[];
    closed: LiquidityPool[];
    // permissioned: LiquidityPool[];
    // permissionless: LiquidityPool[];
    activePath: Path;
    setActivepath: (arg: Path) => void;

}
