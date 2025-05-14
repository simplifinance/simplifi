"use client"

import React from "react";
import Notification from "@/components/utilities/Notification";
import { appData, emptyMockPoint, mockAssets, mockPoint, mockProviders, phases } from "@/interfaces";
import type { FactoryData, FunctionName, Path, PointsReturnValue, ProviderResult, SupportedAsset, TransactionCallback, } from "@/interfaces";
import { StorageContextProvider } from "@/components/contexts/StateContextProvider";
import { useAccount, useBlockNumber, useConfig, useReadContracts,} from "wagmi";
// import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import AppFeatures from "@/components/AppFeatures";
import { filterTransactionData, formatAddr, toBN } from "@/utilities";

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

  const steps : FunctionName[] = ['symbol', 'getFactoryData', 'getPoints', 'getProviders', 'getSupportedAssets'];

  const setmessage = (arg: string) => arg === ''? setMessage([]): setMessage((prev) => [...prev, arg]);
  const callback : TransactionCallback = (arg) => {
    if(arg.message) setmessage(arg.message);
    if(arg.errorMessage) setErrorMessage(arg.errorMessage);
  };
  const { isConnected, chainId } = useAccount();
  const config = useConfig();
  const { data: blockNumber} = useBlockNumber({watch: true});
  // const { getFactoryDataConfig, readSymbolConfig, getPointsConfig, getProvidersConfig, getSupportedAssetConfig, } = getReadFunctions({chainId});
  
  const { symbol, fData, point, provider, sAsset } = React.useMemo(() => {
    const filtered = filterTransactionData({
      chainId,
      filter: true,
      functionNames: steps,
      callback
    });
    const symbol = {abi: filtered.transactionData[0].abi, ca: formatAddr(filtered.transactionData[0].contractAddress)};
    const fData = {abi: filtered.transactionData[1].abi, ca: formatAddr(filtered.transactionData[1].contractAddress)};
    const point = {abi: filtered.transactionData[2].abi, ca: formatAddr(filtered.transactionData[2].contractAddress)};
    const provider = {abi: filtered.transactionData[3].abi, ca: formatAddr(filtered.transactionData[3].contractAddress)};
    const sAsset = {abi: filtered.transactionData[4].abi, ca: formatAddr(filtered.transactionData[4].contractAddress)};
    return { symbol, fData, point, provider, sAsset }
  }, [chainId]);

  // Read contract data from the blockchain
  const { refetch, data, isPending } = useReadContracts({
    config,
    contracts: [
      {abi: symbol.abi, address: symbol.ca, args: [], functionName: 'symbol'},
      {abi: fData.abi, address: fData.ca, args: [], functionName: 'getFactoryData'},
      {abi: point.abi, address: point.ca, args: [], functionName: 'getPoints'},
      {abi: provider.abi, address: provider.ca, args: [], functionName: 'getProviders'},
      {abi: sAsset.abi, address: sAsset.ca, args: [], functionName: 'getSupportedAssets'},
    ],
    allowFailure: true,
    query: {
      enabled: !!isConnected,
      refetchOnReconnect: 'always', 
      refetchInterval: 5000,
      // refetchOnMount: 'always',
      // refetchIntervalInBackground: true,
      // retry: true,
    }
  });

  
  const { symbols, factoryData, points, supportedAssets, providers } = React.useMemo(() => {
    const notReady = isPending || !data;
    const pointData = data?.[2]?.result as PointsReturnValue[];
    const provs = data?.[3]?.result as ProviderResult[];
    const sassets = data?.[4]?.result as SupportedAsset[];
    const fdata = data?.[1]?.result as FactoryData;
    const sym= data?.[0]?.result as string;

    const symbols = notReady? appData[0] : sym || appData[0];
    const factoryData = notReady? appData[1] : fdata || appData[1];
    const beta : PointsReturnValue = notReady? {key: phases[0].phase, value: [mockPoint]} : {key: pointData?.[0]?.key || phases[0].phase, value: [...pointData?.[0].value || [mockPoint]]}
    const alpha : PointsReturnValue = notReady? {key: phases[1].phase, value: [emptyMockPoint]} : {key: pointData?.[1]?.key || phases[1].phase, value: [...pointData?.[1].value || [emptyMockPoint]]}
    const mainnet : PointsReturnValue = notReady? {key: phases[2].phase, value: [emptyMockPoint]} : {key: pointData?.[2]?.key || phases[2].phase, value: [...pointData?.[2].value || [emptyMockPoint]]}
    const points : PointsReturnValue[] = [beta, alpha, mainnet];
    const supportedAssets : SupportedAsset[] = notReady? mockAssets : [...sassets || mockAssets];
    const providers : ProviderResult[] = notReady? mockProviders : [...provs || mockProviders];
    return { notReady, symbols, factoryData, points, supportedAssets, providers };
  }, [data]);

  const toggleProviders = (arg: bigint) => {
    providersIds.includes(arg)? setProvidersIds(providersIds.filter((id) => id !== arg)) : setProvidersIds((prev) => [...prev, arg]);
  }
  const setError = (arg:string) => setErrorMessage(arg);
  const closeDisplayForm = () => setDisplayForm(false);
  const openDisplayForm = () => setDisplayForm(true);
  const toggleDisplayOnboardUser = () => setDisplayOnboardUser(!displayOnboardUser);
  const exitOnboardScreen = () => setDisplay(true);

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
          symbol: symbols,
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
          callback,
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