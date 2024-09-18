import React from "react";
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { LiquidityPool, Pools } from '@/interfaces';
import { motion } from 'framer-motion';
import { POOL_HEADER_CONTENT } from "@/constants";
import { PoolColumn } from "./PoolColumn";
import { toBN } from "@/utilities";

const extractClosedPools = (pools: Pools) => {
  let closed : number = 0;
  pools.forEach((pool: LiquidityPool) => {
    if(toBN(pool.uints.quorum).isZero()) {
      closed ++;
    }
  });
  return closed;
}

export const Closed : React.FC<{pools: Pools}> = ({pools}) => {
  const gridSize = 12/POOL_HEADER_CONTENT.length;

  return(
    <Stack className='space-y-6 mt-4'>
      <Box className="w-full flex ">
        <div className='w-[30%] '>
          <button className='w-full py-8 text-xl font-black text-orangec text-left'>Liquidity Pool</button>
        </div>
        <div className='w-[70%] text-2xl font-bold flex justify-between items-center gap-10 text-white'>
          <div className='w-full bg-orangec rounded-lg p-8'>
            <h3 >Total Pool</h3>
            <h3>{pools.length}</h3>
          </div>
          <div className='w-full bg-orangec rounded-lg p-8'>
            <h3 >Total Closed</h3>
            <h3>{extractClosedPools(pools)}</h3>
          </div>
        </div>
      </Box>

      <Grid container xs>
        {/* Table Head */}
        <Grid item container xs={12} className='bg-orangec rounded-t-lg p-4'>
          {
            POOL_HEADER_CONTENT.map((text: string) => (
              <Grid item xs={gridSize} key={text}>
                <h3 className='text-white font-black text-center'>{text}</h3>
              </Grid>
            ))
          }
        </Grid>
        {/* Table Body */}
        <Grid container xs>
          {
            pools.map((pool: LiquidityPool, epochId: number) => (
              <motion.button
                key={epochId}
                initial={{opacity: 0}}
                animate={{opacity: [0, 1]}}
                transition={{duration: '0.5', delay: epochId/pools.length}}
                className='w-full rounded-md flex flex-col justify-start items-center  text-stone-300 cursor-pointer' 
                // onClick={handleBoardClick} 
              >
                <PoolColumn {...{epochId, pool }} />
              </motion.button>
            ))
          }
        </Grid>
      </Grid>
    </Stack>
  );
}

// https://website-ui-beta.vercel.app/