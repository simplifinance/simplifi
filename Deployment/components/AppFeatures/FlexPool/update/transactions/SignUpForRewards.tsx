import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { FunctionName } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

const steps : FunctionName[] = ['registerToEarnPoints'];

export default function SignUpForRewards({disabled, toggleDrawer, openDrawer, optionalButtonContent} : SignUpProps) {    
    const { chainId } = useAccount();
    const { callback } = useAppStorage();

    const { contractAddresses: ca, transactionData: td, pointsContract } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames:steps,
            callback
        });
        const pointsContract = formatAddr(filtered.contractAddresses.Points);
        return { ...filtered, pointsContract };
    }, [chainId, callback]);

    const getTransactions = React.useCallback(() => {
        let transactions = td.map((txObject) => {
            const transaction : Transaction = {
                abi: txObject.abi,
                args: [],
                contractAddress: pointsContract,
                functionName: txObject.functionName as FunctionName,
                requireArgUpdate: txObject.requireArgUpdate
            };
            return transaction;
        })
        return transactions;
    
   }, [td, pointsContract]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer}
                buttonContent='Get Started'
                widthType='fit-content'
                optionalButtonContent={optionalButtonContent}
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to sign up for reward'
                lastStepInList='registerToEarnPoints'
            />
        </React.Fragment>
    )
}

type SignUpProps = {
    disabled: boolean;
    openDrawer: number;
    toggleDrawer: (arg: number) => void;
    optionalButtonContent?: React.ReactNode;
}
