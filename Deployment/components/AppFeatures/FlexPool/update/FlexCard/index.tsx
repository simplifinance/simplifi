import React from "react";

import { type ButtonObj, type Address, type ReadDataReturnValue, type FormattedCData, formattedMockData } from "@/interfaces";
import { formatAddr, formatPoolData } from "@/utilities";
import { flexCenter, flexSpread, getChainData, Stage } from "@/constants";
import { useAccount, } from "wagmi";
import { InfoDisplay, Contributors } from '../DrawerWrapper';
import { renderIcon } from '../Icons';
import { PermissionPopUp } from '../PermissionPopUp';
import BigNumber from "bignumber.js";
import { Button } from "@/components/ui/button";
import Contribute from "../transactions/Contribute";
import ClosePool from "../transactions/ClosePool";
import GetFinance from "../transactions/GetFinance";
import Payback from "../transactions/Payback";
import Liquidate from "../transactions/Liquidate";
import { zeroAddress } from "viem";

/**
 * Filter the data list for current user
 * @param cData : Formatted providers' data
 * @param currentUser : Connected user wallet.
 * @returns Object: <{isMember: boolean, data: FormattedData}>
 */
const filterUser = (
    cData: FormattedCData[], 
    currentUser: Address
) : FormattedCData => {
    let result : FormattedCData = formattedMockData;
    const filtered = cData.filter(({ profile }) => profile.id.toLowerCase() === currentUser.toString().toLowerCase() );
    if(filtered?.length > 0) {
        result = filtered[0];
    }
    return result;
}

