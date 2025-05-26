import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { FunctionName, VoidFunc, TransactionData, Address} from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

export default function ProvideLiquidity({ args: provideLiquidityArgs, back, liquidityAmount, openDrawer, toggleDrawer  }: ProvideLiquidityProps) {
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback } = useAppStorage();
    const config = useConfig();

    const {readTxObject, mutate, providersContract } = React.useMemo(() => {
        const { contractAddresses: ca, transactionData: td } = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['allowance'],
            callback
        });

        const mutate = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['approve', 'provideLiquidity'],
            callback
        });

        const providersContract = formatAddr(mutate.contractAddresses.Providers);
        const readArgs = [[account, providersContract]];
        const addresses = [ca.stablecoin];
        const readTxObject = td.map((item, i) => {
            return{
                abi: item.abi,
                functionName: item.functionName,
                address: formatAddr(addresses[i]),
                args: readArgs[i]
            }
        });

        return { readTxObject, mutate, providersContract };
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
            let proceed = 1;
            await refetch().then((result) => {
                const allowance_ : bigint | undefined = result?.data?.[0].result as bigint;
                switch (funcName) {
                    case 'approve':
                        // console.log("allowance", allowance_);
                        // console.log("liquidityAmount", liquidityAmount);
                        if(allowance_ >= liquidityAmount) proceed = 0;
                        args = [providersContract, liquidityAmount];
                        break;
                    default:
                        break;
                }
            });
            return {args, value: 0n, proceed};
        };
        
        const getArgs = (txObject: TransactionData) => {
            let args: any[] = [];
            let address = '' as Address;
            console.log("provideLiquidityArgs", provideLiquidityArgs);
            switch (txObject.functionName) {
                case 'provideLiquidity':
                    address = providersContract;
                    args = provideLiquidityArgs;
                    break;
                default:
                    address = formatAddr(mutate.contractAddresses.stablecoin);
                    break;
            }

            return {args, address};
        };

        let transactions = mutate.transactionData.map((txObject) => {
            const { args, address } = getArgs(txObject);
            const transaction : Transaction = {  
                abi: txObject.abi,
                args,
                contractAddress: address,
                functionName: txObject.functionName as FunctionName,
                refetchArgs: txObject.requireArgUpdate? refetchArgs : undefined,
                requireArgUpdate: txObject.requireArgUpdate
            };
            return transaction;
        })
        console.log("Transactions", transactions);
        return transactions;

    }, [mutate, providersContract, account, provideLiquidityArgs, liquidityAmount, refetch]);

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