import React from 'react'
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { getAnalytics } from '@/utilities';
import FlexPool from '../FlexPool';
import { MotionDivWrap } from '@/components/utilities/MotionDivWrap';

const className = 'flex flex-col justify-between items-center gap-2 border border-green1/80 dark:border-white2/20 text-green1/80 dark:text-white2/80 rounded-lg p-4 text-sm w-full text-center dark:bg-green1/90';

export default function OnchainStatistics() {
  const { providers, pools, currentEpoches, recordEpoches, } = useAppStorage();

  const {
    activeUsers,
    averageRate,
    totalBorrowedFromProviders,
    totalLiquidatablePool,
    totalPayout,
    totalPermissioned,
    totalPermissionless,
    totalProviders,
    tvlInBase,
    tvlInCollateral,
    tvlProviders,
    unpaidInterest
  } = React.useMemo(() => {
    return getAnalytics(providers, pools);
  }, [providers, pools]);

  return(
    <MotionDivWrap>
      <div className='space-y-4 p-4 relative font-bold'>
          <h1 className='text-lg text-green1/90 opacity-90 dark:text-orange-300 font-black md:text-2xl pb-2 underline '>Onchain Stats</h1>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            {/* Epoches */}
            <div className={`relative bg-white dark:bg-green1/50 space-y-4 w-full border dark:border-orange-300 p-4 rounded-lg `}>
              <h1 className='font-black text-green1/80 dark:text-orange-300'>Epoches</h1>
              <div className='flex justify-start gap-2'>
                <div className={`flex justify-around text-white1 items-center dark:text-green1/80 rounded-lg p-4 w-full text-center font-black bg-green1/90 dark:bg-orange-400`}>
                  <h3 className=''>Active</h3>
                  <h3 className='text-2xl dark:text-green1/80'>{currentEpoches.toString() || '0'}</h3>
                </div>
                <div className={`flex justify-around items-center text-white1  dark:text-green1/80 rounded-lg p-4 w-full text-center font-black bg-green1/90 dark:bg-orange-400`}>
                  <h3>Past</h3>
                  <h3 className='text-2xl'>{recordEpoches.toString() || '0'}</h3>
                </div>
              </div>
            </div>

            {/* Users */}
            <div className={`relative bg-white dark:bg-green1/50 space-y-4 w-full border dark:border-orange-300 p-4 rounded-lg `}>
              <h1 className='font-black text-green1/80 dark:text-orange-300'>Active users</h1>
              <div className='flex justify-start gap-2'>
                <div className={`flex justify-around items-center text-white1 dark:text-green1/80 rounded-lg p-4 w-full text-center font-black bg-green1/90 dark:bg-orange-400`}>
                  <h3 className=''>Flexpools</h3>
                  <h3 className='text-2xl dark:text-green1/80'>{activeUsers}</h3>
                </div>
                <div className={`flex justify-around items-center text-white1 dark:text-green1/80 rounded-lg p-4 w-full text-center font-black bg-green1/90 dark:bg-orange-400`}>
                  <h3>Providers</h3>
                  <h3 className='text-2xl'>{totalProviders}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-green1/50 w-full border dark:border-white2/20 p-4 rounded-lg `}>
            {/* Flexpools */}
            <div className={`space-y-4 font-black`}>
              <h1 className='text-lg text-green1/90 dark:text-orange-300'>Flexpools</h1> 
              <div className='grid grid-cols-3 gap-2'>
                <div className={className}>
                  <h3 className=''>Public</h3>
                  <h3 className='text-xl'>{totalPermissionless}</h3>
                </div>
                <div className={className}>
                  <h3>Private</h3>
                  <h3 className='text-xl'>{totalPermissioned}</h3>
                </div>
                <div className={className}>
                  <h3>Open to liquidate</h3>
                  <h3 className='text-xl'>{totalLiquidatablePool}</h3>
                </div>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                <div className={className}>
                  <h3 className=''>Total paid out</h3>
                  <h3 className='text-xl'>{`$${totalPayout}`}</h3>
                </div>
                <div className={className}>
                  <h3>{`Tvl (Base)`}</h3>
                  <h3 className='text-xl'>{`$${tvlInBase}`}</h3>
                </div>
                <div className={className}>
                  <h3>{`Tvl (Collateral)`}</h3>
                  <h3 className='text-xl'>{`$${tvlInCollateral}`}</h3>
                </div>
              </div>
            </div>

            {/* Providers */}
            <div className={`space-y-4 font-black`}>
              <h1 className='text-lg text-green1/90 dark:text-orange-300'>Providers</h1> 
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                <div className='hidden md:block'>
                </div>
                <div className={className}>
                  <h3>Tvl</h3>
                  <h3 className='text-xl'>{`$${tvlProviders}`}</h3>
                </div>
                <div className={className}>
                  <h3>Unpaid interests</h3>
                  <h3 className='text-xl'>{`$${unpaidInterest}`}</h3>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <div className={className}>
                  <h3 className=''>{`Avg. rate`}</h3>
                  <h3 className='text-xl'>{`${averageRate}%`}</h3>
                </div>
                <div className={className}>
                  <h3>{`Total borrowed`}</h3>
                  <h3 className='text-xl'>{`$${totalBorrowedFromProviders}`}</h3>
                </div>
              </div>
            </div>
          </div>

          <FlexPool 
            showMyPool={false}
            allPools={true}
          />
      </div>
    </MotionDivWrap>
  )
}
