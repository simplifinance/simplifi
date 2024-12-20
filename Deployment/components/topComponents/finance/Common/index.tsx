import React from "react";
import Grid from '@mui/material/Grid';
import { PoolType, type LiquidityPool } from '@/interfaces';
import { motion } from 'framer-motion';
import { flexSpread, } from "@/constants";
import { PoolColumn } from "../PoolColumn";
import useAppStorage from '@/components/StateContextProvider/useAppStorage';
import filterPools, { type Operation } from "../commonUtilities";
import ButtonTemplate from "@/components/OnboardScreen/ButtonTemplate";
import { CustomButton } from "@/components/CustomButton";

export const Common : React.FC<{heroTitle2: string, operation: Operation}> = ({heroTitle2, operation}) => {
  const [isPermissioned, setPermissionType] = React.useState<boolean>(false);
  const { storage: { pools } } = useAppStorage();
  const { open, closed } = filterPools(pools);
  const filtered = operation === 'Open'? open : closed;

  return(
    <div className='space-y-4'>
      <div className="flex justify-between items-start md:items-center">
        <div className="flex bg-green1 p-1 rounded-[26px]">
          <CustomButton
            disabled={false}
            overrideClassName={`${isPermissioned? 'bg-gray1' : 'bg-green1'} p-3 rounded-l-full ${!isPermissioned && 'hover:shadow-sm hover:shadow-orange-200 animate-none text-xs md:text-md uppercase'}`}
            handleButtonClick={() => setPermissionType(true)}
          >
            Permissioned
          </CustomButton>
          <CustomButton
            disabled={false}
            overrideClassName={`w-full ${!isPermissioned? 'bg-gray1' : 'bg-green1'} p-3 rounded-r-full ${!isPermissioned && 'hover:shadow-sm hover:shadow-orange-200 text-xs md:text-md uppercase'}`}
            handleButtonClick={() => setPermissionType(false)}
          >
            Permissionless
          </CustomButton>
        </div>
        {/* <h3 className='text-[36px] w-2/4 md:w-full md:text-[50px] font-black text-orange-300 text-left '>{heroTitle2}</h3> */}
        <ul className={`text-[12px] w-2/4 md:w-full md:text-[16px] font-semibold text-orange-200 ${flexSpread} md:gap-6`}>
          <li className={`flex flex-col justify-center items-center text-center`}>
            <h3 className={"bg-green1 p-2 size-10 text-center rounded-full"}>{pools.length}</h3>
            <h3>Onchain Pools</h3>
          </li>
          <li className={`flex flex-col justify-center items-center text-center`}>
            <h1 className="bg-green1 p-2 size-10 text-center rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-orange-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </h1>
              <p>Private providers</p>               
          </li>
          <li className={`flex flex-col justify-center items-center text-center`}>
            <h1 className="bg-green1 p-2 size-10 text-center rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </h1>
            <p>Public providers</p>               
          </li>
        </ul>
      </div>
      {
        (!filtered?.length || filtered?.length === 0)?
          <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center text-center">
            <h1>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[150px] md:size-[250px] text-green1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
            </h1>
            <h1 className="text-2xl md:text-[36px] text-orange-300 font-black">{`Found 0 ${heroTitle2} Pool`}</h1>
          </div>
            :
          <Grid container xs={"auto"} spacing={2}>
            {
              filtered?.map((pool: LiquidityPool, i) => (
                <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
                  <motion.button
                    initial={{opacity: 0}}
                    animate={{opacity: [0, 1]}}
                    transition={{duration: '0.5', delay: i/pools.length}}
                    className='w-full rounded-md cursor-pointer' 
                  >
                    <PoolColumn {...{ pool }} />
                  </motion.button>
                </Grid>
              ))
            }
          </Grid> 
      }
    </div>
  );
}



// const renderPool = (pool: LiquidityPool, operation: Operation) => {
//   const stage = toBN(pool.stage.toString()).toNumber();

//     const quorumIsZero = stage === FuncTag.ENDED || (stage === FuncTag.ENDED && toBN(pool.uints.quorum.toString()).isZero());
//     // const poolIsZero = toBN(pool.uint256s.currentPool.toString()).isZero();
//     const allGH = toBN(pool.allGh.toString()).eq(toBN(pool.userCount._value.toString())) && stage === FuncTag.ENDED;
//     const isClosed : boolean = allGH || quorumIsZero;

//     return operation === 'Closed'? isClosed? <PoolColumn {...{ pool }} /> : null : !isClosed? <PoolColumn {...{ pool }} /> : null;
// }