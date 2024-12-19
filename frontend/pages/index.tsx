import React from "react";
import OnbaordScreen from "@/components/OnboardScreen";
import App from "@/components/App";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import { POOLS_MOCK, ROUTE_ENUM } from "@/constants";
import Dashboard from "@/components/topComponents/Dashboard";
import FlexPool from "@/components/topComponents/finance";
import Yield from "@/components/topComponents/Yield";
import Faq from "@/components/topComponents/Faq";
import SimpliDao from "@/components/topComponents/SimpliDao";
import { DrawerAnchor, TransactionResult, TrxnResult } from "@/interfaces";
import { Create } from "@/components/topComponents/finance/Create";
import { Open } from "@/components/topComponents/finance/Open";
import { Closed } from "@/components/topComponents/finance/Closed";
import { StorageContextProvider } from "@/components/StateContextProvider";
import Notification from "@/components/Notification";
import { filterPools } from "@/components/topComponents/finance/commonUtilities";

/**
 * Renders Liquidity child components
 * @returns React.JSX.Element[]
 */
const renderLiquidityChildComponents = () => [
  {
    path: ROUTE_ENUM.CREATE,
    element: () => (<Create />),
  },
  {
    path: ROUTE_ENUM.OPEN,
    element: () => (<Open />),
  },
  {
    path: ROUTE_ENUM.CLOSED,
    element: () => (<Closed />)
  }
].map(({path, element}) => (
  <Route key={path} {...{path, element: element()}} />
));

/**
 * Renders App child components
 * @returns React.JSX.Element[]
 */
const renderAppChildComponents = () => [
  {
    // children: undefined,
    path: ROUTE_ENUM.DASHBOARD,
    renderElement: () => ( <Dashboard /> ), 
  },
  {
    children: renderLiquidityChildComponents(),
    path: ROUTE_ENUM.FLEXPOOL,
    renderElement: () => (<FlexPool />), 
  },
  {
    children: undefined,
    path: ROUTE_ENUM.YIELD,
    renderElement: () => ( <Yield /> ), 
  },
  {
    children: undefined,
    path: ROUTE_ENUM.DAO,
    renderElement: () => ( <SimpliDao /> ), 
  },
  {
    children: undefined,
    path: ROUTE_ENUM.FAQ,
    renderElement: () => ( <Faq /> ), 
  }
].map(({renderElement, path, children}) => (
  <Route key={path} {...{element: renderElement(), path}}>
    { children }
  </Route>
));

export default function SimpliApp() {
  const [storage, setStorage] = React.useState<TrxnResult>({pools: POOLS_MOCK});
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const [openPopUp, setPopUp] = React.useState<boolean>(false);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [txnStatus, setTxnStatus] = React.useState<TransactionResult>({loading: false, txResult: '', message: '', buttonText: 'Approve'});
  const [drawerState, setDrawerState] = React.useState<boolean>(false);
  const [displayOnboardUser, setDisplayOnboardUser] = React.useState<boolean>(false);
  const [popUpDrawer, setPopUpDrawer] = React.useState<DrawerAnchor>('');
  const [parentLinkActive, setParentActiveLink] = React.useState<string>(ROUTE_ENUM.DASHBOARD);
  
  
  const setParentActive = (arg: string) => setParentActiveLink(arg);
  const handlePopUpDrawer = (arg: DrawerAnchor) => setPopUpDrawer(arg);
  const toggleDisplayOnboardUser = () => setDisplayOnboardUser(!displayOnboardUser);
  const setdrawerState = (arg: boolean) => setDrawerState(arg);
  const setstate = (arg: TrxnResult) => setStorage(arg);
  const exitOnboardScreen = () => setDisplay(true);
  const togglePopUp = () => setPopUp(!openPopUp);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const setTrxnStatus = (arg: TransactionResult) => setTxnStatus(arg);
  const setMessage = (arg: string) => {
    const networkResponseError = 'Trxn failed with HTTP request failed';
    setTxnStatus(
      (prev) => { 
        if(arg.match(networkResponseError)){
          prev.message = 'Please check your internet connection';
        } else {
          prev.message = arg;
        }
        return prev;
      }
    );
  }

  // const filtered = filterPools(pools, operation);

  const toggleTransactionWindow =
    (value: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
        return;
    }

    setdrawerState(value );
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route 
        path={'/'} 
        element={ <App /> } 
      >
        { renderAppChildComponents() }
      </Route>
    )
  );

  const displayScreen = () => displayAppScreen? <RouterProvider router={router} /> : <OnbaordScreen />;
  React.useEffect(() => {
    if(openPopUp){
      setTimeout(() => {
        togglePopUp()
      }, 10000)
    }
  }, [openPopUp])

  return (
    <StorageContextProvider 
    value={
      {
        storage, 
        setstate,
        exitOnboardScreen,
        toggleSidebar,
        showSidebar,
        setTrxnStatus,
        txnStatus,
        setMessage,
        displayAppScreen,
        drawerState,
        popUpDrawer,
        openPopUp,
        parentLinkActive,
        displayOnboardUser,
        setParentActive,
        setdrawerState,
        togglePopUp,
        handlePopUpDrawer,
        toggleTransactionWindow,
        toggleDisplayOnboardUser,
      }}
    >
      <div >
        { displayScreen() }
      </div>
      <Notification message={txnStatus.message} />
    </StorageContextProvider>
  );
}
