import * as React from "react";
import OnbaordScreen from "@/components/OnboardScreen";
import App, { DRAWER_CONTENT } from "@/components/App";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/components/constants";
import Dashboard from "@/components/topComponents/Dashboard";
import Finance from "@/components/topComponents/finance";
import Invest from "@/components/topComponents/invest";
import SimpliDao from "@/components/topComponents/SimpliDao";
import SpeedDoc from "@/components/topComponents/speeddoc";

export default function Home(): React.ReactElement {
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const exitOnboardScreen = () => setDisplay(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    displayAppScreen? navigate('/dashboard', {replace: true}) : null;
  }, [displayAppScreen])

  return (
    <main className="h-screen">
      {
        displayAppScreen? 
          <Routes>
            <Route path={'/'} element={<App />}>
              {
                [
                  {
                    path: ROUTE_ENUM.dashboard,
                    element: <Dashboard />
                  },
                  {
                    path: ROUTE_ENUM.finance,
                    element: <Finance />
                  },
                  {
                    path: ROUTE_ENUM.invest,
                    element: <Invest />
                  },
                  {
                    path: ROUTE_ENUM.digdao,
                    element: <DigDao />
                  },
                  {
                    path: ROUTE_ENUM.speeddoc,
                    element: <SpeedDoc />
                  },
                ].map((item, i) => (
                  <Route path={item.path} element={item.element} key={i}/>
                ))
              }
            </Route>
          </Routes> : <OnbaordScreen exitOnboardScreen={exitOnboardScreen} /> 
      }
    </main>
  );
}
