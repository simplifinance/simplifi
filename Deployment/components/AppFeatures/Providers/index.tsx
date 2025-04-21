import { Button } from "@/components/ui/button";
import { flexSpread } from "@/constants";
import Link from "next/link";
import React from "react";
import getReadFunctions from "../FlexPool/update/DrawerWrapper/readContractConfig";
import { useAccount, useConfig, useReadContract } from "wagmi";
import { Loading, NotFound } from "../FlexPool/PoolWrapper/Nulls";
import { motion } from "framer-motion";
import { formatAddr, formatValue, toBigInt, toBN } from "@/utilities";
import { parseEther, zeroAddress } from "viem";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import Checkbox from "@mui/material/Checkbox";
import { Input } from "../FlexPool/Create/Input";
import { Confirmation } from "../FlexPool/update/ActionButton/Confirmation";
import AddLiquidity from "./AddLiquidity";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";
import RemoveLiquidity from "./RemoveLiquidity";
import { HandleTransactionParam } from "@/interfaces";

export default function Providers() {
    let totalLiquidity = React.useRef({value: 0n});
    const [ unitLiquidity, setUnitLiquidity ] = React.useState<string>('0');
    const [ openDrawer, setOpenDrawer ] = React.useState<number>(0);
    const [ addLiquidity, setAddLiquidity ] = React.useState<boolean>(false);

    const { address, chainId } = useAccount();
    const account = formatAddr(address);
    const config = useConfig();
    const { getProvidersConfig } = getReadFunctions({chainId});
    const { data, isPending, isError, isLoading } = useReadContract({...getProvidersConfig()});
    const { toggleProviders, providersIds, } = useAppStorage();
    const hasSelectedProvider = providersIds.length > 0;
    const handleClickProvider = ({slot, amount}: {slot: bigint, amount: bigint}) => {
        totalLiquidity.current.value += amount;
        toggleProviders(slot);
    };

    console.log("Data", data)
    const toggleDrawer = (arg: number) => setOpenDrawer(arg);
    const transactionArgs : HandleTransactionParam = {
        commonParam: {account, config, contractAddress: zeroAddress, unit: parseEther(unitLiquidity)},
        txnType: 'Borrow',
        providersSlots: providersIds,
    }

    const onChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setUnitLiquidity(e.target.value);
    }

    const renderProviders = () => {
        if(!data || data?.length === 0 || isError) {
            return ( 
                <NotFound 
                    errorMessage="No Provider"
                    position="relative"
                />
            );
        }
        return(
            <div className="w-full max-w-sm">
                <div className="grid grid-cols-5 max-w-sm bg-green1/90 p-1 rounded-lg">
                    <div className="bg-gray1 p-2 rounded-lg text-center">Select</div>
                    <div className="bg-gray1 p-2 rounded-lg text-center">Slot ID</div>
                    <div className="bg-gray1 p-2 rounded-lg">Liquidity</div>
                    <div className="bg-gray1 p-2 rounded-lg">Rate</div>
                    <div className="bg-gray1 p-2 rounded-lg">Actions</div>
                </div>
                <div>
                {/* <RemoveLiquidity  /> */}
                    { (isPending || isLoading || !data) && <Loading /> }
                    {
                        data && data.map(({slot, account, amount, rate}, index) => (
                            <motion.div
                                onClick={() => handleClickProvider({slot, amount})}
                                initial={{opacity: 0}}
                                animate={{opacity: [0, 1]}}
                                transition={{duration: '0.5', delay: index/data.length}}
                                className={` w-full rounded-md cursor-pointer grid grid-cols-3 max-w-sm ${providersIds.includes(slot) && 'bg-gray1'}`} 
                            >
                                <div className="place-items-center">
                                    <Checkbox 
                                        checked={providersIds.includes(slot)}
                                    />
                                </div>
                                <div className="text-center">{slot.toString()}</div>
                                <div className="text-center">{formatValue(amount)}</div>
                                <div className="text-center">{toBN(rate.toString()).div(100).toString()}</div>
                                <div>{ account === formatAddr(address) && <RemoveLiquidity  />}</div>
                            </motion.div>
                        ))
                    }
                    
                </div>
            </div>
        );
    }

    return(
        <div className="minHeight p-4 bg-white1 dark:bg-gray1 border border-green1/30 dark:border-gray1 md:rounded-xl space-y-4">
            <div className="dark:bg-green1/90 p-4 shadow-sm shadow-green1/30 rounded-lg">
                {
                    addLiquidity? 
                        <AddLiquidity back={() => setAddLiquidity(false)} /> 
                            :
                        <MotionDivWrap className={`grid grid-cols-2 `}>
                            <div>
                                <h1 className='text-md text-green1/80 dark:text-white1 font-bold'>{"Don't have enough to contribute? You can borrow from providers with low interest rate"}</h1>
                            </div>
                            <div className="space-y-4">
                                <Button className={`${flexSpread} w-full bg-green1/90 dark:bg-white1 dark:text-green1/90`}>
                                    <Link href={'https://simplifinance.gitbook.io/docs'}>Learn more</Link>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </Button>
                                <Button onClick={() => setAddLiquidity(true)} className={`w-full bg-green1/90 dark:bg-white1 dark:text-green1/90`}>
                                    Add liquidity
                                </Button>
                            </div>
                        </MotionDivWrap>
                }
            </div>
            <div className={`${flexSpread} max-w-sm overflow-auto`}>
                <Button variant={'outline'} className={`${flexSpread} gap-2 cursor-not-allowed`}>
                    <h3>Amount</h3>
                    <h3>{unitLiquidity}</h3>
                </Button>
                <Button variant={'outline'} className="cursor-not-allowed">{ !hasSelectedProvider? <h3 className="text-red-400">Please select provider</h3> : <h3 className={`${totalLiquidity.current.value > toBigInt(unitLiquidity) && 'text-red-400' }`}>{formatValue(totalLiquidity.current.value)}</h3>}</Button>
            </div>
            {
                !hasSelectedProvider && <div className={`${flexSpread} gap-2`}>
                    <Input 
                        id="UnitLiquidity"
                        required
                        type="number"
                        label=""
                        placeholder="Should be your unit contribution"
                        onChange={onChange}
                        toolTipTitle="Liquidity amount you wish to borrow"            
                    />
                    <Button onClick={() => toggleDrawer(1)} className="bg-green1/90 text-orange-300">Submit</Button>
                </div>
            }
            <h3 className="font-bold">Pick your providers</h3>
            {/* <RemoveLiquidity  /> */}
            <div className="p-4">
                { renderProviders() }
            </div>
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                back={() => setOpenDrawer(0)}
                transactionArgs={transactionArgs}
            />
        </div>
    )
}
