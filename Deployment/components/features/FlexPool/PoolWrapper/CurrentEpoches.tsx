import { useReadContract } from "wagmi";
import { readPoolConfig } from '../update/DrawerWrapper/readContractConfig';
import Grid from "@mui/material/Grid";
import { motion } from 'framer-motion';
import { Loading, NoPoolFound } from "./Nulls";
import { FlexCard } from "../update/FlexCard";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { toBN } from "@/utilities";

const CurrentPool = (props: { index: number, unitId: bigint, totalPool: number}) => {
    const { index, unitId, totalPool } = props;
    const { data: pool, isPending } = useReadContract({ ...readPoolConfig(unitId) });

    if(pool?.cData.length === 0) {
      return ( <NoPoolFound />);
    }
    return(
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <motion.button
          initial={{opacity: 0}}
          animate={{opacity: [0, 1]}}
          transition={{duration: '0.5', delay: index/totalPool}}
          className='w-full rounded-md cursor-pointer' 
        >
          { isPending? <Loading /> : <FlexCard { ...{...pool! }} /> }
        </motion.button>
      </Grid>
    );
  }
  
export const CurrentEpoches:React.FC = () => {
    const { currentEpoches } = useAppStorage();
    const totalPool = toBN(currentEpoches.toString()).toNumber();
    const unfilteredPools = () => {
        return [...Array(totalPool).keys()];
    }
    return(
        <Grid container xs={"auto"} spacing={2}>
        {
            totalPool > 0? 
            unfilteredPools().map((unitId) => (
                <CurrentPool 
                  key={unitId}
                  index={unitId}
                  totalPool={totalPool}
                  unitId={BigInt(unitId + 1)}
                />
            )) : <NoPoolFound />
        }
        </Grid> 
    );
}