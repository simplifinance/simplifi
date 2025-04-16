import React from "react";
import { flexSpread, Stage,  } from "@/constants";
import { Contributor } from './Contributor';
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import { Address, RekeyParam, FormattedCData, FormattedPoolData, } from "@/interfaces";
import Drawer from "../ActionButton/Confirmation/Drawer";
import { formatAddr, } from "@/utilities";
import LiquidityAndStrategyBalances from "./LiquidityAndSafeBalances";
import AccessAndCollateralBalances from "./AccessAndCollateralBalances";
import CollateralQuote from "./CollateralQuote";
import { useAccount } from "wagmi";
// import { getContractData } from "@/apis/utils/getContractData";
import { zeroAddress } from "viem";

const BOXSTYLING = "h-[180px] lg:h-[150px] w-full rounded-lg border border-white1/20 p-4 space-y-2 text-orange-200 bg-white1/10";

export const InfoDisplay = ({ data, actions, popUpDrawer, toggleDrawer } : InfoDisplayProps) => {
    const { chainId,} = useAccount();
    // const { token, currency } = getContractData(chainId || 4157);
    const {
        pool: { 
            addrs: { colAsset, safe, lastPaid } ,
            low: { colCoverage, duration, allGh, maxQuorum, selector },
            big: { unit, unitId,  recordId, currentPool },
            isPermissionless,
            // router,
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
    console.log("Collateral coverage: ", colCoverage);
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
                        <h3 className="">{"Reserved Id"}</h3>
                        <p className="">{`${recordId.toString()}`}</p>
                    </li>
                </ul>
                <CollateralQuote unit={unit.big} />
                <LiquidityAndStrategyBalances
                    formattedSafe={safe}
                    collateralAsset={collateralAsset}
                    isPermissionless={isPermissionless}
                    param={rekeyParam}
                    isCancelledPool={stage.toNum === Stage.CANCELED}
                    handleCloseDrawer={() => toggleDrawer(0)}
                />

                <AccessAndCollateralBalances 
                    collateralAsset={collateralAsset}
                    formattedSafe={safe}
                    handleCloseDrawer={() => toggleDrawer(0)}
                    recordId={recordId.big}
                />

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
                </ul>
                <ul className={`${BOXSTYLING} text-xs`}>
                    {/* <li className={`w-full ${flexSpread}`}>
                        <h3>Interest Percent</h3>
                        <p>{intPercentString}</p>
                    </li> */}
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Collateral Coverage Ratio</h3>
                        <p>{colCoverage}</p>
                    </li>
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Duration</h3>
                        <p>{`${duration.inHour} hrs`}</p>
                    </li>
                </ul>

                <ul className={`${BOXSTYLING} text-xs`}>
                    {/* <li className={`w-full ${flexSpread}`}>
                        <h3>{"Int/Sec"}</h3>5321099538 yetunde kafayat
                        <p className="px-2 text-xs md:textsm">{`${intPerSecInEther} ${currency}`}</p>
                    </li> */}
                    {/* <li className={`w-full ${flexSpread}`}>
                        <h3>Full Interest</h3>
                        <p>{`${fullInterestInEther} ${currency}`}</p>
                    </li> */}
                    <li className={`w-full ${flexSpread}`}>
                        <h3>Stage</h3>
                        <p>{stage.inStr}</p>
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