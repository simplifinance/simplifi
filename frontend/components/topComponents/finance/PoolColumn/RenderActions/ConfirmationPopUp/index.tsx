import React from "react";
import Stack from "@mui/material/Stack";
import type { ButtonText, } from "@/interfaces";
import { Spinner } from "@/components/Spinner";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { DrawerWrapper } from "../../TableChild";
import ButtonTemplate from "@/components/OnboardScreen/ButtonTemplate";
import { formatError } from "@/apis/transact/formatError";

export const ConfirmationPopUp : 
    React.FC<{
        sendTransaction: () => Promise<void>;
        buttonText: ButtonText, 
        epochId: number
    }> = 
        ({sendTransaction, buttonText, epochId}) => 
{   
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleCloseDrawer = () => handlePopUpDrawer('');
    const { setTrxnStatus, popUpDrawer, handlePopUpDrawer, txnStatus } = useAppStorage();
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
        setLoading(true);
        await sendTransaction()
        .then(() => {
            setTrxnStatus({message: 'Trxn Completed',});
            setLoading(false);
            setTimeout(() => handleCloseDrawer(), 3000);
        })
        .catch((error: any) => {
            const errorMessage = formatError(error);
            setTrxnStatus({message: `Trxn failed with ${errorMessage.length > 120? errorMessage.substring(0, 100) : errorMessage}`,});
            setLoading(false);
            setTimeout(() => handleCloseDrawer(), 3000);
        });
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
                    disableButtonB={loading}
                    overrideClassName="border border-gray1"
                />
            </Stack>
        </DrawerWrapper>
    );
}
