import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContract } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { Address, FunctionName } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

const steps : FunctionName[] = ['allowance', 'closePool', 'transferFrom'];

export default function ClosePool({ unit, safe, disabled, overrideButtonContent }: ClosePoolProps) {
    const [ openDrawer, setDrawerState ] = React.useState<number>(0);

    const toggleDrawer = (arg: number) => setDrawerState(arg);
    const config = useConfig();
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback } = useAppStorage();

    // Build transaction data
    const { contractAddresses: ca, transactionData: td, flexpoolContract, allowanceArgs, isCelo, closePoolArgs } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames:steps,
            callback
        });
        const allowanceArgs = [safe, account];
        const closePoolArgs = [unit];
        const flexpoolContract = filtered.isCelo? filtered.contractAddresses.CeloBased : filtered.contractAddresses.CeloBased;
        return { ...filtered, flexpoolContract, allowanceArgs, closePoolArgs };
    }, [chainId, unit, account]);

    // Fetch allowance of safe to the user
    const { refetch  } = useReadContract(
        {
            config,
            abi: td[0].abi,
            address: ca.stablecoin as Address,
            args: allowanceArgs,
            functionName: td[0].functionName,
        }
    );

    // Prepare the transactions
    const getTransactions = React.useCallback(() => {
        // Remove the allowance trx from the list that was previously built
        const txObjects = td.filter(({functionName}) => functionName !== steps[0]);
        
        /**
         * Some transactions need their args to be refetched after a transaction is completed especially when they precedes the main 
         * transaction. Example is a payback process. 'payback' step precedes 'transferFrom', after payback is completed, the safe contract
         * approves the user to withdraw their collateral asset, thereafter the trx is confirmed, the user can now withdraw their asset
         * from the safe. In this context, 'transferFrom' step replies largelt on the allowance to be > 0 before it can succeed. 
         * 
         * @param funcName 
         * @returns 
         */
        const refetchArgs = async(funcName: FunctionName) => {
            let args : any[] = [];
            let proceed = 1;
            if(funcName === 'transferFrom'){
                await refetch().then((result) => {
                    let allowance : bigint | undefined = result?.data as bigint;
                    args = [safe, account, allowance];
                    if(allowance === 0n) proceed = 0;
                });
            }
            return {args, value: 0n, proceed};
        };
        
        const getArgs = (funcName: FunctionName) => {
            let result: any[] = [];
            let contractAddress = flexpoolContract;
            switch (funcName) {
                case 'closePool':
                    result = closePoolArgs;
                    break;
                default:
                    contractAddress = isCelo? ca.stablecoin : ca.SimpliToken;
                    break;
            }
            return {result, contractAddress: formatAddr(contractAddress)};
        };

        // Compose the raw transaction data into a runnable transactions
        let transactions = txObjects.map((txObject) => {
            const { result: args, contractAddress } = getArgs(txObject.functionName as FunctionName);
            const transaction : Transaction = {
                abi: txObject.abi,
                args,
                contractAddress: contractAddress,
                functionName: txObject.functionName as FunctionName,
                refetchArgs: txObject.requireArgUpdate? refetchArgs : undefined,
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
    safe: Address;
    disabled: boolean;
    overrideButtonContent?: string;
};