import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { Address, FunctionName } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';
import { zeroAddress } from 'viem';

const getSteps = (isWrappedAsset: boolean) : {read: FunctionName[], mutate: FunctionName[]} => {
    const mutateFirstStep = isWrappedAsset? 'deposit' : 'approve';
    return {
        read: Array.from(['getCollateralQuote', 'allowance', 'deposits']),
        mutate: Array.from([mutateFirstStep, 'getFinance'])
    };
}

export default function GetFinance({ unit, collateralAddress, safe, disabled, overrideButtonContent}: GetFinanceProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const config = useConfig();
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback } = useAppStorage();

    const {readTxObject, flexpoolContract, getFinanceArgs, mutate } = React.useMemo(() => {
        const isWrappedAsset = collateralAddress.toLowerCase() === filterTransactionData({chainId, filter: false}).contractAddresses.WrappedNative?.toLowerCase();
        const steps = getSteps(isWrappedAsset);
        const { contractAddresses: ca, transactionData: td, isCelo } = filterTransactionData({
            chainId,
            filter: true,
            functionNames: steps.read,
            callback
        });

        const mutate = filterTransactionData({
            chainId,
            filter: true,
            functionNames: steps.mutate,
            callback
        });

        const flexpoolContract = formatAddr(isCelo? ca.CeloBased : ca.CeloBased);
        const readArgs = [[unit], [safe, account], [account, flexpoolContract]];
        const addresses = [flexpoolContract, ca.stablecoin, ca.WrappedNative];
        const readTxObject = td.map((item, i) => {
            return{
                abi: item.abi,
                functionName: item.functionName,
                address: formatAddr(addresses[i]),
                args: readArgs[i]
            }
        });

        const getFinanceArgs = [unit];
        return { readTxObject, flexpoolContract, isWrappedAsset, getFinanceArgs, steps, mutate};
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
                const collateralQuote = result?.data?.[0].result as bigint;
                const allowance = result?.data?.[1]?.result as bigint;
                const prevDeposit = result?.data?.[2]?.result as bigint;
                switch (funcName) {
                    case 'approve':
                        if(allowance >= collateralQuote) proceed = 0;
                        args = [flexpoolContract, collateralQuote];
                        break;
                    case 'deposit':
                        if(prevDeposit >= collateralQuote){
                            proceed = 0;
                            value = 0;
                        }
                        args = [flexpoolContract];
                        value = collateralQuote;
                        break;
                    default:
                        break;
                }
                
            });
            return {args, value, proceed};
        };

        // const approvalArgs = 
        const getArgs = (functionName: FunctionName) => {
            let args : any[] = [];
            let cAddress : Address = zeroAddress;
            let value = 0n;
            switch (functionName) {
                case 'getFinance':
                    args = getFinanceArgs;
                    cAddress = flexpoolContract!;
                    break;
                case 'deposit':
                    cAddress = formatAddr(mutate.contractAddresses.WrappedNative);
                    break;
                case 'approve':
                    cAddress = formatAddr(mutate.contractAddresses.SimpliToken);
                    break;
                default:
                    break;
            }
            return {args, cAddress, value};
        }

        let transactions = mutate.transactionData.map((txObject) => {
            const { args, cAddress, value} = getArgs(txObject.functionName as FunctionName);
            const transaction : Transaction = {
                abi: txObject.abi,
                args,
                contractAddress: cAddress,
                functionName: txObject.functionName as FunctionName,
                refetchArgs: txObject.requireArgUpdate? refetchArgs : undefined,
                requireArgUpdate: txObject.requireArgUpdate,
                value: txObject.functionName === 'deposit'? value : undefined
            };
            return transaction;
        })
        console.log("transactions", transactions);

        return transactions;
   }, [unit, mutate, flexpoolContract]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer}
                buttonContent={overrideButtonContent || 'GetFinance'}
                widthType='fit-content'
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to Getfinance'
                lastStepInList={'getFinance'}
            />
        </React.Fragment>
    )
}

type GetFinanceProps = {
    unit: bigint;
    collateralAddress: Address;
    safe: Address;
    disabled: boolean;
    overrideButtonContent?: string;
};