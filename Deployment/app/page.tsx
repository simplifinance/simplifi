"use client"

import React from "react";
import Notification from "@/components/utilities/Notification";
import { analytics, appData, mockAssets, mockPoints, mockProviders } from "@/interfaces";
import type { AppState, Path, Point, ProviderResult, SupportedAsset, } from "@/interfaces";
import { StorageContextProvider } from "@/components/contexts/StateContextProvider";
import { useAccount, useReadContracts,} from "wagmi";
import NotConnectedPopUp from "@/components/utilities/NotConnectedPopUp";
import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import AppFeatures from "@/components/AppFeatures";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { isSuportedChain } from "@/apis/utils/getContractData";

export default function SimplifiApp() {
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const [openPopUp, setPopUp] = React.useState<number>(0);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [messages, setMessage] = React.useState<string[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [displayOnboardUser, setDisplayOnboardUser] = React.useState<boolean>(false);
  const [prevPaths, setPreviousPath] = React.useState<Path[]>([]);
  const [providersIds, setProvidersIds] = React.useState<bigint[]>([]);
  const [activePath, setActivePath] = React.useState<Path>('Dashboard');
  const [displayForm, setDisplayForm] = React.useState<boolean>(false);
  const [appState, setAppState] = React.useState<AppState>(appData);
    
  const { isConnected, address, connector, isDisconnected, chainId } = useAccount();
  const { openChainModal, chainModalOpen } = useChainModal();
  const { getFactoryDataConfig, readSymbolConfig, getPointsConfig, getProvidersConfig, getSupportedAssetConfig, } = getReadFunctions({chainId});
  
  // Read contract data from the blockchain
  const { refetch } = useReadContracts({
    contracts: [
      readSymbolConfig(),
      getFactoryDataConfig(),
      getPointsConfig(),
      getProvidersConfig(),
      getSupportedAssetConfig(),
    ],
    allowFailure: true,
    query: {
      refetchInterval: (data_) => {
        data_.fetch()
        .then((newData) => {
          const symbol = newData[0]?.result || appState[0];
          const factoryData = newData[1]?.result || appState[1];
          const points : Point[] = [...newData?.[2]?.result || mockPoints];
          const supportedAssets : SupportedAsset[] = [...newData?.[4]?.result || mockAssets];
          const providers : ProviderResult[] = [...newData?.[3]?.result || mockProviders];
          setAppState([symbol, factoryData, points, providers, supportedAssets]);
        })
        return 5000
      }, 
      refetchOnReconnect: 'always', 
      refetchOnMount: 'always',
      refetchIntervalInBackground: true,
      retry: true,
    }
  });

  // // We convert blockchain's readonly data to mutable object
  // const points : Point[] = [...data?.[2]?.result || mockPoints];
  // const supportedAssets : SupportedAsset[] = [...data?.[4]?.result || mockAssets];
  // const providers : ProviderResult[] = [...data?.[3]?.result || mockProviders];

  const toggleProviders = (arg: bigint) => {
    // const found = providersIds.filter((id) => id === arg).at(0);
    providersIds.includes(arg)? setProvidersIds(providersIds.filter((id) => id !== arg)) : setProvidersIds((prev) => [...prev, arg]);
  }
  const setError = (arg:string) => setErrorMessage(arg);
  const closeDisplayForm = () => setDisplayForm(false);
  const openDisplayForm = () => setDisplayForm(true);
  const toggleDisplayOnboardUser = () => setDisplayOnboardUser(!displayOnboardUser);
  const exitOnboardScreen = () => setDisplay(true);
  const togglePopUp = (arg: number) => setPopUp(arg);
  const setmessage = (arg: string) => arg === ''? setMessage([]): setMessage((prev) => [...prev, arg]);

  const toggleSidebar = (arg: boolean) => setShowSidebar(arg);
  const setActivepath = (newPath: Path) => {
    if(newPath === '') {
      if(prevPaths.length > 0) {
        newPath = prevPaths[prevPaths.length - 1];
        console.log("NewPath: ", newPath); 
        setPreviousPath((prev) => prev.filter((_, index) => index < (prevPaths.length - 1)));
      } else newPath = 'Dashboard';
    } else {
      setPreviousPath((prev) => [...prev, activePath]);
    }
    if(newPath !== activePath) setActivePath(newPath);
  };
  

  /**
   * React UseEffect. Watches changes to the 'isConnected' variable.
   * If user is not connected, they're restricted access to the app functionalities. 
   * A popup modal is activated instead. At the same time, it ensures that users are 
   * connected to a supported network.
   */
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
          symbol: appState[0],
          currentEpoches: appState[1].currentEpoches,
          recordEpoches: appState[1].recordEpoches || 0n, 
          analytics: appState[1].analytics,
          points: appState[2],
          providers: appState[3],
          supportedAssets: appState[4],
          toggleProviders,
          displayForm,
          closeDisplayForm,
          openDisplayForm,
          messages,
          errorMessage,
          setError,
          exitOnboardScreen,
          toggleSidebar,
          showSidebar,
          setmessage,
          displayAppScreen,
          openPopUp,
          displayOnboardUser,
          activePath,
          prevPaths,
          setActivepath,
          togglePopUp,
          toggleDisplayOnboardUser,
          providersIds
        }
      }
    >
      <AppFeatures currentPath={activePath} />
      <NotConnectedPopUp toggleDrawer={togglePopUp} openDrawer={openPopUp} />
      <Notification message={messages[messages.length - 1] || ''} resetMessage={() => setmessage('')} />
    </StorageContextProvider>
  );
}

