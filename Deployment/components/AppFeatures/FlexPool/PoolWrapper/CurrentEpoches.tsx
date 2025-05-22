import React from "react";
import { useAccount, useConfig, useReadContracts } from "wagmi";
import Grid from "@mui/material/Grid";
import { Loading, NotFound } from "./Nulls";
import { FlexCard } from "../update/FlexCard";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { filterTransactionData, toBN } from "@/utilities";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";
import { Address, ReadDataReturnValue } from "@/interfaces";

export const CurrentEpoches:React.FC = () => {
  const config = useConfig();
  const { isConnected, chainId } = useAccount();
  const { currentEpoches, setError } = useAppStorage();
  const epoches = toBN(currentEpoches.toString()).toNumber();
  const unfilteredPools = () => {
    return [...Array(epoches).keys()];
  };

  console.log("currentEpoches", currentEpoches);
  console.log("Unfiltered", unfilteredPools());

  const { transactionData, } = React.useMemo(() => {
    const filtered = filterTransactionData({
      chainId,
      filter: true,
      functionNames: ['getPoolData'],
      callback: (arg) => {
        if(arg.errorMessage) setError(arg.errorMessage);
      } 
    });
    return { ...filtered }
  }, [chainId]);

  
  const contracts = unfilteredPools().map((item) => {
    const td = transactionData?.[0];
    return {
      abi: td.abi,
      address: td.contractAddress as Address,
      functionName: td.functionName,
      args: [item]
    }
  });
  console.log("contracts", contracts);

  const {data, isError, isPending} = useReadContracts(
    {
      allowFailure: true,
      query: {
        enabled: !!isConnected,
        refetchInterval: 5000,
      },
      config,
      contracts
    }
  );

  console.log("Data", data)

  if(isError) {
    return ( <NotFound errorMessage={'No pool found'} />);
  } else if(isPending){
    return (<Loading />);
  }
  return(
    <MotionDivWrap className="w-full">
      <Grid container xs={"auto"} spacing={2}>
        {
          data?.map((item, index) => {
            const item_ = item?.result as ReadDataReturnValue;
            console.log("Item", item_)
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionDivWrap className='w-full rounded-md' transitionDelay={index / data?.length}>
                  { (toBN(item_?.pool?.low.maxQuorum.toString()).toNumber() > 0 && toBN(item_.pool.big.unit.toString()).gt(0)) && <FlexCard cData={item_.cData} pool={item_.pool} /> }
                </MotionDivWrap>
              </Grid>
            )
          })
        }
      </Grid> 
    </MotionDivWrap>
  );
}
