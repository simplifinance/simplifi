import React from "react";
import Stack from "@mui/material/Stack";
import type { ButtonText, } from "@/interfaces";
import { Spinner } from "@/components/Spinner";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { DrawerWrapper } from "../../TableChild";
import ButtonTemplate from "@/components/OnboardScreen/ButtonTemplate";
import { formatError, FormatErrorArgs } from "@/apis/transact/formatError";

export const ConfirmationPopUp : 
    React.FC<{
        sendTransaction: (arg: {onSuccess: () => void, onError: (errorArg: FormatErrorArgs) => void}) => Promise<void>;
        buttonText: ButtonText, 
        epochId: number
    }> = 
        ({sendTransaction, buttonText, epochId}) => 
{   
    const [loading, setLoading] = React.useState<boolean>(false);
    const { setTrxnStatus, popUpDrawer, setmessage, message, handlePopUpDrawer, } = useAppStorage();
    const handleCloseDrawer = () => {
        handlePopUpDrawer('');
        setmessage('');
    };
    let displayMessage = ``;

    switch (buttonText) {
        case 'ADD LIQUIDITY':
            displayMessage = `Request to add liquidity to epoch ${epochId}`;
            break;
        case 'GET FINANCE':
            displayMessage = `Getting finance from epoch ${epochId}`;
            break;
        case 'PAYBACK':
            displayMessage = `Paying back loan at epoch ${epochId}`
            break;
        case 'LIQUIDATE':
            displayMessage = `Setting liquidation at epoch ${epochId}`;
            break;
        default:
            displayMessage = `No valid transaction request found at epoch ${epochId}`;
            break;
    }

    const handleSendTransaction = async() => {
        setLoading(true);
        await sendTransaction({
            onSuccess: () => {
                setTrxnStatus({message: 'Trxn Completed',});
                setLoading(false);
                setTimeout(() => handleCloseDrawer(), 5000);
                clearTimeout(5000);
            },
            onError: (errorArg: FormatErrorArgs) => {
                setTrxnStatus({message: formatError(errorArg)});
                setLoading(false);
                setTimeout(() => handleCloseDrawer(), 5000);
                clearTimeout(5000);
            }
        });

    }

    return (
        <DrawerWrapper openDrawer={popUpDrawer === 'confirmation'} rest={{padding:'22px', borderLeft: '1px solid #2e3231', height: "100%"}}>
            <Stack className="p-4 space-y-4 text-orange-200 text-center">
                <button onClick={handleCloseDrawer} className="w-[fit-content] active:ring-1 bg-green1 rounded-full active:ring1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className='pb-6 text-md'>{ loading? "Processing Transaction ..." : displayMessage }</h1>
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
                {
                    message !== '' && 
                        <div className="border border-gray1 rounded-[16px] bg-gray1 text-orange-400 p-4 font-serif max-h-20 md:max-h-36 overflow-y-auto text-xs md:text-sm">
                            { message }
                        </div>
                }
            </Stack>
        </DrawerWrapper>
    );
}
