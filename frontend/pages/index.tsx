import React from "react";
import OnbaordScreen from "@/components/OnboardScreen";
import { POOLS_MOCK, } from "@/constants";
import Dashboard from "@/components/topComponents/Dashboard";
import FlexPool from "@/components/topComponents/finance";
import Yield from "@/components/topComponents/Yield";
import Faq from "@/components/topComponents/Faq";
import SimpliDao from "@/components/topComponents/SimpliDao";
import { DrawerAnchor, Path, Pools, TrxState, } from "@/interfaces";
import { StorageContextProvider } from "@/components/StateContextProvider";
import Notification from "@/components/Notification";
import filterPools from "@/components/topComponents/finance/commonUtilities";
import { MotionDivWrap } from "@/components/MotionDivWrap";
import Sidebar from "@/components/App/Sidebar";
import Navbar from "@/components/App/Navbar";
import Footer from "@/components/App/Footer";
import NotConnectedPopUp from "@/components/App/NotConnectedPopUp";
import { useAccount, useConfig } from "wagmi";
import { getEpoches } from "@/apis/read/readContract";

export default function SimpliApp() {
  const [storage, setStorage] = React.useState<Pools>(POOLS_MOCK);
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const [openPopUp, setPopUp] = React.useState<boolean>(false);
  const [showSidebar, setShowSidebar] = React.useState(false);
  // const [txnStatus, setTxnStatus] = React.useState<TrxState>({message: '',});
  const [message, setMessage] = React.useState<string>('');
  const [drawerState, setDrawerState] = React.useState<boolean>(false);
  const [displayOnboardUser, setDisplayOnboardUser] = React.useState<boolean>(false);
  const [popUpDrawer, setPopUpDrawer] = React.useState<DrawerAnchor>('');
  const [activePath, setActivePath] = React.useState<Path>('/dashboard');
  
  const { isConnected, connector,  } = useAccount();
  const config = useConfig();
  const handlePopUpDrawer = (arg: DrawerAnchor) => setPopUpDrawer(arg);
  const toggleDisplayOnboardUser = () => setDisplayOnboardUser(!displayOnboardUser);
  const setdrawerState = (arg: boolean) => setDrawerState(arg);
  // const setstate = (arg: TrxnResult) => setStorage(arg);
  const exitOnboardScreen = () => setDisplay(true);
  const togglePopUp = () => setPopUp(!openPopUp);
  const toggleSidebar = (arg: boolean) => setShowSidebar(arg);
  const setActivepath = (arg:Path) => setActivePath(arg);
  const setTrxnStatus = (arg: TrxState) => {
    if(arg.message) setMessage(arg.message);
    if(arg.contractState) setStorage(arg.contractState);
  };
  // const setMessage = (arg: string) => {
  //   const networkResponseError = 'Trxn failed with HTTP request failed';
  //   setTxnStatus(
  //     (prev) => { 
  //       if(arg.match(networkResponseError)){
  //         prev.message = 'Please check your internet connection';
  //       } else {
  //         prev.message = arg;
  //       }
  //       return prev;
  //     }
  //   );
  // }

  const { open, closed, tvl, permissioned, permissionless } = filterPools(storage);

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
      <NotConnectedPopUp handleClosePopUp={togglePopUp} openPopUp={openPopUp} />
    </div>
    );
    return (
      displayAppScreen? children : <OnbaordScreen />
    );
  };

  React.useEffect(() => {
    const ctrl = new AbortController();
    if(!isConnected){
      openPopUp && setTimeout(() => {
        setPopUp(false);
      }, 6000);
    } else {
      if(isConnected && connector) {
        setTimeout(async() => {
          const pools = await getEpoches({config});
          setStorage(pools);
        }, 6000);
      }
    }
    return () => {
      clearTimeout(6000);
      ctrl.abort();
    };
  }, [isConnected, connector, openPopUp, togglePopUp]);

  return (
    <StorageContextProvider 
    value={
      {
        storage, 
        open,
        tvl,
        closed,
        permissioned,
        permissionless,
        exitOnboardScreen,
        toggleSidebar,
        showSidebar,
        setTrxnStatus,
        // txnStatus,
        // setMessage,
        displayAppScreen,
        drawerState,
        popUpDrawer,
        openPopUp,
        displayOnboardUser,
        activePath,
        setActivepath,
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
      <Notification message={message} />
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
