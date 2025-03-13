import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { CustomButton } from '@/components/CustomButton';
import { Create } from './Create';
import { flexStart, flexSpread } from '@/constants';
import USDBalances from './USDBalances';
import { PastEpoches } from './PoolWrapper/PastEpoches';
import { CurrentEpoches } from './PoolWrapper/CurrentEpoches';
import useAppStorage from '@/components/StateContextProvider/useAppStorage';

const FlexPool = () => {
  const [isPastEpoches, setEpochType] = React.useState<boolean>(false);  
  const { displayForm, openDisplayForm } = useAppStorage();

  return (
    <React.Fragment>
      {
        !displayForm?
          <div className='space-y-4'>
            <div className="flex justify-between items-center gap-2">
              <div className={`${flexSpread} gap-2`}>
                <div className={`md:hidden w-[fit-content] ${flexStart}`}>
                  <button disabled={!isPastEpoches} onClick={() => setEpochType(false)} className={`${flexSpread} gap-2 ${isPastEpoches? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${isPastEpoches && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </button>
                  <button disabled={isPastEpoches} onClick={() => setEpochType(true)} className={`${flexSpread} gap-2 ${!isPastEpoches? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${!isPastEpoches && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </button>
                </div>
                <div className={`hidden md:flex items-center w-[fit-content] text-xs uppercase`}>
                  <button disabled={!isPastEpoches} onClick={() => setEpochType(false)} className={`${flexSpread} gap-2 uppercase text-orange-300 border border-green1 ${isPastEpoches? 'bg-gray1 animate-pulse hover:text-orangec' : 'bg-green1 '} p-3 rounded-l-full`}>
                    Active Pools
                  </button>
                  <button disabled={isPastEpoches} onClick={() => setEpochType(true)} className={`${flexSpread} gap-2 uppercase text-orange-300 border border-green1 ${!isPastEpoches? 'bg-gray1 animate-pulse hover:text-orangec' : 'bg-green1 '} p-3 rounded-r-full`}>
                    Past Pools
                  </button>
                </div>
                <USDBalances />
              </div>
              

              <div className='relative'>
                <CustomButton
                  disabled={false}
                  overrideClassName={`bg-green1 rounded-full w-[38px] h-[38px] hover:shadow-sm hover:shadow-orange-200`}
                  handleButtonClick={openDisplayForm}
                >
                  {/* <h1 className='hidden md:block text-orange-200 font-bold absolute -top-8 text-[8px]'>New FlexPool</h1> */}
                  <Tooltip title="New Pool">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 text-orange-300 animate-pulse hover:animate-none">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </Tooltip>
                </CustomButton>
              </div>
            </div>
            { isPastEpoches? <PastEpoches /> : <CurrentEpoches />}
          </div> : <Create />
      }
    </React.Fragment>
  )
}

export default FlexPool

// const isLargeScreen = useMediaQuery('(min-width:768px)');