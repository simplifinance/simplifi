import * as React from "react";
import OnbaordScreen from "@/components/OnboardScreen";
import App from "@/components/App";
import { Routes, Route, useNavigate, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet } from "react-router-dom";
import { DRAWERWIDTH, ROUTE_ENUM } from "@/constants";
import Dashboard from "@/components/topComponents/Dashboard";
import Liquidity from "@/components/topComponents/finance";
import Invest from "@/components/topComponents/invest";
import SpeedDoc from "@/components/topComponents/speeddoc";
import SimpliDao from "@/components/SimpliDao";
import { LiquidityInnerLinkEntry } from "@/interfaces";
// import { Create } from "@/components/topComponents/finance/Create";
// import { Open } from "@/components/topComponents/finance/Open";
// import Closed from "@/components/Finance/closed";
// import { MotionDivWrap } from "@/components/MotionDivWrap";

export default function Home(): React.ReactElement {
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const exitOnboardScreen = () => setDisplay(true);
  const [innerlink, setInnerlink] = React.useState<LiquidityInnerLinkEntry>('Dashboard');
  const [displayLiqChild, setDisplayChild] = React.useState<boolean>(false);

  const setInnerLink = (arg: LiquidityInnerLinkEntry) => setInnerlink(arg);
  const setDisplayLiqChild = (arg: boolean) => setDisplayChild(arg);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App {...{setInnerLink, innerlink, displayAppScreen, displayLiqChild, setDisplayLiqChild }} />} >
        <Route path={ROUTE_ENUM.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTE_ENUM.LIQUIDITY} element={<Liquidity elementId={innerlink} displayChild={displayLiqChild} />} />
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