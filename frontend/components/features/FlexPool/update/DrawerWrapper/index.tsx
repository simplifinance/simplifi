import React from "react";
import { flexSpread, } from "@/constants";
import { Provider } from './Provider';
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { Address, FormattedData, FormattedPoolContentProps, FuncTag, } from "@/interfaces";
import Drawer from "../ActionButton/Confirmation/Drawer";
import { useAccount, } from "wagmi";
import { formatAddr, } from "@/utilities";
import LiquidityAndStrategyBalances, { RekeyParam } from "./LiquidityAndStrategyBalances";

const BOXSTYLING = "h-[180px] lg:h-[150px] w-full rounded-lg border border-white1/20 p-4 space-y-2 text-orange-200 bg-white1/10";

export const InfoDisplay = ({ formattedPool, actions, popUpDrawer, toggleDrawer } : InfoDisplayProps) => {
    const { address, isConnected } = useAccount();
    const account = formatAddr(address);

    const {
        unit_InEther,
        currentPool_InEther,
        epochId_toNumber,
        allGh_toNumber,
        // asset,
        quorum_toNumber,
        cData_formatted,
        colCoverage_InString,
        intPercent_string,
        duration_toNumber,
        fullInterest_InEther,
        intPerSec_InEther,
        stage_toNumber,
        lastPaid,
        isPermissionless,
        formatted_strategy,
    } = formattedPool;

    const extractAddresses = () => {
        let addrs : Address[] = [];
        cData_formatted.forEach((cd) => {
            addrs.push(formatAddr(cd.id_toString))
        });
        return addrs;
    }
    const rekeyParam : RekeyParam = {
        colCoverage: Number(colCoverage_InString),
        durationInHours: duration_toNumber,
        intRate: Number(intPercent_string),
        contributors: extractAddresses(),
        allGH: allGh_toNumber
    }

    return(
        <Drawer openDrawer={popUpDrawer} setDrawerState={toggleDrawer} styles={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px', color: '#fed7aa', borderLeft: '1px solid rgb(249 244 244 / 0.2)',}} >
            <div className={`space-y-4 uppercase`}>
                <div className={`${flexSpread} gap-6`}>
                    <button onClick={() => toggleDrawer(0)} className="w-2/4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    { actions }
                </div>
                <ul className={`bg-gray1 p-4 rounded-lg border border-white1/20 text-orange-400 font-bold text-sm`}>
                    <li className={`${flexSpread}`}>
                        <h3 className="">Asset</h3>
                        <p className="">{'USDT'}</p>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3 className="">Strategy</h3>
                        <AddressWrapper 
                            size={4} 
                            copyIconSize="4" 
                            account={account}
                            overrideClassName="text-xl" 
                            display 
                        />
                    </li>
                    <li className={`${flexSpread}`} >
                        <h3 className="">{"Financed"}</h3>
                        <p className="">{`${allGh_toNumber}`}</p>
                    </li>
                </ul>
                <LiquidityAndStrategyBalances
                    formatted_strategy={formatted_strategy}
                    isPermissionless={isPermissionless}
                    param={rekeyParam}
                    isCancelledPool={quorum_toNumber === 0 && stage_toNumber === FuncTag.ENDED}
                    handleCloseDrawer={() => toggleDrawer(0)}
                    stage={stage_toNumber}
                />

                <ul className={`${BOXSTYLING} text-xs`}>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>Unit Liquidity</h3>
                        <p>{`$${unit_InEther}`}</p>
                    </li>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>Total Pooled Liquidity</h3>
                        <p>{`$${currentPool_InEther}`}</p>
                    </li>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>Epoch Id</h3>
                        <p>{epochId_toNumber}</p>
                    </li>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>Last Paid</h3>
                        <AddressWrapper size={3} account={lastPaid} display />
                    </li>
                </ul>
                <ul className={`${BOXSTYLING} text-xs`}>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>Interest Percent</h3>
                        <p>{intPercent_string}</p>
                    </li>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>Collateral Coverage Ratio</h3>
                        <p>{colCoverage_InString}</p>
                    </li>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>Duration</h3>
                        <p>{`${duration_toNumber} hrs`}</p>
                    </li>
                </ul>

                <ul className={`${BOXSTYLING} text-xs`}>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>{"Int/Sec"}</h3>
                        <p className="px-2 text-xs md:textsm">{`${intPerSec_InEther} XFI`}</p>
                    </li>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>Full Interest</h3>
                        <p>{`${fullInterest_InEther} XFI`}</p>
                    </li>
                    <li className={`w-full ${flexSpread} font-semibold`}>
                        <h3>Stage</h3>
                        <p>{FuncTag[stage_toNumber]}</p>
                    </li>
                </ul>
            </div>
        </Drawer>
    );
}

export const Providers: React.FC<ProvidersProps> = ({popUpDrawer, toggleDrawer, cData_formatted}) => {
    return(
        <Drawer openDrawer={popUpDrawer} setDrawerState={toggleDrawer} styles={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px', color: '#fed7aa', borderLeft: '1px solid rgb(249 244 244 / 0.3)', height: "100%"}} >
            <div className="p-0 flex justify-between items-center text-lg md:text-xl font-bold">
                <h3>Providers</h3>
                <button onClick={() => toggleDrawer(0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <React.Fragment>
                {
                    cData_formatted.map((item, i) => (
                        <Provider
                            formattedData={item}
                            key={i} 
                            index={i}
                        />
                    ))
                }
            </React.Fragment>
        </Drawer>
    );
}

interface InfoDisplayProps {
    formattedPool: FormattedPoolContentProps;
    actions: React.ReactNode;
    popUpDrawer: number;
    toggleDrawer: (arg: number) => void;
}

interface ProvidersProps {
    cData_formatted: FormattedData[];
    popUpDrawer: number;
    toggleDrawer: (arg: number) => void;
}