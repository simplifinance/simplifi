import React from "react";
import { Spinner } from "@/components/utilities/Spinner";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import Drawer from './Drawer';
import { errorMessage, } from "@/apis/update/formatError";
import Message from "../../../../../utilities/Message";
import { Address, ButtonText, HandleTransactionParam, TransactionCallback, VoidFunc } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { formatAddr, handleTransact } from "@/utilities";
import SelectComponent from "@/components/AppFeatures/Dashboard/WelcomeTabs/SelectComponent";

export const Confirmation : 
    React.FC<{
        transactionArgs: HandleTransactionParam
        toggleDrawer: (arg: number) => void
        openDrawer: number,
        back?: VoidFunc,
        optionalDisplay?: React.ReactNode,
        displayMessage?: string,
        actionButtonText?: string;
    }> = 
        ({transactionArgs, back, toggleDrawer, openDrawer, displayMessage, optionalDisplay, actionButtonText}) => 
{   
    const [loading, setLoading] = React.useState<boolean>(false);
    const [assetHolding, setAssetHolding] = React.useState<Address | string>('');
    const { setmessage, setError, setActivepath } = useAppStorage();
    let isGetFinance = false;
    if(transactionArgs !== null && transactionArgs?.txnType){
        isGetFinance = transactionArgs.txnType === 'GetFinance';
    }

    const handleCloseDrawer = () => {
        setmessage('');
        setError('');
        toggleDrawer(0);
    };

    const setConvertible = (arg: Address | string) => setAssetHolding(arg);
    const callback : TransactionCallback = (arg) => {
        if(arg.message) setmessage(arg.message);
        if(arg.errorMessage) setError(arg.errorMessage);
        // if(arg.status === 'success') handleCloseDrawer();
    }
    const isDark = useTheme().theme === 'dark';
    const callback_after = (errored: boolean, txnType: ButtonText, error?: any) => {
        errored && setError(errorMessage(error));
        setLoading(false);
        setTimeout(() => {
            handleCloseDrawer();
            back?.();
            if(txnType === 'Create') setActivepath('Flexpool');
        }, 6000);
        clearTimeout(6000);
    }

    const handleSendTransaction = async() => {
        console.log("transactionArgs", transactionArgs)
        transactionArgs.commonParam.callback = callback;
        if(isGetFinance && assetHolding === '') return alert("Please select the asset you wish to use as collateral");
        transactionArgs.selectedAsset = formatAddr(assetHolding);
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
            <div className="bg-white1 dark:bg-green1/90 space-y-4 text-green1/90 dark:text-orange-300 text-center">
                { optionalDisplay && optionalDisplay }
                {
                    isGetFinance && !loading && <SelectComponent data='convertible' callback={setConvertible} label="Asset holding" placeholder="Which asset are you holding?"/>
                } 
                <Message />
                <Button variant={'outline'} disabled={loading} className="w-full max-w-sm dark:text-orange-200" onClick={handleSendTransaction}>{loading? <Spinner color={"white"} /> : actionButtonText || "Proceed"}</Button>
            </div>
        </Drawer>
    );
}
