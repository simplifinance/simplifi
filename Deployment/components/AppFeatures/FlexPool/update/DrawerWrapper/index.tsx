import React from "react";
import { flexSpread, } from "@/constants";
import { Contributor } from './Contributor';
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import { Address, RekeyParam, FormattedCData, FormattedPoolData, } from "@/interfaces";
import Drawer from "../ActionButton/Confirmation/Drawer";
import { formatAddr, } from "@/utilities";
import LiquidityAndStrategyBalances from "./LiquidityAndSafeBalances";
import AccessAndCollateralBalances from "./CollateralBalances";
import CollateralQuote from "./CollateralQuote";
import { zeroAddress } from "viem";
import { Button } from "@/components/ui/button";

const BOXSTYLING = "h-[180px] lg:h-[150px] w-full rounded-lg border border-white1/20 p-4 space-y-2 text-orange-200 bg-white1/10";

export const InfoDisplay = ({ data, actions, popUpDrawer, toggleDrawer } : InfoDisplayProps) => {
    const {
        pool: { 
            addrs: { colAsset, safe, lastPaid } ,
            low: { colCoverage, duration, allGh, },
            big: { unit, unitId,  recordId, currentPool },
            isPermissionless,
            stage,
        },
        cData,
    } = data;

    const collateralAsset = formatAddr(colAsset.toString());
    const extractAddresses = () => {
        let addrs : Address[] = [];
        cData.forEach((cd) => {
            addrs.push(formatAddr(cd.profile.id.toString()))
        });
        return addrs;
    }
    // console.log("Collateral coverage: ", colCoverage);
    const rekeyParam : RekeyParam = {
        colCoverage: colCoverage,
        durationInHours: Number(duration.toString()),
        contributors: extractAddresses(),
        allGH: allGh
    }

    return(
        <Drawer openDrawer={popUpDrawer} setDrawerState={toggleDrawer} styles={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px', color: '#fed7aa', borderLeft: '1px solid rgb(249 244 244 / 0.2)',}} >
            <div className={`space-y-4`}>
                <div className={`${flexSpread} gap-6`}>
                    <Button onClick={() => toggleDrawer(0)} className="w-2/4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </Button>
                    { actions }
                </div>
                <ul className={`bg-gray1 p-4 rounded-lg border border-white1/20 text-orange-400 font-normal text-sm`}>
                    <li className={`${flexSpread}`}>
                        <h3 className="">Asset</h3>
                        <AddressWrapper 
                            size={4} 
                            copyIconSize="4" 
                            account={colAsset || zeroAddress}
                            overrideClassName="text-md" 
                            display 
                        />
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3 className="">Safe</h3>
                        <AddressWrapper 
                            size={4} 
                            copyIconSize="4" 
                            account={safe}
                            overrideClassName="text-md" 
                            display 
                        />
                    </li>
                    <li className={`${flexSpread}`} >
                        <h3 className="">{"Financed"}</h3>
                        <p className="">{`${allGh}`}</p>
                    </li>
                    <li className={`${flexSpread}`} >
                        <h3 className="">{"RecordId"}</h3>
                        <p className="">{`${recordId.str}`}</p>
                    </li>
                </ul>
                <CollateralQuote unit={unit.big} />
                <LiquidityAndStrategyBalances
                    safe={safe}
                    collateralAsset={collateralAsset}
                    isPermissionless={isPermissionless}
                    param={rekeyParam}
                />
                <AccessAndCollateralBalances collateralAsset={collateralAsset} safe={safe}/>

                <ul className={`${BOXSTYLING} text-xs`}>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Unit Liquidity</h3>
                        <p>{`$${unit.inEther}`}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Total Pooled Liquidity</h3>
                        <p>{`$${currentPool.inEther}`}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Unit Id</h3>
                        <p>{unitId.str}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Record Id</h3>
                        <p>{recordId.str}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Last Paid</h3>
                        <AddressWrapper size={3} account={lastPaid} display />
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Stage</h3>
                        <p>{stage.inStr}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Collateral Coverage Ratio</h3>
                        <p>{colCoverage}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Duration</h3>
                        <p>{`${duration.inHour} hrs`}</p>
                    </li>
                </ul>
            </div>
        </Drawer>
    );
}

export const Contributors: React.FC<ContributorsProp> = ({popUpDrawer, isAdmin, toggleDrawer, cData}) => {
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
                    cData?.map((data, i) => (
                        <Contributor
                            data={data}
                            key={i} 
                        />
                    ))
                }
            </React.Fragment>
        </Drawer>
    );
}

interface InfoDisplayProps {
    data: FormattedPoolData;
    actions: React.ReactNode;
    popUpDrawer: number;
    toggleDrawer: (arg: number) => void;
}

interface ContributorsProp {
    cData: FormattedCData[];
    popUpDrawer: number;
    toggleDrawer: (arg: number) => void;
    isAdmin: boolean;
}