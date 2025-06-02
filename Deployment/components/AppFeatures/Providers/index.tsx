import { Button } from "@/components/ui/button";
import { flexSpread, flexStart } from "@/constants";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";
import { formatAddr, toBigInt, toBN } from "@/utilities";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { Input } from "../FlexPool/Create/Input";
import AddLiquidity from "./AddLiquidity";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";
import DataTable from "./DataTable";
import RemoveLiquidity from "../FlexPool/update/transactions/RemoveLiquidity";
import Borrow from "../FlexPool/update/transactions/Borrow";

export default function Providers() {
    const [ unitLiquidity, setUnitLiquidity ] = React.useState<string>('0');
    const [ openDrawer, setOpenDrawer ] = React.useState<number>(0);
    const [ addLiquidity, setAddLiquidity ] = React.useState<boolean>(false);
    const [ totalLiquidity, setTotalLiquidity ] = React.useState<bigint>(0n);

    const { address } = useAccount();
    const account = formatAddr(address);
    const unit = toBigInt(toBN(unitLiquidity).times('1e18').toString());
    const { toggleProviders, providersIds, } = useAppStorage();
    const hasSelectedProvider = providersIds.length > 0;
    const handleClickProvider = React.useCallback(
        (slot: bigint, amount: bigint, isSelected: boolean) => {
        if(isSelected){
            setTotalLiquidity((prev) => prev + amount);
        } else {
            if(totalLiquidity > amount) setTotalLiquidity((prev) => prev - amount);
        }
        toggleProviders(slot);
    }, [toggleProviders, totalLiquidity]);

    const toggleDrawer = (arg: number) => setOpenDrawer(arg);
    const args = [providersIds, unit];

    const onChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.target.value;
        setUnitLiquidity(value === ''? '0' : value);
    }

    return(
        <div className="p-4 bg-white1 dark:bg-gray1 border-r border-r-green1/20 dark:border-gray1 space-y-4">
            <div>
                { addLiquidity && <AddLiquidity back={() => setAddLiquidity(false)} /> }
                {
                    !addLiquidity &&
                        <div className={`${flexStart}`}>
                            <MotionDivWrap className={`w- bg-white2/50 dark:bg-green1/30 p-4 rounded-lg grid md:grid-cols-2 gap-2`}>
                                <div className={`space-y-2`}>
                                    <h3 className="font-bold dark:text-orange-300">{`Own stablecoin sitting idle in your wallet?`}</h3>
                                    <p>Engage in wise saving by depositing your idle stablecoin to the providers pool setting your preferred rate. This earns you profits when contributors borrow from it</p>
                                    <div className={`space-y-4`}>
                                        <h3>Pay attention to the <strong className="text-orange-400">Cancellation risk</strong></h3>
                                        <Button variant={'outline'} className={`${flexSpread} max-w-sm dark:bg-green1/90`}>
                                            <Link href={'https://simplifinance.gitbook.io/docs'}>Learn more</Link>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold dark:text-orange-300">{'Are you a contributors?'}</h3>
                                        <p>Don't have enough stablecoin to contribute to a pool, select a provider, enter an amount, and you will be funded. For large amount, you can select multiple providers</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className={`${flexSpread}`}>
                                        <h3 className="font-bold text-green1/80 dark:text-orange-300">Providers only</h3>
                                        <RemoveLiquidity />
                                    </div>
                                    <div className="bg-white1 dark:bg-green1/60 p-4 space-y-4 rounded-lg">
                                        <h3 className="font-bold">Add Liquidity</h3>
                                        <AddLiquidity back={() => setAddLiquidity(false)} />
                                    </div>
                                </div>
                            </MotionDivWrap>
                        </div>
                }
            </div>
            <div className="relative dark:bg-green1/90 p-4 space-y-2 shadow-sm shadow-green1/30 rounded-lg max-h-[500px] overflow-auto">
                <div className={`w-full ${flexSpread}`}>
                    <h3 className="font-bold">Select providers</h3>
                    <div className="dark:bg-green1/90 p-4 space-y-4 ">
                        {!hasSelectedProvider && <h3 className="text-orangec dark:text-orange-300 t">{"No provider was selected!"}</h3>} 
                        {
                            hasSelectedProvider && <div className={`${flexSpread} gap-2`}>
                                <Input 
                                    id="UnitLiquidity"
                                    required
                                    type="number"
                                    inputValue={unitLiquidity}
                                    placeholder="Enter amount"
                                    onChange={onChange}
                                    toolTipTitle="Total amount you wish to contribute"            
                                />
                                <Button variant={'ghost'} onClick={() => toggleDrawer(1)} className="bg-green1/90 text-orange-200">Submit</Button>
                            </div>
                        }

                    </div>
                    
                </div>
                <DataTable 
                    currentUser={account}
                    providerSlots={providersIds}
                    onCheckboxClicked={handleClickProvider}
                />
            </div>
            <Borrow 
                args={args}
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                unit={unit}
            />
        </div>
    )
}
