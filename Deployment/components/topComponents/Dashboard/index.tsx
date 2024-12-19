import React from 'react'
import { LiquidityPool, Pools } from '@/interfaces';
import { BigNumber } from  'bignumber.js';
import { toBN, toBigInt } from '@/utilities';
import { formatEther } from 'viem';
import { 
  permissionedIcon,
  permissionlessIcon,
  tvlIcon,
  collateralIcon,
  networkIcon,
  proposalIcon 
} from '@/components/assets';
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
  const { storage: { pools } } = useAppStorage()
  const { tvl, permissioned, permissionless } = extractValues(pools);

  const dashboardInfo = [
    {
      title: 'TVL',
      value: tvl,
      icon: tvlIcon
    },
    {
      title: 'COLLATERAL',
      value: 'XFI',
      icon: collateralIcon
    },
    {
      title: 'NETWORK',
      value: 'CROSSFI',
      icon: networkIcon
    },
    {
      title: 'PROPOSALS',
      value: 'COMING SOON ...',
      icon: proposalIcon
      
    },
    {
      title: 'PERMISSION-LESS',
      value: permissionless,
      icon: permissionlessIcon
    },
    {
      title: 'PERMISSIONED',
      value: permissioned,
      icon: permissionedIcon
      
    },
  ];

  return (
    <React.Fragment>
      <div className='grid sm:grid-cols-2 gap-6 md:-10 relative'>
        {
          dashboardInfo.map(({title, icon, value}, i) => (
            <div key={i} className={`bg-green1 rounded-[36px] py-12 px-6 lg:p-8 text-white flex justify-center items-center lg:justify-start gap-4`}>
              <h1 className='border border-gray1 bg-gray1 rounded-full p-2'>{icon()}</h1>
              <div className='w-full flex flex-col justify-start items-start'>
                <h3 className='text-sm lg:text-lg font-semibold '>{ title }</h3>
                <p className='text-xs md:text-md'>{ value }</p>
              </div>
            </div>
          ))
        }
      </div>
    </React.Fragment>
  )
}

export default Dashboard;
   