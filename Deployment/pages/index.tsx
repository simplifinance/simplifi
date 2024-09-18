import * as React from "react";
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

export default function Home(): React.ReactElement {
  const [storage, setStorage] = React.useState<TrxnResult>({pools: POOLS_MOCK, profile: PROFILE_MOCK});

  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const exitOnboardScreen = () => setDisplay(true);
  const [innerlink, setInnerlink] = React.useState<LiquidityInnerLinkEntry>('Dashboard');

  const setstate = (arg: TrxnResult) => setStorage(arg);
  const setInnerLink = (arg: LiquidityInnerLinkEntry) => setInnerlink(arg);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App {...{setInnerLink, innerlink, displayAppScreen  }} />} >
        <Route path={ROUTE_ENUM.DASHBOARD} element={<Dashboard pools={storage.pools} />} />
        <Route path={ROUTE_ENUM.LIQUIDITY} element={<Liquidity setstate={setstate} />}>
          <Route path={ROUTE_ENUM.CREATE} element={<Create />} />
          <Route path={ROUTE_ENUM.OPEN} element={<Open pools={storage.pools}/>} />
          <Route path={ROUTE_ENUM.CLOSED} element={<Closed pools={storage.pools}/>} />
        </Route>
        <Route path={ROUTE_ENUM.INVEST} element={<Invest />} />
        <Route path={ROUTE_ENUM.DAO} element={<SimpliDao />} />
        <Route path={ROUTE_ENUM.SPEEDDOC} element={<SpeedDoc />} />
      </Route>
    )
  )

  return (
    <main className="h-screen">
      {
        displayAppScreen? 
        <RouterProvider router={router} />
          :
            <OnbaordScreen exitOnboardScreen={exitOnboardScreen} />
      }
    </main>
  );
}

// {
//   displayAppScreen? 
//     <Routes>
//       <Route path={'/'} element={<App />}>
//         {
//           [
//             {
//               path: ROUTE_ENUM.DASHBOARD,
//               element: <Dashboard />
//             },
//             {
//               path: ROUTE_ENUM.LIQUIDITY,
//               element: 
//               <Route path={ROUTE_ENUM.LIQUIDITY} element={<Liquidity />}>
//               {
//                 (
//                   [
//                     {
//                       path: ROUTE_ENUM.CREATE,
//                       element: <Create />,
//                     },
//                     {
//                       path: ROUTE_ENUM.OPEN,
//                       element: <Open />,
//                     },
//                     {
//                       path: ROUTE_ENUM.CLOSED,
//                       element: <Closed />,
//                     },
    
//                   ] as const).map(({path, element}) => (
//                     <Route path={path} element={element} key={path}/>
//                   )
//                 )
//               }
//             </Route>
//             },
//             {
//               path: ROUTE_ENUM.INVEST,
//               element: <Invest />
//             },
//             {
//               path: ROUTE_ENUM.DAO,
//               element: <SimpliDao />
//             },
//             {
//               path: ROUTE_ENUM.SPEEDDOC,
//               element: <SpeedDoc />
//             },
//           ].map((item, i) => (
//             <Route path={item.path} element={item.element} key={i}/>
//           ))
//         }
//       </Route>
//     </Routes> : <OnbaordScreen exitOnboardScreen={exitOnboardScreen} /> 
// }