import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount } from 'wagmi';
import { filterTransactionData, formatAddr, TransactionData } from '@/utilities';
import { FunctionName, VoidFunc } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

const steps : FunctionName[] = ['approve', 'provideLiquidity'];

export default function ProvideLiquidity({ args: provideLiquidityArgs, back, liquidityAmount, openDrawer, toggleDrawer  }: ProvideLiquidityProps) {
    const { chainId } = useAccount();
    const { callback } = useAppStorage();
    const { contractAddresses: ca, transactionData: td, approvalArg } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames:steps,
            callback
        });
        const approvalArg = [filtered.contractAddresses.Providers, liquidityAmount];
        return { ...filtered, approvalArg };
    }, [chainId, liquidityAmount]);

    const getTransactions = React.useCallback(() => {
        const getArgs = (txObject: TransactionData) => {
            let result: any[] = [];
            let contractAddress = txObject.contractAddress;
            switch (txObject.functionName) {
                case 'approve':
                    result = approvalArg;
                    contractAddress = ca.stablecoin;
                    break;
                default:
                    result = provideLiquidityArgs;
                    break;
            }
            return {result, contractAddress: formatAddr(contractAddress)};
        };

        let transactions = td.map((txObject) => {
            const { result, contractAddress } = getArgs(txObject);
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
    
   }, [provideLiquidityArgs, td, approvalArg]);

    return(
        <Confirmation 
            openDrawer={openDrawer}
            toggleDrawer={toggleDrawer}
            getTransactions={getTransactions}
            displayMessage='Request to provide liquidity'
            lastStepInList='provideLiquidity'
            back={back}
        />
    )
}

type ProvideLiquidityProps = {
    args: number[];
    liquidityAmount: bigint;
    openDrawer: number;
    toggleDrawer: (arg:number) => void;
    back?: VoidFunc;
};