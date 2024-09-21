import React from "react";
import { Address, AmountToApproveParam, FormattedData, PoolColumnProps, ScreenUserResult } from "@/interfaces";
import { formatAddr, formatPoolContent } from "@/utilities";
import { Grid } from "@mui/material";
import { FORMATTEDDATA_MOCK } from "@/constants";
import { useAccount, useConfig } from "wagmi";
import { RenderActions } from "./RenderActions";

// import { Input } from "./Create/Input";
// import Notification from "@/components/Notification";
// import { approve } from "@/apis/factory/transact/testToken/approve";
// import BigNumber from "bignumber.js";

// const filterButtonObject = () => {
//     const buttonTextArr : {tag: ButtonText, }[] = ['ADD', 'GET', 'PAY', 'LIQUIDATE', 'AWAIT PAYMENT', 'DISABLED', 'WAIT'];

// }

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
    const [modalOpen, setOpen] = React.useState<boolean>(false);
    const account = formatAddr(useAccount().address);
    const config = useConfig();

    const { 
        pair,
        unit,
        cData_formatted, 
        stage_toNumber, 
        isPermissionless,
        epochId_toNumber,
        epochId_bigint,
        quorum_toNumber,
        intPerSec_InEther,
        intPercent_string,
        unit_InEther,
        intPerSec,
        lastPaid,
        duration_toNumber,
        userCount_toNumber,
    } = formatPoolContent(props.pool, true);
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
        togglerIcon(modalOpen),
        epochId_toNumber,
        quorum_toNumber,
        unit_InEther,
        intPercent_string,
        pair,
        userCount_toNumber,
        renderIcon(isPermissionless),
        <RenderActions 
            {
                ...{
                    isMember,
                    isPermissionless,
                    loan_InBN,
                    payDate_InSec,
                    stage_toNumber,
                    maxEpochDuration: duration_toNumber.toString(),
                    otherParam
                }
            }
        />
    ]);

    const gridSize = 12/column_content.length;

    const toggleModal = async() => {
        setOpen(!modalOpen)
    };

    return(
        <React.Fragment>
            {/* <Grid container xs className="hover:bg-gray-100 p-4 cursor-pointer" onClick={() => handleClick({pool: props.pool, epochId})} > */}
            <Grid container xs className="hover:bg-gray-100 p-4 cursor-pointer" onClick={toggleModal} >
                {
                    column_content.map((item, id) => (
                    <Grid key={id} item xs={gridSize} >
                        <span className="text-gray-500 text-center">{ item }</span>
                    </Grid>
                    ))
                }
            </Grid>
        </React.Fragment>
    )
}

const togglerIcon = (open: boolean) => {
    return (
        <span>
            {
                open? 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="size-4 text-orangec">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>              
                        : 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="size-4 text-orangec">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  
            }
        </span>
    )
}
  
const renderIcon = (isPermissionless: boolean) => {
    return (
        !isPermissionless? 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-orangec">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg> 
                : 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-orangec">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>              

    );
}



// const callback : TransactionCallback = (arg: TransactionCallbackArg) => {
//     if(arg?.message) setMessage(arg.message);
//     console.log("Arg: ", arg)
// }

// const handleSetDur = (e:React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     setPreferredDur(e.currentTarget.value);
// }

{/* <AddressWrapper account={admin.toString()} size={4} display key={4}/>,
<AddressWrapper account={asset.toString()} size={4} display key={5}/>, */}
    
            //   <PopUp { ...{modalOpen, handleModalClose: toggleModal } } > 
            //       <Container maxWidth="sm" className="space-y-2">
            //           <Stack sx={{bgcolor: 'background.paper'}} className="p-4 md:p-8 my-10 rounded-xl border-2 space-y-6 text-lg ">
            //               <Box className={`w-full ${flexSpread}`}>
            //                   <h3 className={`text-xl font-black text-orangec`}>{`Pool ${formattedUnit} at Epoch Id ${epochId_}`}</h3>
            //                   <button className="w-[20%] float-end text-white bg-orangec p-2 rounded-lg" onClick={toggleModal}>Close</button>
            //               </Box> 
  
            //               <Stack className="space-y-4">
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Liquidity per provider</h3>
            //                       <h3>{formattedUnit}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>{"Current No. Of providers"}</h3>
            //                       <h3>{currentProviders}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>{"Borrowers will payback on/before"}</h3>
            //                       <h3>{`${formattedDuration} hrs`}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Interest percent</h3>
            //                       <h3>{intPercent}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Interest per sec</h3>
            //                       <h3>{`${formatEther(toBigInt(toBN(intPerSec.toString()).toString()))} USDT`}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Full interest</h3>
            //                       <h3>{`${formatEther(toBigInt(toBN(fullInterest.toString()).toString()))} USDT`}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Collateral index</h3>
            //                       <h3>{`${toBN(colCoverage.toString()).div(toBN(100)).toNumber()}`}</h3>
            //                   </Box>
            //                   {
            //                       txnType === 'Borrow' &&
            //                           <Box className="w-full">
            //                               <Input 
            //                                   id="Borrow"
            //                                   onChange={handleSetDur}
            //                                   type="number"
            //                                   placeholder="Specify your preferred duration"
            //                               />
            //                           </Box>
            //                   }
            //                   <Box className={`${flexSpread} gap-4 `}>
            //                       <button 
            //                           className="w-full bg-orangec p-4 rounded-lg text-white hover:bg-opacity-70"
            //                           onClick={handleTransact}
            //                       >
            //                           { txnType.toString()}
            //                       </button>
            //                       <button 
            //                           className="w-full text-orangec border border-orangec p-4 rounded-lg hover:bg-yellow-100"
            //                           onClick={toggleProfileModal}
            //                       >
            //                           View Profile
            //                       </button>
            //                   </Box>
            //               </Stack> 
            //           </Stack>
            //       </Container>
            //   </PopUp>
            //   <DisplayProfile 
            //       {
            //           ...{
            //               profile,
            //               epochId,
            //               profileModalOpen,
            //               toggleProfileModal,
            //           }
  
            //       }
            //   />
            //   <Notification message={message} />