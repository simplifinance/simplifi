import React from "react";
import { Address, AmountToApproveParam, FormattedData, PoolColumnProps, ScreenUserResult, VoidFunc } from "@/interfaces";
import { formatAddr, formatPoolContent } from "@/utilities";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { FORMATTEDDATA_MOCK } from "@/constants";
import { useAccount, useConfig } from "wagmi";
import { RenderActions } from "./RenderActions";
import { TableChild } from "./TableChild";

/**
 * Filter the data list for current user
 * @param cData : Formatted providers' data
 * @param currentUser : Connected user wallet.
 * @returns Object: <{isMember: boolean, data: FormattedData}>
 */
const screenUser = (
    cData: FormattedData[], 
    currentUser: Address
) : ScreenUserResult => {
    let result : ScreenUserResult = { isMember: false, data: FORMATTEDDATA_MOCK};
    const filtered = cData.filter(({id_lowerCase}) => id_lowerCase === currentUser.toString().toLowerCase());
    if(filtered?.length > 0) {
        result = {
            isMember: true,
            data: filtered[0]
        }
    }
    return result;
}

export const PoolColumn = (props: PoolColumnProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const account = formatAddr(useAccount().address);
    const config = useConfig();

    const handleClick = () => setOpen(!open);

    const formattedPool = formatPoolContent(props.pool, true);
    const {
        pair,
        unit,
        cData_formatted, 
        stage_toNumber, 
        isPermissionless,
        epochId_toNumber,
        epochId_bigint,
        quorum_toNumber,
        // intPerSec_InEther,
        intPercent_string,
        unit_InEther,
        intPerSec,
        lastPaid,
        duration_toNumber,
        userCount_toNumber,
    } = formattedPool;
    const { isMember, data: { loan_InEther, slot_toNumber, payDate_InSec, loan_InBN }} = screenUser(cData_formatted, account);

    const otherParam: AmountToApproveParam = {
        config,
        account,
        epochId: epochId_bigint,
        intPerSec,
        lastPaid,
        txnType: 'WAIT',
        unit
    };

    const column_content = Array.from([
        { value: togglerIcon(open, handleClick), gridSize: 0.5 },
        { value: epochId_toNumber, gridSize: 1},
        { value: quorum_toNumber, gridSize: 1},
        { value: unit_InEther, gridSize: 1.5},
        { value: intPercent_string, gridSize: 1.5},
        { value: pair, gridSize: 2},
        { value: userCount_toNumber, gridSize: 1.5},
        { value: renderIcon(isPermissionless), gridSize: 1.5},
        { 
            value:  
                <RenderActions 
                {...{
                    isMember,
                    isPermissionless,
                    loan_InBN,
                    payDate_InSec,
                    stage_toNumber,
                    epochId_toNumber,
                    maxEpochDuration: duration_toNumber.toString(),
                    otherParam
                }}                />,
            gridSize: 1
        }
    ]);

    return(
        <Stack className="w-full">
            {/* <Grid container xs={'auto'}> */}
            <Grid container xs={12} className={`${open? "bg-white1 bg-opacity-10" : ""} p-4`} >
                {
                    column_content.map(({ value, gridSize}, id) => (
                        <Grid key={id} item xs={gridSize} className="flex justify-center items-center place-content-center">
                            <Stack className="place-items-center w-full" style={{color: 'rgba(255, 255, 255, 0.7)'}}>{ value }</Stack>
                        </Grid>
                    ))
                }
            </Grid>
            {/* </Grid> */}
            <Grid container xs={12}>
                <TableChild {...{formattedPool, open}} />
            </Grid>
        </Stack>
    )
}

export const togglerIcon = (open: boolean, handleClick?: VoidFunc, className?: string) => {
    return (
        <button onClick={() => handleClick?.()} className={`${className || "w-full p-2 flex justify-center items-center bg-orangec rounded-lg"}`}>
            {
                open? 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className={`size-4 ${className? "text-orangec" : "text-white1"}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>              
                        : 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className={`size-4 ${className? "text-orangec" : "text-white1"}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  
            }
        </button>
    )
}
  
const renderIcon = (isPermissionless: boolean) => {
    return (
        !isPermissionless? 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-white1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg> 
                : 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-white1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>              

    );
}
