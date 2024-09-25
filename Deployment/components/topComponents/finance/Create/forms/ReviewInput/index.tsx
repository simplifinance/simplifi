import React from "react";
import Container from "@mui/material/Container";
import { PopUp } from "../transactionStatus/PopUp";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { Address, AmountToApproveParam, CreatePermissionedPoolParams, CreatePermissionLessPoolParams, InputSelector, TransactionCallback, TransactionCallbackArg, TrxnResult } from "@/interfaces";
import { Chevron } from "@/components/Collapsible";
import { createPermissionedLiquidityPool } from "@/apis/transact/factory/createPermissionedLiquidityPool";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, handleTransact, toBigInt, toBN } from "@/utilities";
import { createPermissionlessLiquidityPool } from "@/apis/transact/factory/createPermissionless";
import Notification from "@/components/Notification";
import { parseEther } from "viem";
import { Spinner } from "@/components/Spinner";
import { StorageContext } from "@/components/StateContextProvider";

interface ReviewInputProps {
    values: {title: string, value: string}[];
    type: InputSelector;
    participants?: Address[];
    modalOpen: boolean;
    handleModalClose: () => void;
}

type ButtonContent = 'Approve' | 'CreatePool' | 'Completed';

export const ReviewInput = (props: ReviewInputProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<{buttonText: ButtonContent, value: boolean}>({buttonText: 'Approve', value: false});
    const [message, setMessage] = React.useState<string>('');
    
    const { modalOpen, values, participants, type, handleModalClose } = props;
    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const { setstate } = React.useContext(StorageContext);
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

    const otherParam: AmountToApproveParam = { account, config, unit: parseEther(unitLiquidity.toString()), txnType: "AWAIT PAYMENT"};
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
        otherParam.txnType = 'AWAIT PAYMENT';
        setLoading((prev) => {prev.value = true; return prev;});
        const isPermissioned = type === "address";
        switch (loading.buttonText) {
            case 'Approve':
                await handleTransact({ callback, otherParam })
                    .then(() => setLoading({value: false, buttonText: 'CreatePool'}))
                break;
            case 'CreatePool':
                otherParam.txnType = 'CREATE';
                await handleTransact({
                    router: isPermissioned? 'Permissioned' : 'Permissionless',
                    callback,
                    otherParam,
                    createPermissionedPoolParam,
                    createPermissionlessPoolParam,
                }).then(() => setLoading({value: false, buttonText: 'Completed'}))
                break;
            default:
                break;
        }
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
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="xs" className="space-y-4">
                <Stack className="p-4 md:p-8 rounded-lg space-y-4 text-lg bg-green1 text-white1 border shadow-lg shadow-yellow-100">
                    <Box className="w-full">
                        <button className="w-[15%] float-end text-xs text-white1 bg-green1 rounded-lg hover:shadow-lg p-2 hover:shadow-orangec hover:text-yellow-200 font-extrabold" onClick={() => handleModalClose()}>Close</button>
                    </Box> 
                    <Stack className="space-y-4">
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
                                        <div key={item.title} className="flex justify-between items-center text-sm font-semibold">
                                            <h3 >{ item.title }</h3>
                                            <h3 >{ item.value }</h3>
                                        </div>
                                    )
                                )
                            })
                        }
                        <Box className="w-full flex justify-center items-center">
                            <button
                                disabled={loading.value || loading.buttonText === 'Completed'}
                                className={`w-full p-3 rounded-lg ${loading.value? "bg-gray-200 opacity-50" : "bg-yellow-100"} text-orangec border border-orangec text-small font-extrabold hover:bg-orangec hover:text-black flex justify-center`}
                                onClick={handleClick}
                            >
                                {
                                    loading.value? <Spinner color={"#F87C00"} /> : loading.buttonText
                                }
                            </button>
                        </Box>
                    </Stack> 
                </Stack>
                <Notification message={message} />
            </Container>
        </PopUp>
    );
}
