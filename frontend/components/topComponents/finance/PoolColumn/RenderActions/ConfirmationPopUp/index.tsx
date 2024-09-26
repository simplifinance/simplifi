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
            message = `You request to add liquidity to epoch ${epochId}`;
            break;
        case 'GET':
            message = `Now, getting finance from epoch ${epochId}`;
            break;
        case 'PAY':
            message = `Paying back to pool at epoch ${epochId}`
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
            <Container maxWidth="xs" className="space-y-4">
                <Stack className="p-4 md:p-8 rounded-lg space-y-12 text-lg bg-green1 text-white1 border shadow-lg shadow-yellow-100">
                   {
                        txnStatus.loading? 
                            <Box className={`${flexCenter} my-4 text-2xl text-center text-yellow-200`}>
                                {/* <Image 
                                    src='/blockchain.svg'
                                    alt={"Loading image"}
                                    width={100}
                                    height={100}
                                /> */}
                                <h3>{"Transaction Processing ..."}</h3>
                            </Box>
                                : 
                                <Stack className={`${flexCenter} text-2xl font-semibold text-wrap text-center text-yellow-100`}>
                                    <h3>{message}</h3>
                                    {/* <h3 className="text-sm ">Confirm to send</h3> */}
                                </Stack>
                   }
                    <Box className={`${flexSpread} gap-4 `}>
                        <button 
                            disabled={txnStatus.loading}
                            className={`${flexCenter} w-full ${txnStatus.loading? "bg-opacity-50" : "bg-orangec text-yellow-100"} font-extrabold p-3 rounded-lg hover:shadow-md hover:shadow-yellow-100 hover:text-black`}
                            onClick={handleModalClose}
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={txnStatus.loading || txnStatus.txResult === 'Success'}
                            className={`${flexCenter} w-full ${txnStatus.loading? "bg-opacity-50" : "bg-yellow-200 text-orangec"} font-extrabold p-3 rounded-lg hover:shadow-md hover:shadow-yellow-100 hover:text-black`}
                            onClick={handleSendTransaction}
                        >
                            {
                                txnStatus.loading? <Spinner color={"orange"} /> : "Proceed"
                            }
                        </button>
                    </Box>
                </Stack>
                <Notification message={txnStatus.message} />
            </Container>
        </PopUp>
    );
}