export const FlexCard = (props: ReadDataReturnValue) => {
    const [infoDrawer, setShowInfo]= React.useState<number>(0);
    const [providerDrawer, setProviderDrawer]= React.useState<number>(0);
    const [permissionDrawer, setPermissionDrawer]= React.useState<number>(0);

    const { address, chainId } = useAccount();
    const account = formatAddr(address);
    const { pair } = getChainData(chainId);
    const showPermissionDetail = (arg:number) => setPermissionDrawer(arg);
    const showProviderDetails = (arg:number) => setProviderDrawer(arg);

    const formattedPoolData = formatPoolData(props);
    const {
        cData,
        pool: {
            big: { unit, unitId, currentPool },
            low: { userCount, maxQuorum, },
            addrs: { colAsset, safe, lastPaid },
            stage,
            isPermissionless,
        }
    } = formattedPoolData;

    const { profile:{ sentQuota, loan, paybackTime }, slot: { isAdmin, isMember } } = filterUser(cData, account);
    const endedOrCancelled = stage.toNum === Stage.ENDED || stage.toNum === Stage.CANCELED;
    
    // A function that when called, renders the action components with packed transaction objects
    const renderAction = React.useCallback(() => {
        let actionObj : ButtonObj = {value: 'Contribute', disable: false};
        let component : React.ReactNode = <></>;
        switch (stage.toNum) {
            case Stage.JOIN:
                if(isPermissionless){
                    if(isAdmin) {
                        if(userCount === 1) {
                            actionObj = {value: 'closePool', disable: false};
                        } else {
                            actionObj = {value: 'Wait', disable: true};
                        }
                    } else {
                        if(isMember && sentQuota){
                            actionObj = {value: 'Wait', disable: true};
                        } else {
                            actionObj = {value: 'contribute', disable: false};
                        }
                    }
                    if(actionObj.value === 'closePool') component = <ClosePool unit={unit.big} disabled={actionObj.disable} overrideButtonContent={actionObj.value} />;
                    else component = <Contribute unit={unit.big} disabled={actionObj.disable} overrideButtonContent={actionObj.value}/>;
                } else {
                    if(isAdmin) {
                        if(currentPool.big === unit.big){
                            actionObj = {value: 'closePool', disable: false};
                        } else {
                            actionObj = {value: 'Wait', disable: true};
                        }
                    } else if(isMember && !sentQuota){
                        actionObj = {value: 'contribute', disable: false};
                    } else if(isMember && sentQuota && currentPool.big === (unit.big * BigInt(maxQuorum))){
                        actionObj = {value: 'Wait', disable: true};
                    } else if(isMember && sentQuota && currentPool.big < (unit.big * BigInt(maxQuorum))) {
                        actionObj = {value: 'contribute', disable: false};
                    } else {
                        actionObj = {value: 'Not Allowed', disable: true};
                    }

                    if(actionObj.value === 'closePool') component = <ClosePool unit={unit.big} disabled={actionObj.disable} overrideButtonContent={actionObj.value} />;
                    else component = <Contribute unit={unit.big} disabled={actionObj.disable} overrideButtonContent={actionObj.value}/>;
                }
                break;
    
            case Stage.GET:
                if(isMember) {
                    actionObj = {value: 'getFinance', disable: false};
                } else {
                    actionObj = { value: 'Not Allowed', disable: true};
                }
                component = <GetFinance collateralAddress={colAsset} safe={safe} unit={unit.big} disabled={actionObj.disable} overrideButtonContent={actionObj.value}/>;
                break;
            
            case Stage.PAYBACK:
                if(isMember){
                    if(loan.inBN.gt(BigNumber(0))) actionObj = {value : 'payback', disable: false};
                    else actionObj = { value: 'Not Allowed', disable: true};
                } else {
                    if((new Date().getTime() / 1000) >  paybackTime.inSec) actionObj = { value: 'liquidate', disable: false};
                    else actionObj = { value: 'Not Allowed', disable: true};
                }
                if(actionObj.value === 'payback') component = <Payback collateralAddress={colAsset} unit={unit.big} disabled={actionObj.disable} overrideButtonContent={actionObj.value}/>;
                else component = <Liquidate lastPaid={lastPaid} collateralAddress={colAsset} safe={safe} unit={unit.big} disabled={actionObj.disable} overrideButtonContent={actionObj.value}/>
                break;
            default:
                component = <Liquidate lastPaid={zeroAddress} collateralAddress={zeroAddress} safe={zeroAddress} unit={0n} disabled={true} overrideButtonContent={'Ended'}/>
                break;
        } 
        return component;
    }, [colAsset, currentPool.big, isAdmin, isMember, isPermissionless, lastPaid, loan.inBN, maxQuorum, paybackTime.inSec, safe, sentQuota, stage.toNum, unit.big, userCount]);

    return(
        <React.Fragment>
            <div className={`relative bg-white1 dark:bg-green1 ${endedOrCancelled ? 'opacity-80 dark:opacity-70' : ''} shadow-sm shadow-green1/90 dark:shadow-none dark:border border-green1/30 p-2 md:p-4 rounded-xl space-y-2`}>
                <h1 className={`${endedOrCancelled? 'block' : 'hidden'} absolute right-2 top-2 text-xs font-semibold text-red-400 `}>ENDED</h1>
                <h2 className="absolute right-2 md:right-4 top-10 max-w-s text-lg md:text-xl font-black dark:text-orange-200">
                    {`$${unit.inEther}`}
                </h2>
                <button className={`${flexCenter} absolute top-0 left-12 w-fit rounded-full p-2 shadow-sm shadow-green1/90 dark:shadow-orange-300`} onClick={() => showPermissionDetail(1)} >
                    <span className="bg-transparent text-sm">{renderIcon(isPermissionless)}</span>
                </button>
                <div className="absolute top-0 left-2 size-8 rounded-full p-2 shadow-sm shadow-green1/90 dark:shadow-orange-300">
                    <h3 className="absolute top-0 left-0 dark:text-orange-200 font-bold text-[10px]">{userCount}</h3>
                    <button onClick={() => showProviderDetails(1)} className="bg-transparent hover:bg-transparent">
                        { 
                            isPermissionless?
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 dark:text-orange-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg> 
                                    : 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 dark:text-red-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                        
                        }
                    </button>
                </div>

                <div className="text-xs font-mediu dark:text-orange-200 pt-16 ">
                    <div className={`${flexSpread}`}>
                        <h3>Stage</h3>
                        <h3 className="uppercase">{stage.inStr}</h3>
                    </div>
                    <div className={`${flexSpread}`}>
                        <h3>{'Max. Contributors'}</h3>
                        <h3 className="uppercase">{maxQuorum}</h3>
                    </div>
                    <div className={`${flexSpread}`}>
                        <h3 className="">{'Pair:'}</h3>
                        <h3 className="uppercase">{pair}</h3>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Button
                        variant={'outline'}
                        onClick={() => setShowInfo(1)}
                        className="dark:text-white1/30 border border-green1/20 dark:border-gray1/70"
                    >
                        Info
                    </Button>
                    { renderAction() }
                </div>
            </div>
            <PermissionPopUp
                toggleDrawer={showPermissionDetail}
                popUpDrawer={permissionDrawer}
            >
                {
                    isPermissionless? 
                        "A permissionless pool is public, and open to anyone. To operate a this type of pool, you only need to provide other required parameters. Anyone is free to contribute." 
                            : 
                        "A permissioned pool is private by design. It is designed for people who are familiar with one another such as friends, families, peer groups, etc. You will need to provide the addresses of the contributors aside of yours. These addresses only can participate." 
                }
            </PermissionPopUp>
            <Contributors
                isAdmin={isAdmin}
                popUpDrawer={providerDrawer}
                toggleDrawer={showProviderDetails}
                cData={cData}
            />
            <InfoDisplay 
                data={formattedPoolData}
                popUpDrawer={infoDrawer}
                toggleDrawer={(arg) => setShowInfo(arg)}
                actions={ renderAction() } 
            />
        </React.Fragment>
    )
}
