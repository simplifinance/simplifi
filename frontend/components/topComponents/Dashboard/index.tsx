import React from 'react'
import { LiquidityPool, Pools } from '@/interfaces';
import { BigNumber } from  'bignumber.js';
import { toBN, toBigInt } from '@/utilities';
import { formatEther } from 'viem';
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
  // const [modalOpen, setModal] = React.useState<boolean>(false);
  const { storage: { pools } } = useAppStorage()
  const { tvl, permissioned, permissionless } = extractValues(pools);

  const dashboardInfo = [
    {
      title: 'TVL',
      value: tvl,
      icon: <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F87C00]">
              <path d="M24.0055 3.13133C23.7431 2.91689 23.4408 2.75662 23.116 2.6598C22.7913 2.56297 22.4506 2.53153 22.1136 2.56728C21.7766 2.60302 21.4501 2.70526 21.1529 2.86805C20.8556 3.03085 20.5937 3.25098 20.3821 3.51571L12.9611 12.8125H16.2411L22.3834 5.11471L24.3566 6.72652L19.4109 12.8125H22.7114L26.3425 8.34346L30.7449 11.9386L29.9812 12.8125H30.75C31.5142 12.8117 32.2742 12.9248 33.005 13.1481C33.2842 12.6244 33.3729 12.0201 33.2561 11.4383C33.1392 10.8564 32.8241 10.3332 32.3644 9.95783L24.0055 3.13133ZM7.6875 14.0937C7.6875 13.7539 7.82249 13.428 8.06277 13.1877C8.30305 12.9474 8.62894 12.8125 8.96875 12.8125H10.3986L12.4358 10.25H8.96875C7.94932 10.25 6.97165 10.6549 6.25081 11.3758C5.52997 12.0966 5.125 13.0743 5.125 14.0937V29.4687C5.125 31.1677 5.79994 32.7972 7.00135 33.9986C8.20275 35.2 9.83221 35.875 11.5312 35.875H30.75C32.1092 35.875 33.4128 35.335 34.3739 34.3739C35.335 33.4128 35.875 32.1092 35.875 30.75V20.5C35.875 19.1407 35.335 17.8372 34.3739 16.876C33.4128 15.9149 32.1092 15.375 30.75 15.375H8.96875C8.62894 15.375 8.30305 15.24 8.06277 14.9997C7.82249 14.7594 7.6875 14.4335 7.6875 14.0937ZM26.9062 25.625H29.4688C29.8086 25.625 30.1345 25.7599 30.3747 26.0002C30.615 26.2405 30.75 26.5664 30.75 26.9062C30.75 27.246 30.615 27.5719 30.3747 27.8122C30.1345 28.0525 29.8086 28.1875 29.4688 28.1875H26.9062C26.5664 28.1875 26.2405 28.0525 26.0003 27.8122C25.76 27.5719 25.625 27.246 25.625 26.9062C25.625 26.5664 25.76 26.2405 26.0003 26.0002C26.2405 25.7599 26.5664 25.625 26.9062 25.625Z" fill="#F87C00"/>
            </svg>
    },
    {
      title: 'COLLATERAL',
      value: 'XFI',
       icon: <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F87C00]">
              <path d="M24.0055 3.13133C23.7431 2.91689 23.4408 2.75662 23.116 2.6598C22.7913 2.56297 22.4506 2.53153 22.1136 2.56728C21.7766 2.60302 21.4501 2.70526 21.1529 2.86805C20.8556 3.03085 20.5937 3.25098 20.3821 3.51571L12.9611 12.8125H16.2411L22.3834 5.11471L24.3566 6.72652L19.4109 12.8125H22.7114L26.3425 8.34346L30.7449 11.9386L29.9812 12.8125H30.75C31.5142 12.8117 32.2742 12.9248 33.005 13.1481C33.2842 12.6244 33.3729 12.0201 33.2561 11.4383C33.1392 10.8564 32.8241 10.3332 32.3644 9.95783L24.0055 3.13133ZM7.6875 14.0937C7.6875 13.7539 7.82249 13.428 8.06277 13.1877C8.30305 12.9474 8.62894 12.8125 8.96875 12.8125H10.3986L12.4358 10.25H8.96875C7.94932 10.25 6.97165 10.6549 6.25081 11.3758C5.52997 12.0966 5.125 13.0743 5.125 14.0937V29.4687C5.125 31.1677 5.79994 32.7972 7.00135 33.9986C8.20275 35.2 9.83221 35.875 11.5312 35.875H30.75C32.1092 35.875 33.4128 35.335 34.3739 34.3739C35.335 33.4128 35.875 32.1092 35.875 30.75V20.5C35.875 19.1407 35.335 17.8372 34.3739 16.876C33.4128 15.9149 32.1092 15.375 30.75 15.375H8.96875C8.62894 15.375 8.30305 15.24 8.06277 14.9997C7.82249 14.7594 7.6875 14.4335 7.6875 14.0937ZM26.9062 25.625H29.4688C29.8086 25.625 30.1345 25.7599 30.3747 26.0002C30.615 26.2405 30.75 26.5664 30.75 26.9062C30.75 27.246 30.615 27.5719 30.3747 27.8122C30.1345 28.0525 29.8086 28.1875 29.4688 28.1875H26.9062C26.5664 28.1875 26.2405 28.0525 26.0003 27.8122C25.76 27.5719 25.625 27.246 25.625 26.9062C25.625 26.5664 25.76 26.2405 26.0003 26.0002C26.2405 25.7599 26.5664 25.625 26.9062 25.625Z" fill="#F87C00"/>
            </svg>
    },
    {
      title: 'NETWORK',
      value: 'CROSSFI',
      icon: <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F87C00]">
              <path d="M24.0055 3.13133C23.7431 2.91689 23.4408 2.75662 23.116 2.6598C22.7913 2.56297 22.4506 2.53153 22.1136 2.56728C21.7766 2.60302 21.4501 2.70526 21.1529 2.86805C20.8556 3.03085 20.5937 3.25098 20.3821 3.51571L12.9611 12.8125H16.2411L22.3834 5.11471L24.3566 6.72652L19.4109 12.8125H22.7114L26.3425 8.34346L30.7449 11.9386L29.9812 12.8125H30.75C31.5142 12.8117 32.2742 12.9248 33.005 13.1481C33.2842 12.6244 33.3729 12.0201 33.2561 11.4383C33.1392 10.8564 32.8241 10.3332 32.3644 9.95783L24.0055 3.13133ZM7.6875 14.0937C7.6875 13.7539 7.82249 13.428 8.06277 13.1877C8.30305 12.9474 8.62894 12.8125 8.96875 12.8125H10.3986L12.4358 10.25H8.96875C7.94932 10.25 6.97165 10.6549 6.25081 11.3758C5.52997 12.0966 5.125 13.0743 5.125 14.0937V29.4687C5.125 31.1677 5.79994 32.7972 7.00135 33.9986C8.20275 35.2 9.83221 35.875 11.5312 35.875H30.75C32.1092 35.875 33.4128 35.335 34.3739 34.3739C35.335 33.4128 35.875 32.1092 35.875 30.75V20.5C35.875 19.1407 35.335 17.8372 34.3739 16.876C33.4128 15.9149 32.1092 15.375 30.75 15.375H8.96875C8.62894 15.375 8.30305 15.24 8.06277 14.9997C7.82249 14.7594 7.6875 14.4335 7.6875 14.0937ZM26.9062 25.625H29.4688C29.8086 25.625 30.1345 25.7599 30.3747 26.0002C30.615 26.2405 30.75 26.5664 30.75 26.9062C30.75 27.246 30.615 27.5719 30.3747 27.8122C30.1345 28.0525 29.8086 28.1875 29.4688 28.1875H26.9062C26.5664 28.1875 26.2405 28.0525 26.0003 27.8122C25.76 27.5719 25.625 27.246 25.625 26.9062C25.625 26.5664 25.76 26.2405 26.0003 26.0002C26.2405 25.7599 26.5664 25.625 26.9062 25.625Z" fill="#F87C00"/>
            </svg>
    },
    {
      title: 'PROPOSALS',
      value: 'COMING SOON ...',
      icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-[#F87C00]'>
              <path d="M24.768 7.492L26.988 9.746L32 14.76V13.42C32 12.5 31.64 11.62 30.994 10.964L26.194 6.09C25.5427 5.42824 24.7663 4.90265 23.91 4.54384C23.0536 4.18502 22.1345 4.00016 21.206 4H11.5C10.6149 3.99976 9.7625 4.33491 9.11456 4.93794C8.46662 5.54098 8.07123 6.36712 8.008 7.25C8.99124 6.43997 10.2261 5.99795 11.5 6H21.206C21.869 6.00011 22.5253 6.13208 23.1369 6.38822C23.7484 6.64437 24.3028 7.01957 24.768 7.492V7.492ZM5 26C5.26522 26 5.51957 26.1054 5.70711 26.2929C5.89464 26.4804 6 26.7348 6 27V29C6 30.3261 6.52678 31.5979 7.46447 32.5355C8.40215 33.4732 9.67392 34 11 34H29C30.3261 34 31.5979 33.4732 32.5355 32.5355C33.4732 31.5979 34 30.3261 34 29V27C34 26.7348 34.1054 26.4804 34.2929 26.2929C34.4804 26.1054 34.7348 26 35 26C35.2652 26 35.5196 26.1054 35.7071 26.2929C35.8946 26.4804 36 26.7348 36 27V29C36 30.8565 35.2625 32.637 33.9498 33.9498C32.637 35.2625 30.8565 36 29 36H11C9.14349 36 7.36301 35.2625 6.05025 33.9498C4.7375 32.637 4 30.8565 4 29V27C4 26.7348 4.10536 26.4804 4.29289 26.2929C4.48043 26.1054 4.73478 26 5 26ZM20 8V17C20 17.7957 20.3161 18.5587 20.8787 19.1213C21.4413 19.6839 22.2044 20 23 20H32V29C32 29.7957 31.6839 30.5587 31.1213 31.1213C30.5587 31.6839 29.7957 32 29 32H11C10.2044 32 9.44129 31.6839 8.87868 31.1213C8.31607 30.5587 8 29.7957 8 29V11C8 10.2044 8.31607 9.44129 8.87868 8.87868C9.44129 8.31607 10.2044 8 11 8H20ZM12 15C12 15.2652 12.1054 15.5196 12.2929 15.7071C12.4804 15.8946 12.7348 16 13 16H17C17.2652 16 17.5196 15.8946 17.7071 15.7071C17.8946 15.5196 18 15.2652 18 15C18 14.7348 17.8946 14.4804 17.7071 14.2929C17.5196 14.1054 17.2652 14 17 14H13C12.7348 14 12.4804 14.1054 12.2929 14.2929C12.1054 14.4804 12 14.7348 12 15ZM13 18C12.7348 18 12.4804 18.1054 12.2929 18.2929C12.1054 18.4804 12 18.7348 12 19C12 19.2652 12.1054 19.5196 12.2929 19.7071C12.4804 19.8946 12.7348 20 13 20H17C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19C18 18.7348 17.8946 18.4804 17.7071 18.2929C17.5196 18.1054 17.2652 18 17 18H13ZM12 23C12 23.2652 12.1054 23.5196 12.2929 23.7071C12.4804 23.8946 12.7348 24 13 24H17C17.2652 24 17.5196 23.8946 17.7071 23.7071C17.8946 23.5196 18 23.2652 18 23C18 22.7348 17.8946 22.4804 17.7071 22.2929C17.5196 22.1054 17.2652 22 17 22H13C12.7348 22 12.4804 22.1054 12.2929 22.2929C12.1054 22.4804 12 22.7348 12 23ZM22 8.5V17C22 17.2652 22.1054 17.5196 22.2929 17.7071C22.4804 17.8946 22.7348 18 23 18H31.5L22 8.5Z" fill="#F87C00"/>
            </svg>
      
    },
    {
      title: 'PERMISSION-LESS',
      value: permissionless,
      icon: <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F87C00]">
              <path d="M19.25 10.5H21C22.9305 10.5 24.5 12.0695 24.5 14V24.5C24.5 26.4305 22.9305 28 21 28H3.5C1.5668 28 0 26.4305 0 24.5V14C0 12.0695 1.5668 10.5 3.5 10.5H15.75V7.875C15.75 3.5257 19.2773 0 23.625 0C27.9727 0 31.5 3.5257 31.5 7.875V10.5C31.5 11.468 30.718 12.25 29.75 12.25C28.782 12.25 28 11.468 28 10.5V7.875C28 5.45891 26.0422 3.5 23.625 3.5C21.2078 3.5 19.25 5.45891 19.25 7.875V10.5Z" fill="#F87C00"/>
            </svg>
    },
    {
      title: 'PERMISSIONED',
      value: permissioned,
      icon: <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.49922 17.1V13.3C9.49922 10.7805 10.5001 8.36413 12.2817 6.58253C14.0633 4.80094 16.4797 3.80005 18.9992 3.80005C21.5188 3.80005 23.9351 4.80094 25.7167 6.58253C27.4983 8.36413 28.4992 10.7805 28.4992 13.3V17.1C29.507 17.1 30.4736 17.5004 31.1862 18.213C31.8989 18.9257 32.2992 19.8922 32.2992 20.9V30.4001C32.2992 31.4079 31.8989 32.3744 31.1862 33.0871C30.4736 33.7997 29.507 34.2001 28.4992 34.2001H9.49922C8.4914 34.2001 7.52485 33.7997 6.81221 33.0871C6.09957 32.3744 5.69922 31.4079 5.69922 30.4001V20.9C5.69922 19.8922 6.09957 18.9257 6.81221 18.213C7.52485 17.5004 8.4914 17.1 9.49922 17.1V17.1ZM24.6992 13.3V17.1H13.2992V13.3C13.2992 11.7883 13.8998 10.3385 14.9687 9.26954C16.0377 8.20058 17.4875 7.60005 18.9992 7.60005C20.511 7.60005 21.9608 8.20058 23.0297 9.26954C24.0987 10.3385 24.6992 11.7883 24.6992 13.3V13.3Z" fill="#F87C00"/>
            </svg>
      
    },
  ];

  return (
    <React.Fragment>
      <div className='grid sm:grid-cols-2 gap-10 relative'>
        {
          dashboardInfo.map((item) => (
            <div className={`bg-green1 rounded-[36px] py-12 px-6 lg:p-8 text-white flex justify-center items-center lg:justify-start gap-4`}>
              <h1 className='border border-gray1 bg-gray1 rounded-full p-2'>{item.icon}</h1>
              <div className='w-full flex flex-col justify-start items-start'>
                <h3 className='text-sm lg:text-lg font-semibold '>{ item.title }</h3>
                <p className='text-xs md:text-md'>{ item.value }</p>
              </div>
            </div>
          ))
        }
      </div>
    </React.Fragment>
  )
}

export default Dashboard;
   