import React from "react";
import type { ButtonObj, Address, AmountToApproveParam, FormattedData, ReadDataReturnValue, } from "@/interfaces";
import { formatAddr, formatPoolContent } from "@/utilities";
import { FORMATTEDDATA_MOCK, FuncTag } from "@/constants";
import { useAccount, useConfig } from "wagmi";
import { ActionButton } from "../ActionButton";
import { InfoDisplay, Providers } from '../DrawerWrapper';
import { renderIcon } from '../Icons';
import { PermissionPopUp } from '../PermissionPopUp';
import { CustomButton } from "@/components/CustomButton";
import { getContractData } from "@/apis/utils/getContractData";

/**
 * Filter the data list for current user
 * @param cData : Formatted providers' data
 * @param currentUser : Connected user wallet.
 * @returns Object: <{isMember: boolean, data: FormattedData}>
 */
const filterUser = (
    cData: FormattedData[], 
    currentUser: Address
) : FormattedData => {
    let result : FormattedData = FORMATTEDDATA_MOCK;
    const filtered = cData.filter(({id_lowerCase}) => id_lowerCase === currentUser.toString().toLowerCase());
    if(filtered?.length > 0) {
        result = filtered[0];
    }
    return result;
}

export const FlexCard = (props: ReadDataReturnValue) => {
    const [inputModalOn, setInputModal] = React.useState<boolean>(false);
    const [confirmationDrawerOn, setDrawerState] = React.useState<number>(0);
    const [infoDrawer, setShowInfo]= React.useState<number>(0);
    const [providerDrawer, setProviderDrawer]= React.useState<number>(0);
    const [permissionDrawer, setPermissionDrawer]= React.useState<number>(0);

    const[buttonObj, setButtonObj] = React.useState<ButtonObj>({value: 'ADD LIQUIDITY', disable: false});
    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const { pair } = getContractData(config.state.chainId || 4157);
    
    const showPermissionDetail = (arg:number) => setPermissionDrawer(arg);
    const showProviderDetails = (arg:number) => setProviderDrawer(arg);

    const formattedPool = formatPoolContent(props, true, account);
    const {
        // pair,
        unit,
        currentPoolInBN,
        unitInBN,
        cData_formatted, 
        stage_toNumber, 
        isPermissionless,
        unitId_toNumber,
        // unitId_bigint,
        quorum_toNumber,
        // formatted_bank,
        intPercent_string,
        unit_InEther,
        intPerSec,
        lastPaid,
        isMember,
        isAdmin,
        // duration_toNumber,
        userCount_toNumber,
    } = formattedPool;

    const { payDate_InSec, loan_InBN, sentQuota } = filterUser(cData_formatted, account);
    const otherParam: AmountToApproveParam = {
        config,
        account,
        // epochId: epochId_bigint,
        intPerSec,
        lastPaid,
        txnType: buttonObj.value,
        unit: BigInt(unit.toString())
    };

    const msg_AddLiq = `Request to add liquidity to epoch ${unitId_toNumber}`;
    const msg_getFin = `Getting finance from epoch ${unitId_toNumber}`;
    const msg_Pay = `Paying back loan at epoch ${unitId_toNumber}`
    const msg_Liq = `Setting liquidation at epoch ${unitId_toNumber}`;
    const msg_Remv = `Request to remove Flexpool at epoch ${unitId_toNumber}`;

    React.useEffect(() => {
        switch (stage_toNumber) {
            case FuncTag.JOIN:
                if(isPermissionless){
                    if(isAdmin) {
                        if(userCount_toNumber === 1) {
                            setButtonObj({value: 'REMOVE', disable: false, displayMessage: msg_Remv});
                        } else {
                            setButtonObj({value: 'WAIT', disable: true});
                        }
                    } else {
                        if(isMember && sentQuota){
                            setButtonObj({value: 'WAIT', disable: true});
                        } else {
                            setButtonObj({value: 'ADD LIQUIDITY', disable: false, displayMessage: msg_AddLiq});
                        }
                    }
                } else {
                    if(isAdmin) {
                        if(currentPoolInBN.eq(unitInBN)){
                            setButtonObj({value: 'REMOVE', disable: false, displayMessage: msg_Remv});
                        } else {
                            setButtonObj({value: 'WAIT', disable: true});
                        }
                    } else if(isMember && !sentQuota){
                        setButtonObj({value: 'ADD LIQUIDITY', disable: false, displayMessage: msg_AddLiq});
                    } else if(isMember && sentQuota){
                        setButtonObj({value: 'WAIT', disable: true});
                    } else {
                        setButtonObj({value: 'NOT ALLOWED', disable: true});
                    }
                }
                break;
    
            case FuncTag.GET:
                if(isMember) {
                    setButtonObj({value: 'GET FINANCE', disable: false, displayMessage: msg_getFin});
                } else setButtonObj({ value: 'NOT ALLOWED', disable: true});
                break;
            
            case FuncTag.PAYBACK:
                if(isMember){
                    if(loan_InBN.gt(0)) setButtonObj({value : 'PAYBACK', disable: false, displayMessage: msg_Pay});
                    else setButtonObj({ value: 'NOT ALLOWED', disable: true});
                } else {
                    if((new Date().getTime() / 1000) >  payDate_InSec) setButtonObj({ value: 'LIQUIDATE', disable: false, displayMessage: msg_Liq});
                    else setButtonObj({ value: 'NOT ALLOWED', disable: true});
                }
                break;
            default:
                setButtonObj({ value: 'ENDED', disable: true});
                break;
        }    
    }, [stage_toNumber]);

    return(
        <React.Fragment>
            <div className={`relative ${stage_toNumber === FuncTag.ENDED || stage_toNumber === FuncTag.CANCELED ? 'bg-gray1/70' : 'bg-green1'} shadow-lg space-y-4 shadow-green1 p-4 rounded-[26px] text-orange-200 text-[14px]`}>
                <div className="flex gap-2 items-center ">
                    <button onClick={() => showPermissionDetail(1)} className="bg-gray1 p-3 rounded-full hover:shadow-md hover:shadow-orange-200 focus:shadow-md focus:shadow-orange-200">{renderIcon(isPermissionless)}</button>
                    <div className="relative ">
                        <h3 className="absolute -top-2 left-0 text-orange-200 text-[10px]">{userCount_toNumber}</h3>
                        <button onClick={() => showProviderDetails(1)} className="bg-gray1 p-3 rounded-full hover:shadow-md hover:shadow-orange-200 focus:shadow-md focus:shadow-orange-200">
                            { 
                                isPermissionless?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-orange-300">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                    </svg> 
                                        : 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-300">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                    </svg>
                            
                            }
                        </button>
                    </div>
                </div>
                <div className="text-orangec font-medium">
                    <span className="flex items-center gap-2">
                        <h1>{'Unit Id:'}</h1>
                        <h1>{unitId_toNumber}</h1>
                    </span>
                    <div className="flex items-center gap-2">
                        <h3>{'Rate:'}</h3>
                        <h3>{`${intPercent_string}%`}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <h3>{'Stage:'}</h3>
                        <h3>{FuncTag[stage_toNumber]}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <h3>{'Quorum:'}</h3>
                        <h3>{quorum_toNumber}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <h3 className="">{'Pair:'}</h3>
                        <h3 className="">{pair}</h3>
                    </div>
                    <h2 className="absolute right-0 top-[1px] text-lg lg:text-2xl p-2 font-black text-orange-200 bg-gray1 border-r border-r-green1 rounded-tr-[26px] rounded-bl-[26px]">
                        {`$${unit_InEther}`}
                    </h2>
                </div>
                <div className="w-full flex flex-col justify-between items-center">
                    <div className="w-full flex flex-col justify-between items-center space-y-2">
                        <CustomButton
                            disabled={false}
                            handleButtonClick={() => setShowInfo(1)}
                            overrideClassName="bg-green1 border border-gray1 rounded-full text-white1/30"
                        >
                            More Info
                        </CustomButton>
                        <ActionButton
                            {
                                ...{
                                    sentQuota,
                                    loan_InBN,
                                    payDate_InSec,
                                    otherParam,
                                    buttonObj,
                                    ...formattedPool,
                                    inputModalOn,
                                    confirmationDrawerOn,
                                    setDrawerState: (arg:number) => setDrawerState(arg),
                                    setInputModal: (arg:boolean) => setInputModal(arg)
                                }
                            }
                        />
                    </div>
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
            <Providers
                isAdmin={isAdmin}
                popUpDrawer={providerDrawer}
                toggleDrawer={showProviderDetails}
                cData_formatted={cData_formatted} 
            />
            {
                (!confirmationDrawerOn && !inputModalOn) && 
                    <InfoDisplay 
                        formattedPool={formattedPool} 
                        popUpDrawer={infoDrawer}
                        toggleDrawer={(arg) => setShowInfo(arg)}
                        actions={
                            <ActionButton 
                                {
                                    ...{
                                        sentQuota,
                                        loan_InBN,
                                        payDate_InSec,
                                        otherParam,
                                        buttonObj,
                                        ...formattedPool,
                                        inputModalOn,
                                        confirmationDrawerOn,
                                        setDrawerState: (arg:number) => setDrawerState(arg),
                                        setInputModal: (arg:boolean) => setInputModal(arg)
                                    }
                                }
                            />
                        } 
                    />
            }
        </React.Fragment>
    )
}
