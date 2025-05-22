import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useReadContract } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { FunctionName, VoidFunc, TransactionData} from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

const steps : FunctionName[] = ['allowance', 'approve', 'provideLiquidity'];

export default function ProvideLiquidity({ args: provideLiquidityArgs, back, liquidityAmount, openDrawer, toggleDrawer  }: ProvideLiquidityProps) {
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback } = useAppStorage();
    const { contractAddresses: ca, transactionData: td, allowanceObj, approvalArg } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames:steps,
            callback
        });

        const providersContract = formatAddr(filtered.contractAddresses.Providers);
        const approvalArg = [filtered.contractAddresses.Providers, liquidityAmount];
        const allowanceObj = {
            abi: filtered.transactionData[0].abi,
            address: formatAddr(filtered.contractAddresses.stablecoin),
            args: [account, providersContract],
            functionName: filtered.transactionData[0].functionName
        };
        return { ...filtered, approvalArg, allowanceObj };
    }, [chainId, liquidityAmount]);

    const { data } = useReadContract({ ...allowanceObj });

    const getTransactions = React.useCallback(() => {
        let filteredTrxn = td.filter((item) => item.functionName !== 'allowance');
        const prevAllowance = data as bigint || undefined;
        if(prevAllowance && prevAllowance >= liquidityAmount){
            filteredTrxn = filteredTrxn.filter((item) => item.functionName !== 'approve');
        }

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

        let transactions = filteredTrxn.map((txObject) => {
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
        console.log("transactions", transactions);
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