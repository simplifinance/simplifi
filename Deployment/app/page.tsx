"use client"

import React from "react";
import Notification from "@/components/utilities/Notification";
import { mockAssets, mockFactoryData, mockPointsReturnValue, mockProviders } from "@/interfaces";
import type { FactoryData, FunctionName, Path, PointsReturnValue, ProviderResult, SupportedAsset, TransactionCallback, } from "@/interfaces";
import { StorageContextProvider } from "@/components/contexts/StateContextProvider";
import { useAccount, useBlockNumber, useConfig, useConnect, useReadContracts,} from "wagmi";
import AppFeatures from "@/components/AppFeatures";
import { filterTransactionData, formatAddr, toBN } from "@/utilities";
import InitialPopUp from "@/components/AppFeatures/InitialPopUp";

// Array of functions to read from the contracts
const steps : FunctionName[] = ['symbol', 'getFactoryData', 'getPoints', 'getProviders', 'getSupportedAssets', 'isVerified'];

export default function SimplifiApp() {
  const [displayAppScreen, setDisplay] = React.useState<boolean>(false);
  const [displayForm, setDisplayForm] = React.useState<boolean>(false);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [messages, setMessage] = React.useState<string[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [displayOnboardUser, setDisplayOnboardUser] = React.useState<boolean>(false);
  const [prevPaths, setPreviousPath] = React.useState<Path[]>([]);
  const [providersIds, setProvidersIds] = React.useState<bigint[]>([]);
  const [activePath, setActivePath] = React.useState<Path>('Home');
  const [pointData, setPointData] = React.useState<PointsReturnValue[]>(mockPointsReturnValue);
  const [providers, setProviders] = React.useState<ProviderResult[]>(mockProviders);
  const [supportedAssets, setSupportedAssets] = React.useState<SupportedAsset[]>(mockAssets);
  const [factoryData, setFactoryData] = React.useState<FactoryData>(mockFactoryData);
  const [symbol, setSymbol] = React.useState<string>('USD');
  const [isVerified, setIsVerified] = React.useState<boolean>(false);

  const setmessage = (arg: string) => arg === ''? setMessage([]): setMessage((prev) => [...prev, arg]);
  const callback : TransactionCallback = (arg) => {
    if(arg.message) setmessage(arg.message);
    if(arg.errorMessage) setErrorMessage(arg.errorMessage);
  };

  const { isConnected, chainId, address, connector } = useAccount();
  const { connect } = useConnect();
  const config = useConfig();
  const account = formatAddr(address);
  const { data: blockNumber} = useBlockNumber({watch: true});

  // Update current page based on connection state
  React.useEffect(() => {
    if(!isConnected && connector) connect({connector, chainId});
  }, [isConnected, connector, chainId, connect]);
  
  // Prepare and format read data
  const readData = React.useMemo(() => {
    const td = filterTransactionData({
      chainId,
      filter: true,
      functionNames: steps,
      callback
    });

    return td.transactionData.map(({abi, contractAddress, functionName}) => {
      return {
        abi,
        address: functionName === 'symbol'? formatAddr(td.contractAddresses.WrappedNative) : formatAddr(contractAddress),
        args: functionName === 'isVerified'? [account] : [],
        functionName
      }
    });
  }, [chainId, account]);

  // Fetch the data ahead
  const { refetch, data, isPending } = useReadContracts({
    config,
    contracts: readData,
    allowFailure: true,
    query: {
      enabled: !!isConnected,
      refetchOnReconnect: 'always', 
      refetchInterval: 4000,
    }
  });

  // Update the data to state anytime new updates are fetched
  React.useEffect(() => {
    let pointData_ : PointsReturnValue[] = mockPointsReturnValue;
    let providers_ : ProviderResult[] = mockProviders;
    let supportedAssets_ : SupportedAsset[] = mockAssets;
    let factoryData_ : FactoryData = mockFactoryData;
    let symbol_ : string = 'USD';
    let isVerified_ : boolean = false;
    
    if(data && data[0].status === 'success' && data[0].result !== undefined) {
      symbol_ = data?.[0]?.result as string;
      setSymbol(symbol_);
    }
    if(data && data[1].status === 'success' && data[1].result !== undefined) {
      factoryData_ = data?.[1]?.result as FactoryData;
      setFactoryData(factoryData_);
    }
    if(data && data[2].status === 'success' && data[2].result !== undefined) {
      pointData_ = data?.[2]?.result as PointsReturnValue[];
      setPointData(pointData_);
    }
    if(data && data[3].status === 'success' && data[3].result !== undefined) {
      providers_ = data?.[3]?.result as ProviderResult[];
      setProviders(providers_);
    }
    if(data && data[4].status === 'success' && data[4].result !== undefined) {
      supportedAssets_ = data?.[4]?.result as SupportedAsset[];
      setSupportedAssets(supportedAssets_);
    }
    if(data && data[5].status === 'success' && data[5].result !== undefined) {
      isVerified_ = data?.[5]?.result as boolean;
      setIsVerified(isVerified_);
    }

    
    
  }, [data]);
  

  const { pools } = React.useMemo(() => {
    // const factoryData = notReady? appData[1] : fdata || appData[1];
    const pastPools = [...factoryData.pastPools ];
    const currentPools = [ ...factoryData.currentPools ];
    const pools = currentPools.concat(pastPools);
    // const beta : PointsReturnValue = notReady? {key: phases[0].phase, value: [mockPoint]} : {key: pointData?.[0]?.key || phases[0].phase, value: [...pointData?.[0].value || [mockPoint]]}
    // const alpha : PointsReturnValue = notReady? {key: phases[1].phase, value: [emptyMockPoint]} : {key: pointData?.[1]?.key || phases[1].phase, value: [...pointData?.[1].value || [emptyMockPoint]]}
    // const mainnet : PointsReturnValue = notReady? {key: phases[2].phase, value: [emptyMockPoint]} : {key: pointData?.[2]?.key || phases[2].phase, value: [...pointData?.[2].value || [emptyMockPoint]]}
    // const points : PointsReturnValue[] = [beta, alpha, mainnet];
    // const supportedAssets : SupportedAsset[] = notReady? mockAssets : [...sassets || mockAssets];
    // const providers : ProviderResult[] = notReady? mockProviders : [...provs || mockProviders];
    return { pools };
  }, [factoryData]);
  // console.log("IsVerified", isVerified, data?.[5]?.result)
  // console.log("Data", data)
  
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
  }, [isConnected, blockNumber, refetch]);

  return (
    <StorageContextProvider 
      value={
        {
          symbol,
          currentEpoches: factoryData.currentEpoches,
          recordEpoches: factoryData.recordEpoches, 
          analytics: factoryData.analytics,
          pools, 
          points: pointData,
          providers,
          isVerified,
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
      <InitialPopUp />
    </StorageContextProvider>
  );
}
