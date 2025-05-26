import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { FunctionName } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

export default function ClaimTestTokens({ disabled }: ClaimTestTokenProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const { chainId } = useAccount();
    const { callback } = useAppStorage();

    const { contractAddresses: ca, transactionData: td, faucetContract } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['claimTestTokens'],
            callback
        });
        const faucetContract = formatAddr(filtered.contractAddresses.Faucet);
        return { ...filtered, faucetContract };
    }, [chainId, callback]);

    const getTransactions = React.useCallback(() => {
        const transactions = td.map((txObject) => {
            const transaction : Transaction = {
                abi: txObject.abi,
                args: [],
                contractAddress: faucetContract,
                functionName: txObject.functionName as FunctionName,
                requireArgUpdate: txObject.requireArgUpdate
            };
            return transaction;
        })
        return transactions;
    
   }, [td, faucetContract]);

    return(
        <React.Fragment>
             <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer}
                buttonContent='Get Tokens'
                widthType='fit-content'
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Claiming test tokens'
                lastStepInList='claimTestTokens'
            />
        </React.Fragment>
    )
}

type ClaimTestTokenProps = {
    disabled: boolean;
    toggleDrawer: (arg: number) => void;
    openDrawer: number;
};