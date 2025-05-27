import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { flexStart, flexSpread } from '@/constants';
import { PastEpoches } from './PoolWrapper/PastEpoches';
import { CurrentEpoches } from './PoolWrapper/CurrentEpoches';
import { Button } from '@/components/ui/button';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { Input } from './Create/Input';

export default function Flexpool() {
  const [isPastEpoches, setEpochType] = React.useState<boolean>(false);
  const { setActivepath } = useAppStorage();
  const handleCreatePool = () => setActivepath('CreateFlexpool');

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {}

  return (
    <div className='space-y-4'>
          <div className="grid grid-cols-1 md:grid-cols-2 bg-white1 dark:bg-transparent p-4 dark:rounded-lg border-b-2 border-b-green1/70">
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
                <Button disabled={!isPastEpoches} variant={'ghost'} onClick={() => setEpochType(false)} className={` dark:bg-green1/90 dark:text-orange-300`}>
                  Active Pools
                </Button>
                <Button disabled={isPastEpoches} variant={'ghost'}  onClick={() => setEpochType(true)} className={`dark:bg-green1/90 dark:text-orange-300`}>
                  Past Pools
                </Button>
              </div>
            </div>
    
            <div className={`w-full flex justify-end items-center gap-2`}>
              <Button variant={'ghost'} onClick={handleCreatePool} className={`dark:bg-green1/90 dark:text-orange-300`}>
                <h3>New pool</h3>
                <Tooltip title="New Pool">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-5 md:size-6 hover:text-green1/70">
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










  //   <div className='grid grid-cols-1'>
  //   <div></div>

  //   <div className='space-y-4'>
  //     <div className={`${flexSpread}`}>
  //       <h3>My Pools</h3>
  //       <Input 
  //         id='Search'
  //         onChange={onchange}
  //         type='number'
  //         placeholder='Search by amount'
  //         required={false}
  //       />
  //     </div>

  //       {/* Map all pools belonging to the current user */}
  //   </div>

  //   <div>
  //     <div className={`${flexSpread}`}>
  //       <h3>All Pools</h3>
  //       <Input 
  //         id='Search'
  //         onChange={onchange}
  //         type='number'
  //         placeholder='Search by amount'
  //         required={false}
  //       />
  //     </div>

  //   </div>
  // </div>