import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useReadContract } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { FunctionName, TransactionData } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

const steps : FunctionName[] = ['allowance', 'approve', 'createPool'];

export default function CreatePool({ unit, args, toggleDrawer, openDrawer, optionalDisplay }: CreatePoolProps) {
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback } = useAppStorage();
    
    const { contractAddresses: ca, transactionData: td, approvalArg, allowanceObj, flexpoolContract } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames: steps,
            callback
        });
        const flexpoolContract = formatAddr(filtered.isCelo? filtered.contractAddresses.CeloBased : filtered.contractAddresses.CeloBased);
        const approvalArg = [flexpoolContract, unit];
        const allowanceObj = {
            abi: filtered.transactionData[0].abi,
            address: formatAddr(filtered.contractAddresses.stablecoin),
            args: [account, flexpoolContract],
            functionName: filtered.transactionData[0].functionName
        };
        return { ...filtered, approvalArg, allowanceObj, flexpoolContract };
    }, [chainId, unit, account]);

    const { data } = useReadContract({ ...allowanceObj });

    const getTransactions = React.useCallback(() => {
        let filteredTrxn = td.filter((item) => item.functionName !== 'allowance');
        const prevAllowance = data as bigint || undefined;
        if(prevAllowance && prevAllowance >= unit){
            filteredTrxn = filteredTrxn.filter((item) => item.functionName !== 'approve');
        }
        // console.log("prevAllowance trx", prevAllowance);
        const getArgs = (txObject: TransactionData) => {
            let result: any[] = [];
            let contractAddress = flexpoolContract;
            switch (txObject.functionName) {
                case 'approve':
                    result = approvalArg;
                    contractAddress = formatAddr(ca.stablecoin);
                    break;
                default:
                    result = args;
                    break;
            }
            return {result, contractAddress: formatAddr(contractAddress)};
        }

        let transactions = filteredTrxn.map((txObject) => {
            const { contractAddress, result} = getArgs(txObject)
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
    
   }, [unit, args]);

    return(
        <Confirmation 
            openDrawer={openDrawer}
            toggleDrawer={toggleDrawer}
            getTransactions={getTransactions}
            displayMessage='Request to create a Flexpool'
            optionalDisplay={optionalDisplay}
            lastStepInList='createPool'
        />
    )
}

type CreatePoolProps = {
    unit: bigint;
    args: any[];
    optionalDisplay?: React.ReactNode;
    openDrawer: number;
    toggleDrawer: (arg: number) => void;
    disabled: boolean;
};