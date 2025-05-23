import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { FunctionName, TransactionData } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

const steps : FunctionName[] = ['allowance', 'approve', 'createPool'];

export default function CreatePool({ unit, args, toggleDrawer, openDrawer, optionalDisplay }: CreatePoolProps) {
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const config = useConfig();
    const { callback } = useAppStorage();
    
    const { readTxObject, flexpoolContract, mutate } = React.useMemo(() => {
        const { contractAddresses: ca, transactionData: td, isCelo } = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['allowance'],
            callback
        });

        const mutate = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['approve', 'createPool'],
            callback
        });

        const flexpoolContract = formatAddr(isCelo? ca.CeloBased : ca.CeloBased);
        const readArgs = [[account, flexpoolContract]];
        const addresses = [ca.stablecoin];
        const readTxObject = td.map((item, i) => {
            return{
                abi: item.abi,
                functionName: item.functionName,
                address: formatAddr(addresses[i]),
                args: readArgs[i]
            }
        });

        return { readTxObject, flexpoolContract, mutate };
    }, [chainId, unit, account]);

    const { refetch } = useReadContracts(
        {
            config,
            contracts: readTxObject.map((item) => { return item})
        }
    );

    const getTransactions = React.useCallback(() => {
        const refetchArgs = async(funcName: FunctionName) => {
            let args : any[] = [];
            let value : bigint = 0n;
            let proceed = 1;
            await refetch().then((result) => {
                const allowance = result?.data?.[0]?.result as bigint;
                switch (funcName) {
                    case 'approve':
                        if(allowance >= unit) proceed = 0;
                        args = [flexpoolContract, allowance];
                        break;
                    default:
                        break;
                }
                
            });
            return {args, value, proceed};
        };

        const getArgs = (txObject: TransactionData) => {
            let result: any[] = [];
            let contractAddress = flexpoolContract;
            switch (txObject.functionName) {
                case 'approve':
                    contractAddress = formatAddr(mutate.contractAddresses.stablecoin);
                    break;
                default:
                    result = args;
                    break;
            }
            return {args: result, contractAddress};
        }

        let transactions = mutate.transactionData.map((txObject) => {
            const { contractAddress, args } = getArgs(txObject);
            const functionName = txObject.functionName as FunctionName;
            const transaction : Transaction = {
                abi: txObject.abi,
                args,
                contractAddress,
                functionName: txObject.functionName as FunctionName,
                refetchArgs: functionName === 'approve'? refetchArgs : undefined,
                requireArgUpdate: txObject.requireArgUpdate
            };
            return transaction;
        })
        return transactions;
    
   }, [unit, args, refetch]);

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