import React from 'react'
import { 
  permissionedIcon,
  permissionlessIcon,
  tvlIcon,
  collateralIcon,
  networkIcon,
} from '@/components/assets';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { formatEther } from 'viem';
import { toBigInt, toBN } from '@/utilities';
import { getContractData } from '@/apis/utils/getContractData';
import { useAccount } from 'wagmi';
import { Card, CardContent, } from '@/components/ui/card';

export default function OnchainStatistics() {
  const { analytics: { totalPermissioned, totalPermissionless, tvlBase, tvlCollateral }, symbol, currentEpoches, recordEpoches, } = useAppStorage();
  const tvlInCollateral = toBN(formatEther(toBigInt(tvlCollateral))).decimalPlaces(3);
  const tvlInBase = toBN(formatEther(toBigInt(tvlBase))).decimalPlaces(3);
  const { chainId, isConnected } = useAccount();
  const { currency, network } = getContractData(chainId || 4157);

  const dashboardInfo = [
    {
      title: `Tvl - Base currency`,
      value: `$${tvlInBase}`,
      icon: tvlIcon
    },
    {
      title: `Tvl - Collateral`,
      value: `$${tvlInCollateral}`,
      icon: tvlIcon
    },
    {
      title: 'Collateral',
      value: `${isConnected? currency : 'ERC20'}`,
      icon: collateralIcon
    },
    {
      title: 'Network',
      value: `${isConnected? network : 'Celo'}`,
      icon: networkIcon
    },
    // {
    //   title: 'Proposals',
    //   value: 'Coming soon...',
    //   icon: proposalIcon
    // },
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
    <div className='space-y-4'>
        <h1 className='text-lg text-green1/90 font-bold dark:text-white1 md:text-2xl'>Onchain Stats</h1>
        <div className='grid grid-cols-2 gap-4 '>
            <Card className='dark:bg-gray1 border-b-8 border-r-8 border-green1 text-green1/90  dark:bg-green1/90 dark:text-white1 font-bold text-center'>
                <CardContent>
                    <h3 className='text-xs text-start text-orangec dark:text-orange-300'>Active Epoches</h3>
                    <h3 className='text-2xl font-black'>{currentEpoches.toString() || '0'}</h3>
                </CardContent>
            </Card>
            <Card className='dark:bg-gray1 border-b-8 border-r-8 border-green1 text-green1/90 dark:bg-green1/90 dark:text-white1 font-bold text-center'>
                <CardContent>
                    <h3 className='text-xs text-start text-orangec dark:text-orange-300'>Past Epoches</h3>
                    <h3 className='text-2xl font-black'>{recordEpoches.toString() || '0'}</h3>
                </CardContent>
            </Card>
        </div>
        <div className='grid grid-cols-2 gap-2'>
            {
                dashboardInfo.map(({title, value}, i) => (
                    <Card key={i} className='dark:bg-gray1 text-green1/90 border border-green1/70 dark:text-current font-bold text-center'>
                        <CardContent>
                            <h3 className='text-[10px] text-start  dark:text-orange-300'>{title}</h3>
                            <h3 className=' text-center font-black'>{value}</h3>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    </div>
  )
}
