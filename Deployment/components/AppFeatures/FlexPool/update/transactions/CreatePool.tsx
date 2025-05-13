import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContract } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { Address, FunctionName, TransactionCallback } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

const steps : FunctionName[] = ['allowance', 'approve', 'createPool'];

export default function CreatePool({ unit, args, toggleDrawer, openDrawer, optionalDisplay }: CreatePoolProps) {
    const config = useConfig();
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { setmessage } = useAppStorage();

    const callback : TransactionCallback = (arg) => {
        if(arg.message) setmessage(arg.message);
        if(arg.errorMessage) setmessage(arg.errorMessage);
    };

    const { contractAddresses: ca, transactionData: td, allowanceArg, approvalArg } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames: steps,
            callback
        });
        const allowanceArg = [account, filtered.contractAddresses.FlexpoolFactory];
        const approvalArg = [filtered.contractAddresses.FlexpoolFactory, unit];

        return { ...filtered, allowanceArg, approvalArg };
    }, [chainId, unit, account]);

    const { data, refetch } = useReadContract(
        {
            config,
            abi: td[0].abi,
            address: ca.stablecoin as Address,
            args: allowanceArg,
            functionName: td[0].functionName,
        }
    );
    const allowance = data as bigint;

    const getTransactions = React.useCallback(() => {
        const txObjects = td.filter(({functionName}) => functionName !== steps[0]);
        if(!allowance) refetch();
        let transactions = txObjects.map((txObject) => {
            const isApprovalTx = txObject.functionName === steps[1];
            const transaction : Transaction = {
                abi: txObject.abi,
                args: isApprovalTx? approvalArg : args,
                contractAddress: txObject.contractAddress as Address,
                functionName: txObject.functionName as FunctionName,
            };
            return transaction;
        })
        console.log("transactions", transactions);
        if(allowance && allowance >= unit){
            transactions = transactions.filter((tx) => tx.functionName = steps[1]);
        }
        console.log("Popped transactions", transactions);
    
        return transactions;
    
   }, [unit, allowance]);

    return(
        <Confirmation 
            openDrawer={openDrawer}
            toggleDrawer={toggleDrawer}
            getTransactions={getTransactions}
            displayMessage='Request to create a Flexpool'
            optionalDisplay={optionalDisplay}
        />
    )
}

type CreatePoolProps = {
    unit: bigint;
    args: any[];
    optionalDisplay?: React.ReactNode;
    openDrawer: number;
    toggleDrawer: (arg: number) => void;
};