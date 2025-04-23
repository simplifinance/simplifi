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
        back?: VoidFunc,
        displayMessage?: string
    }> = 
        ({transactionArgs, back, toggleDrawer, openDrawer, displayMessage}) => 
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
            title={ !loading? (displayMessage || 'Transaction request') : 'Transaction sent' }
            openDrawer={openDrawer} 
            setDrawerState={toggleDrawer}
            onClickAction={handleCloseDrawer}
            styles={{padding:'22px', borderLeft: '1px solid #2e3231', height: "100%", background: isDark? '#121212' : '#F9F4F4'}}
        >
            <div className="minHeight bg-white1 dark:bg-green1/90 p-4 space-y-4 text-green1/90 dark:text-orange-300 text-center">
                <Message />
                <Button variant={'outline'} disabled={loading} className="w-full max-w-sm dark:text-orange-200" onClick={handleSendTransaction}>{loading? <Spinner color={"white"} /> : "Proceed"}</Button>
            </div>
        </Drawer>
    );
}
