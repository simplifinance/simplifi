import React from 'react'
import { 
  permissionedIcon,
  permissionlessIcon,
  tvlIcon,
  collateralIcon,
  networkIcon,
  proposalIcon 
} from '@/components/assets';
import useAppStorage from '@/components/StateContextProvider/useAppStorage';
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
    <React.Fragment>
      <ul className={`w-full md:text-lg text-orange-200 ${flexEven} shadow shadow-green1 p-4 rounded-[26px] mb-4 md:gap-2`}>
        <li className={`flex flex-col justify-center items-center text-center`}>
          <h3 className={"text-center text-[16px] md:text-[26px] rounded-full"}>{currentEpoches.toString()}</h3>
          <h3>Active Pools</h3>
        </li>
        <li className={`flex flex-col justify-center items-center text-center`}>
          <h3 className={"text-center text-[16px] md:text-[26px] rounded-full"}>{recordEpoches.toString()}</h3>
          <h3>Past Pools</h3>
        </li>
        {/* <li className={`flex flex-col justify-center items-center text-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[24px] md:size-[40px] text-orange-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
            <p>Private providers</p>               
        </li>
        <li className={`flex flex-col justify-center items-center text-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[24px] md:size-[40px] text-red-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
          <p>Public providers</p>               
        </li> */}
      </ul>
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
   