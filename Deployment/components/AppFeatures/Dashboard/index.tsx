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
// import { WelcomeTabs } from './WelcomeTabs';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
import SwipeableInfo from '@/components/screens/OnboardScreen/SwipeableInfo';

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
    </div>
  )
}
