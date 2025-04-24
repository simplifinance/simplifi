import React from "react";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import type { Address, HandleTransactionParam, InputSelector, Router, } from "@/interfaces";
import { Chevron } from "@/components/utilities/Icons";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, toBN } from "@/utilities";
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
            title="Your settings"
            openDrawer={popUpDrawer}
            setDrawerState={toggleDrawer} 
            onClickAction={() => closeReview(0)}
        >
            <div className="bg-white1/50 dark:bg-green1/60 space-y-3 p-4 rounded-lg text-green1/90 dark:text-orange-200 font-semibold border">
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
                className={`w-full  dark:text-orange-300`}
                onClick={() => toggleDrawer(1)}
            >
                SendTransaction
            </Button>
            <Confirmation 
                openDrawer={confirmationOpen}
                toggleDrawer={toggleDrawer}
                transactionArgs={transactionArgs}
                back={() => closeReview(0)}
                displayMessage="Requesting to launch a Flexpool"
            />
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
