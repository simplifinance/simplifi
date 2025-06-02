import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@/components/ui/button';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { useAccount } from 'wagmi';
import { filterPoolForCurrentUser, filterPools, formatAddr, toBN } from '@/utilities';
import { Loading } from './PoolWrapper/Nulls';
import { MotionDivWrap } from '@/components/utilities/MotionDivWrap';
import Grid from '@mui/material/Grid';
import { FlexCard } from './update/FlexCard';
import { Input } from '@/components/ui/input';
import { parseUnits } from 'viem';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { ConnectWallet } from '@/components/utilities/ConnectWallet';
import { flexEnd, flexSpread } from '@/constants';

export default function Flexpool() {
  const [poolType, setPoolType] = React.useState<PoolType>('all');
  const [myPoolSearchElement, setSearchMyPoolElement] = React.useState<bigint>(0n);
  const [searchElement, setSearchElement] = React.useState<bigint>(0n);

  const { setActivepath, pools } = useAppStorage();
  const { address, isConnected } = useAccount();
  const account = formatAddr(address);
  const handleCreatePool = () => setActivepath('CreateFlexpool');

  const { myPools, renderedPools } = React.useMemo(() => {
    let renderedPools = pools;
    const myPools = filterPoolForCurrentUser(pools, account);
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

    return { myPools, renderedPools }
  }, [pools, poolType, account]);

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
    <div className='relative space-y-4 p-4'>
      {/* My Pools container */}
      {
        myPools && myPools.length > 0 && 
        <div className='grid grid-cols-1 gap-4'>
          <div className={`${flexSpread} bg-white2/80 dark:bg-transparent rounded-lg p-4 border border-b border-b-green1/30'`}>
            <div className='text-2xl font-bold text-green1/80 dark:text-orange-200'>
              <h3>My Pools</h3>
            </div>

            {/* Search column */}
            <Input
              placeholder="Search amount..."
              onChange={onMyPoolchange}
              className="max-w-xs"
              type='text'
            />
          </div>

          {/* My pools */}
          <div>
            { !myPools && <Loading /> }
            { 
              (myPools.length === 0 && isConnected) && <div className='place-items-center border-2 border-dotted rounded-lg p-4 space-y-4 opacity-50'>
                <h1 className='text-2xl md:text-3xl font-bold'>No pool found for user</h1>
                <div className='place-items-center space-y-2'>
                  <h3 className='text-sm '>Scroll down to contribute to existing pools</h3>
                  <h3>Or</h3>
                  <Button onClick={handleCreatePool}>Launch a pool</Button>
                </div>
              </div> 
            }
            { 
              (myPools.length === 0 && !isConnected) && <div className='place-items-center border-2 border-dotted rounded-lg p-4 space-y-4 opacity-50'>
                <h1 className='text-2xl md:text-3xl font-bold'>Please connect a wallet</h1>
                <ConnectWallet />
              </div> 
            }
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
                                  <Grid item xs={12} sm={6} md={3} key={index}>
                                    <MotionDivWrap className='w-full rounded-md' transitionDelay={index / myPools?.length}>
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
      }
      
      {/* Dashboard container */}
      <div className='grid grid-cols-1 gap-4'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 bg-white2/80 dark:bg-transparent p-4 border border-b border-b-green1/20 rounded-lg'>
          <div className='text-2xl font-bold text-green1/80 dark:text-orange-200'>
            <h3>Flexpools</h3>
          </div>
          <div>
            <Input 
              placeholder="Search by amount..."
              onChange={onchange}
              className="max-w-sm"
              type='text'
            />
          </div>
          <div className={`${flexEnd}`}>
            <Button variant={'outline'} onClick={handleCreatePool} className={`dark:bg-green1/90 w-full`}>
              <h3>New pool</h3>
              <Tooltip title="New Pool">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-5 md:size-6 hover:text-green1/70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Tooltip>
            </Button>
          </div>
          <div className={`${flexEnd}`}>
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
              <h1 className='text-xl md:text-3xl font-bold'>Please connect a wallet</h1>
              <div className="animate-pulse">
                <ConnectWallet />
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
                                <Grid item xs={12} sm={6} md={3} key={index}>
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

