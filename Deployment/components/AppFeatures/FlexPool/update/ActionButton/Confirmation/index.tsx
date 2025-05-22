import React from "react";
import { Spinner } from "@/components/utilities/Spinner";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import Drawer from './Drawer';
import Message from "../../../../../utilities/Message";
import { Address, FunctionName, VoidFunc } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { formatAddr } from "@/utilities";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { WriteContractErrorType } from "wagmi/actions";

export const Confirmation : 
    React.FC<ConfirmationProps> = 
        ({ getTransactions, back, toggleDrawer, lastStepInList, openDrawer, displayMessage, optionalDisplay, actionButtonText}) => 
{   
    const [loading, setLoading] = React.useState<boolean>(false);

    const { setmessage, setError, setActivepath, refetch } = useAppStorage();
    const isDark = useTheme().theme === 'dark';
    const { address } = useAccount();
    const account = formatAddr(address);
    const config = useConfig();

    // Reset the messages and error messages in state, and close the drawer when transaction is completed
    const handleCloseDrawer = () => {
        setmessage('');
        setError('');
        toggleDrawer(0);
    };

    // Wait for sometime before resetting the state after completing a transaction
    const setCompletion = async(functionName: FunctionName) => {
        await refetch();
        setLoading(false);
        setTimeout(() => {
            handleCloseDrawer();
            back?.();
            if(functionName === 'createPool') setActivepath('Flexpool');
        }, 8000);
        clearTimeout(8000);
    };

    // Call this function when transaction successfully completed
    const onSuccess = (data: Address, variables: any) => {
        if(variables.functionName === lastStepInList){
            setmessage(`Completed ${variables.functionName} with hash: ${data.substring(0, 16)}...`);
            setCompletion(variables.functionName as FunctionName);
        } else {
            setmessage(`Completed approval request with: ${data.substring(0, 8)}...`);
        }
    };

    
    const { writeContractAsync: retry} = useWriteContract({
        config,
        mutation: { 
            // retry(failureCount, error) {
            //     return true;
            // },
            // retryDelay(failureCount, error) {
            //     return 1000;
            // },
            // gcTime: 3,
            onSuccess, 
            onError : (error, variables) => {
                setError(error.message);
                setCompletion(variables.functionName as FunctionName);
            }
        }
    });

    const onError = async(error: WriteContractErrorType, variables: any) => {
        if(variables.functionName !== lastStepInList){
            setError('');
            setmessage(`${variables.functionName.toLocaleUpperCase()} failed!. Retrying ${lastStepInList}...`);
            const transactions = getTransactions();
            const { abi, functionName, args: inArgs, value, requireArgUpdate, refetchArgs, contractAddress,  } = transactions[transactions.length - 1];
            let args = inArgs;
            let value_ = value;
            if(requireArgUpdate) {
                const result = await refetchArgs?.(functionName);
                args = result?.args || [];
                value_ = result?.value;
            }
            console.log("argsreeee", args)
            await retry({
                abi,
                functionName,
                address: contractAddress,
                account,
                args,
                value
            })
            setCompletion(variables.functionName as FunctionName);

        } else {
            setError(error.message);
            setCompletion(variables.functionName as FunctionName);
        }
    }

    const { writeContractAsync, } = useWriteContract({
        config, 
        mutation: { onError, onSuccess }
    });

    const handleSendTransaction = async() => {
        setLoading(true);
        const transactions = getTransactions();
        // console.log("confirmation transactions", transactions);
        for( let i = 0; i < transactions.length; i++) {
            const {abi, value, functionName, refetchArgs, requireArgUpdate, contractAddress: address, args: inArgs} = transactions[i];
            let args = inArgs;
            let value_ = value;
            if(requireArgUpdate) {
                const result = await refetchArgs?.(functionName);
                args = result?.args || [];
                value_ = result?.value;
            }
            await writeContractAsync({
                abi,
                functionName,
                address,
                account,
                args,
                value: value_
            });
        }
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
                {/* {
                    isGetFinance && !loading && <SelectComponent data='convertible' callback={setConvertible} label="Asset holding" placeholder="Which asset are you holding?"/>
                }  */}
                <Message />
                <Button variant={'outline'} disabled={loading} className="w-full max-w-sm dark:text-orange-200" onClick={handleSendTransaction}>{loading? <Spinner color={"white"} /> : actionButtonText || "Proceed"}</Button>
            </div>
        </Drawer>
    );
}

export type Transaction = {
    functionName: FunctionName,
    contractAddress: Address,
    args: any[] | [],
    requireArgUpdate: boolean;
    abi: any[] | Readonly<any[]>;
    value?: bigint;
    refetchArgs?: (funcName: FunctionName) => Promise<{args: any[], value: bigint}>;
};

export interface ConfirmationProps {
    toggleDrawer: (arg: number) => void;
    openDrawer: number;
    back?: VoidFunc;
    optionalDisplay?: React.ReactNode;
    displayMessage?: string;
    actionButtonText?: string;
    getTransactions: () => Transaction[];
    lastStepInList: FunctionName;
}
