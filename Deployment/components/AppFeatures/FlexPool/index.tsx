import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@/components/ui/button';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { useAccount } from 'wagmi';
import { filterPoolForCurrentUser, filterPools, formatAddr, formatValue, toBN } from '@/utilities';
import { Loading } from './PoolWrapper/Nulls';
import { MotionDivWrap } from '@/components/utilities/MotionDivWrap';
import Grid from '@mui/material/Grid';
import { FlexCard } from './update/FlexCard';
import { Input } from '@/components/ui/input';
import { parseUnits } from 'viem';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { ConnectWallet } from '@/components/utilities/ConnectWallet';
import { flexCenter, flexEnd, flexSpread } from '@/constants';
import RemoveLiquidity from './update/transactions/RemoveLiquidity';
import AddLiquidity from '../Providers/AddLiquidity';

export default function Flexpool({showMyPool, allPools, padding} : {showMyPool: boolean, allPools: boolean, padding?: string}) {
  const [poolType, setPoolType] = React.useState<PoolType>('all');
  const [myPoolSearchElement, setSearchMyPoolElement] = React.useState<bigint>(0n);
  const [searchElement, setSearchElement] = React.useState<bigint>(0n);

  const { setActivepath, pools, providers } = useAppStorage();
  const { address, isConnected } = useAccount();
  const account = formatAddr(address);
  const handleCreatePool = () => setActivepath('CreateFlexpool');

  const { myPools, renderedPools, filteredProviders } = React.useMemo(() => {
    let renderedPools = pools;
    const { filteredPools, filteredProviders } = filterPoolForCurrentUser(pools, providers, account);
    const { pastPools, currentPools, permissioned, permissionless } = filterPools(pools);
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

    return { myPools: filteredPools, renderedPools, filteredProviders }
  }, [pools, poolType, providers, account]);

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
    <div className={`relative space-y-2 ${padding}`}>
      {/* My Pools container */}
      {
        showMyPool && 
        <div className='grid grid-cols-1 gap-4'>
          <div className={`${flexSpread} bg-white w-full dark:bg-transparent rounded-lg p-4 border-2 border-green1/20`}>
            <h3 className='text-lg md:text-2xl font-bold text-green1/80 dark:text-orange-200 w-[50%]'>Dashboard</h3>
            {/* Search column */}
            <Input
              placeholder="Search amount..."
              onChange={onMyPoolchange}
              className="max-w-xs w-[50%]"
              type='text'
            />
          </div>

          {/* My pools */}
          <div className='space-y-4'>
            <MotionDivWrap className='grid md:grid-cols-2 gap-4'>
              {
                filteredProviders.length === 0 && <div className={`${flexCenter} border-2 border-dashed border-orange-200 bg-white1/50 text-orange-400 dark:text-white2 dark:bg-green1/80 font-black p-4 rounded-lg`}>
                  <h1>No liquidity found</h1>
                </div>
              }
              {
                filteredProviders.length > 0 && 
                  <div className='relative grid grid-cols-1 md:grid-cols-2 border-2 border-green1/20 bg-white text-center text-green1/80 dark:text-white2 dark:bg-green1/80 font-black p-4 rounded-lg place-items-center space-y-4 md:space-y-0'>
                    <div className='text-lg space-y-4 md:space-y-0'>
                      <div className='space-y-2'>
                        <h3 className='dark:text-orange-300 text-xs'>My Liquidity balance</h3>
                        <h3 className='text-2xl md:text-4xl text-orange-400'>{`$${formatValue(filteredProviders[0].amount.toString()).toStr}`}</h3>
                      </div>
                      <div className='md:absolute top-0 left-4 md:left-0 md:dark:top-[70%] md:dark:left-14'>
                        <RemoveLiquidity />
                      </div>
                    </div>
                    <div className='flex justify-between items-center gap-2 md:block md:space-y-2 w-full'>
                      <div className='p-4 bg-white2 dark:bg-transparent dark:border dark:border-white2/10 rounded-lg dark:text-orange-300 w-2/4 md:w-full h-32 md:h-full space-y-4 text-xs'>
                        <h3>Unpaid rewards</h3>
                        <h3 className='text-xl md:text-4xl text-orange-400'>{`$${formatValue(filteredProviders[0].accruals.fullInterest).toStr}`}</h3>
                      </div>
                      <div className='p-4 bg-white2 dark:bg-transparent dark:border dark:border-white2/10 rounded-lg dark:text-orange-300 w-2/4 md:w-full h-32 md:h-full space-y-4 text-xs'>
                        <h3>Rate</h3>
                        <h3 className='text-xl md:text-4xl text-orange-400'>{`%${formatValue(filteredProviders[0].rate).toStr}`}</h3>
                      </div>
                    </div>
                </div>
              }
              <div className='space-y-4 bg-white1 dark:bg-green1/50 p-4 rounded-lg'>
                <h3 className='text-xl text-orange-400 dark:text-orange-300 font-bold'>Add liquidity</h3>
                <AddLiquidity />
              </div>
            </MotionDivWrap>

            { !myPools && <Loading /> }
            { 
              (myPools.length === 0 && isConnected && filteredProviders.length === 0) && <MotionDivWrap className='place-items-center border-2 border-dotted rounded-lg p-4 space-y-4 opacity-50'>
                <h1 className='text-2xl md:text-3xl font-bold'>No pool found for user</h1>
                <div className='place-items-center space-y-2'>
                  <div className='text-sm'>
                    <Button onClick={() => setActivepath('Home')} variant={'ghost'} className='text-orangec '>Contribute</Button> to existing pools
                  </div>
                  {/* <h3 className='text-sm '>Scroll down to contribute to existing pools</h3> */}
                  <h3>Or</h3>
                  <Button onClick={handleCreatePool}>Launch a pool</Button>
                </div>
              </MotionDivWrap> 
            }
            { 
              (myPools.length === 0 && !isConnected && filteredProviders.length === 0) && <MotionDivWrap className='place-items-center border-2 border-dotted rounded-lg p-4 space-y-4 opacity-50'>
                <h1 className='text-2xl md:text-3xl font-bold'>Please connect a wallet</h1>
                <ConnectWallet />
              </MotionDivWrap> 
            }
            { 
              ((myPools.length > 0 || filteredProviders.length > 0) && !isConnected) && <MotionDivWrap className='place-items-center mb-4 border-2 border-dotted rounded-lg space-y-4 p-4 md:py-16 opacity-70 bg-white1 dark:bg-green1/50'>
                  <h1 className='text-lg md:text-2xl font-bold'>Please Reconnect wallet</h1>
                <ConnectWallet />
              </MotionDivWrap> 
            }
            
            { 
              myPools 
                && 
                  myPools.length > 0 
                    && 
                      <MotionDivWrap className="w-full max-h-[300px] pb-4 overflow-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {
                            myPools.filter(({pool}) => myPoolSearchElement === 0n? true : pool.big.unit === myPoolSearchElement).map(({pool, cData}, index) => {
                              const hasPool = toBN(pool.big.unit.toString()).gt(0);
                              if(hasPool) {
                                return (
                                  <div key={index}>
                                    <MotionDivWrap className='w-full rounded-md' transitionDelay={index / myPools?.length}>
                                      <FlexCard cData={cData} pool={pool} />
                                    </MotionDivWrap>
                                  </div>
                                )
                              }
                            })
                          }
                        </div> 
                      </MotionDivWrap>
            }
          </div>
        </div>
      }

      {/* Dashboard container */}
      {
        allPools && 
          <MotionDivWrap className='grid grid-cols-1 gap-2'>
            <h3 className='text-lg md:text-2xl font-bold text-green1/80 dark:text-orange-200'>Flexpools</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 bg-white2/80 p-4 border border-white dark:bg-green1/90 dark:border-none rounded-lg'>
              <Input 
                placeholder="Search by amount..."
                onChange={onchange}
                className="max-w-md text-xs md:text-md"
                type='text'
              />
              <div className={`${flexEnd} gap-2`}>
                <Button variant={'outline'} onClick={handleCreatePool} className={`dark:bg-green1/90 w-full`}>
                  <h3>New pool</h3>
                  <Tooltip title="New Pool">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6 hover:text-green1/70">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </Tooltip>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto w-full capitalize">
                      {poolType} 
                      <ChevronDown />
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
              { 
                (renderedPools.length === 0 && !isConnected) && <div className='place-items-center p-20 space-y-4 opacity-80'>
                  <h1 className='text-xl md:text-3xl text-center font-bold'>Please connect a wallet</h1>
                  <div className="animate-pulse">
                    <ConnectWallet />
                  </div>
                </div> 
              }
              { 
                (renderedPools.length === 0 && isConnected) && <div className='place-items-center p-20 space-y-4 bg-white dark:bg-green1/40 opacity-80'>
                  <h1 className='text-xl md:text-2xl text-center font-bold'>{'Something went wrong!'}</h1>
                  <div className="animate-pulse">
                    <h3>Check your connection</h3>
                  </div>
                </div> 
              }
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
                                    <Grid item xs={6} md={3} key={index}>
                                      {/* index / renderedPools?.length */}
                                      <MotionDivWrap className='w-full rounded-md' transitionDelay={1}>
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
          </MotionDivWrap>
      }
      
    </div>
  )
}

const dropDownContent : PoolType[] = ['all', 'current', 'past', 'permissioned', 'permissionless'];
export type PoolType = 'current' | 'past' | 'permissioned' | 'permissionless' | 'all';

