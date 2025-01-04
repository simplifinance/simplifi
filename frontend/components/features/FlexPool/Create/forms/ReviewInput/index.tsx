import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import type { Address, AmountToApproveParam, CreatePermissionedPoolParams, CreatePermissionLessPoolParams, InputSelector, PoolType, TransactionCallback, TrxState, } from "@/interfaces";
import { Chevron } from "@/components/Collapsible";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, handleTransact, toBigInt, toBN } from "@/utilities";
import { parseEther } from "viem";
import { Spinner } from "@/components/Spinner";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { formatError } from "@/apis/update/formatError";
import Drawer from "../../../update/ActionButton/Confirmation/Drawer";

export const ReviewInput = (props: ReviewInputProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const { popUpDrawer, values, participants, type, formType, toggleDrawer } = props;
    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const { setTrxnStatus, setmessage, message } = useAppStorage();
    const unitLiquidity = toBigInt(toBN(values[1].value).toString());
    const colCoverage = toBN(values[4].value).toNumber();
    const intRate = toBN(values[3].value).toNumber();
    const durationInHours = toBN(values[2].value).toNumber();

    const callback : TransactionCallback = (arg: TrxState) => {
        setTrxnStatus(arg);
    }

    const otherParam: AmountToApproveParam = { account, config, unit: parseEther(unitLiquidity.toString()), txnType: "CREATE"};
    const createPermissionedPoolParam : CreatePermissionedPoolParams = {
        account,
        colCoverage,
        config,
        contributors: participants!,
        durationInHours,
        intRate,
        unitLiquidity: parseEther(unitLiquidity.toString()),
        callback
    };
    const createPermissionlessPoolParam : CreatePermissionLessPoolParams = {
        account,
        colCoverage,
        config,
        quorum: toBN(values[0].value).toNumber(),
        durationInHours,
        intRate,
        unitLiquidity: parseEther(unitLiquidity.toString()),
        callback
    };

    const callback_final = (errored: boolean, error?: any) => {
        if(!errored){
            setmessage('Trxn Completed');
        } else {
            setmessage(formatError(error));
        }
        setLoading(false);
        setTimeout(() => toggleDrawer(0), 3000);
    }

    const handleClick = async() => {
        setLoading(true);
        setmessage('Trxn processing');
        switch (formType) {
            case 'Permissioned':
                await handleTransact({
                    router: 'Permissioned',
                    callback,
                    otherParam,
                    createPermissionedPoolParam,
                })
                .then(() => {
                   callback_final(false);
                })
                .catch((error: any) => {
                    callback_final(true, error);
                }); 
            case 'Permissionless':
                await handleTransact({
                    router: 'Permissionless',
                    callback,
                    otherParam,
                    createPermissionlessPoolParam,
                })
                .then(() => {
                    callback_final(false);
                })
                .catch((error: any) => {
                    callback_final(true, error);
                }); 
                break;
            default:
                break;
        }
        setLoading(false);
        setTimeout(() => {
            toggleDrawer(0);
        }, 3000);
    }

    return(
        <Drawer 
            openDrawer={popUpDrawer}
            setDrawerState={toggleDrawer} 
            styles={{borderLeft: '1px solid rgb(249 244 244 / 0.3)', display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px', height: "100%"}}
        >
            <Box className="p-4 text-orange-200 space-y-6 gap-4 overflow-hidden">
                <button onClick={() => toggleDrawer(0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className="text-lg text-orange-300">Please approve spending cap</h1>
                <div className="space-y-2">
                    {
                        values.map((item) => {
                            return (
                                (item.title === "Participants" && type === 'address') ? (
                                    <Stack key={item.title} >
                                        <div className="flex justify-between items-center text-sm font-semibold">
                                            <h3>{ item.title }</h3>
                                            <button onClick={() => setOpen(!open)}><Chevron open={open} hideChevron={false} /></button>
                                        </div>
                                        <Collapse in={open} timeout="auto" unmountOnExit>
                                            <div className="p-2 rounded bg-[#272525]">
                                                {
                                                    participants?.map((address, i) => (
                                                        <div key={address} className="flex justify-between items-center" >
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
                                        <h3 >{ item.value }</h3>
                                    </div>
                                )
                            )
                        })
                    }
                </div>
                <button
                    disabled={loading}
                    className={`w-full p-3 rounded-[26px] ${loading? "bg-gray-200 opacity-50" : "bg-orange-200"} text-green1 text-xs uppercase font-medium hover:shadow-sm hover:text-orangec hover:shadow-orange-200 focus:shadow-md focus:shadow-orange-200 flex justify-center`}
                    onClick={handleClick}
                >
                    {
                        loading? <Spinner color={"#F87C00"} /> : 'CreatePool'
                    }
                </button>
                {
                    message !== '' && 
                        <div className="border border-gray1 rounded-[16px] bg-gray1 text-orange-400 p-4 font-serif max-h-20 md:max-h-36 overflow-y-auto text-xs md:text-sm text-center">
                            { message }
                        </div>
                }
            </Box>
            {/* <Notification message={message} /> */}
        </Drawer>
    );
}

interface ReviewInputProps {
    values: {title: string, value: string}[];
    type: InputSelector;
    participants?: Address[];
    popUpDrawer: number;
    formType: PoolType;
    toggleDrawer: (arg: number) => void;
}
    // const toggleApprovalModal = (continueExec: boolean) => {
    //     setApprovalModal(false);
    //     setContinuation(true);
    // };

    // // Send transaction
    // const handleCreatePool = async() => {
        
    //     if(isPermissioned) {
    //         await createPermissionedLiquidityPool(
    //             {
    //                 account,
    //                 colCoverage,
    //                 config,
    //                 contributors: participants!,
    //                 durationInHours,
    //                 intRate,
    //                 unitLiquidity: parseEther(unitLiquidity.toString()),
    //                 callback
    //             }
    //         )
    //     } else {
    //         await createPermissionlessLiquidityPool(
    //             {
    //                 account,
    //                 colCoverage,
    //                 config,
    //                 quorum: toBN(values[0].value).toNumber(),
    //                 durationInHours,
    //                 intRate,
    //                 unitLiquidity: parseEther(unitLiquidity.toString()),
    //                 callback
    //             }
    //         );
    //     }
    // }
