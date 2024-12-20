import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { getEpoches } from '@/apis/read/readContract';
import { useAccount, useConfig } from 'wagmi';
import useAppStorage from '@/components/StateContextProvider/useAppStorage';
import { CustomButton } from '@/components/CustomButton';
import { PoolWrapper } from './pool';
import { Create } from './Create';
import { useMediaQuery } from '@mui/material';

const FlexPool = () => {
  const [isPermissioned, setPermissionType] = React.useState<boolean>(false);
  const [displayForm, setDisplayForm] = React.useState<boolean>(false);
  
  const { storage: { pools }, permissioned, permissionless } = useAppStorage();
  const closeDisplayForm = () => setDisplayForm(false);
  const { setstate, openPopUp, togglePopUp, setActivepath } = useAppStorage();
  const { isConnected, connector } = useAccount();
  const isLargeScreen = useMediaQuery('(min-width:768px)');
  const config = useConfig();
  const poolIsEmpty = isPermissioned? (!permissioned?.length || permissioned?.length === 0) : (!permissionless?.length || permissionless?.length === 0);
  
  React.useEffect(() => {
    if(!isConnected){
      setActivepath('/dashboard')
      if(!openPopUp) togglePopUp();
    }
  }, [isConnected, setActivepath, openPopUp, togglePopUp]);

  React.useEffect(() => {
    const ctrl = new AbortController();
    setTimeout(() => {
      if(isConnected && connector) {
        const fetchData = async() => {
          const pools = await getEpoches({
            config
          });
          setstate({pools});
        }
        fetchData();
      }
    }, 6000);
    return () => {
      clearTimeout(6000);
      ctrl.abort();
    };
  }, [isConnected, connector, config, setstate]);

  return (
    <React.Fragment>
      {
        !displayForm?
          <div className='space-y-4'>
            <div className="flex justify-between items-start md:items-center">
              <div className="flex bg-green1 p-1 rounded-[26px]">
                <CustomButton
                  disabled={isPermissioned}
                  overrideClassName={`${isPermissioned? 'bg-gray1' : 'bg-green1 hover:text-orangec hover:shadow-sm hover:shadow-orange-200'} p-3 rounded-l-full ${!isPermissioned && 'animate-pulse text-xs text-orange-300 uppercase'}`}
                  handleButtonClick={() => setPermissionType(true)}
                >
                  {
                    isLargeScreen? 'Permissioned' : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                    </svg>
                  }
                </CustomButton>
                <CustomButton
                  disabled={!isPermissioned}
                  overrideClassName={`${!isPermissioned? 'bg-gray1' : 'bg-green1 hover:text-orangec hover:shadow-sm hover:shadow-orange-200'} p-3 rounded-r-full ${!isPermissioned && 'animate-pulse text-xs text-orange-300 uppercase'}`}
                  handleButtonClick={() => setPermissionType(false)}
                >
                  {
                    isLargeScreen? 'Permissionless' : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                      </svg>
                  }
                </CustomButton>
              </div>
              <div>
                  <CustomButton
                    disabled={false}
                    overrideClassName={`bg-green1 p-2 rounded-full w-[40px] h-[40px] md:h-[48px] md:w-[48px] hover:shadow-sm hover:shadow-orange-200`}
                    handleButtonClick={() => setDisplayForm(true)}
                  >
                    <Tooltip title="New FlexPool">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 md:size-8 text-orange-300">
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
        //   <Grid container xs={"auto"} spacing={2}>
        //     {
        //       filtered?.map((pool: LiquidityPool, i) => (
        //         <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
        //           <motion.button
        //             initial={{opacity: 0}}
        //             animate={{opacity: [0, 1]}}
        //             transition={{duration: '0.5', delay: i/pools.length}}
        //             className='w-full rounded-md cursor-pointer' 
        //           >
        //             <PoolColumn {...{ pool }} />
        //           </motion.button>
        //         </Grid>
        //       ))
        //     }
        // </Grid> 