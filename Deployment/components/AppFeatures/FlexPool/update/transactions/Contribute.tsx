import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts} from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { FunctionName, TransactionData } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

export default function Contribute({ unit, disabled, overrideButtonContent}: ContributeProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const { chainId, address } = useAccount();
    const config = useConfig();
    const account = formatAddr(address);
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
            functionNames: ['approve', 'contribute'],
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
    }, [chainId, account, callback]);

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
                        args = [flexpoolContract, unit];
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
                    result = [unit];
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

    }, [unit, mutate, flexpoolContract, refetch]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer} 
                buttonContent={overrideButtonContent || 'Contribute'}
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
    overrideButtonContent?: string;
};