import React from "react";
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Pools } from '@/interfaces';
import { motion } from 'framer-motion';
import { POOL_HEADER_CONTENT, POOLS_MOCK } from "@/constants";
import { PoolColumn } from "./PoolColumn";

export const Open : React.FC<{}> = () => {
  const [pools, setPools] = React.useState<Pools>(POOLS_MOCK);
  const gridSize = 12/POOL_HEADER_CONTENT.length;

  // const handleClick = () => {

  // }

  return(
    <Stack className='space-y-6 mt-4'>
      <Box className="w-full flex ">
        <div className='w-[30%] '>
          <button className='w-full py-8 text-xl font-black text-orange-400 text-left'>Liquidity Pool</button>
        </div>
        <div className='w-[70%] flex justify-between items-center gap-10 text-lg text-white'>
          <button className='w-full bg-orange-400 rounded-lg p-8'>Total Pool</button>
          <button className='w-full bg-orange-400 rounded-lg p-8'>Account</button>
        </div>
      </Box>

      <Grid container xs>
        {/* Table Head */}
        <Grid item container xs={12} className='bg-orange-400 rounded-t-lg p-4'>
          {
            POOL_HEADER_CONTENT.map((text) => (
              <Grid item xs={gridSize}>
                <h3 className='text-white font-black text-center'>{text}</h3>
              </Grid>
            ))
          }
        </Grid>
        {/* Table Body */}
        <Grid container xs>
          {
            pools.map((pool, epochId) => (
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