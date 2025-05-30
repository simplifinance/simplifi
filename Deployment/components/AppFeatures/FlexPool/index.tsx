import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@/components/ui/button';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { useAccount } from 'wagmi';
import { filterPoolForCurrentUser, filterPools, formatAddr, toBN } from '@/utilities';
import { Loading, NotFound } from './PoolWrapper/Nulls';
import { MotionDivWrap } from '@/components/utilities/MotionDivWrap';
import Grid from '@mui/material/Grid';
import { FlexCard } from './update/FlexCard';
import { Input } from '@/components/ui/input';
import { parseUnits } from 'viem';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export default function Flexpool() {
  const [poolType, setPoolType] = React.useState<PoolType>('all');
  const [myPoolSearchElement, setSearchMyPoolElement] = React.useState<bigint>(0n);
  const [searchElement, setSearchElement] = React.useState<bigint>(0n);

  const { setActivepath, pools } = useAppStorage();
  const { address } = useAccount();
  const account = formatAddr(address);
  const handleCreatePool = () => setActivepath('CreateFlexpool');

  const { myPools, renderedPools } = React.useMemo(() => {
    let renderedPools = pools;
    const myPools = filterPoolForCurrentUser(pools, account);
    const {pastPools, currentPools, permissioned, permissionless } = filterPools(pools);
    switch (poolType) {
      case 'current':
        renderedPools = currentPools;
        break;

      case 'past':
        renderedPools = pastPools;
        break;

      case 'permissioned':
        renderedPools = permissioned;
        break;

      case 'permissionless':
        renderedPools = permissionless;
        break;
    
      default:
        break;
    }

    return { myPools, renderedPools }
  }, [pools, poolType]);

  // Handles user's search input
  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchElement(parseUnits(e.target.value, 18));
  }

  // Handles user's search input on myPool object
  const onMyPoolchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchMyPoolElement(parseUnits(e.target.value, 18));
  }

  return (
    <div className='grid grid-cols-1 gap-4'>
      {/* My Pools container */}
      <div className='grid grid-cols-1 gap-4'>
        <div className='grid grid-cols-3 gap-2 bg-white2/80 dark:bg-green1 p-4 border rounded-lg'>
          <div className='text-2xl font-bold text-green1/80 dark:text-orange-200'>
            <h3>My Pools</h3>
          </div>
          <div>
            <Button variant={'ghost'} onClick={handleCreatePool} className={`dark:bg-green1/90 dark:text-orange-300 w-full`}>
              <h3>New pool</h3>
              <Tooltip title="New Pool">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-5 md:size-6 hover:text-green1/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Tooltip>
            </Button>
          </div>
          <div className={`place-items-center`}>
            <Input
              placeholder="Search by amount..."
              onChange={onMyPoolchange}
              className="max-w-sm"
              type='text'
            />
          </div>
        </div>

        {/* My pools */}
        <div className='space-y-4'>
        { !myPools && <Loading /> }
          { myPools.length === 0 && <NotFound errorMessage={'No pool found'} /> }
          { 
            myPools 
              && 
                myPools.length > 0 
                  && 
                    <MotionDivWrap className="w-full">
                      <Grid container xs={"auto"} spacing={2}>
                        {
                          myPools.filter(({pool}) => myPoolSearchElement === 0n? true : pool.big.unit === myPoolSearchElement).map(({pool, cData}, index) => {
                            const hasPool = toBN(pool.big.unit.toString()).gt(0);
                            if(hasPool) {
                              return (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                  <MotionDivWrap className='w-full rounded-md' transitionDelay={index / renderedPools?.length}>
                                    <FlexCard cData={cData} pool={pool} />
                                  </MotionDivWrap>
                                </Grid>
                              )
                            }
                          })
                        }
                      </Grid> 
                    </MotionDivWrap>
          }
        </div>
      </div>
      
      {/* All Pools container */}
      <div className='grid grid-cols-1 gap-4'>
        <div className='grid grid-cols-3 gap-2 bg-white2/80 dark:bg-green1 p-4 border rounded-lg'>
          <div className='text-2xl font-bold text-green1/80 dark:text-orange-200'>
            <h3>All Pools</h3>
          </div>
          <div>
            <Input 
              placeholder="Search by amount..."
              onChange={onchange}
              className="max-w-sm"
              type='text'
            />
          </div>
          <div className={`w-full`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto w-full">
                  Sort pools <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {
                  dropDownContent
                    .map((item) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={item}
                          className="capitalize"
                          checked={poolType === item}
                          onCheckedChange={(value) => setPoolType(item)}
                        >
                          {item}
                        </DropdownMenuCheckboxItem>
                      )
                    }
                  )
                }
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          { !renderedPools && <Loading /> }
          { renderedPools.length === 0 && <NotFound errorMessage={'No pool found'} /> }
          { 
            renderedPools 
              && 
                renderedPools.length > 0 
                  && 
                    <MotionDivWrap className="w-full">
                      <Grid container xs={"auto"} spacing={2}>
                        {
                          renderedPools.filter(({pool}) => searchElement === 0n? true : pool.big.unit === searchElement).map(({pool, cData}, index) => {
                            const hasPool = toBN(pool.big.unit.toString()).gt(0);
                            if(hasPool) {
                              return (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                  <MotionDivWrap className='w-full rounded-md' transitionDelay={index / renderedPools?.length}>
                                    <FlexCard cData={cData} pool={pool} />
                                  </MotionDivWrap>
                                </Grid>
                              )
                            }
                          })
                        }
                      </Grid> 
                    </MotionDivWrap>
          }
        </div>
      </div>
    </div>
  )
}

const dropDownContent : PoolType[] = ['all', 'current', 'past', 'permissioned', 'permissionless'];
export type PoolType = 'current' | 'past' | 'permissioned' | 'permissionless' | 'all';




{/* <div className='space-y-4'>
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
</div> */}
