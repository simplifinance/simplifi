"use client"

import React from "react";
import Notification from "@/components/utilities/Notification";
import { appData, emptyMockPoint, mockAssets, mockPoint, mockProviders, phases } from "@/interfaces";
import type { Path, PointsReturnValue, ProviderResult, SupportedAsset, } from "@/interfaces";
import { StorageContextProvider } from "@/components/contexts/StateContextProvider";
import { useAccount, useBlockNumber, useReadContracts,} from "wagmi";
import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import AppFeatures from "@/components/AppFeatures";
import { toBN } from "@/utilities";

export default function SimplifiApp() {
  // const [isMounted, setMount] = React.useState<boolean>(false);
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [messages, setMessage] = React.useState<string[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [displayOnboardUser, setDisplayOnboardUser] = React.useState<boolean>(false);
  const [prevPaths, setPreviousPath] = React.useState<Path[]>([]);
  const [providersIds, setProvidersIds] = React.useState<bigint[]>([]);
  const [activePath, setActivePath] = React.useState<Path>('Dashboard');
  const [displayForm, setDisplayForm] = React.useState<boolean>(false);
    
  const { isConnected, chainId } = useAccount();
  const { data: blockNumber} = useBlockNumber({watch: true});
  const { getFactoryDataConfig, readSymbolConfig, getPointsConfig, getProvidersConfig, getSupportedAssetConfig, } = getReadFunctions({chainId});
  
  // Read contract data from the blockchain
  const { refetch, data, isPending } = useReadContracts({
    contracts: [
      readSymbolConfig(),
      getFactoryDataConfig(),
      getPointsConfig(),
      getProvidersConfig(),
      getSupportedAssetConfig(),
    ],
    allowFailure: true,
    query: {
      enabled: !!isConnected,
      refetchOnReconnect: 'always', 
      // refetchInterval: 10000
      // refetchOnMount: 'always',
      // refetchIntervalInBackground: true,
      // retry: true,
    }
  });

  const { notReady, symbol, factoryData, points, supportedAssets, providers } = React.useMemo(() => {
    const notReady = isPending || !data;
    const symbol = notReady? appData[0] : data[0]?.result || appData[0];
    const factoryData = notReady? appData[1] : data[1]?.result || appData[1];
    const beta : PointsReturnValue = notReady? {key: phases[0].phase, value: [mockPoint]} : {key: data?.[2]?.result?.[0]?.key || phases[0].phase, value: [...data?.[2]?.result?.[0].value || [mockPoint]]}
    const alpha : PointsReturnValue = notReady? {key: phases[1].phase, value: [emptyMockPoint]} : {key: data?.[2]?.result?.[1]?.key || phases[1].phase, value: [...data?.[2]?.result?.[1].value || [emptyMockPoint]]}
    const mainnet : PointsReturnValue = notReady? {key: phases[2].phase, value: [emptyMockPoint]} : {key: data?.[2]?.result?.[2]?.key || phases[2].phase, value: [...data?.[2]?.result?.[2].value || [emptyMockPoint]]}
    const points : PointsReturnValue[] = [beta, alpha, mainnet];
    const supportedAssets : SupportedAsset[] = notReady? mockAssets : [...data?.[4]?.result || mockAssets];
    const providers : ProviderResult[] = notReady? mockProviders : [...data?.[3]?.result || mockProviders];
    return { notReady, symbol, factoryData, points, supportedAssets, providers };
  }, [data]);

  const toggleProviders = (arg: bigint) => {
    providersIds.includes(arg)? setProvidersIds(providersIds.filter((id) => id !== arg)) : setProvidersIds((prev) => [...prev, arg]);
  }
  const setError = (arg:string) => setErrorMessage(arg);
  const closeDisplayForm = () => setDisplayForm(false);
  const openDisplayForm = () => setDisplayForm(true);
  const toggleDisplayOnboardUser = () => setDisplayOnboardUser(!displayOnboardUser);
  const exitOnboardScreen = () => setDisplay(true);
  const setmessage = (arg: string) => arg === ''? setMessage([]): setMessage((prev) => [...prev, arg]);

  const toggleSidebar = (arg: boolean) => setShowSidebar(arg);

  const setActivepath = (newPath: Path) => {
    if(newPath === '') {
      if(prevPaths.length > 0) {
        newPath = prevPaths[prevPaths.length - 1];
        setPreviousPath((prev) => prev.filter((_, index) => index < (prevPaths.length - 1)));
      } else newPath = 'Dashboard';
    } else {
      setPreviousPath((prev) => [...prev, activePath]);
    }
    if(newPath !== activePath) setActivePath(newPath);
  }
  
  React.useEffect(() => {
    if(isConnected) {
      if(toBN(blockNumber).toNumber() % 10 === 0) refetch();
    } 
  }, [isConnected, blockNumber]);

  return (
    <StorageContextProvider 
      value={
        {
          symbol,
          currentEpoches: factoryData.currentEpoches,
          recordEpoches: factoryData.recordEpoches, 
          analytics: factoryData.analytics,
          points,
          providers,
          supportedAssets,
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
          displayOnboardUser,
          activePath,
          prevPaths,
          setActivepath,
          toggleDisplayOnboardUser,
          providersIds,
          refetch
        }
      }
    >
      <AppFeatures currentPath={activePath} />
      <Notification message={messages[messages.length - 1] || ''} resetMessage={() => setmessage('')} />
    </StorageContextProvider>
  );
}

// data_.fetch()
//         .then((newData) => {
//           const symbol = newData[0]?.result || appState[0];
//           const factoryData = newData[1]?.result || appState[1];
//           const beta : PointsReturnValue = {key: newData?.[2]?.result?.[0]?.key || phases[0].phase, value: [...newData?.[2]?.result?.[0].value || [mockPoint]]}
//           const alpha : PointsReturnValue = {key: newData?.[2]?.result?.[1]?.key || phases[1].phase, value: [...newData?.[2]?.result?.[1].value || [emptyMockPoint]]}
//           const mainnet : PointsReturnValue = {key: newData?.[2]?.result?.[2]?.key || phases[2].phase, value: [...newData?.[2]?.result?.[2].value || [emptyMockPoint]]}
//           const points : PointsReturnValue[] = [beta, alpha, mainnet];
//           const supportedAssets : SupportedAsset[] = [...newData?.[4]?.result || mockAssets];
//           const providers : ProviderResult[] = [...newData?.[3]?.result || mockProviders];
//           setAppState([symbol, factoryData, points, providers, supportedAssets]);
//         })