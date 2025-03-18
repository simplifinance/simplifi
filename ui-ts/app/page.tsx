"use client"

import React from "react";
import OnbaordScreen from "@/components/screens/OnboardScreen";
import Dashboard from "@/components/features/Dashboard";
import FlexPool from "@/components/features/FlexPool";
import Yield from "@/components/features/Yield";
import Faq from "@/components/features/Faq";
import SimpliDao from "@/components/features/SimpliDao";
import Notification from "@/components/utilities/Notification";
import { ANALYTICS, } from "@/constants";
import { Path, TrxState, } from "@/interfaces";
import { StorageContextProvider } from "@/components/contexts/StateContextProvider";
import { useAccount, useReadContracts,} from "wagmi";
import { MotionDivWrap } from "@/components/utilities/common/MotionDivWrap";
import Sidebar from "@/components/Layout/Sidebar";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Typed from "react-typed";
import NotConnectedPopUp from "@/components/utilities/NotConnectedPopUp";
import getReadFunctions from "@/components/features/FlexPool/update/DrawerWrapper/readContractConfig";
import Layout from "@/components/Layout";

export default function SimplifiApp() {
  // const [isMounted, setMount] = React.useState(false);
  // const {data: blockNumber, } = useBlockNumber({watch: true, query: {refetchInterval: 3000}});
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const [openPopUp, setPopUp] = React.useState<number>(0);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [message, setMessage] = React.useState<string>('');
  const [displayOnboardUser, setDisplayOnboardUser] = React.useState<boolean>(false);
  const [activePath, setActivePath] = React.useState<Path>('/dashboard');
  const [displayForm, setDisplayForm] = React.useState<boolean>(false);
    
  const { isConnected, address, connector, isDisconnected, chainId } = useAccount();
  const { getFactoryDataConfig, readSymbolConfig } = getReadFunctions({chainId});
  
  const { data, refetch } = useReadContracts({
    contracts: [
      {...readSymbolConfig()},
      {...getFactoryDataConfig()}
    ],
    allowFailure: true,
    query: {
      refetchInterval: 4000, 
      refetchOnReconnect: 'always', 
    }
  });
  
  const closeDisplayForm = () => setDisplayForm(false);
  const openDisplayForm = () => setDisplayForm(true);
  const toggleDisplayOnboardUser = () => setDisplayOnboardUser(!displayOnboardUser);
  const exitOnboardScreen = () => setDisplay(true);
  const togglePopUp = (arg: number) => setPopUp(arg);
  const setmessage = (arg: string) => setMessage(arg);
  const toggleSidebar = (arg: boolean) => setShowSidebar(arg);
  const setActivepath = (arg:Path) => setActivePath(arg);
  const setstorage = (arg: TrxState) => {
    if(arg.message) setMessage(arg.message);
    refetch();
  };

  const displayScreen = () => {
    const children = (
      <div className='appContainer'>
        <Navbar />
        <Sidebar />
        <main className='md:pl-4 md:py-[26px] md:pr-[22px] space-y-4 relative'>
          <MotionDivWrap className="flex justify-center items-center">
            <Typed 
              strings={['Warning! This is testnet version', 'Warning! Coins and/or Tokens used are not real', 'Warning! Do not send or use real token']}
              className='fixed top-16 z-50 md:hidden text-green1 dark:text-white1 font-extrabold px-4 py-1 text-center text-lg'
              typeSpeed={100} backSpeed={100} loop showCursor={false}              
            />    
          </MotionDivWrap>
          <MotionDivWrap className={`minHeight md:rounded-[26px] px-4 py-6 md:py-10 bg-transparent relative`} >
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

  React.useEffect(() => {
    if(!isConnected) {
      openPopUp && setTimeout(() => {
        setPopUp(0);
      }, 6000);
      clearTimeout(6000);
    } else {
      refetch();
    }

  }, [isConnected, address, connector, isDisconnected, openPopUp]);
 
  return (
    <Layout>
      <StorageContextProvider 
        value={
          {
            currentEpoches: data?.[1].result?.currentEpoches || 0n,
            recordEpoches: data?.[1].result?.recordEpoches || 0n, 
            analytics: data?.[1].result?.analytics || ANALYTICS,
            symbol: data?.[0].result || 'USD',
            setstorage,
            displayForm,
            closeDisplayForm,
            openDisplayForm,
            message,
            exitOnboardScreen,
            toggleSidebar,
            showSidebar,
            setmessage,
            displayAppScreen,
            openPopUp,
            displayOnboardUser,
            activePath,
            setActivepath,
            togglePopUp,
            toggleDisplayOnboardUser,
          }
        }
      >
        <div >
          { displayScreen() }
        </div>
        <Notification message={message} resetMessage={() => setmessage('')} />
      </StorageContextProvider>
    </Layout>
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
