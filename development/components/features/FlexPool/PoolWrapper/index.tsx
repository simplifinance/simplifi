import React from 'react';
import { LiquidityPool } from '@/interfaces';
import Grid from '@mui/material/Grid';
import { FlexCard } from '../update/FlexCard';
import { motion } from 'framer-motion';

export const PoolWrapper:React.FC<{filteredPool: LiquidityPool[], totalPool: number}> = ({filteredPool, totalPool}) => {
    return(
        <Grid container xs={"auto"} spacing={2}>
            {
              filteredPool?.map((pool, i) => (
                <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
                  <motion.button
                    initial={{opacity: 0}}
                    animate={{opacity: [0, 1]}}
                    transition={{duration: '0.5', delay: i/totalPool}}
                    className='w-full rounded-md cursor-pointer' 
                  >
                    <FlexCard {...{ pool }} />
                  </motion.button>
                </Grid>
              ))
            }
        </Grid> 
    );
}