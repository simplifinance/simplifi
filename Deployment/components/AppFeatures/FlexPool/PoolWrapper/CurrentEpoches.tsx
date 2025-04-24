import { useAccount, useReadContract } from "wagmi";
import getReadFunctions from '../update/DrawerWrapper/readContractConfig';
import Grid from "@mui/material/Grid";
import { Loading, NotFound } from "./Nulls";
import { FlexCard } from "../update/FlexCard";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { toBN } from "@/utilities";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";

const CurrentPool = (props: { index: number, unitId: bigint, totalPool: number}) => {
    const { index, unitId, totalPool } = props;
    const { chainId } = useAccount();

    const { data, isPending, isError } = useReadContract({
      ...getReadFunctions({chainId}).readPoolConfig({unitId}),
      query: {
        refetchInterval: 3000, 
        refetchOnReconnect: 'always', 
        retry: true,
        refetchIntervalInBackground: true
      }
    });
    const isEmptyPool = data && data.pool && data.pool.low.maxQuorum === 0; 

    if(!data || isError || isEmptyPool) {
      return ( <NotFound errorMessage={`${isEmptyPool? 'No Active pool' : 'No pool found'}`} />);
    }
    if(data?.pool.big.unit > 0n){
      return(
        <Grid item xs={12} sm={6} md={4} >
          <MotionDivWrap className='w-full rounded-md' transitionDelay={index/totalPool}>
            { isPending? <Loading /> : (data?.pool.low.maxQuorum === 0 || data?.pool.big.unit === 0n)? null : <FlexCard cData={data?.cData} pool={data?.pool} /> }
          </MotionDivWrap>
        </Grid>
      );
    }
  }
  
export const CurrentEpoches:React.FC = () => {
    const currentEpoches = toBN(useAppStorage().currentEpoches.toString()).toNumber();
    const unfilteredPools = () => {
        return [...Array(currentEpoches).keys()];
    }
    return(
        <Grid container xs={"auto"} spacing={2}>
        {
            currentEpoches > 0? 
            unfilteredPools().map((unitId) => (
                <CurrentPool 
                  key={unitId}
                  index={unitId}
                  totalPool={currentEpoches}
                  unitId={BigInt(unitId + 1)}
                />
            )) : <NotFound />
        }
        </Grid> 
    );
}