import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { flexCenter, flexSpread } from "@/constants";
import type { ButtonText, } from "@/interfaces";
import { Spinner } from "@/components/Spinner";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { DrawerWrapper } from "../../TableChild";
import ButtonTemplate from "@/components/OnboardScreen/ButtonTemplate";

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
        <DrawerWrapper openDrawer={popUpDrawer === 'confirmation'} rest={{padding:'22px', borderLeft: '1px solid #2e3231', height: "100%"}}>
            <Stack className="lg:p-4 space-y-4 text-orange-200 bg-gray1 md:bg-transparent border border-green1 p-4 rounded-[36px] w-full text-center text-md">
                <button onClick={handleCloseDrawer} className="w-[fit-content] active:ring-1 bg-green1 rounded-full p-2 active:ring1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className='pb-6 text-md'>{ loading? "Processing Transaction ..." : message }</h1>
                <ButtonTemplate 
                    buttonAContent="Cancel"
                    buttonBContent={
                        loading? <Spinner color={"white"} /> : "Proceed"
                    }
                    buttonAFunc={handleCloseDrawer}
                    buttonBFunc={handleSendTransaction}
                    disableButtonA={loading}
                    disableButtonB={loading || txResult === 'Success'}
                />
            </Stack>
        </DrawerWrapper>
    );
}
