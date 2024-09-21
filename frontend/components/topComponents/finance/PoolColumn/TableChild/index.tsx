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
        <Collapse in={open} timeout="auto" unmountOnExit className={'w-full p-4'}>
            <Grid container xs={'auto'}>
                <h3 className="text-xl ">Details</h3>
                <Grid item xs={12} md={4}>
                    <Stack>
                        <Box className={`${flexSpread} text-pretty text-small text-gray-600`}>
                            <h3>Unit Liquidity</h3>
                            <h3>{`$${unit_InEther}`}</h3>
                        </Box>
                        <Box className={`${flexSpread} text-pretty text-small text-gray-600`}>
                            <h3>Current Liquidity</h3>
                            <h3>{`$${currentPool_InEther}`}</h3>
                        </Box>
                        <Box className={`${flexSpread} text-pretty text-small text-gray-600`}>
                            <h3>Epoch Id</h3>
                            <h3>{epochId_toNumber}</h3>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack>
                        <Box className={`${flexSpread} text-pretty text-small text-gray-600`}>
                            <h3>Interest Percent</h3>
                            <h3>{intPercent_string}</h3>
                        </Box>
                        <Box className={`${flexSpread} text-pretty text-small text-gray-600`}>
                            <h3>Collateral Coverage Ratio</h3>
                            <h3>{colCoverage_InString}</h3>
                        </Box>
                        <Box className={`${flexSpread} text-pretty text-small text-gray-600`}>
                            <h3>Duration</h3>
                            <h3>{`${duration_toNumber / 3600} hrs`}</h3>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack>
                        <Box className={`${flexSpread} text-pretty text-small text-gray-600`}>
                            <h3>Interest Per Sec</h3>
                            <h3>{`${intPerSec_InEther} XFI`}</h3>
                        </Box>
                        <Box className={`${flexSpread} text-pretty text-small text-gray-600`}>
                            <h3>Full Interest</h3>
                            <h3>{`${fullInterest_InEther} XFI`}</h3>
                        </Box>
                        <Box className={`${flexSpread} text-pretty text-small text-gray-600`}>
                            <h3>Stage</h3>
                            <h3>{FuncTag[stage_toNumber]}</h3>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item container xs={12} className="bg-green1">
                    <Grid item xs={12} md={4}>
                        <Stack className="">
                            <h3>Currency In Use</h3>
                            <Box>
                                <h3>Name</h3>
                                <h3>{'USDT'}</h3>
                            </Box>
                            <Box>
                                <h3>{"C/Address"}</h3>
                                <AddressWrapper size={3} account={asset.toString()} display />
                            </Box>
                            
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack className="">
                            <h3>Last Paid</h3>
                            <AddressWrapper size={3} account={lastPaid} display />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack className="">
                            <h3>{`${allGh_toNumber} got financed`}</h3>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Inner Collapse Showing the providers */}
                <Grid item container xs={12}>
                    <Box className={`${flexSpread} bg-orangec text-white1 text-xl font-bold`} onClick={() => setInnerCollapse(!innerCollapse)} >
                        <h3>Providers</h3>
                        { togglerIcon(innerCollapse) }
                    </Box>
                    <Collapse in={innerCollapse} timeout="auto" unmountOnExit className={'w-full p-4'}>
                        {
                            cData_formatted.map(({id_toString, slot_toNumber, isAdmin, colBals_InEther, payDate_InDateFormat, turnTime_InDateFormat, durOfChoice_InSec, loan_InEther, expInterest_InEther}, i) => (
                                <Grid item container xs={12}>
                                    <Box className={`w-full bg-orange-400 ${flexSpread} `} onClick={() => setInnerLevel2Collapse(!innerLevel2Collapse)} >
                                        <h3>{`Provider ${i + 1}`}</h3>
                                        { togglerIcon(innerLevel2Collapse) }
                                    </Box>
                                    <Collapse in={innerLevel2Collapse} timeout="auto" unmountOnExit className={'w-full p-4'}>
                                        {/* Profile Header */}
                                        <Grid item container xs={'auto'} className="bg-green1 ">
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">Address</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">Slot No</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">Turn</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">Duration</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">Loan</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">PayDate</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">{"Col-Bal"}</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">{"Est Interest"}</h3>
                                            </Grid>
                                        </Grid>

                                        {/* Profile Body */}
                                        <Grid item container xs={'auto'}>
                                            <Grid item xs={2} >
                                                <Box className={`${isAdmin? flexSpread : flexCenter}`}>
                                                    <AddressWrapper size={3} account={id_toString} display />
                                                    { adminBadge(isAdmin) }
                                                </Box>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">{ slot_toNumber }</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">{ turnTime_InDateFormat}</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">{durOfChoice_InSec > 0? durOfChoice_InSec / 3600 : 0}</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">{`${loan_InEther} USDT`}</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">{ payDate_InDateFormat }</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">{`${colBals_InEther} XFI`}</h3>
                                            </Grid>
                                            <Grid item xs={2} >
                                                <h3 className="text-lg text-center font-bold text-white1">{`${expInterest_InEther} XFI`}</h3>
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg> : null
)