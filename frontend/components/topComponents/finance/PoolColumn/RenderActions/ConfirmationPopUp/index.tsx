import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { flexCenter, flexSpread } from "@/constants";
import type { ButtonText, } from "@/interfaces";
import { Spinner } from "@/components/Spinner";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { DrawerWrapper } from "../../TableChild";

export const ConfirmationPopUp : 
    React.FC<{
        sendTransaction: () => Promise<void>;
        buttonText: ButtonText, 
        epochId: number
    }> = 
        ({sendTransaction, buttonText, epochId}) => 
{
    const handleCloseDrawer = () => handlePopUpDrawer('');
    const { setTrxnStatus, popUpDrawer, handlePopUpDrawer, txnStatus: { loading, txResult } } = useAppStorage();
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

    const broadcastTransaction = async() => {
        await sendTransaction()
            .then(() => {
                setTrxnStatus({loading: false, message: 'Trxn Completed', txResult: 'Success'});
                handleCloseDrawer();
            })
                .catch((error: any) => {
                    const errorMessage : string = error?.message || error?.data?.message;
                    setTrxnStatus({loading: false, message: `Trxn failed with ${errorMessage.length > 120? errorMessage.substring(0, 100) : errorMessage}`, txResult: ''});
                });
    }
    
    const handleSendTransaction = async() => {
        setTrxnStatus({loading: true, message: 'Trxn processing', txResult: ''});
        await broadcastTransaction();
        // setTimeout(
        //     async() => {
        //         handleCloseDrawer();
        //         await broadcastTransaction();
        //     }, 
        //     3000
        // );
        
    }

    return (
        <DrawerWrapper openDrawer={popUpDrawer === 'confirmation'}>
            <Stack className="p-4 lg:p-8 rounded-lg space-y-12 text-xl bg-gray1 text-orange-200 shadow-lg shadow-orange-400">
                <button onClick={handleCloseDrawer} className="w-2/4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1>{ loading? "Processing Transaction ..." : message }</h1>
                <Box className={`${flexSpread} gap-4 `}>
                    <button
                        disabled={loading}
                        className={`${flexCenter} w-full ${loading? "bg-opacity-50" : ""} border-[0.3px] border-green1 text-[12px] text-orange-200 hover:bg-orange-400 hover:text-white1 p-2 active:ring-1 uppercase rounded-full underlineFromLeft flex justify-center`}
                        onClick={handleCloseDrawer}
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={loading || txResult === 'Success'}
                        className={`${flexCenter} w-full ${loading? "bg-opacity-50" : "text-green1"} bg-orange-200 border-[0.3px] border-gray1 text-[12px] font-semibold text-green1 hover:bg-orange-400 hover:text-white1 p-2 uppercase active:ring-1 rounded-full underlineFromLeft flex justify-center`}
                        onClick={handleSendTransaction}
                    >
                        {
                            loading? <Spinner color={"white"} /> : "Proceed"
                        }
                    </button>
                </Box>
            </Stack>
        </DrawerWrapper>
    );
}
