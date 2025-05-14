import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount } from 'wagmi';
import { filterTransactionData, formatAddr, TransactionData } from '@/utilities';
import { FunctionName, } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

const steps : FunctionName[] = ['approve', 'contribute'];

export default function Contribute({ unit, disabled }: ContributeProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const { chainId } = useAccount();
    const { callback } = useAppStorage();

    const { contractAddresses: ca, transactionData: td, contributeArg, approvalArg } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames:steps,
            callback
        });
        const approvalArg = [filtered.contractAddresses.FlexpoolFactory, unit];
        const contributeArg = [unit];

        return { ...filtered, approvalArg, contributeArg };
    }, [chainId, unit]);

    const getTransactions = React.useCallback(() => {
        const getArgs = (txObject: TransactionData) => {
            let result: any[] = [];
            let contractAddress = '';
            switch (txObject.functionName) {
                case 'approve':
                    result = approvalArg;
                    contractAddress = ca.stablecoin;
                    break;
                default:
                    result = contributeArg;
                    contractAddress = txObject.contractAddress;
                    break;
            }
            return {result, contractAddress: formatAddr(contractAddress)};
        };

        let transactions = td.map((txObject) => {
            const { result, contractAddress} = getArgs(txObject);
            const transaction : Transaction = {
                abi: txObject.abi,
                args: result,
                contractAddress: contractAddress,
                functionName: txObject.functionName as FunctionName,
                requireArgUpdate: false
            };
            return transaction;
        })
        return transactions;
    
   }, [unit, td]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer} 
                buttonContent='Contribute'
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to contribute to a Flexpool'
                lastStepInList='contribute'
            />
        </React.Fragment>
    )
}

type ContributeProps = {
    unit: bigint;
    disabled: boolean;
};