import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import useAppStorage from '@/components/StateContextProvider/useAppStorage';
import { CustomButton } from '@/components/CustomButton';
import { PoolWrapper } from './PoolWrapper';
import { Create } from './Create';
import { flexStart, flexSpread } from '@/constants';
import AddressWrapper from '@/components/AddressFormatter/AddressWrapper';
import USDBalances from './USDBalances';

const FlexPool = () => {
  const [isPermissioned, setPermissionType] = React.useState<boolean>(false);
  const [displayForm, setDisplayForm] = React.useState<boolean>(false);
  
  const { storage: pools, permissioned, permissionless } = useAppStorage();
  const closeDisplayForm = () => setDisplayForm(false);
  const poolIsEmpty = isPermissioned? (!permissioned?.length || permissioned?.length === 0) : (!permissionless?.length || permissionless?.length === 0);
  
  return (
    <React.Fragment>
      {
        !displayForm?
          <div className='space-y-4'>
            <div className="flex justify-between items-center gap-2">
              <div className={`${flexSpread} gap-2`}>
                <div className={`md:hidden w-[fit-content] ${flexStart}`}>
                  <button disabled={!isPermissioned} onClick={() => setPermissionType(false)} className={`${flexSpread} gap-2 ${isPermissioned? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${isPermissioned && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </button>
                  <button disabled={isPermissioned} onClick={() => setPermissionType(true)} className={`${flexSpread} gap-2 ${!isPermissioned? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${!isPermissioned && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </button>
                </div>
                <div className={`hidden md:flex items-center w-[fit-content] text-xs uppercase`}>
                  <button disabled={!isPermissioned} onClick={() => setPermissionType(false)} className={`${flexSpread} gap-2 uppercase text-orange-300 border border-green1 ${isPermissioned? 'bg-gray1 animate-pulse hover:text-orangec' : 'bg-green1 '} p-3 rounded-l-full`}>
                    Permissionless
                  </button>
                  <button disabled={isPermissioned} onClick={() => setPermissionType(true)} className={`${flexSpread} gap-2 uppercase text-orange-300 border border-green1 ${!isPermissioned? 'bg-gray1 animate-pulse hover:text-orangec' : 'bg-green1 '} p-3 rounded-r-full`}>
                    Permissioned
                  </button>
                </div>
                <USDBalances />
              </div>
              

              <div className='relative'>
                <CustomButton
                  disabled={false}
                  overrideClassName={`bg-green1 rounded-full w-[38px] h-[38px] hover:shadow-sm hover:shadow-orange-200`}
                  handleButtonClick={() => setDisplayForm(true)}
                >
                  <h1 className='text-orange-200 font-bold absolute top-6 text-[10px]'>New FlexPool</h1>
                  <Tooltip title="Open New FlexPool">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 text-orange-300 animate-pulse hover:animate-none">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </Tooltip>
                </CustomButton>
              </div>
            </div>
            {
              poolIsEmpty?
                <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center text-center">
                  <h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[150px] md:size-[250px] text-green1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                    </svg>
                  </h1>
                  <h1 className="text-2xl md:text-[36px] text-orange-300 font-black">{`Found 0 ${isPermissioned? 'Permissioned' : 'Permissionless'} Pool`}</h1>
                </div>
                  :
                isPermissioned? 
                  <PoolWrapper 
                    filteredPool={permissioned}
                    totalPool={pools.length}
                  /> : <PoolWrapper 
                      filteredPool={permissionless}
                      totalPool={pools.length}
                  />
                }
          </div> : <Create back={closeDisplayForm} />
      }
    </React.Fragment>
  )
}

export default FlexPool

// const isLargeScreen = useMediaQuery('(min-width:768px)');