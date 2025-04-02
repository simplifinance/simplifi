import React from "react";
import { flexSpread, FuncTag, } from "@/constants";
import { Provider } from './Provider';
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import { Address, FormattedData, FormattedPoolContentProps, } from "@/interfaces";
import Drawer from "../ActionButton/Confirmation/Drawer";
import { formatAddr, } from "@/utilities";
import LiquidityAndStrategyBalances, { RekeyParam } from "./LiquidityAndBankBalances";
import AccessAndCollateralBalances from "./AccessAndCollateralBalances";
import CollateralQuote from "./CollateralQuote";
import { useAccount } from "wagmi";
import { getContractData } from "@/apis/utils/getContractData";

const BOXSTYLING = "h-[180px] lg:h-[150px] w-full rounded-lg border border-white1/20 p-4 space-y-2 text-orange-200 bg-white1/10";

export const InfoDisplay = ({ formattedPool, actions, popUpDrawer, toggleDrawer } : InfoDisplayProps) => {
    const { chainId,} = useAccount();
    const { token, currency } = getContractData(chainId || 4157);
    const {
        unitInEther,
        currentPoolInEther,
        unitIdToNumber,
        allGhToNumber,
        quorumToNumber,
        cDataFormatted,
        colCoverageInString,
        intPercentString,
        durationToNumber,
        fullInterestInEther,
        intPerSecInEther,
        stageToNumber,
        lastPaid,
        isPermissionless,
        formattedSafe,
        unit_bigint,
        rId,
        // isAdmin
    } = formattedPool;

    const extractAddresses = () => {
        let addrs : Address[] = [];
        cDataFormatted.forEach((cd) => {
            addrs.push(formatAddr(cd.idToString))
        });
        return addrs;
    }
    const rekeyParam : RekeyParam = {
        colCoverage: Number(colCoverageInString),
        durationInHours: durationToNumber,
        intRate: Number(intPercentString),
        contributors: extractAddresses(),
        allGH: allGhToNumber
    }

    return(
        <Drawer openDrawer={popUpDrawer} setDrawerState={toggleDrawer} styles={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px', color: '#fed7aa', borderLeft: '1px solid rgb(249 244 244 / 0.2)',}} >
            <div className={`space-y-4`}>
                <div className={`${flexSpread} gap-6`}>
                    <button onClick={() => toggleDrawer(0)} className="w-2/4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    { actions }
                </div>
                <ul className={`bg-gray1 p-4 rounded-lg border border-white1/20 text-orange-400 font-normal text-sm`}>
                    <li className={`${flexSpread}`}>
                        <h3 className="">Asset</h3>
                        <AddressWrapper 
                            size={4} 
                            copyIconSize="4" 
                            account={token}
                            overrideClassName="text-md" 
                            display 
                        />
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3 className="">Bank</h3>
                        <AddressWrapper 
                            size={4} 
                            copyIconSize="4" 
                            account={formattedSafe}
                            overrideClassName="text-md" 
                            display 
                        />
                    </li>
                    <li className={`${flexSpread}`} >
                        <h3 className="">{"Financed"}</h3>
                        <p className="">{`${allGhToNumber}`}</p>
                    </li>
                    <li className={`${flexSpread}`} >
                        <h3 className="">{"Reserved Id"}</h3>
                        <p className="">{`${rId.toString()}`}</p>
                    </li>
                </ul>
                <CollateralQuote unit={unit_bigint} />
                <LiquidityAndStrategyBalances
                    formattedSafe={formattedSafe}
                    isPermissionless={isPermissionless}
                    param={rekeyParam}
                    isCancelledPool={quorumToNumber === 0 && stageToNumber === FuncTag.ENDED}
                    handleCloseDrawer={() => toggleDrawer(0)}
                />

                <AccessAndCollateralBalances 
                    formattedSafe={formattedSafe}
                    handleCloseDrawer={() => toggleDrawer(0)}
                    rId={rId}
                />

                <ul className={`${BOXSTYLING} text-xs`}>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Unit Liquidity</h3>
                        <p>{`$${unitInEther}`}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Total Pooled Liquidity</h3>
                        <p>{`$${currentPoolInEther}`}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Unit Id</h3>
                        <p>{unitIdToNumber}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Last Paid</h3>
                        <AddressWrapper size={3} account={lastPaid} display />
                    </li>
                </ul>
                <ul className={`${BOXSTYLING} text-xs`}>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Interest Percent</h3>
                        <p>{intPercentString}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Collateral Coverage Ratio</h3>
                        <p>{colCoverageInString}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Duration</h3>
                        <p>{`${durationToNumber} hrs`}</p>
                    </li>
                </ul>

                <ul className={`${BOXSTYLING} text-xs`}>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>{"Int/Sec"}</h3>
                        <p className="px-2 text-xs md:textsm">{`${intPerSecInEther} ${currency}`}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Full Interest</h3>
                        <p>{`${fullInterestInEther} ${currency}`}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Stage</h3>
                        <p>{FuncTag[stageToNumber]}</p>
                    </li>
                </ul>
            </div>
        </Drawer>
    );
}

export const Providers: React.FC<ProvidersProps> = ({popUpDrawer, isAdmin, toggleDrawer, cDataFormatted}) => {
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
                    cDataFormatted.map((data, i) => (
                        <Provider
                            formattedData={data}
                            key={i} 
                            index={i}
                            isAdmin={isAdmin}
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
    cDataFormatted: FormattedData[];
    popUpDrawer: number;
    toggleDrawer: (arg: number) => void;
    isAdmin: boolean;
}