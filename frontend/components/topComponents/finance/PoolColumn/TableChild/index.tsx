import { FormattedPoolContentProps, FuncTag, VoidFunc } from "@/interfaces";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { flexSpread, } from "@/constants";
import { togglerIcon } from "..";
import React from "react";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { Provider } from "./Provider";
import { PopUp } from "../../Create/forms/transactionStatus/PopUp";
// import { ListItemIcon } from "@mui/material";

interface TableChildProps {
    open: boolean;
    formattedPool: FormattedPoolContentProps;
    handleModalClose: VoidFunc;
    actions: React.ReactNode;
}

const BOXSTYLING = "h-[180px] lg:h-[150px] w-full rounded-lg border border-white1/20 p-4 space-y-2 text-orange-200 bg-white1/10";

export const TableChild = ({ open, formattedPool, actions, handleModalClose } : TableChildProps) => {
    const [innerCollapse, setInnerCollapse] = React.useState<boolean>(false);
    const [innerLevel2Collapse, setInnerLevel2Collapse] = React.useState<boolean>(false);
    const handleClickInnerCollapse = () => setInnerCollapse(!innerCollapse);
    const handleClickInnerLevel2Collapse = () => setInnerLevel2Collapse(!innerLevel2Collapse);

    const {
        cData_formatted,
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
    return(
        // <PopUp modalOpen={open} timeout="auto" unmountOnExit className={'w-full bg-gray-100 p-4 rounded-lg mt-2'}>
        <PopUp modalOpen={open} handleModalClose={handleModalClose} >
            <Box className="h-full md:max-h-[550px] space-y-4 overflow-y-auto md:overflow-y-auto p-4 lg:p-8 rounded-lg text-lg bg-green1 text-white1 border shadow-lg shadow-yellow-100">
                <Grid item container xs={12}  className="space-y-4">
                    <Grid item xs={12}>
                        <div className="flex justify-between items-center">
                            {/* <h3 className="text-xl text-left text-orangec font-bold">Details</h3> */}
                            { actions }
                            <button onClick={handleModalClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </Grid>
                    <Grid item container xs={12} className="rounded-lg ">
                        <Grid item xs={12} className={`${flexSpread} border border-white1/20 bg-white/10 rounded-lg p-4`}>
                            <Stack className="text-sm md:text-md w-full">
                                <h3 className="text-orange-200">Asset</h3>
                                <p className="text-xs md:text-sm">{'USDT'}</p>
                            </Stack>
                            <Stack className="text-center w-full" >
                                <h3 className="text-orange-200 text-sm md:text-md">{"C/Address"}</h3>
                                <AddressWrapper 
                                    size={4} 
                                    copyIconSize="4" 
                                    account={asset.toString()}
                                    overrideClassName="text-xs md:text-sm" 
                                    display 
                                />
                            </Stack>
                            <Stack className="text-end w-full" >
                                <h3 className="text-orange-200 text-sm md:text-md">{"Benefited"}</h3>
                                <p className="text-xs md:text-sm">{`${allGh_toNumber}`}</p>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={`md:flex justify-between items-center space-y-2 md:space-y-0 gap-4`}>
                        <Box className={`${BOXSTYLING}`}>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>Unit Liquidity</h3>
                                <p>{`$${unit_InEther}`}</p>
                            </div>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>Total Pooled Liquidity</h3>
                                <p>{`$${currentPool_InEther}`}</p>
                            </div>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>Epoch Id</h3>
                                <p>{epochId_toNumber}</p>
                            </div>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>Last Paid</h3>
                                <AddressWrapper size={3} account={lastPaid} display />
                            </div>
                        </Box>
                        <Box className={`${BOXSTYLING}`}>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>Interest Percent</h3>
                                <p>{intPercent_string}</p>
                            </div>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>Collateral Coverage Ratio</h3>
                                <p>{colCoverage_InString}</p>
                            </div>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>Duration</h3>
                                <p>{`${duration_toNumber} hrs`}</p>
                            </div>
                        </Box>
                        <Box className={`${BOXSTYLING}`}>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>{"Int/Sec"}</h3>
                                <p className="px-2 text-xs md:textsm">{`${intPerSec_InEther} XFI`}</p>
                            </div>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>Full Interest</h3>
                                <p>{`${fullInterest_InEther} XFI`}</p>
                            </div>
                            <div className={`w-full ${flexSpread} font-semibold text-sm `}>
                                <h3>Stage</h3>
                                <p>{FuncTag[stage_toNumber]}</p>
                            </div>
                        </Box>
                    </Grid>


                    {/* Inner Collapse Showing the providers */}
                    <Grid item container xs={12}>
                        <Box onClick={handleClickInnerCollapse} className={`w-full text-lg p-2 border border-white1/20 bg-white1/20 text-orange-200 rounded-t-lg ${flexSpread} cursor-pointer`}>
                            <h3>Providers</h3>
                            { togglerIcon(innerCollapse, undefined, "bg-none text-orange-200") }
                        </Box>
                        <Collapse in={innerCollapse} timeout="auto" unmountOnExit className={'w-full'}>
                            <div className="w-full max-h-[120px] overflow-y-auto border border-white1/20 rounded-b-lg ">
                                {
                                    cData_formatted.map((item, i) => (
                                        <Provider
                                            formattedData={item}
                                            key={i} 
                                            index={i}
                                            />
                                    ))
                                }
                            </div>
                        </Collapse>
                    </Grid>
                </Grid> 
            </Box>
        </PopUp>
    );
}

