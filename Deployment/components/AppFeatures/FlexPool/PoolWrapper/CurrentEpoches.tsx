import React from "react";
import { useAccount, useReadContracts } from "wagmi";
import getReadFunctions from '../update/DrawerWrapper/readContractConfig';
import Grid from "@mui/material/Grid";
import { NotFound } from "./Nulls";
import { FlexCard } from "../update/FlexCard";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { toBN } from "@/utilities";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";

export const CurrentEpoches:React.FC = () => {
  const { isConnected } = useAccount();
  const currentEpoches = toBN(useAppStorage().currentEpoches.toString()).toNumber();
  const unfilteredPools = () => {
    return [...Array(currentEpoches).keys()];
  }
  const { chainId } = useAccount();

  const {data, isError, refetch} = useReadContracts(
    {
      allowFailure: true,
      query: {
        enabled: !!isConnected,
        refetchOnReconnect: 'always', 
        refetchOnMount: 'always',
        refetchIntervalInBackground: true,
        retry: true,
      },
      contracts: unfilteredPools().map((item) => {
        return {
          ...getReadFunctions({chainId}).readPoolConfig({unitId: BigInt(item + 1)}),
        }
      })
    }
  );

  React.useEffect(() => {
    if(isConnected) {
      refetch();
    } 
  }, [isConnected, currentEpoches]);

  if(isError) {
    return ( <NotFound errorMessage={'No pool found'} />);
  }
  return(
    <MotionDivWrap className="w-full">
      <Grid container xs={"auto"} spacing={2}>
        {
          data?.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionDivWrap className='w-full rounded-md' transitionDelay={0.7}>
                { (item.result?.pool.low.maxQuorum === 0 || item.result?.pool.big.unit === 0n)? null : <FlexCard cData={item.result?.cData!} pool={item.result?.pool!} /> }
              </MotionDivWrap>
            </Grid>
          ))
        }
      </Grid> 
    </MotionDivWrap>
  );
}
