import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { PopUp } from "@/components/transactionStatus/PopUp";
import { flexCenter, flexSpread } from "@/constants";
import type { ButtonText, VoidFunc } from "@/interfaces";
import { Spinner } from "@/components/Spinner";
import Image from "next/image";
import Notification from "@/components/Notification";

type TrxResult = 'Failed' | 'Success' | '';

export const ConfirmationPopUp : 
    React.FC<{
        modalOpen: boolean, 
        handleModalClose: VoidFunc,
        sendTransaction: () => Promise<void>;
        buttonText: ButtonText, 
        epochId: number
    }> = 
        ({modalOpen, handleModalClose, sendTransaction, buttonText, epochId}) => 
{
    const [txnStatus, setTxnStatus] = React.useState<{loading: boolean, message: string, txResult: TrxResult}>({loading: false, txResult: '', message: ''});

    let message = ``;

    switch (buttonText) {
        case 'ADD':
            message = `You're about to join add liquidity to epoch ${epochId}`;
            break;
        case 'GET':
            message = `Now You're getting finance from epoch ${epochId}`;
            break;
        case 'PAY':
            message = `Returning borrowed fund to pool at epoch ${epochId}`
            break;
        case 'LIQUIDATE':
            message = `Setting liquidation at epoch ${epochId}`;
            break;

        default:
            message = `No valid transaction request found at epoch ${epochId}`;
            break;
    }

    
    const handleSendTransaction = async() => {
        setTxnStatus({loading: true, message: 'Trxn processing', txResult: ''});
        await sendTransaction()
            .then(() => {
                setTxnStatus({loading: false, message: 'Trxn Completed', txResult: 'Success'});
                handleModalClose();
            })
                .catch((error: any) => {
                    const errorMessage : string = error?.message || error?.data?.message;
                    setTxnStatus({loading: false, message: `Trxn failed with ${errorMessage.length > 120? errorMessage.substring(0, 100) : errorMessage}`, txResult: ''});
                });
    }


    return (
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="xs" className="space-y-2">
                <Stack sx={{bgcolor: 'background.paper'}} className="p-4 md:p-8 my- rounded-xl space-y-6 bg-orangec">
                   {
                        txnStatus.loading? 
                            <Box>
                                <Image 
                                    src='/blockchain.svg'
                                    alt={"Loading image"}
                                    width={100}
                                    height={100}
                                />
                            </Box>
                                : 
                                <Stack className={`${flexCenter} space-y-4 text-lg font-semibold `}>
                                    <h3>{message}</h3>
                                    <h3 className="text-sm ">Confirm sending</h3>
                                </Stack>
                   }
                    <Box className={`${flexSpread} gap-4 `}>
                        <button 
                            disabled={txnStatus.loading}
                            className={`${flexCenter} w-full border border-yellow-100 bg-orangec p-4 rounded-lg text-white1 hover:shadow-lg hover:shadow-green1`}
                            onClick={handleModalClose}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 text-white1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <button 
                            disabled={txnStatus.loading || txnStatus.txResult === 'Success'}
                            className={`${flexCenter} w-full text-orangec bg-yellow-100 border border-orangec p-4 rounded-lg hover:shadow-lg hover:shadow-green1`}
                            onClick={handleSendTransaction}
                        >
                            {
                                txnStatus.loading? <Spinner color={"orange"} /> : 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                            }
                        </button>
                    </Box>
                </Stack>
                <Notification message={txnStatus.message} />
            </Container>
        </PopUp>
    );
}

interface PreferredDurationInputProp {
    modalOpen: boolean;
    maxEpochDuration: string;
    preferredDuration: string;
    handleModalClose: VoidFunc;
    useEpochDuration: VoidFunc
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}