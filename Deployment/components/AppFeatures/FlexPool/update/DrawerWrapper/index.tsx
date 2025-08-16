import React from "react";
import { flexSpread, } from "@/constants";
import { Contributor } from './Contributor';
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import { FormattedCData, FormattedPoolData, } from "@/interfaces";
import Drawer from "../ActionButton/Confirmation/Drawer";
import BalancesAndCollaterals from "./BalancesAndCollaterals";
import { zeroAddress } from "viem";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";

const BOXSTYLING = "w-full rounded-lg border border-b-4 p-4 space-y-2 dark:text-orange-200";

export const InfoDisplay = ({ data, actions, popUpDrawer, toggleDrawer } : InfoDisplayProps) => {
    const { symbol } = useAppStorage();
    const {
        pool: { 
            addrs: { colAsset, safe, lastPaid } ,
            low: { colCoverage, duration, allGh, },
            big: { unit, unitId,  recordId, currentPool },
            stage,
        },
    } = data;

    // const collateralAsset = formatAddr(colAsset.toString());
    // const extractAddresses = () => {
    //     let addrs : Address[] = [];
    //     cData.forEach((cd) => {
    //         addrs.push(formatAddr(cd.profile.id.toString()))
    //     });
    //     return addrs;
    // }
    // const rekeyParam : RekeyParam = {
    //     colCoverage: colCoverage,
    //     durationInHours: Number(duration.toString()),
    //     contributors: extractAddresses(),
    //     allGH: allGh
    // }

    return(
        <Drawer
            title="Pool Information"
            onClickAction={() => toggleDrawer(0)}
            openDrawer={popUpDrawer} 
            setDrawerState={toggleDrawer} 
        >
            <div className={`space-y-4 md:space-y-4`}>
                <div>{ actions }</div>
                <ul className={`bg-white1 dark:bg-transparent border border-b-4 p-4 rounded-lg dark:text-orange-300 space-y-2 font-medium `}>
                    <li className={`${flexSpread}`}>
                        <h3>{`Collateral denom : ${symbol}`}</h3>
                        <AddressWrapper
                            size={4}
                            copyIconSize="4" 
                            account={colAsset || zeroAddress}
                            overrideClassName="text-md" 
                            display 
                        />
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3 className="">Pool Safe</h3>
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

                <BalancesAndCollaterals unit={unit.big} safe={safe} collateralAsset={colAsset} />
                
                <ul className={`${BOXSTYLING} text-sm font-medium `}>
                    <li className={`w-full max-w-sm  ${flexSpread}`}>
                        <h1>{'Unit Id:'}</h1>
                        <p>{unitId.str}</p>
                    </li>
                    <li className={`w-full max-w-sm ${flexSpread}`}>
                        <h3>Contribution per user</h3>
                        <p>{`$${unit.inEther}`}</p>
                    </li>
                    <li className={`w-full max-w-sm ${flexSpread}`}>
                        <h3>Total contributed</h3>
                        <p>{`$${currentPool.inEther}`}</p>
                    </li>
                    <li className={`w-full max-w-sm ${flexSpread}`}>
                        <h3>Pool Id</h3>
                        <p>{unitId.str}</p>
                    </li>
                    <li className={`w-full max-w-sm ${flexSpread}`}>
                        <h3>Record Id</h3>
                        <p>{recordId.str}</p>
                    </li>
                    <li className={`w-full max-w-sm ${flexSpread}`}>
                        <h3>Last Paid</h3>
                        <AddressWrapper size={3} account={lastPaid} display />
                    </li>
                    <li className={`w-full max-w-sm ${flexSpread}`}>
                        <h3>Stage</h3>
                        <p>{stage.inStr}</p>
                    </li>
                    <li className={`w-full max-w-sm ${flexSpread}`}>
                        <h3>Collateral Coverage Ratio</h3>
                        <p>{colCoverage}</p>
                    </li>
                    <li className={`w-full max-w-sm ${flexSpread}`}>
                        <h3>Duration</h3>
                        <p>{`${duration.inHour} ${duration.inHour > 1? 'hrs' : 'hr'}`}</p>
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