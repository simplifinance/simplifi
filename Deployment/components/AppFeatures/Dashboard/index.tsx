import React from 'react'
import { 
  permissionedIcon,
  permissionlessIcon,
  tvlIcon,
  collateralIcon,
  networkIcon,
  proposalIcon 
} from '@/components/assets';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { flexSpread, } from '@/constants';
import { formatEther } from 'viem';
import { toBN } from '@/utilities';
import { getContractData } from '@/apis/utils/getContractData';
import { useAccount } from 'wagmi';
import { WelcomeTabs } from './WelcomeTabs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SwipeableInfo from '@/components/screens/OnboardScreen/SwipeableInfo';
import { CustomNode } from '@/interfaces';

export default function Dashboard() {
  const { analytics: { totalPermissioned, totalPermissionless, tvlInUsd, tvlInXFI }, symbol, currentEpoches, recordEpoches, } = useAppStorage();
  const tvlInXfi = toBN(formatEther(tvlInXFI)).decimalPlaces(3);
  const tvlInUSD = formatEther(tvlInUsd);
  const { chainId, isConnected } = useAccount();
  const { currency, network } = getContractData(chainId || 4157);

  const dashboardInfo = [
    {
      title: `Tvl - Base currency`,
      value: `${tvlInUSD} ${symbol}`,
      icon: tvlIcon
    },
    {
      title: `Tvl - Collateral`,
      value: `${tvlInXfi} ${isConnected? currency : 'USD'}`,
      icon: tvlIcon
    },
    {
      title: 'Collateral',
      value: `${isConnected? currency : 'Not Connected'}`,
      icon: collateralIcon
    },
    {
      title: 'Network',
      value: `${isConnected? network : 'Not Connected'}`,
      icon: networkIcon
    },
    {
      title: 'Proposals',
      value: 'Coming soon...',
      icon: proposalIcon
      
    },
    {
      title: 'Permissionless',
      value: totalPermissionless?.toString(),
      icon: permissionlessIcon
    },
    {
      title: 'Permissioned',
      value: totalPermissioned?.toString(),
      icon: permissionedIcon
    },
  ];

  return(
    <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
      <div className='minHeight p-4 space-y-4 w-full'>
        <SwipeableInfo />
        <div className='p-4 bg-green1 rounded-xl space-y-2'>
          <h1 className='text-lg text-orange-300 md:text-3xl font-bold'>Statistics</h1>
          <div className={`p-4 bg-green1 rounded-xl space-y-2 md:font-semibold text-orange-100 `}>
            <div className={`${flexSpread}`}>
              <h3>Active</h3>
              <h3 className=''>{currentEpoches.toString()}</h3>
            </div>
            <div className={`${flexSpread}`}>
              <h3>Past</h3>
              <h3>{recordEpoches.toString()}</h3>
            </div>
            <div>
              {
                dashboardInfo.map(({title, value}, i) => (
                  <div key={i} className={`${flexSpread}`}>
                    <h3>{ title }</h3>
                    <h3>{ value }</h3>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      
      <div className='minHeight p-4 space-y-4'>
        <div className={`${flexSpread} bg-white1 dark:bg-green1 p-4 rounded-xl`}>
          <h1 className='text-xl text-green1 dark:text-white1 md:text-3xl font-bold'>Welcome to Simplifi!</h1>
          <Button className={`${flexSpread}`}>
            <Link href={'https://simplifinance.gitbook.io/docs'}>How it works</Link>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </Button>
        </div>
        <div className='p-4 bg-green1 rounded-xl text-sm space-y-2'>
          <h3 className='text-xl font-semibold text-orange-300 flex justify-start items-center gap-4'>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </span>
            Simplifi Phase 1 is live
          </h3>
          <p>Participate in testnet activities and social tasks to earn reward</p>
        </div>
        <WelcomeTabs />
      </div>
    </div>
  )
}
