import React from "react";
import { flexSpread, } from "@/constants";
import { Contributor } from './Contributor';
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import { Address, RekeyParam, FormattedCData, FormattedPoolData, } from "@/interfaces";
import Drawer from "../ActionButton/Confirmation/Drawer";
import { formatAddr, } from "@/utilities";
import LiquidityAndStrategyBalances from "./LiquidityAndSafeBalances";
// import AccessAndCollateralBalances from "./CollateralBalances";
import CollateralQuote from "./CollateralQuote";
import { zeroAddress } from "viem";
import { Button } from "@/components/ui/button";
import DrawerHeader from "@/components/utilities/DrawerHeader";

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
    const rekeyParam : RekeyParam = {
        colCoverage: colCoverage,
        durationInHours: Number(duration.toString()),
        contributors: extractAddresses(),
        allGH: allGh
    }

    return(
        <Drawer
            title="Pool Information"
            onClickAction={() => toggleDrawer(0)}
            openDrawer={popUpDrawer} 
            setDrawerState={toggleDrawer} 
        >
            <div className={`space-y-4 md:space-y-4`}>
                { actions }
                <ul className={`bg-white1 dark:bg-gray1 p-4 rounded-lg text-orange-200 font-normal text-sm`}>
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
                {/* <AccessAndCollateralBalances collateralAsset={collateralAsset} safe={safe}/> */}

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

export const Contributors: React.FC<ContributorsProp> = ({popUpDrawer, toggleDrawer, cData}) => {
    return(
        <Drawer 
            title="Contributors"
            openDrawer={popUpDrawer} 
            setDrawerState={toggleDrawer} 
            onClickAction={() => toggleDrawer(0)}
        >
            <div className=" bg-white1/60 dark:bg-green1/90 border p-4 space-y-4 rounded-lg">
                <div>
                    {
                        cData?.map((data, i) => (
                            <Contributor
                                data={data}
                                key={i} 
                            />
                        ))
                    }
                </div>
            </div>
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