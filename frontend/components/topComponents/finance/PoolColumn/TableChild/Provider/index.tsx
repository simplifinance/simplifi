import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import React from "react";
import { FormattedData } from "@/interfaces";
import { flexCenter, flexEnd, flexSpread } from "@/constants";
// import { togglerIcon } from "../..";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { PopUp } from "../../../Create/forms/transactionStatus/PopUp";
import { commonStyle } from "@/utilities";
// import { Collapsible } from "@/components/Collapsible";
import Collapse from "@mui/material/Collapse";
import { Chevron } from "@/components/Collapsible";

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
        <Grid item xs={2} >
            <button onClick={handleCollapse} className={`text-yellow-300 p-2 text-xs uppercase font-semibold `}>
                <h3>{`Prov. ${index + 1}`}</h3>
                <Chevron open={open} />
            </button>
            <Collapse in={open} timeout="auto" unmountOnExit className={'w-full bg-gray1 p-4 text-yellow-200'}>
                {/* <Stack className="w-full rounded-lg space-y-12 text-lg bg-green1 text-white1 border shadow-lg shadow-yellow-100"> */}
                <Stack className="w-full space-y-4 relative">
                    {/* <div className="flex justify-end">
                        <button onClick={handleCollapse}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className="size-10 text-orangec hover:text-white1/50 active:ring-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div> */}
                    <Box className="space-y-2 pb-4">
                        <ul>
                            <li className={`${flexSpread}`}>
                                <h3 className="text-center font-bold text-sm md:text-md">Address</h3>
                                <AddressWrapper size={3} account={id_toString} display overrideClassName="text-sm" copyIconSize="4"/>
                                <h3 className="absolute">
                                    { adminBadge(isAdmin) }
                                </h3>
                            </li>
                            <li className={`${flexSpread}`}>
                                <h3>Slot No</h3>
                                <h3>{ slot_toNumber }</h3>
                            </li>
                            <li className={`${flexSpread}`}>
                                <h3>Turn</h3>
                                <h3>{turnTime_InDateFormat}</h3>
                            </li>
                            <li className={`${flexSpread}`}>
                                <h3>Duration</h3>
                                <h3>{durOfChoice_InSec > 0? durOfChoice_InSec / 3600 : 0}</h3>
                            </li>
                            <li className={`${flexSpread}`}>
                                <h3>Loan</h3>
                                <h3>{`${loan_InEther} USDT`}</h3>
                            </li>
                            <li className={`${flexSpread}`}>
                                <h3>PayDate</h3>
                                <h3>{ payDate_InDateFormat }</h3>
                            </li>
                            <li className={`${flexSpread}`}>
                                <h3>{"Col-Bal"}</h3>
                                <h3>{`${colBals_InEther} XFI`}</h3>
                            </li>
                            <li className={`${flexSpread}`}>
                                <h3>{"Est. Interest"}</h3>
                                <h3>{`${expInterest_InEther} XFI`}</h3>
                            </li>
                        </ul>
                    </Box>
                </Stack>
            </Collapse>
        </Grid>
    );
}

const adminBadge = (isAdmin: boolean) => {
    return(
        <span hidden={!isAdmin} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="#F87C00" viewBox="0 0 20 20" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
        </span>
    );
};
