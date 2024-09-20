import React from "react";
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { FuncTag, type LiquidityPool } from '@/interfaces';
import { motion } from 'framer-motion';
import { POOL_HEADER_CONTENT } from "@/constants";
import { PoolColumn } from "../PoolColumn";
import { toBN } from "@/utilities";
import { StorageContext } from "@/components/StateContextProvider";
import { filterPools, type Operation } from "../commonUtilities";

const renderPool = (pool: LiquidityPool, operation: Operation) => {
    const quorumIsZero = toBN(pool.stage.toString()).toNumber() === FuncTag.ENDED || toBN(pool.uints.quorum.toString()).isZero();
    if(operation === 'Closed') return (quorumIsZero? <PoolColumn {...{ pool }} /> : null);
    
    return (!quorumIsZero? <PoolColumn {...{ pool }} /> : null);

}

export const Common : React.FC<{heroTitle2: string, operation: Operation}> = ({heroTitle2, operation}) => {
  const gridSize = 12/POOL_HEADER_CONTENT.length;
  const { storage: { pools } } = React.useContext(StorageContext);

  return(
    <Stack className='space-y-6 mt-4'>
      <Box className="w-full flex ">
        <div className='w-[30%] '>
          <button className='w-full py-8 text-xl font-black text-orangec text-left'>Liquidity Pool</button>
        </div>
        <div className='w-[70%] text-2xl font-bold  flex justify-between items-center gap-10 text-white'>
          <div className='w-full bg-orangec rounded-lg p-8'>
            <h3 >Total Pool</h3>
            <h3>{pools.length}</h3>
          </div>
          <div className='w-full bg-orangec rounded-lg p-8'>
            <h3 >{heroTitle2}</h3>
            <h3>{filterPools(pools, operation)}</h3>
          </div>
        </div>
      </Box>

      <Grid container xs>
        {/* Table Head */}
        <Grid item container xs={12} className='bg-orangec rounded-t-lg p-4'>
          {
            POOL_HEADER_CONTENT.map((text: string) => (
              <Grid item key={text} xs={gridSize}>
                <h3 className='text-white font-black text-center'>{text}</h3>
              </Grid>
            ))
          }
        </Grid>
        {/* Table Body */}
        <Grid container xs>
          {
            pools.map((pool: LiquidityPool, i) => (
              <motion.button
                key={i}
                initial={{opacity: 0}}
                animate={{opacity: [0, 1]}}
                transition={{duration: '0.5', delay: i/pools.length}}
                className='w-full rounded-md flex flex-col justify-start items-center  text-stone-300 cursor-pointer' 
              >
                { renderPool(pool, operation) }
              </motion.button>
            ))
          }
        </Grid>
      </Grid>
    </Stack>
  );
}