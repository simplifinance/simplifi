import React from "react";
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { FuncTag, type LiquidityPool } from '@/interfaces';
import { motion } from 'framer-motion';
import { flexSpread, POOL_HEADER_CONTENT } from "@/constants";
import { PoolColumn } from "../PoolColumn";
import { toBN } from "@/utilities";
import { StorageContext } from "@/components/StateContextProvider";
import { filterPools, type Operation } from "../commonUtilities";

const headerClassName = `w-full ${flexSpread} bg-orangec rounded-lg p-6`;

const renderPool = (pool: LiquidityPool, operation: Operation) => {
    const quorumIsZero = toBN(pool.stage.toString()).toNumber() === FuncTag.ENDED || toBN(pool.uints.quorum.toString()).isZero();
    if(operation === 'Closed') {
      return (quorumIsZero? <PoolColumn {...{ pool }} /> : null);
    }
    
    return (<PoolColumn {...{ pool }} /> );

}

export const Common : React.FC<{heroTitle2: string, operation: Operation}> = ({heroTitle2, operation}) => {
  const { storage: { pools } } = React.useContext(StorageContext);

  // const handleNext = () => {

  // }

  // const handleBack = () => {

  // }

  return(
    <Stack className='space-y-6 mt-4'>
      <Box className="w-full flex ">
        <div className='w-[30%] '>
          <button className='w-full cursor-none text-xl font-black text-yellow-100 text-left'>Liquidity Pools</button>
        </div>
        <div className={`w-[70%] text-xl font-bold ${flexSpread} gap-10 text-white1`}>
          <div className={headerClassName}>
            <h3 >Total Pool</h3>
            <h3>{pools.length}</h3>
          </div>
          <div className={headerClassName}>
            <h3 >{heroTitle2}</h3>
            <h3>{filterPools(pools, operation)}</h3>
          </div>
        </div>
      </Box>

      <Grid container xs={12} className="space-y-2">
        {/* Table Head */}
        <Grid item container xs={12} className='bg-orangec rounded-t-lg p-4'>
          {
            POOL_HEADER_CONTENT.map(({ value, gridSize}) => (
              <Grid item key={value} xs={gridSize}>
                <h3 className='text-white font-black text-center'>{value}</h3>
              </Grid>
            ))
          }
        </Grid>
        {/* Table Body */}
        <Grid container xs={12} >
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
          {/* <Grid item xs={12} mt={4}>
            <Box className={`${flexEnd} gap-4 text-sm`}>
                <h3>{`Showing ${''} to ${''} of ${''} items`}</h3>
                <div className={`${flexCenter}`}>
                    <button className="bg-yellow-100 w-full p-2 text-sm text-orangec border border-orangec hover:bg-orange-200 rounded-l-lg">Back</button>
                    <button className="bg-yellow-100 w-full p-2 text-sm text-orangec border border-orangec hover:bg-orange-200 rounded-r-lg">Next</button>
                </div>
              </Box>
          </Grid> */}
        </Grid>
      </Grid>
    </Stack>
  );
}