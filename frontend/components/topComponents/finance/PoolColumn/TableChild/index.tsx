import { FormattedPoolContentProps, FuncTag } from "@/interfaces";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { flexCenter, flexSpread } from "@/constants";
import { togglerIcon } from "..";
import React from "react";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";

interface TableChildProps {
    open: boolean;
    formattedPool: FormattedPoolContentProps;
}


export const TableChild = ({ open, formattedPool } : TableChildProps) => {
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
        <Collapse in={open} timeout="auto" unmountOnExit className={'w-full bg-gray-100 p-4 rounded-lg mt-2'}>
            <Grid container xs={12}  className="">
                <Grid item xs={12} mb={2}>
                    <h3 className="text-xl text-left text-orangec font-bold">Details</h3>
                </Grid>
                <Grid item container xs={12} mb={2} className="bg-green1 p-4 rounded-lg ">
                    <Grid item xs={12} md={4}>
                        <Box className={`w-full ${flexSpread} px-4 `}>
                            <h3>Asset</h3>
                            <h3>{'USDT'}</h3>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box className={`w-full ${flexSpread} px-4 `}>
                            <h3>{"C/Address"}</h3>
                            <AddressWrapper size={3} account={asset.toString()} display />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box className={`w-full ${flexCenter}`}>
                            <h3>{`${allGh_toNumber} got financed`}</h3>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack className="place-items-center p-4 border-r border-r-gray-200 space-y-2">
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Unit Liquidity</h3>
                            <h3>{`$${unit_InEther}`}</h3>
                        </Box>
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Total Pooled Liquidity</h3>
                            <h3>{`$${currentPool_InEther}`}</h3>
                        </Box>
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Epoch Id</h3>
                            <h3>{epochId_toNumber}</h3>
                        </Box>
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Last Paid</h3>
                            <AddressWrapper size={3} account={lastPaid} display />
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack className="place-items-center p-4 border-r border-r-gray-200 space-y-2">
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Interest Percent</h3>
                            <h3>{intPercent_string}</h3>
                        </Box>
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Collateral Coverage Ratio</h3>
                            <h3>{colCoverage_InString}</h3>
                        </Box>
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Duration</h3>
                            <h3>{`${duration_toNumber} hrs`}</h3>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack className="place-items-center p-4 border-r border-r-gray-200 space-y-2">
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Interest Per Sec</h3>
                            <h3>{`${intPerSec_InEther} XFI`}</h3>
                        </Box>
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Full Interest</h3>
                            <h3>{`${fullInterest_InEther} XFI`}</h3>
                        </Box>
                        <Box className={`w-full ${flexSpread} font-semibold text-sm text-gray-600`}>
                            <h3>Stage</h3>
                            <h3>{FuncTag[stage_toNumber]}</h3>
                        </Box>
                    </Stack>
                </Grid>

                {/* Inner Collapse Showing the providers */}
                <Grid item container xs={12}>
                    <Grid item xs={12}>
                        <Box className={`w-full text-lg`}>
                            <button className={`w-[20%] p-4 bg-yellow-100 text-orangec mb-4 font-semibold rounded-lg ${flexSpread}`}>
                                <h3>Providers</h3>
                                { togglerIcon(innerCollapse, handleClickInnerCollapse, "bg-none text-orangec") }
                            </button>
                        </Box>
                    </Grid>
                    <Collapse in={innerCollapse} timeout="auto" unmountOnExit className={'w-full'}>
                        {
                            cData_formatted.map(({id_toString, slot_toNumber, isAdmin, colBals_InEther, payDate_InDateFormat, turnTime_InDateFormat, durOfChoice_InSec, loan_InEther, expInterest_InEther}, i) => (
                                <Grid item container xs={12}>
                                    <Box className={`w-full ${flexSpread} rounded-t-lg border border-gray-300 text-gray-400 p-4`}>
                                        <h3>{`Prov. ${i + 1}`}</h3>
                                        { togglerIcon(innerLevel2Collapse, handleClickInnerLevel2Collapse, "bg-none w-[5%]") }
                                    </Box>

                                    <Collapse in={innerLevel2Collapse} timeout="auto" unmountOnExit className={'w-full'}>
                                        <Grid item container xs={12}>
                                            {/* Profile Header */}
                                            <Grid item container xs={12} className="bg-black bg-opacity-80 p-2 text text-white1">
                                                <Grid item xs={2} >
                                                    <h3 className="text-center font-bold">Address</h3>
                                                </Grid>
                                                <Grid item xs={1} >
                                                    <h3 className="text-center font-bold">Slot No</h3>
                                                </Grid>
                                                <Grid item xs={1.5} >
                                                    <h3 className="text-center font-bold">Turn</h3>
                                                </Grid>
                                                <Grid item xs={1.5} >
                                                    <h3 className="text-center font-bold">Duration</h3>
                                                </Grid>
                                                <Grid item xs={1.5} >
                                                    <h3 className="text-center font-bold">Loan</h3>
                                                </Grid>
                                                <Grid item xs={1.5} >
                                                    <h3 className="text-center font-bold">PayDate</h3>
                                                </Grid>
                                                <Grid item xs={1.5} >
                                                    <h3 className="text-center font-bold">{"Col-Bal"}</h3>
                                                </Grid>
                                                <Grid item xs={1.5} >
                                                    <h3 className="text-center font-bold">{"Est. Interest"}</h3>
                                                </Grid>
                                            </Grid>

                                            {/* Profile Body */}
                                            <Grid item container xs={12} className="text-gray-600">
                                                <Grid item xs={2} p={2}>
                                                    <Box className={`w-full ${isAdmin? flexSpread : flexCenter}`}>
                                                        <AddressWrapper size={3} account={id_toString} display />
                                                        { adminBadge(isAdmin) }
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={1} p={2} >
                                                    <h3 className="text-center font-semibold text-xs ">{ slot_toNumber }</h3>
                                                </Grid>
                                                <Grid item xs={1.5} p={2} >
                                                    <h3 className="text-center font-semibold text-xs ">{ turnTime_InDateFormat}</h3>
                                                </Grid>
                                                <Grid item xs={1.5} p={2} >
                                                    <h3 className="text-center font-semibold text-xs ">{durOfChoice_InSec > 0? durOfChoice_InSec / 3600 : 0}</h3>
                                                </Grid>
                                                <Grid item xs={1.5} p={2} >
                                                    <h3 className="text-center font-semibold text-xs ">{`${loan_InEther} USDT`}</h3>
                                                </Grid>
                                                <Grid item xs={1.5} p={2} >
                                                    <h3 className="text-center font-semibold text-xs ">{ payDate_InDateFormat }</h3>
                                                </Grid>
                                                <Grid item xs={1.5} p={2} >
                                                    <h3 className="text-center font-semibold text-xs ">{`${colBals_InEther} XFI`}</h3>
                                                </Grid>
                                                <Grid item xs={1.5} p={2} >
                                                    <h3 className="text-center font-semibold text-xs ">{`${expInterest_InEther} XFI`}</h3>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                                </Grid>
                            ))
                        }
                    </Collapse>

                </Grid>
            </Grid>
            
        </Collapse>
    );
}

const adminBadge = (isAdmin: boolean) => (
    isAdmin?
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg> : null
);


{/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
</svg> */}