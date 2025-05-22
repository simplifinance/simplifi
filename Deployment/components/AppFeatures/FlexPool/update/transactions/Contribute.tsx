import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useReadContract } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { FunctionName, TransactionData } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

const steps : FunctionName[] = ['allowance', 'approve', 'contribute'];

export default function Contribute({ unit, disabled }: ContributeProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const { chainId, address } = useAccount();
    const account = formatAddr(address);
    const { callback } = useAppStorage();

    const { contractAddresses: ca, transactionData: td, allowanceObj, flexpoolContract, contributeArg, approvalArg } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames:steps,
            callback
        });
        const flexpoolContract = formatAddr(filtered.isCelo? filtered.contractAddresses.CeloBased : filtered.contractAddresses.CeloBased);
        const approvalArg = [flexpoolContract, unit];
        const contributeArg = [unit];
        const allowanceObj = {
            abi: filtered.transactionData[0].abi,
            address: formatAddr(filtered.contractAddresses.stablecoin),
            args: [account, flexpoolContract],
            functionName: filtered.transactionData[0].functionName
        };

        return { ...filtered, allowanceObj, approvalArg, flexpoolContract, contributeArg };
    }, [chainId, unit]);

    const { data } = useReadContract({ ...allowanceObj });

    const getTransactions = React.useCallback(() => {
        let filteredTrxn = td.filter((item) => item.functionName !== 'allowance');
        const prevAllowance = data as bigint || undefined;
        if(prevAllowance && prevAllowance >= unit){
            filteredTrxn = filteredTrxn.filter((item) => item.functionName !== 'approve');
        }
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
                    contractAddress = flexpoolContract!;
                    break;
            }
            return {result, contractAddress: formatAddr(contractAddress)};
        };

        let transactions = filteredTrxn.map((txObject) => {
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
                widthType='fit-content'
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