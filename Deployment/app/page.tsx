"use client"

import React from "react";
import Notification from "@/components/utilities/Notification";
import { analytics } from "@/constants";
import { Path, } from "@/interfaces";
import { StorageContextProvider } from "@/components/contexts/StateContextProvider";
import { useAccount, useReadContracts,} from "wagmi";
import NotConnectedPopUp from "@/components/utilities/NotConnectedPopUp";
import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import AppFeatures from "@/components/AppFeatures";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { isSuportedChain } from "@/utilities";

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
    
  const { isConnected, address, connector, isDisconnected, chainId } = useAccount();
  const { openChainModal, chainModalOpen } = useChainModal();
  const { getFactoryDataConfig, readSymbolConfig } = getReadFunctions({chainId});
  
  // Read contract data from the blockchain
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
          currentEpoches: data?.[1].result?.currentEpoches || 0n,
          recordEpoches: data?.[1].result?.recordEpoches || 0n, 
          analytics: data?.[1].result?.analytics || analytics,
          symbol: data?.[0].result || 'USD',
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
