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
import { flexEven, } from '@/constants';
import { formatEther } from 'viem';
import { toBN } from '@/utilities';
import { getContractData } from '@/apis/utils/getContractData';
import { useAccount } from 'wagmi';

const Dashboard : React.FC = () => {
  const { analytics: { totalPermissioned, totalPermissionless, tvlInUsd, tvlInXFI }, symbol, currentEpoches, recordEpoches } = useAppStorage();
  const tvlInXfi = toBN(formatEther(tvlInXFI)).decimalPlaces(3);
  const tvlInUSD = formatEther(tvlInUsd);
  const { chainId } = useAccount();
  const { currency, network } = getContractData(chainId || 4157);

  const dashboardInfo = [
    {
      title: `TVL - ${symbol || 'USD'}`,
      value: `${tvlInUSD} ${symbol}`,
      icon: tvlIcon
    },
    {
      title: `TVL`,
      value: `${tvlInXfi} ${currency}`,
      icon: tvlIcon
    },
    {
      title: 'COLLATERAL',
      value: `${currency}`,
      icon: collateralIcon
    },
    {
      title: 'NETWORK',
      value: `${network}`,
      icon: networkIcon
    },
    {
      title: 'PROPOSALS',
      value: 'COMING SOON ...',
      icon: proposalIcon
      
    },
    {
      title: 'PERMISSION-LESS',
      value: totalPermissionless?.toString(),
      icon: permissionlessIcon
    },
    {
      title: 'PERMISSIONED',
      value: totalPermissioned?.toString(),
      icon: permissionedIcon
      
    },
  ];

  return (
    <div>
      <div>
        
        <ul className={`w-full md:text-lg text-orange-200 ${flexEven} shadow shadow-green1 p-4 rounded-[26px] mb-4 md:gap-2`}>
          <li className={`flex flex-col justify-center items-center text-center`}>
            <h3 className={"text-center text-[16px] md:text-[26px] rounded-full"}>{currentEpoches.toString()}</h3>
            <h3>Active Pools</h3>
          </li>
          <li className={`flex flex-col justify-center items-center text-center`}>
            <h3 className={"text-center text-[16px] md:text-[26px] rounded-full"}>{recordEpoches.toString()}</h3>
            <h3>Past Pools</h3>
          </li>
        </ul>

      </div>
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
    </div>
  )
}

export default Dashboard;
   