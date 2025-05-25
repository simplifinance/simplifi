import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { FunctionName } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

export default function ClosePool({ unit, disabled, overrideButtonContent }: ClosePoolProps) {
    const [ openDrawer, setDrawerState ] = React.useState<number>(0);

    const toggleDrawer = (arg: number) => setDrawerState(arg);
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback } = useAppStorage();
 
    const { flexpoolContract, td } = React.useMemo(() => {
        const { isCelo, contractAddresses: ca, transactionData: td} = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['closePool'],
            callback
        });

        const flexpoolContract = formatAddr(isCelo? ca.CeloBased : ca.CeloBased);
        return { flexpoolContract, td, ca };
    }, [chainId, account]);

    const getTransactions = React.useCallback(() => {
        let transactions = td.map((txObject) => {
            const transaction : Transaction = {
                abi: txObject.abi,
                args: [unit],
                contractAddress: flexpoolContract,
                functionName: txObject.functionName as FunctionName,
                refetchArgs: undefined,
                requireArgUpdate: txObject.requireArgUpdate
            };
            return transaction;
        })
        return transactions;

    }, [unit, td, flexpoolContract]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer} 
                buttonContent={overrideButtonContent || 'Remove'}
                widthType='w-full'
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to remove a pool'
                lastStepInList='closePool'
            />
        </React.Fragment>
    )
}

type ClosePoolProps = {
    unit: bigint;
    disabled: boolean;
    overrideButtonContent?: string;
};