import { useAccount, useReadContract } from "wagmi";
import getReadFunctions from '../update/DrawerWrapper/readContractConfig';
import Grid from "@mui/material/Grid";
import { motion } from 'framer-motion';
import { Loading, NotFound } from "./Nulls";
import { FlexCard } from "../update/FlexCard";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { toBN } from "@/utilities";

const CurrentPool = (props: { index: number, unitId: bigint, totalPool: number}) => {
    const { index, unitId, totalPool } = props;
    const { chainId } = useAccount();

    const { data, isPending } = useReadContract({
      ...getReadFunctions({chainId}).readPoolConfig({unitId}),
      query: {
        refetchInterval: 4000, 
        refetchOnReconnect: 'always', 
      }
    });
    if(!data) {
      return ( <NotFound />);
    }
    if(data?.cData.length > 0){
      return(
        <Grid item xs={12} sm={6} md={4} >
          <motion.button
            initial={{opacity: 0}}
            animate={{opacity: [0, 1]}}
            transition={{duration: '0.5', delay: index/totalPool}}
            className='w-full rounded-md cursor-pointer' 
          >
            { isPending? <Loading /> : (data?.pool.low.maxQuorum === 0 || data?.pool.big.unit === 0n)? null : <FlexCard cData={data?.cData} pool={data?.pool} /> }
          </motion.button>
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