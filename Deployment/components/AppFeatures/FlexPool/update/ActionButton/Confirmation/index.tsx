import React from "react";
import { Spinner } from "@/components/utilities/Spinner";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import Drawer from './Drawer';
import { formatError, } from "@/apis/update/formatError";
import Message from "../../../../../utilities/Message";
import { ButtonText, HandleTransactionParam, TransactionCallback, VoidFunc } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { flexSpread } from "@/constants";
import { useTheme } from "next-themes";
import { handleTransact } from "@/utilities";

export const Confirmation : 
    React.FC<{
        transactionArgs: HandleTransactionParam
        toggleDrawer: (arg: number) => void
        openDrawer: number,
        back?: VoidFunc
    }> = 
        ({transactionArgs, back, toggleDrawer, openDrawer}) => 
{   
    const [loading, setLoading] = React.useState<boolean>(false);
    const { setmessage, setError, setActivepath } = useAppStorage();

    const handleCloseDrawer = () => {
        setmessage('');
        setError('');
        toggleDrawer(0);
    };
    
    const callback : TransactionCallback = (arg) => {
        if(arg.message) setmessage(arg.message);
        if(arg.errorMessage) setError(arg.errorMessage);
        // if(arg.status === 'success') handleCloseDrawer();
    }
    const isDark = useTheme().theme === 'dark';
    const callback_after = (errored: boolean, txnType: ButtonText, error?: any) => {
        errored && setError(formatError({error}));
        setLoading(false);
        setTimeout(() => {
            handleCloseDrawer();
            back?.();
            if(txnType === 'Create') setActivepath('Flexpool');
            // closeDisplayForm();
        }, 10000);
        clearTimeout(10000);
    }

    const handleSendTransaction = async() => {
        transactionArgs.commonParam.callback = callback;
        setLoading(true);
        await handleTransact(transactionArgs)
        .then(({error, errored}) => callback_after(errored, transactionArgs.txnType, error))
    }

    return (
        <Drawer 
            openDrawer={openDrawer} 
            setDrawerState={toggleDrawer}
            styles={{padding:'22px', borderLeft: '1px solid #2e3231', height: "100%", background: isDark? '#121212' : '#F9F4F4'}}
        >
            <div className="p-4 space-y-6 text-green1/90 dark:text-orange-300 text-center">
                <div className={`${flexSpread}`}>
                    <h3 className='text-lg text-left w-2/4 font-bold'>{ loading? "Transaction in progress..." : 'Confirm send transaction' }</h3>
                    <Button variant={'outline'} onClick={handleCloseDrawer} className="w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 dark:text-orange-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>
                <Message />
                <Button variant={'outline'} disabled={loading} className="w-full max-w-sm dark:text-orange-200" onClick={handleSendTransaction}>{loading? <Spinner color={"white"} /> : "Proceed"}</Button>
            </div>
        </Drawer>
    );
}
