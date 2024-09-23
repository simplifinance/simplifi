import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import React from 'react'
import Image from 'next/image';
import { LiquidityPool, Pools } from '@/interfaces';
import { BigNumber } from  'bignumber.js';
import { toBN, toBigInt } from '@/utilities';
import { formatEther } from 'viem';
import { StorageContext } from '@/components/StateContextProvider';

const extractValues = (pools: Pools ) => {
  let tvl : BigNumber = toBN(0);
  let permissioned : BigNumber = toBN(0);
  let permissionless : BigNumber = toBN(0);
  pools.forEach((pool: LiquidityPool) => {
    tvl.plus(toBN(pool.uint256s.currentPool.toString()));
    pool.isPermissionless? permissionless.plus(toBN(1)) : permissioned.plus(toBN(1));
  })
  return {
    permissioned: permissioned.toNumber(),
    permissionless: permissionless.toNumber(),
    tvl: formatEther(toBigInt(tvl.toString()))
  };
}

const Dashboard : React.FC = () => {
  const { storage: { pools } } = React.useContext(StorageContext);
  const { tvl, permissioned, permissionless } = extractValues(pools);

  const dashboardInfo = [
    {
      title: 'TVL',
      value: tvl,
      icon: '/TVL.svg'
    },
    {
      title: 'COLLATERAL',
      value: 'XFI',
       icon: '/TVL.svg'
    },
    {
      title: 'NETWORK',
      value: 'CROSSFI',
      icon: '/TVL.svg'
    },
    {
      title: 'PROPOSALS',
      value: 'COMING SOON ...',
      icon: '/PROPOSAL.svg'
    },
    {
      title: 'PERMISSIONLESS',
      value: permissionless,
      icon: '/OPENED.svg'
    },
    {
      title: 'PERMISSIONED',
      value: permissioned,
      icon: '/CLOSED.svg'
    },
  ];

  return (
    <Stack className="space-y-10">
      <Box className="w-full">
        <div className='grid md:grid-cols-3 justify-between gap-12' >
          {
            dashboardInfo.map((item) => (
              <div key={item.title}>
                <div className={`w-full bg-orangec rounded-lg p-8 text-white flex justify-start gap-4`}>
                  <div>
                    <Image 
                      alt={item.title}
                      src={item.icon}
                      width={50}
                      height={50}
                    />
                  </div>
                  <Stack >
                    <h3 className='text-2xl font-bold'>{ item.title }</h3>
                    <h1 className='font-semibold text-lg'>{ item.value }</h1>
                  </Stack>
                </div>
              </div>
            ))
          }
        </div>
      </Box>
    </Stack>
  )
}

export default Dashboard;
   