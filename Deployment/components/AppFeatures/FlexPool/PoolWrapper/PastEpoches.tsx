import React from "react";
import { useAccount, useReadContract } from "wagmi";
import getReadFunctions from '../update/DrawerWrapper/readContractConfig';
import Grid from "@mui/material/Grid";
import { Loading, NotFound } from "./Nulls";
import { FlexCard } from "../update/FlexCard";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { toBN } from "@/utilities";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";

const PastPools = (props: { index: number, recordId: bigint, totalPool: number}) => {
  const { index, recordId, totalPool } = props;
  const { chainId, isConnected } = useAccount();
  const { data, isPending, refetch} = useReadContract({
    ...getReadFunctions({chainId}).readRecordConfig({recordId}),
    query: {
      enabled: !!isConnected,
      refetchOnReconnect: 'always', 
      refetchOnMount: 'always',
      refetchIntervalInBackground: true,
      retry: true,
    },
  });

  React.useEffect(() => {
    if(isConnected) {
      refetch();
    } 
  }, [isConnected, recordId]);

  if(!data) {
    return ( <NotFound />);
  }

  if(data?.cData.length > 0) {
    return(
      <Grid item xs={12} sm={6} md={4} >
        <MotionDivWrap className='w-full rounded-md' transitionDelay={index/totalPool}>
          { isPending? <Loading /> : <FlexCard cData={data?.cData} pool={data?.pool} /> }
        </MotionDivWrap>
      </Grid>
    );
  }
}
  
export const PastEpoches:React.FC = () => {
    const { recordEpoches } = useAppStorage();
    const totalPool = toBN(recordEpoches.toString()).toNumber();
    const unfilteredPools = () => {
        return [...Array(totalPool).keys()];
    }
    return(
      <MotionDivWrap className="w-full">
        <Grid container xs={"auto"} spacing={2}>
        {
            totalPool > 0? 
              unfilteredPools().map((recordId) => (
                  <PastPools 
                    key={recordId}
                    index={recordId}
                    totalPool={totalPool}
                    recordId={BigInt(recordId)}
                  />
              )) : <NotFound />
        }
        </Grid> 
      </MotionDivWrap>
    );
}