import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import React from "react";
import { FormattedData } from "@/interfaces";
import { flexCenter, flexSpread } from "@/constants";
import { togglerIcon } from "../..";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";

interface ProviderProps {
    formattedData: FormattedData;
    index: number;
}

export const Provider = ({ formattedData, index }: ProviderProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const handleCollapse = () => setOpen(!open);
    const { 
        slot_toNumber, 
        isAdmin, 
        id_toString, 
        turnTime_InDateFormat,
        durOfChoice_InSec,
        loan_InEther,
        payDate_InDateFormat,
        colBals_InEther,
        expInterest_InEther
    } = formattedData;

    return(
        <Grid item container xs={12}>
            <Box className={`w-full ${flexSpread} rounded-t-lg border border-gray-300 text-gray-400 p-4`}>
                <h3>{`Prov. ${index + 1}`}</h3>
                { togglerIcon(open, handleCollapse, "bg-none w-[5%]") }
            </Box>

            <Collapse in={open} timeout="auto" unmountOnExit className={'w-full'}>
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
    );
}

const adminBadge = (isAdmin: boolean) => (
    isAdmin?
        <svg xmlns="http://www.w3.org/2000/svg" fill="#F87C00" viewBox="0 0 20 20" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg> : null
);
