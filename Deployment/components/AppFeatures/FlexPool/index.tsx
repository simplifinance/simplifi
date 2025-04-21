import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { flexStart, flexSpread } from '@/constants';
import { PastEpoches } from './PoolWrapper/PastEpoches';
import { CurrentEpoches } from './PoolWrapper/CurrentEpoches';
import { Button } from '@/components/ui/button';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

export default function Flexpool() {
  const [isPastEpoches, setEpochType] = React.useState<boolean>(false);
  const { setActivepath } = useAppStorage();
  const handleCreatePool = () => setActivepath('CreateFlexpool');

  return (
    <div className='space-y-4'>
      <div className="flex justify-between items-center gap-2">
        <div className={`${flexSpread} gap-2`}>
          <div className={`md:hidden w-[fit-content] ${flexStart}`}>
            <Button disabled={!isPastEpoches} onClick={() => setEpochType(false)} className={`${flexSpread} gap-2 ${isPastEpoches? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${isPastEpoches && 'hover:shadow-sm hover:shadow-orange-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </Button>
            <Button disabled={isPastEpoches} onClick={() => setEpochType(true)} className={`${flexSpread} gap-2 ${!isPastEpoches? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${!isPastEpoches && 'hover:shadow-sm hover:shadow-orange-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </Button>
          </div>
          <div className={`hidden md:flex items-center gap-2 w-[fit-content] text-xs`}>
            <Button disabled={!isPastEpoches} variant={'outline'} onClick={() => setEpochType(false)} className={` bg-green1/90 text-orange-300`}>
              Active Pools
            </Button>
            <Button disabled={isPastEpoches} variant={'outline'}  onClick={() => setEpochType(true)} className={`bg-green1/90 text-orange-300`}>
              Past Pools
            </Button>
          </div>
          {/* <USDBalances /> */}
        </div>

        <div className={`${flexSpread} relative gap-2`}>
          <Button variant={'outline'}  onClick={() => setActivepath('')} className={`bg-green1/90 text-orange-300`}>
            Back
          </Button>
          <Button variant={'outline'} onClick={handleCreatePool} className={`bg-green1/90 text-orange-300`}>
            <h3>Create</h3>
            <Tooltip title="New Pool">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-5 md:size-6 text-white1 hover:text-green1/70">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </Tooltip>
          </Button>
        </div>
      </div>
      { 
        isPastEpoches? <PastEpoches /> : <CurrentEpoches />
      }
    </div>
  )
}
