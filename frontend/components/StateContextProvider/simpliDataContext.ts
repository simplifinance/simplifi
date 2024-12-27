import { DrawerAnchor, LiquidityPool, Path, Pools, TrxState, VoidFunc } from "@/interfaces";

export interface DataContextProps {
    storage: Pools;
    // setstate: (arg: TrxnResult) => void;
    exitOnboardScreen: VoidFunc;
    toggleSidebar: (arg: boolean) => void;
    showSidebar: boolean;
    setTrxnStatus: (arg: TrxState) => void; 
    // txnStatus: TrxState;
    // setMessage: (arg: string) => void;
    drawerState: boolean;
    openPopUp: boolean;
    setdrawerState: (arg: boolean) => void;
    toggleTransactionWindow:(value: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => void;
    toggleDisplayOnboardUser: VoidFunc;
    togglePopUp: VoidFunc;
    handlePopUpDrawer: (arg: DrawerAnchor) => void;
    displayOnboardUser: boolean;
    displayAppScreen: boolean;
    popUpDrawer: DrawerAnchor;
    tvl: string;
    open: LiquidityPool[];
    closed: LiquidityPool[];
    permissioned: LiquidityPool[];
    permissionless: LiquidityPool[];
    activePath: Path;
    setActivepath: (arg: Path) => void;

}
