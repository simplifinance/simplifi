import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { FunctionName } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import assert from 'assert';

export default function Borrow({ unit, args, openDrawer, toggleDrawer }: BorrowProps) {
    const { chainId } = useAccount();
    const { callback } = useAppStorage();

    const { contractAddresses: ca, transactionData: td } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['borrow'],
            callback
        });

        return { ...filtered };
    }, [chainId, callback]);

    const getTransactions = React.useCallback(() => {
        let transactions = td.map((txObject) => {
            assert(args.length === txObject.inputCount, "Args not fully provided");
            const transaction : Transaction = {
                abi: txObject.abi,
                args,
                contractAddress: formatAddr(txObject.contractAddress),
                functionName: txObject.functionName as FunctionName,
                requireArgUpdate: txObject.requireArgUpdate
            };
            return transaction;
        })
        return transactions;
    
   }, [td, args]);

    return(
        <Confirmation 
            openDrawer={openDrawer}
            toggleDrawer={toggleDrawer}
            getTransactions={getTransactions}
            displayMessage='Request to finance contribution through a provider'
            lastStepInList='borrow'
        />
    )
}

type BorrowProps = {
    unit: bigint;
    args: any[];
    toggleDrawer: (arg: number) => void;
    openDrawer: number;
};