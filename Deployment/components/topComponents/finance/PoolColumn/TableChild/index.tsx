import { FormattedPoolContentProps, FuncTag } from "@/interfaces";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { flexCenter, flexSpread } from "@/constants";
import { togglerIcon } from "..";
import React from "react";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { Provider } from "./Provider";
import { ListItemIcon } from "@mui/material";

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
            <Grid item container xs={12}  className="">
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
                            cData_formatted.map((item, i) => (
                                <Provider
                                    formattedData={item}
                                    key={i} 
                                    index={i}
                                    />
                            ))
                        }
                    </Collapse>

                </Grid>
            </Grid>
            
        </Collapse>
    );
}

