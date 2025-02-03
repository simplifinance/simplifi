import { useAccount, useReadContract } from "wagmi";
import getReadFunctions from '../update/DrawerWrapper/readContractConfig';
import Grid from "@mui/material/Grid";
import { motion } from 'framer-motion';
import { Loading, NoPoolFound } from "./Nulls";
import { FlexCard } from "../update/FlexCard";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { toBN } from "@/utilities";

const PastPools = (props: { index: number, rId: bigint, totalPool: number}) => {
  const { index, rId, totalPool } = props;
  const { chainId } = useAccount();
  const { data, isPending } = useReadContract({ ...getReadFunctions({chainId}).readRecordConfig({rId}) });
  if(!data) {
    return ( <NoPoolFound />);
  }
  if(data?.cData.length > 0) {
    return(
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <motion.button
          initial={{opacity: 0}}
          animate={{opacity: [0, 1]}}
          transition={{duration: '0.5', delay: index/totalPool}}
          className='w-full rounded-md cursor-pointer' 
        >
          { isPending? <Loading /> : <FlexCard { ...{...data! }} /> }
        </motion.button>
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
        <Grid container xs={"auto"} spacing={2}>
        {
            totalPool > 0? 
              unfilteredPools().map((rId) => (
                  <PastPools 
                    key={rId}
                    index={rId}
                    totalPool={totalPool}
                    rId={BigInt(rId + 1)}
                  />
              )) : <NoPoolFound />
        }
        </Grid> 
    );
}