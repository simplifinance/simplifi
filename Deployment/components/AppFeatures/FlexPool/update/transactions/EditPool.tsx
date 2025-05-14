import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { FunctionName, TransactionCallback } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import assert from 'assert';
import { ActionButton } from '../ActionButton';

const steps : FunctionName[] = ['editPool'];

export default function EditPool({ unit, args,disabled }: EditPoolProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const { chainId } = useAccount();
    const { callback } = useAppStorage();

    const { contractAddresses: ca, transactionData: td } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames:steps,
            callback
        });

        return { ...filtered };
    }, [chainId ]);

    const getTransactions = React.useCallback(() => {
        let transactions = td.map((txObject) => {
            assert(args.length === txObject.inputCounts, "Args not fully provided");
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
    
   }, [unit, ca, td]);

    return(
        <React.Fragment>
             <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer}
                buttonContent='Edit'
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to edit a pool'
                lastStepInList='editPool'
            />
        </React.Fragment>
    )
}

type EditPoolProps = {
    unit: bigint;
    args: any[];
    disabled: boolean;
};