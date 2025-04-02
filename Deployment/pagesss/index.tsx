import React from "react";
import Dashboard from "@/components/AppFeatures/Dashboard";
import FlexPool from "@/components/AppFeatures/FlexPool";
import Yield from "@/components/AppFeatures/Yield";
import Faq from "@/components/AppFeatures/Faq";
import SimpliDao from "@/components/AppFeatures/SimpliDao";
import Notification from "@/components/utilities/Notification";
import { analytics, routeEnum, } from "@/constants";
import { Path, TrxState, } from "@/interfaces";
import { StorageContextProvider } from "@/components/contexts/StateContextProvider";
import { useAccount, useReadContracts,} from "wagmi";
import NotConnectedPopUp from "@/components/utilities/NotConnectedPopUp";
import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import AppFeatures from "@/components/AppFeatures";
import { Create } from "@/components/AppFeatures/FlexPool/Create";
import Pools from "@/components/AppFeatures/FlexPool/Pools";
import AiAssist from "@/components/AppFeatures/AiAssist";
import ErrorBoundary from "@/components/utilities/ErrorBoundary";
import { isSuportedChain } from "@/utilities";
import { useChainModal } from "@rainbow-me/rainbowkit"

// import { GetServerSidePropsContext, InferGetServerSidePropsType, PreviewData } from 'next';
// import { getSession } from 'next-auth/react';
// import { getToken } from 'next-auth/jwt';
// import { ParsedUrlQuery } from "querystring";

// export const getServerSideProps = async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
//   const session = await getSession(context);
//   const token = await getToken({req: context.req});
//   const address = token?.sub ?? null;
  
//   return{
//     props: {
//       address,
//       session,
//     },
//   };
// };
// type AuthenticatedPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function SimplifiApp() {
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const [openPopUp, setPopUp] = React.useState<number>(0);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [message, setMessage] = React.useState<string>('');
  const [displayOnboardUser, setDisplayOnboardUser] = React.useState<boolean>(false);
  const [activePath, setActivePath] = React.useState<Path>('/dashboard');
  const [displayForm, setDisplayForm] = React.useState<boolean>(false);
  // const [switchChain, setSwitchChain] = React.useState<boolean>(false);

  const { isConnected, address, connector, isDisconnected, chainId } = useAccount();
   const { openChainModal, chainModalOpen } = useChainModal();
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
      if(!isSuportedChain(chainId!) && !chainModalOpen) openChainModal?.(); 
      refetch();
    }

  }, [isConnected, address, connector, isDisconnected, openPopUp]);
 
  return (
    <StorageContextProvider 
      value={
        {
          currentEpoches: data?.[1].result?.currentEpoches || 0n,
          recordEpoches: data?.[1].result?.recordEpoches || 0n, 
          analytics: data?.[1].result?.analytics || analytics,
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
      <RouterProvider router={router} fallbackElement={<ErrorBoundary />} />
      <NotConnectedPopUp toggleDrawer={togglePopUp} openDrawer={openPopUp} />
      <Notification message={message} resetMessage={() => setmessage('')} />
      {/* <SwitchChain chainId={chainId} /> */}
    </StorageContextProvider>
  );
}

const renderFlexPoolChildren = () => [
  {
    path: routeEnum.POOLS,
    element: () => (<Pools />),
  },
  {
    path: routeEnum.CREATE,
    element: () => (<Create />),
  },
].map(({path, element}) => (
    <Route key={path} {...{path, element: element()}} />
));

const CHILDREN : {path: string, element: React.ReactNode, children: React.ReactNode}[] = [
  {
    path: routeEnum.DASHBOARD,
    element: ( <Dashboard /> ), 
    children: undefined
  },
  {
    path: routeEnum.FLEXPOOL,
    element: ( <FlexPool /> ), 
    children: renderFlexPoolChildren()
  },
  { 
    path: routeEnum.YIELD,
    element: ( <Yield /> ),
    children: undefined
  },
  {
    path: routeEnum.DAO,
    element: ( <SimpliDao /> ), 
    children: undefined
  },
  {
    path: routeEnum.FAQ,
    element: ( <Faq /> ), 
    children: undefined
  },
  {
    path: routeEnum.AIASSIST,
    element: ( <AiAssist /> ), 
    children: undefined
  }
];
