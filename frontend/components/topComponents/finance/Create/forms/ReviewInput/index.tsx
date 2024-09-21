import React from "react";
import Container from "@mui/material/Container";
import { PopUp } from "../transactionStatus/PopUp";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { Address, InputSelector, TransactionCallback, TransactionCallbackArg, TrxnResult } from "@/interfaces";
import { Chevron } from "@/components/Collapsible";
import { createPermissionedLiquidityPool } from "@/apis/transact/factory/createPermissionedLiquidityPool";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, toBigInt, toBN } from "@/utilities";
import { createPermissionlessLiquidityPool } from "@/apis/transact/factory/createPermissionless";
import { Approval } from "../Approval";
import Notification from "@/components/Notification";
import { parseEther } from "viem";

interface ReviewInputProps {
    values: {title: string, value: string}[];
    type: InputSelector;
    participants?: Address[];
    modalOpen: boolean;
    handleModalClose: () => void;
}

export const ReviewInput = (props: ReviewInputProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [continueExec, setContinuation] = React.useState<boolean>(false);
    const [approvalModalOpen, setApprovalModal] = React.useState<boolean>(false);
    
    const { modalOpen, values, participants, type, handleModalClose } = props;
    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const unitLiquidity = toBigInt(toBN(values[1].value).toString());
    const colCoverage = toBN(values[4].value).toNumber();
    const intRate = toBN(values[3].value).toNumber();
    const durationInHours = toBN(values[2].value).toNumber();

    const callback : TransactionCallback = (arg: TransactionCallbackArg) => {
        if(arg.txDone) handleModalClose();
        if(arg?.message) setMessage(arg.message);
        // if(arg?.result) setstate(arg.result);
        console.log("Arg result", arg?.result);
    }

    const toggleApprovalModal = (continueExec: boolean) => {
        setApprovalModal(false);
        setContinuation(true);
    };

    const handleCreatePool = async() => {
        const isPermissioned = type === "address";
        if(isPermissioned) {
            await createPermissionedLiquidityPool(
                {
                    account,
                    colCoverage,
                    config,
                    contributors: participants!,
                    durationInHours,
                    intRate,
                    unitLiquidity: parseEther(unitLiquidity.toString()),
                    callback
                }
            )
        } else {
            await createPermissionlessLiquidityPool(
                {
                    account,
                    colCoverage,
                    config,
                    quorum: toBN(values[0].value).toNumber(),
                    durationInHours,
                    intRate,
                    unitLiquidity: parseEther(unitLiquidity.toString()),
                    callback
                }
            );
        }
    }

    React.useEffect(() => {
        if(!values) handleModalClose();
    },[values, handleModalClose]);

    return(
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="sm" className="space-y-4">
                <Stack sx={{bgcolor: 'background.paper'}} className="p-4 md:p-8 my-10 rounded-xl border-2 space-y-6 text-lg ">
                    <Box className="w-full">
                        <button className="w-[20%] float-end text-white bg-orangec p-2 rounded-lg" onClick={() => handleModalClose()}>Close</button>
                    </Box> 
                    <Stack className="space-y-4">
                        {
                            values.map((item) => {
                                return (
                                    (item.title === "Participants" && type === 'address') ? (
                                        <div key={item.title} >
                                            <div className="flex justify-between items-center">
                                                <h3 >{ item.title }</h3>
                                                <button className="w-fullfloat-right" onClick={() => setOpen(!open)}><Chevron open={open} hideChevron={false} /></button>
                                            </div>
                                            <Collapse in={open} timeout="auto" unmountOnExit className="">
                                                <div className="p-2 rounded-lg bg-gray-100">
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
                                        </div>
                                    ) : (
                                        <div key={item.title} className="flex justify-between items-center">
                                            <h3 >{ item.title }</h3>
                                            <h3 >{ item.value }</h3>
                                        </div>
                                    )
                                )
                            })
                        }
                        <Box className="w-full flex justify-between items-center">
                            <button
                                disabled={!continueExec}
                                className={`w-full p-4 rounded-lg ${continueExec? "bg-orangec" : "bg-gray-100"} text-white`}
                                onClick={handleCreatePool}
                            >
                                Transact
                            </button>
                            <button
                                disabled={approvalModalOpen || continueExec}
                                className={`w-full p-4 rounded-lg ${approvalModalOpen || continueExec? "bg-gray-100" : "bg-orangec"} text-white`}
                                onClick={() => setApprovalModal(true)}
                            >
                                Show Approval
                            </button>
                        </Box>
                    </Stack> 
                </Stack>
                <Approval {
                    ...{
                        amountToApprove: unitLiquidity,
                        handleModalClose: toggleApprovalModal,
                        modalOpen: approvalModalOpen,
                    }
                }/>
                <Notification message={message} />
            </Container>
        </PopUp>
    );
}
