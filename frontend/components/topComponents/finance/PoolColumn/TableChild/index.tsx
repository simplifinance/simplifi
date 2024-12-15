import React from "react";
import { flexSpread, } from "@/constants";
import { Provider } from "./Provider";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import TransactionWindow from "../RenderActions/ConfirmationPopUp/TransactionWindow";
import { FormattedData, FormattedPoolContentProps, FuncTag, VoidFunc } from "@/interfaces";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";

const BOXSTYLING = "h-[180px] lg:h-[150px] w-full rounded-lg border border-white1/20 p-4 space-y-2 text-orange-200 bg-white1/10";

export const DrawerWrapper = ({rest, openDrawer, children} : {rest?: React.CSSProperties, openDrawer: boolean, children: React.ReactNode}) => {
    return(
        <TransactionWindow openDrawer={openDrawer} styles={{background: '#121212', display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px', color: '#fed7aa', ...rest}}>
            { children }
        </TransactionWindow>
    );
}

export const InfoDisplay = ({ formattedPool, actions } : InfoDisplayProps) => {
    const {
        unit_InEther,
        currentPool_InEther,
        epochId_toNumber,
        allGh_toNumber,
        asset,
        colCoverage_InString,
        intPercent_string,
        duration_toNumber,
        fullInterest_InEther,
        intPerSec_InEther,
        stage_toNumber,
        lastPaid
     } = formattedPool;
     const {popUpDrawer, handlePopUpDrawer} = useAppStorage();
    const handleCloseWindow = () => handlePopUpDrawer('');

    return(
        <DrawerWrapper openDrawer={popUpDrawer === 'poolDetails'} rest={{borderLeft: '1px solid rgb(249 244 244 / 0.3)',}}>
            <div className={`${flexSpread} gap-6`}>
                <button onClick={handleCloseWindow} className="w-2/4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                { actions }
            </div>
            <ul className={`bg-gray1 p-4 rounded-lg border border-white1/20 text-orange-400 font-bold text-xl`}>
                <li className={`${flexSpread}`}>
                    <h3 className="">Asset</h3>
                    <p className="">{'USDT'}</p>
                </li>
                <li className={`${flexSpread}`}>
                    <h3 className="">{"C/A"}</h3>
                    <AddressWrapper 
                        size={4} 
                        copyIconSize="4" 
                        account={asset.toString()}
                        overrideClassName="text-xl" 
                        display 
                    />
                </li>
                <li className={`${flexSpread}`} >
                    <h3 className="">{"Get Fianances"}</h3>
                    <p className="">{`${allGh_toNumber}`}</p>
                </li>
            </ul>
            <ul className={`${BOXSTYLING}`}>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>Unit Liquidity</h3>
                    <p>{`$${unit_InEther}`}</p>
                </li>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>Total Pooled Liquidity</h3>
                    <p>{`$${currentPool_InEther}`}</p>
                </li>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>Epoch Id</h3>
                    <p>{epochId_toNumber}</p>
                </li>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>Last Paid</h3>
                    <AddressWrapper size={3} account={lastPaid} display />
                </li>
            </ul>
            <ul className={`${BOXSTYLING}`}>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>Interest Percent</h3>
                    <p>{intPercent_string}</p>
                </li>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>Collateral Coverage Ratio</h3>
                    <p>{colCoverage_InString}</p>
                </li>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>Duration</h3>
                    <p>{`${duration_toNumber} hrs`}</p>
                </li>
            </ul>

            <ul className={`${BOXSTYLING}`}>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>{"Int/Sec"}</h3>
                    <p className="px-2 text-xs md:textsm">{`${intPerSec_InEther} XFI`}</p>
                </li>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>Full Interest</h3>
                    <p>{`${fullInterest_InEther} XFI`}</p>
                </li>
                <li className={`w-full ${flexSpread} font-semibold text-sm `}>
                    <h3>Stage</h3>
                    <p>{FuncTag[stage_toNumber]}</p>
                </li>
            </ul>
        </DrawerWrapper>
    );
}

export const Providers: React.FC<ProvidersProps> = ({cData_formatted}) => {
    const { popUpDrawer, handlePopUpDrawer } = useAppStorage();
    const handleCloseDrawer = () => handlePopUpDrawer('');

    return(
        <DrawerWrapper openDrawer={popUpDrawer === 'providers'}>
            <div className="p-0 flex justify-between items-center text-lg md:text-xl font-bold">
                <h3>Providers</h3>
                <button onClick={handleCloseDrawer}>
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
        </DrawerWrapper>
    );
}

interface InfoDisplayProps {
    formattedPool: FormattedPoolContentProps;
    actions: React.ReactNode;
}

interface ProvidersProps {
    cData_formatted: FormattedData[];
}

{/* <Collapse in={innerCollapse} timeout="auto" unmountOnExit className={'w-full'}> */}