import React from "react";
import OnbaordScreen from "@/components/OnboardScreen";
import App from "@/components/App";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet } from "react-router-dom";
import { POOLS_MOCK, PROFILE_MOCK, ROUTE_ENUM } from "@/constants";
import Dashboard from "@/components/topComponents/Dashboard";
import Liquidity from "@/components/topComponents/finance";
import Invest from "@/components/topComponents/invest";
import SpeedDoc from "@/components/topComponents/speeddoc";
import SimpliDao from "@/components/topComponents/SimpliDao";
import { LiquidityInnerLinkEntry, TrxnResult } from "@/interfaces";
import { Create } from "@/components/topComponents/finance/Create";
import { Open } from "@/components/topComponents/finance/Open";
import { Closed } from "@/components/topComponents/finance/Closed";
import { StorageContextProvider } from "@/components/StateContextProvider";

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
    path: ROUTE_ENUM.LIQUIDITY,
    renderElement: () => (<Liquidity />), 
  },
  {
    children: undefined,
    path: ROUTE_ENUM.INVEST,
    renderElement: () => ( <Invest /> ), 
  },
  {
    children: undefined,
    path: ROUTE_ENUM.DAO,
    renderElement: () => ( <SimpliDao /> ), 
  },
  {
    children: undefined,
    path: ROUTE_ENUM.SPEEDDOC,
    renderElement: () => ( <SpeedDoc /> ), 
  }
].map(({renderElement, path, children}) => (
  <Route key={path} {...{element: renderElement(), path}}>
    { children }
  </Route>
));

export default function SimpliApp() {
  const [storage, setStorage] = React.useState<TrxnResult>({pools: POOLS_MOCK});
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const [innerlink, setInnerlink] = React.useState<LiquidityInnerLinkEntry>('Dashboard');

  const setstate = (arg: TrxnResult) => setStorage(arg);
  const exitOnboardScreen = () => setDisplay(true);
  const setInnerLink = (arg: LiquidityInnerLinkEntry) => setInnerlink(arg);
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route 
        path="/" 
        element={ <App {...{ setInnerLink, innerlink, displayAppScreen }} /> } 
      >
        { renderAppChildComponents() }
      </Route>
    )
  );

  const displayScreen = () => displayAppScreen? <RouterProvider router={router} /> : <OnbaordScreen exitOnboardScreen={exitOnboardScreen} />;

  return (
    <main className="h-scree">
      <StorageContextProvider 
        value={{storage, setstate}}
      >
        { displayScreen() }
      </StorageContextProvider>
    </main>
  );
}
