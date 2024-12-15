import { Anchor, DrawerAnchor, DrawerState, TransactionResult, TrxnResult, VoidFunc } from "@/interfaces";

export interface DataContextProps {
    storage: TrxnResult;
    setstate: (arg: TrxnResult) => void;
    exitOnboardScreen: VoidFunc;
    toggleSidebar: VoidFunc;
    showSidebar: boolean;
    setTrxnStatus: (arg: TransactionResult) => void; 
    txnStatus: TransactionResult;
    setMessage: (arg: string) => void;
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

}
