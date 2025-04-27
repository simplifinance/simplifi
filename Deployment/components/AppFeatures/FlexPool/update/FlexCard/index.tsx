import React from "react";
import { 
    type ButtonObj, 
    type Address, 
    type ReadDataReturnValue, 
    type FormattedCData, 
    type HandleTransactionParam, 
    type CommonParam,
    formattedMockData, 
} from "@/interfaces";
import { formatAddr, formatPoolData } from "@/utilities";
import { flexCenter, flexSpread, Stage } from "@/constants";
import { useAccount, useConfig } from "wagmi";
import { ActionButton } from "../ActionButton";
import { InfoDisplay, Contributors } from '../DrawerWrapper';
import { renderIcon } from '../Icons';
import { PermissionPopUp } from '../PermissionPopUp';
import { getContractData } from "@/apis/utils/getContractData";
import BigNumber from "bignumber.js";
import { Button } from "@/components/ui/button";

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
    const [confirmationDrawerOn, setDrawerState] = React.useState<number>(0);
    const [infoDrawer, setShowInfo]= React.useState<number>(0);
    const [providerDrawer, setProviderDrawer]= React.useState<number>(0);
    const [permissionDrawer, setPermissionDrawer]= React.useState<number>(0);
    const [buttonObj, setButtonObj] = React.useState<ButtonObj>({value: 'Contribute', disable: false});

    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const { pair } = getContractData(config.state.chainId || 4157);
    
    const showPermissionDetail = (arg:number) => setPermissionDrawer(arg);
    const showProviderDetails = (arg:number) => setProviderDrawer(arg);

    const formattedPoolData = formatPoolData(props);
    const {
        cData,
        pool: {
            big: { unit, unitId, currentPool },
            low: { userCount, maxQuorum, },
            addrs: { colAsset, safe },
            stage,
            isPermissionless,
        }
    } = formattedPoolData;

    const { profile:{ sentQuota, loan, paybackTime }, slot: { isAdmin, isMember } } = filterUser(cData, account);
    const commonParam : CommonParam = { config, account, unit: unit.big, contractAddress: colAsset,}
    const transactionArgs: HandleTransactionParam = {
        txnType: buttonObj.value,
        commonParam,
        safe
    };

    React.useEffect(() => {
        switch (stage.toNum) {
            case Stage.JOIN:
                if(isPermissionless){
                    if(isAdmin) {
                        if(userCount === 1) {
                            setButtonObj({value: 'Remove', disable: false});
                        } else {
                            setButtonObj({value: 'Wait', disable: true});
                        }
                    } else {
                        if(isMember && sentQuota){
                            setButtonObj({value: 'Wait', disable: true});
                        } else {
                            setButtonObj({value: 'Contribute', disable: false});
                        }
                    }
                } else {
                    if(isAdmin) {
                        if(currentPool.big === unit.big){
                            setButtonObj({value: 'Remove', disable: false});
                        } else {
                            setButtonObj({value: 'Wait', disable: true});
                        }
                    } else if(isMember && !sentQuota){
                        setButtonObj({value: 'Contribute', disable: false});
                    } else if(isMember && sentQuota){
                        setButtonObj({value: 'Wait', disable: true});
                    } else {
                        setButtonObj({value: 'Not Allowed', disable: true});
                    }
                }
                break;
    
            case Stage.GET:
                if(isMember) {
                    setButtonObj({value: 'GetFinance', disable: false});
                } else setButtonObj({ value: 'Not Allowed', disable: true});
                break;
            
            case Stage.PAYBACK:
                if(isMember){
                    if(loan.inBN.gt(BigNumber(0))) setButtonObj({value : 'Payback', disable: false});
                    else setButtonObj({ value: 'Not Allowed', disable: true});
                } else {
                    if((new Date().getTime() / 1000) >  paybackTime.inSec) setButtonObj({ value: 'Liquidate', disable: false});
                    else setButtonObj({ value: 'Not Allowed', disable: true});
                }
                break;
            default:
                setButtonObj({ value: 'Ended', disable: true});
                break;
        }    
    }, [stage.toNum, currentPool.big, isAdmin, isMember, isPermissionless, loan.inBN, paybackTime.inSec, sentQuota, unit.big, userCount]);

    return(
        <React.Fragment>
            <div className={`relative ${stage.toNum === Stage.ENDED || stage.toNum === Stage.CANCELED ? 'bg-gray1/70' : 'dark:bg-green1'} shadow-sm shadow-green1/90 dark:shadow-none dark:border border-green1/30 p-4 rounded-xl space-y-3`}>
                <div className="relative flex justify-between items-center">
                    <h2 className="absolute right-0 top-8 max-w-sm text-lg md:text-xl p-2 font-black dark:text-orange-200 border-r border-r-green1 w-fit">
                        {`$${unit.inEther}`}
                    </h2>
                    <div className="flex justify-between items-center gap-2 ">
                        <button className={`${flexCenter} w-fit rounded-full p-2 shadow-sm shadow-green1/90 dark:shadow-orange-300`} onClick={() => showPermissionDetail(1)} >
                            <span className="bg-transparent text-sm">{renderIcon(isPermissionless)}</span>
                        </button>
                        <div className="relative size-8 rounded-full p-2 shadow-sm shadow-green1/90 dark:shadow-orange-300">
                            <h3 className="absolute top-0 right-0 text-orange-200 text-[10px]">{userCount}</h3>
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
                    </div>
                </div>
                <div className="text-xs font-bold dark:text-orange-200 pt-8">
                    <span className={`${flexSpread}`}>
                        <h1>{'Unit Id:'}</h1>
                        <h1 className="lowercase">{unitId.str}</h1>
                    </span>
                    <div className={`${flexSpread}`}>
                        <h3>{'Stage:'}</h3>
                        <h3 className="lowercase">{stage.inStr}</h3>
                    </div>
                    <div className={`${flexSpread}`}>
                        <h3>{'maxQuorum:'}</h3>
                        <h3 className="lowercase">{maxQuorum}</h3>
                    </div>
                    <div className={`${flexSpread}`}>
                        <h3 className="">{'Pair:'}</h3>
                        <h3 className="lowercase">{pair}</h3>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Button
                        variant={'outline'}
                        onClick={() => setShowInfo(1)}
                        className="bg-green1/90 text-white1/30"
                    >
                        Info
                    </Button>
                    <ActionButton
                        buttonObj={buttonObj}
                        transactionArgs={transactionArgs}
                        setDrawerState={(arg:number) => setDrawerState(arg)}
                        confirmationDrawerOn={confirmationDrawerOn}
                    />
                </div>
            </div>
            <PermissionPopUp
                toggleDrawer={showPermissionDetail}
                popUpDrawer={permissionDrawer}
            >
                {
                    isPermissionless? 
                        "A permissionless pool is public, and open to anyone. To operate a permissionless Flexpool, simply provide the required parameters. Other providers are free to participate." 
                            : 
                        "A permissioned pool is private by nature. To operate this type of FlexPool, you should have the addresses of other providers that wish to join you in the contribution. Only predefined addresses are free to participate." 
                }
            </PermissionPopUp>
            <Contributors
                isAdmin={isAdmin}
                popUpDrawer={providerDrawer}
                toggleDrawer={showProviderDetails}
                cData={cData}
            />
            {
                (!confirmationDrawerOn ) && 
                    <InfoDisplay 
                        data={formattedPoolData}
                        popUpDrawer={infoDrawer}
                        toggleDrawer={(arg) => setShowInfo(arg)}
                        actions={
                            <ActionButton 
                                buttonObj={buttonObj}
                                transactionArgs={transactionArgs}
                                setDrawerState={(arg:number) => setDrawerState(arg)}
                                confirmationDrawerOn={confirmationDrawerOn}
                            />
                        } 
                    />
            }
        </React.Fragment>
    )
}
