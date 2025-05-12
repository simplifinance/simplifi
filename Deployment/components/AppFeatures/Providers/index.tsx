import { Button } from "@/components/ui/button";
import { flexSpread } from "@/constants";
import Link from "next/link";
import React from "react";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, formatValue, toBigInt, toBN } from "@/utilities";
import { zeroAddress } from "viem";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { Input } from "../FlexPool/Create/Input";
import { Confirmation } from "../FlexPool/update/ActionButton/Confirmation";
import AddLiquidity from "./AddLiquidity";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";
import RemoveLiquidity from "./RemoveLiquidity";
import { HandleTransactionParam, } from "@/interfaces";
import DataTable from "./DataTable";

export default function Providers() {
    let totalLiquidity = React.useRef({value: 0n});
    const [ unitLiquidity, setUnitLiquidity ] = React.useState<string>('0');
    const [ openDrawer, setOpenDrawer ] = React.useState<number>(0);
    const [ addLiquidity, setAddLiquidity ] = React.useState<boolean>(false);

    const { address } = useAccount();
    const account = formatAddr(address);
    const config = useConfig();
    const unit = toBigInt(toBN(unitLiquidity).times('1e18').toString());
    const { toggleProviders, providersIds, } = useAppStorage();
    const hasSelectedProvider = providersIds.length > 0;
    const handleClickProvider = React.useCallback(
        (slot: bigint, amount: bigint, isSelected: boolean) => {
        const liquidity = totalLiquidity.current.value;
        if(isSelected){
            totalLiquidity.current.value = liquidity + amount;

        }else {
            if(liquidity > amount) totalLiquidity.current.value = liquidity - amount;
        }
        toggleProviders(slot);
    }, [totalLiquidity.current.value]);

    const toggleDrawer = (arg: number) => setOpenDrawer(arg);
    const transactionArgs : HandleTransactionParam = {
        commonParam: {account, config, unit},
    }
    const args = [providersIds, unit];

    const onChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.target.value;
        setUnitLiquidity(value === ''? '0' : value);
    }

    return(
        <div className="p-4 bg-white1 dark:bg-gray1 border border-green1/30 dark:border-gray1 md:rounded-xl space-y-4">
            <div className="dark:bg-green1/90 p-4 shadow-sm shadow-green1/30 rounded-lg">
                {
                    addLiquidity? 
                        <AddLiquidity back={() => setAddLiquidity(false)} /> 
                            :
                        <MotionDivWrap className={`space-y-4`}>
                            <h1 className='text-lg text-green1/80 dark:text-orange-300 font-bold'>{"Don't have enough to contribute? You can request finance from providers with competitive and low interest rate"}</h1>
                            <div className={`${flexSpread}`}>
                                <Button variant={'outline'} className={`${flexSpread} w-full dark:bg-green1/90 `}>
                                    <Link href={'https://simplifinance.gitbook.io/docs'}>Learn more</Link>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </Button>
                                <Button variant={'outline'} onClick={() => setAddLiquidity(true)} className={`w-full dark:bg-green1/90 dark:text-orange-300`}>
                                    Add liquidity
                                </Button>
                            </div>
                        </MotionDivWrap>
                }
            </div>
            <div className="dark:bg-green1/90 p-4 space-y-4 ring-offset-8 shadow-sm shadow-green1/30 rounded-lg">
                <div className={`${flexSpread} max-w-sm text-xs overflow-auto font-bold`}>
                    <div className={`${flexSpread} gap-2`}>
                        <h3>Amount</h3>
                        <h3>{unitLiquidity}</h3>
                    </div>
                    <h3>{ !hasSelectedProvider? <span className="text-red-400">Please choose provider</span> : <h3 className={`${totalLiquidity.current.value > unit && 'text-red-400' }`}>{formatValue(totalLiquidity.current.value).toStr}</h3>}</h3>
                </div>
                {
                   hasSelectedProvider && <div className={`${flexSpread} gap-2`}>
                        <Input 
                            id="UnitLiquidity"
                            required
                            type="number"
                            label=""
                            placeholder="Should be your unit contribution"
                            onChange={onChange}
                            toolTipTitle="Liquidity amount you wish to borrow"            
                        />
                        <Button variant={'ghost'} onClick={() => toggleDrawer(1)} className="bg-green1/90 text-orange-200">Submit</Button>
                    </div>
                }

            </div>
            <div className="relative dark:bg-green1/90 p-4 space-y-2 shadow-sm shadow-green1/30 rounded-lg max-h-[500px] overflow-auto">
                <div className={`w-full max-w-sm ${flexSpread}`}>
                    <h3 className="font-bold">Pick your providers</h3>
                    <RemoveLiquidity />
                </div>
                <DataTable 
                    currentUser={account}
                    providerSlots={providersIds}
                    onCheckboxClicked={handleClickProvider}
                />
            </div>
            <Confirmation 
                functionName='borrow'
                args={args}
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                back={() => setOpenDrawer(0)}
                transactionArgs={transactionArgs}
            />
        </div>
    )
}
