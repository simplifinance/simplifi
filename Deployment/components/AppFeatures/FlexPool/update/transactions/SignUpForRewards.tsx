import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { FunctionName, TransactionCallback } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

const steps : FunctionName[] = ['registerToEarnPoints'];

export default function SignUpForRewards({disabled} : {disabled: boolean}) {
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
    }, [chainId]);

    const getTransactions = React.useCallback(() => {
        let transactions = td.map((txObject) => {
            const transaction : Transaction = {
                abi: txObject.abi,
                args: [],
                contractAddress: formatAddr(txObject.contractAddress),
                functionName: txObject.functionName as FunctionName,
                requireArgUpdate: txObject.requireArgUpdate
            };
            return transaction;
        })
        return transactions;
    
   }, [ca, td]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer}
                buttonContent='Sign up' 
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to contribute to a Flexpool'
                lastStepInList='registerToEarnPoints'
            />
        </React.Fragment>
    )
}
