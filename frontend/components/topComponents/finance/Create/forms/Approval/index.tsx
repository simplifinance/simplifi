import React from "react";
import Container from "@mui/material/Container";
import { PopUp } from "../transactionStatus/PopUp";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { TransactionCallback, TransactionCallbackArg, } from "@/interfaces";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, toBN } from "@/utilities";
import { approve } from "@/apis/testToken/approve";
import { formatEther, parseEther } from "viem";
import Notification from "@/components/Notification";

interface ApprovalProps {
    amountToApprove: bigint;
    modalOpen: boolean;
    handleModalClose: (arg: boolean) => void;
}

export const Approval = (props: ApprovalProps) => {
    const [message, setMessage] = React.useState<string>('');
    const { modalOpen, amountToApprove, handleModalClose } = props;
    const account = formatAddr(useAccount().address);
    const config = useConfig();

    const callback : TransactionCallback = (arg: TransactionCallbackArg) => {
        if(arg.message) setMessage(arg.message);
        if(arg.txDone) {
            handleModalClose(true);
        }
    }

    const handleModalClose_ = () => handleModalClose(false);

    const handleApprovalTransaction = async() => {
        await approve({
            account,
            amountToApprove: parseEther(amountToApprove.toString()),
            config,
            callback
        })
    }

    return(
        <PopUp { ...{modalOpen, handleModalClose: handleModalClose_ } } > 
            <Container maxWidth="sm" className="space-y-4">
                <Stack sx={{bgcolor: 'background.paper'}} className="p-4 md:p-8 my-10 rounded-xl border-2 space-y-6 text-lg ">
                    <Box className="w-full flex justify-between items-center">
                        <h3>Approve Factory</h3>
                        <button className="w-[20%] float-end text-white bg-orange-400 p-2 rounded-lg" onClick={() => handleModalClose(false)}>Close</button>
                    </Box> 
                    <Stack className="space-y-4">
                        <Box className="flex justify-between items-center ">
                            <h3>Spender</h3>
                            <h3>Factory</h3>
                        </Box>
                        <Box className="flex justify-between items-center">
                            <h3>Amount</h3>
                            <h3>{`${amountToApprove.toString()} USDT`}</h3>
                        </Box>
                        <button 
                            className="bg-orange-400 p-4 rounded-lg text-white"
                            onClick={handleApprovalTransaction}
                        >
                            Approve
                        </button>
                    </Stack> 
                </Stack>
                <Notification message={message} />
            </Container>
        </PopUp>
    );
}
