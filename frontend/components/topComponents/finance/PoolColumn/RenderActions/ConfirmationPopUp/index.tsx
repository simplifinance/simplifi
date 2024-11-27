import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { flexCenter, flexSpread } from "@/constants";
import type { ButtonText, VoidFunc } from "@/interfaces";
import { Spinner } from "@/components/Spinner";
import Image from "next/image";
import Notification from "@/components/Notification";
import { PopUp } from "../../../Create/forms/transactionStatus/PopUp";

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
        case 'ADD LIQUIDITY':
            message = `Request to add liquidity to epoch ${epochId}`;
            break;
        case 'GET FINANCE':
            message = `Getting finance from epoch ${epochId}`;
            break;
        case 'PAYBACK':
            message = `Paying back loan at epoch ${epochId}`
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
                <Stack className="p-4 lg:p-8 rounded-lg space-y-12 text-lg bg-green1 text-white1 border shadow-lg shadow-yellow-100">
                   {
                        txnStatus.loading? 
                            <p>{"Transaction Processing ..."}</p>
                                : 
                            <p className="text-white1/70">{message}</p>
                   }
                    <Box className={`${flexSpread} gap-4 `}>
                        <button 
                            disabled={txnStatus.loading}
                            className={`${flexCenter} w-full ${txnStatus.loading? "bg-opacity-50" : "bg-orangec text-white1"} font-semibold p-3 rounded-lg hover:text-white1/60 underlineFromLeft`}
                            onClick={handleModalClose}
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={txnStatus.loading || txnStatus.txResult === 'Success'}
                            className={`${flexCenter} w-full ${txnStatus.loading? "bg-opacity-50" : "bg-yellow-200 text-orangec"} font-semibold p-3 rounded-lg hover:text-gray-600/30 underlineFromLeft place-items-center`}
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
