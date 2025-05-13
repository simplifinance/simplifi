import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContract } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { Address, FunctionName, TransactionCallback } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

const steps : FunctionName[] = ['getCollateralQuote', 'approve', 'deposit', 'getFinance'];

export default function GetFinance({ unit, collateralAddress }: GetFinanceProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const config = useConfig();
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { setmessage } = useAppStorage();

    const callback : TransactionCallback = (arg) => {
        if(arg.message) setmessage(arg.message);
        if(arg.errorMessage) setmessage(arg.errorMessage);
    };

    const { contractAddresses: ca, transactionData: td, getQuoteArg, isWrappedAsset } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames: steps,
            callback
        });
        const getQuoteArg = [unit];
        const isWrappedAsset = collateralAddress === filtered.contractAddresses.WrappedNative;
        return { ...filtered, getQuoteArg, isWrappedAsset};
    }, [chainId, unit, account]);

    const { data  } = useReadContract(
        {
            config,
            abi: td[0].abi,
            address: td[0].contractAddress as Address,
            args: getQuoteArg,
            functionName: td[0].functionName,
        }
    );
    const collateralQuote = data as bigint;

    const getTransactions = React.useCallback(() => {
        // Remove the first transaction from the list
        const txObjects = td.filter(({functionName}) => functionName !== steps[0]);
        
        const approvalArgs = [ca.FlexpoolFactory, collateralQuote];
        const depositArgs = [ca.FlexpoolFactory];
        const getFinanceArgs = [unit];
        const getArgs = (funcName: FunctionName) => {
            let result = [];
            let cAddress = ca.FlexpoolFactory;
            switch (funcName) {
                case steps[3]:
                    result = getFinanceArgs;
                    break;
                default:
                    if(isWrappedAsset) {
                        cAddress = ca.WrappedNative;
                        result = depositArgs;
                    } else {
                        cAddress = ca.SimpliToken;
                        result = approvalArgs;
                    }
                    break;
            }
            return {result, cAddress};
        }

        let transactions = txObjects.map((txObject) => {
            const { result: args, cAddress} = getArgs(txObject.functionName as FunctionName);
            const transaction : Transaction = {
                abi: txObject.abi,
                args,
                contractAddress: formatAddr(cAddress),
                functionName: txObject.functionName as FunctionName,
            };
            return transaction;
        })
        console.log("transactions", transactions);

        transactions = isWrappedAsset? transactions.filter((tx) => tx.functionName = steps[1]) : transactions.filter((tx) => tx.functionName = steps[2]);
        
        console.log("Popped transactions", transactions);
    
        return transactions;
    
   }, [unit, collateralQuote, ca, td]);

    return(
        <Confirmation 
            openDrawer={openDrawer}
            toggleDrawer={toggleDrawer}
            getTransactions={getTransactions}
            displayMessage='Request to getfinance'
        />
    )
}

type GetFinanceProps = {
    unit: bigint;
    collateralAddress: Address;
};