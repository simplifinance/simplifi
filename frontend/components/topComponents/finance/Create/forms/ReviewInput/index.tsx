import React from "react";
import Container from "@mui/material/Container";
import { PopUp } from "../transactionStatus/PopUp";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import type { Address, AmountToApproveParam, ButtonContent, CreatePermissionedPoolParams, CreatePermissionLessPoolParams, InputSelector, TransactionCallback, TransactionCallbackArg } from "@/interfaces";
import { Chevron } from "@/components/Collapsible";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, handleTransact, toBigInt, toBN } from "@/utilities";
import Notification from "@/components/Notification";
import { parseEther } from "viem";
import { Spinner } from "@/components/Spinner";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import TransactionWindow from "../../../PoolColumn/RenderActions/ConfirmationPopUp/TransactionWindow";

interface ReviewInputProps {
    values: {title: string, value: string}[];
    type: InputSelector;
    participants?: Address[];
    modalOpen: boolean;
    handleModalClose: () => void;
}

export const ReviewInput = (props: ReviewInputProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<{buttonText: ButtonContent, value: boolean}>({buttonText: 'Approve', value: false});
    const [message, setMessage] = React.useState<string>('');
    
    const { modalOpen, values, participants, type, handleModalClose } = props;
    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const { setstate, setTrxnStatus } = useAppStorage();
    const unitLiquidity = toBigInt(toBN(values[1].value).toString());
    const colCoverage = toBN(values[4].value).toNumber();
    const intRate = toBN(values[3].value).toNumber();
    const durationInHours = toBN(values[2].value).toNumber();

    const callback : TransactionCallback = (arg: TransactionCallbackArg) => {
        // if(arg.txDone) handleModalClose();
        if(arg?.message) setMessage(arg.message);
        if(arg?.result) setstate(arg.result);
        console.log("Arg result", arg?.result);
    }

    const otherParam: AmountToApproveParam = { account, config, unit: parseEther(unitLiquidity.toString()), txnType: "APPROVE"};
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

    const handleClick = async() => {
        // otherParam.txnType = 'AWAIT PAYMENT';
        setTrxnStatus({loading: true, message: 'Trxn processing', txResult: ''});
        // setLoading((prev) => {prev.value = true; return prev;});
        const isPermissioned = type === "address";
        switch (loading.buttonText) {
            case 'Approve':
                await handleTransact({ callback, otherParam })
                    // .then(() => setLoading({value: false, buttonText: 'CreatePool'}))
                    // setTrxnStatus({loading: false, message: 'Approval Completed', txResult: 'Success'})
                    .then(() => setTrxnStatus({loading: false, buttonText: 'CreatePool', message: 'Approval Completed', txResult: 'Success'}))
                    .catch((error: any) => {
                        const errorMessage : string = error?.message || error?.data?.message;
                        setTrxnStatus({loading: false, message: `Trxn failed with ${errorMessage.length > 120? errorMessage.substring(0, 100) : errorMessage}`, txResult: ''});
                    }); 
                break;
            case 'CreatePool':
                otherParam.txnType = 'CREATE';
                await handleTransact({
                    router: isPermissioned? 'Permissioned' : 'Permissionless',
                    callback,
                    otherParam,
                    createPermissionedPoolParam,
                    createPermissionlessPoolParam,
                })
                .then(() => setTrxnStatus({loading: false, buttonText: 'Completed', message: 'Transaction Completed', txResult: 'Success'}))
                .catch((error: any) => {
                    const errorMessage : string = error?.message || error?.data?.message;
                    setTrxnStatus({loading: false, message: `Trxn failed with ${errorMessage.length > 120? errorMessage.substring(0, 100) : errorMessage}`, txResult: ''});
                }); 
                break;
            default:
                break;
        }
    }

    React.useEffect(() => {
        if(!values) handleModalClose();
        if(loading.buttonText === 'Completed') {
            setTimeout(() => {
                handleModalClose();
                setLoading({value: false, buttonText: 'Approve'})
            }, 3000);
        }
        return() => clearTimeout(3000);
    },[values, handleModalClose, loading.buttonText]);

    return(
        <TransactionWindow openDrawer={modalOpen} styles={{background: '#121212', borderLeft: '1px solid rgb(249 244 244 / 0.3)', display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px'}}>
            <Box className="p-4 text-orange-200 space-y-6 gap-4 overflow-hidden">
                <button onClick={handleModalClose}>
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
                    disabled={loading.value || loading.buttonText === 'Completed'}
                    className={`w-full p-3 rounded-[26px] ${loading.value? "bg-gray-200 opacity-50" : "bg-orange-200"} text-green1 text-xs uppercase font-medium hover:bg-orangec hover:text-white1 focus:shadow-md focus:shadow-orange-200 flex justify-center`}
                    onClick={handleClick}
                >
                    {
                        loading.value? <Spinner color={"#F87C00"} /> : loading.buttonText
                    }
                </button>
            </Box>
            <Notification message={message} />
        </TransactionWindow>
    );
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
