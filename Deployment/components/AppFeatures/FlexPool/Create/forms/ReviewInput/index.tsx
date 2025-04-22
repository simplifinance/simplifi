import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import type { Address, HandleTransactionParam, InputSelector, Router, } from "@/interfaces";
import { Chevron } from "@/components/utilities/Icons";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, toBigInt, toBN } from "@/utilities";
import { parseEther } from "viem";
import Drawer from "../../../update/ActionButton/Confirmation/Drawer";
import { Button } from "@/components/ui/button";
import { Confirmation } from "../../../update/ActionButton/Confirmation";
import { flexSpread } from "@/constants";

export const ReviewInput = (props: ReviewInputProps) => {
    const [openCollapse, setCollapseState] = React.useState<boolean>(false);
    const [confirmationOpen, setConfirmationPopUpState] = React.useState<number>(0);

    const { popUpDrawer, values, participants, type, formType, toggleDrawer: closeReview } = props;
    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const unitLiquidity = toBN(values[1].value).times('1e18').toString();
    const colCoverage = toBN(values[4].value).times(100).toNumber();
    const collateralAsset = values[3].value as Address;
    const durationInHours = toBN(values[2].value).toNumber();
    // console.log("UnitLiquidity: ", unitLiquidity);
    const toggleDrawer = (arg:number) => setConfirmationPopUpState(arg);
    const transactionArgs : HandleTransactionParam = {
        commonParam: {account, config, unit: BigInt(unitLiquidity), contractAddress: collateralAsset},
        createPermissionedPoolParam: {
            colCoverage,
            contributors: participants!,
            durationInHours,
        },
        createPermissionlessPoolParam: {
            colCoverage,
            contributors: [account],
            quorum: toBN(values[0].value).toNumber(),
            durationInHours,
        },
        txnType: 'Create',
        router: formType,
    }

    return(
        <Drawer 
            openDrawer={popUpDrawer}
            setDrawerState={toggleDrawer} 
            styles={{borderLeft: '1px solid rgb(249 244 244 / 0.3)', display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px', height: "100%"}}
        >
            <Box className="p-4 space-y-6 gap-4 overflow-hidden">
                <Button variant={'outline'} onClick={() => closeReview(0)} className="dark:text-orange-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </Button>
                <h1 className="text-lg text-white1 font-bold dark:text-orange-200">Please review inputs</h1>
                <div className="space-y-3 bg-white1 dark:bg-gray1 p-4 rounded-lg text-green1/90 dark:text-orange-100 font-semibold">
                    {
                        values.map((item) => {
                            return (
                                (item.title === "Participants" && type === 'address') ? (
                                    <Stack key={item.title} >
                                        <Button onClick={() => setCollapseState(!openCollapse)} className={`${flexSpread} text-sm font-semibold`}>
                                            <h3>{ item.title }</h3>
                                            <Chevron open={openCollapse}/>
                                        </Button>
                                        <Collapse in={(openCollapse && participants && participants?.length > 0)} timeout="auto" unmountOnExit>
                                            <div className="p-2 rounded-lg border border-green1/80 border-t-4 bg-white1">
                                                {
                                                    participants?.map((address, i) => (
                                                        <div key={address} className={`${flexSpread}`} >
                                                            <h3 >{ i + 1 }</h3>
                                                            <AddressWrapper 
                                                                account={address}
                                                                display
                                                                size={4}
                                                            />
                                                        </div>
                                                    ))                                                        
                                                }
                                            </div>
                                        </Collapse>
                                    </Stack>
                                ) : (
                                    <div key={item.title} className="flex justify-between items-center text-sm ">
                                        <h3 >{ item.title }</h3>
                                        {
                                            item.value.length === 42? <AddressWrapper 
                                                account={item.value}
                                                display={false}
                                                size={4}
                                            /> : <h3 >{`${item.value}${item.affix}`}</h3>
                                        }
                                    </div>
                                )
                            )
                        })
                    }
                </div>
                <Button
                    variant={'outline'}
                    disabled={confirmationOpen === 1}                                                           
                    className={`w-full  dark:text-orange-200`}
                    onClick={() => toggleDrawer(1)}
                >
                   SendTransaction
                </Button>
                <Confirmation 
                    openDrawer={confirmationOpen}
                    toggleDrawer={toggleDrawer}
                    transactionArgs={transactionArgs}
                    back={() => closeReview(0)}
                />
            </Box>
        </Drawer>
    );
}

interface ReviewInputProps {
    values: {title: string, value: string, affix: string}[];
    type: InputSelector;
    participants?: Address[];
    popUpDrawer: number;
    formType: Router;
    toggleDrawer: (arg: number) => void;
}
// rounded-lg text-green1 text-xs uppercase font-medium hover:shadow-sm hover:text-opacity-60 flex justify-center
