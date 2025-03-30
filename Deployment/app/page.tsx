"use client"

import React from "react";
// import OnbaordScreen from "@/components/screens/OnboardScreen";
import Dashboard from "@/components/AppFeatures/Dashboard";
import FlexPool from "@/components/AppFeatures/FlexPool";
import Yield from "@/components/AppFeatures/Yield";
import Faq from "@/components/AppFeatures/Faq";
import SimpliDao from "@/components/AppFeatures/SimpliDao";
import Notification from "@/components/utilities/Notification";
import { ANALYTICS, ROUTE_ENUM, } from "@/constants";
import { Path, TrxState, } from "@/interfaces";
import { StorageContextProvider } from "@/components/contexts/StateContextProvider";
import { useAccount, useReadContracts,} from "wagmi";
import { MotionDivWrap } from "@/components/utilities/common/MotionDivWrap";
// import Sidebar from "@/components/Layout/Sidebar";
// import Navbar from "@/components/Layout/Navbar";
// import Footer from "@/components/Layout/Footer";
// import Typed from "react-typed";
import NotConnectedPopUp from "@/components/utilities/NotConnectedPopUp";
import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import Layout from "@/components/Layout";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import AppFeatures from "@/components/AppFeatures";
import { Create } from "@/components/AppFeatures/FlexPool/Create";
import Pools from "@/components/AppFeatures/FlexPool/Pools";
import AiAssist from "@/components/screens/Aiassist";

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

  // const displayScreen = () => {
  //   const children = (
      
  //   );
  //   return (
  //     displayAppScreen? children : <OnbaordScreen />
  //   );
  // };

  const renderDashboardChildren = () => {
    return(
      CHILDREN.map(({element, path, children}) => (
        <Route path={path} element={element}>{children && children}</Route>
      ))
    );
  }
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route 
        path={'/'} 
        element={ <AppFeatures /> } 
      >
        { renderDashboardChildren() }
      </Route>
    )
  );

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
      {/* <Layout> */}
        {/* <MotionDivWrap className={`minHeight bg-white1 dark:bg-gray1 md:rounded-[36px] border border-green1/30 dark:border-gray1 p-4 relative`}> */}
          <RouterProvider router={router} />
        {/* </MotionDivWrap> */}
        <NotConnectedPopUp toggleDrawer={togglePopUp} openDrawer={openPopUp} />
      {/* </Layout> */}
      <Notification message={message} resetMessage={() => setmessage('')} />
    </StorageContextProvider>
  );
}

const renderFlexPoolChildren = () => [
  {
    path: ROUTE_ENUM.POOLS,
    element: () => (<Pools />),
  },
  {
    path: ROUTE_ENUM.CREATE,
    element: () => (<Create />),
  },
  // {
  //   path: ROUTE_ENUM.CLOSED,
  //   element: () => (<Closed />)
  // }
].map(({path, element}) => (
    <Route key={path} {...{path, element: element()}} />
));

const CHILDREN : {path: string, element: React.ReactNode, children: React.ReactNode}[] = [
  {
    path: ROUTE_ENUM.DASHBOARD,
    element: ( <Dashboard /> ), 
    children: undefined
  },
  {
    path: ROUTE_ENUM.FLEXPOOL,
    element: ( <FlexPool /> ), 
    children: renderFlexPoolChildren()
  },
  { 
    path: ROUTE_ENUM.YIELD,
    element: ( <Yield /> ),
    children: undefined
  },
  {
    path: ROUTE_ENUM.DAO,
    element: ( <SimpliDao /> ), 
    children: undefined
  },
  {
    path: ROUTE_ENUM.FAQ,
    element: ( <Faq /> ), 
    children: undefined
  },
  {
    path: ROUTE_ENUM.AIASSIST,
    element: ( <AiAssist /> ), 
    children: undefined
  }
];


{/* <div className=''>
  <main className='md:pl-4 md:py-[26px] md:pr-[22px] space-y-4 relative'> */}
    {/* <MotionDivWrap className="fixed top-16 z-50 md:hidden flex justify-center items-center ">
      <Typed 
        strings={['Warning! This is testnet version', 'Warning! Coins and/or Tokens used are not real', 'Warning! Do not send or use real token']}
        className='text-green1 dark:text-white1 font-extrabold px-4 py-1 text-center text-lg'
        typeSpeed={100} backSpeed={100} loop showCursor={false}              
      />    
    </MotionDivWrap> */}
    // <MotionDivWrap className={`minHeight bg-white1 dark:bg-gray1 md:rounded-[36px] border border-green1/30 dark:border-gray1 p-4`} >
    //   {
    //     CHILDREN.filter(({path}) => path === activePath).at(0)?.element
    //   }
    // </MotionDivWrap>
    {/* <Footer /> */}
  {/* </main> */}