import React from "react";
import OnbaordScreen from "@/components/OnboardScreen";
import { POOLS_MOCK, } from "@/constants";
import Dashboard from "@/components/features/Dashboard";
import FlexPool from "@/components/features/FlexPool";
import Yield from "@/components/features/Yield";
import Faq from "@/components/features/Faq";
import SimpliDao from "@/components/features/SimpliDao";
import { Path, Pools, TrxState, } from "@/interfaces";
import { StorageContextProvider } from "@/components/StateContextProvider";
import Notification from "@/components/Notification";
import { MotionDivWrap } from "@/components/MotionDivWrap";
import Sidebar from "@/components/Layout/Sidebar";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import NotConnectedPopUp from "@/components/App/NotConnectedPopUp";
import { useAccount, useConfig, useReadContract, UseReadContractParameters } from "wagmi";
import { getEpoches } from "@/apis/read/readContract";
import filterPools from "@/utilities";

export default function SimpliApp() {
  const [storage, setStorage] = React.useState<Pools>(POOLS_MOCK);
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const [openPopUp, setPopUp] = React.useState<number>(0);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [message, setMessage] = React.useState<string>('');
  const [displayOnboardUser, setDisplayOnboardUser] = React.useState<boolean>(false);
  const [activePath, setActivePath] = React.useState<Path>('/dashboard');
  
  const { isConnected, connector,  } = useAccount();
  const config = useConfig();
  const toggleDisplayOnboardUser = () => setDisplayOnboardUser(!displayOnboardUser);
  const exitOnboardScreen = () => setDisplay(true);
  const togglePopUp = (arg: number) => setPopUp(arg);
  const setmessage = (arg: string) => setMessage(arg);
  const toggleSidebar = (arg: boolean) => setShowSidebar(arg);
  const setActivepath = (arg:Path) => setActivePath(arg);
  const setTrxnStatus = (arg: TrxState) => {
    if(arg.message) setMessage(arg.message);
    if(arg.contractState) setStorage(arg.contractState);
  };

  const { open, closed, tvl, permissioned, permissionless } = filterPools(storage);

  const displayScreen = () => {
    const children = (
      <div className='appContainer'>
      <Navbar />
      <Sidebar />
      <main className='md:pl-4 md:py-[26px] md:pr-[22px] space-y-4'>
        <MotionDivWrap className={`minHeight md:border-4 border-white1/20 md:rounded-[56px] px-4 py-6 md:py-10 bg-gray1 relative`} >
          {
            CHILDREN.filter(({path}) => path === activePath).at(0)?.element
          }
        </MotionDivWrap>
        <Footer />
      </main>
      <NotConnectedPopUp toggleDrawer={togglePopUp} openDrawer={openPopUp} />
    </div>
    );
    return (
      displayAppScreen? children : <OnbaordScreen />
    );
  };
  const confi : UseReadContractParameters = {
    
  }
  const { } = useReadContract();

  // React.useEffect(() => {
  //   const ctrl = new AbortController();
  //   if(!isConnected){
  //     openPopUp && setTimeout(() => {
  //       setPopUp(0);
  //     }, 6000);
  //   } else {
  //     if(isConnected && connector) {
  //       setTimeout(async() => {
  //         const pools = await getEpoches({config});
  //         setStorage(pools);
  //       }, 6000);
  //     }
  //   }
  //   return () => {
  //     clearTimeout(6000);
  //     ctrl.abort();
  //   };
  // }, [isConnected, connector, openPopUp, togglePopUp]);

  return (
    <StorageContextProvider 
    value={
      {
        storage, 
        open,
        tvl,
        closed,
        message,
        permissioned,
        permissionless,
        exitOnboardScreen,
        toggleSidebar,
        showSidebar,
        setTrxnStatus,
        setmessage,
        displayAppScreen,
        openPopUp,
        displayOnboardUser,
        activePath,
        setActivepath,
        togglePopUp,
        toggleDisplayOnboardUser,
      }}
    >
      <div >
        { displayScreen() }
      </div>
      <Notification message={message} resetMessage={() => setmessage('')} />
    </StorageContextProvider>
  );
}


const CHILDREN : {path: Path, element: JSX.Element}[] = [
  {
    path: '/dashboard',
    element: ( <Dashboard /> ), 
  },
  {
    path: '/flexpool',
    element: ( <FlexPool /> ), 
  },
  {
    path: '/yield',
    element: ( <Yield /> ), 
  },
  {
    path: '/simplidao',
    element: ( <SimpliDao /> ), 
  },
  {
    path: 'faq',
    element: ( <Faq /> ), 
  }
];


  // const router = createBrowserRouter(
  //   createRoutesFromElements(
  //     <Route 
  //       path={'/'} 
  //       element={ <App /> } 
  //     >
  //       { renderAppChildComponents() }
  //     </Route>
  //   )
  // );

// const renderLiquidityChildComponents = () => [
//   // {
//   //   path: ROUTE_ENUM.CREATE,
//   //   element: () => (<Create />),
//   // },
//   // {
//   //   path: ROUTE_ENUM.OPEN,
//   //   element: () => (<Open />),
//   // },
//   // {
//   //   path: ROUTE_ENUM.CLOSED,
//   //   element: () => (<Closed />)
//   // }
// ].map(({path, element}) => (
//   <Route key={path} {...{path, element: element()}} />
// ));
