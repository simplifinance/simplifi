import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react'
import Image from 'next/image';
import { LiquidityPool, Pools } from '@/interfaces';
import { BigNumber } from  'bignumber.js';
import { toBN, toBigInt } from '@/utilities';
import { formatEther } from 'viem';
import { ConnectWallet } from '@/components/ConnectWallet';
import { useAccount } from 'wagmi';
import useAppStorage from '@/components/StateContextProvider/useAppStorage';

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
  const [modalOpen, setModal] = React.useState<boolean>(false);
  const { storage: { pools } } = useAppStorage()
  const { tvl, permissioned, permissionless } = extractValues(pools);
  const handleModalClose = () => setModal(!modalOpen);
  const { isConnected, isConnecting, isReconnecting } = useAccount();

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
      title: 'PERMISSION-LESS',
      value: permissionless,
      icon: '/OPENED.svg'
    },
    {
      title: 'PERMISSIONED',
      value: permissioned,
      icon: '/CLOSED.svg'
    },
  ];

  React.useEffect(() => {
    if(!isConnected) {
      setModal(true);
    }
    if(isConnected && modalOpen) handleModalClose();
  }, [isConnected, isConnecting, isReconnecting, modalOpen]);

  return (
    <Box>
      <Grid container xs={'auto'} rowGap={{xs: 4, lg: 6}}>
        {
          dashboardInfo.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.title} className={"md:px-4"}>
              <Box className={`w-full bg-orangec rounded-lg p-6 lg:p-8 text-white flex justify-between lg:justify-start gap-4`}>
                <Image 
                  alt={item.title}
                  src={item.icon}
                  width={50}
                  height={50}
                />
                <Box className='w-full flex flex-col justify-start items-start'>
                  <h3 className='text-lg lg:text-xl font-semibold md:font-bold '>{ item.title }</h3>
                  <p className='text-xs md:text-md'>{ item.value }</p>
                </Box>
              </Box>
            </Grid>
          ))
        }
      </Grid>
      {/* <ConnectWallet { ...{ modalOpen, handleModalClose }} /> */}
    </Box>
  )
}

export default Dashboard;
   