import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { Address, FunctionName } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

const getSteps = (isWrappedAsset: boolean) :FunctionName[] => {
    const secondStep = isWrappedAsset? 'deposit' : 'approve';
    return Array.from(['getCollateralQuote', 'allowance', secondStep, 'getFinance', 'transferFrom']);
}

export default function GetFinance({ unit, collateralAddress, safe, disabled}: GetFinanceProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const config = useConfig();
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback } = useAppStorage();

    const { contractAddresses: ca, transactionData: td, getQuoteArg, flexpoolContract, getFinanceArgs, isCelo, allowanceArg, } = React.useMemo(() => {
        const isWrappedAsset = collateralAddress.toLowerCase() === filterTransactionData({chainId, filter: false}).contractAddresses.WrappedNative?.toLowerCase();
        const steps = getSteps(isWrappedAsset);
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames: steps,
            callback
        });
        const getQuoteArg = [unit];
        const getFinanceArgs = [unit];
        const allowanceArg = [safe, account];
        const flexpoolContract = filtered.isCelo? filtered.contractAddresses.CeloBased : filtered.contractAddresses.CeloBased;
        return { ...filtered, flexpoolContract, getQuoteArg, isWrappedAsset, getFinanceArgs, steps, allowanceArg};
    }, [chainId, unit, account]);

    const { data, refetch } = useReadContracts(
        {
            config,
            contracts: [
                {
                    abi: td[0].abi,
                    address: flexpoolContract as Address,
                    args: getQuoteArg,
                    functionName: td[0].functionName,
                },
                {
                    abi: td[1].abi,
                    address: ca.stablecoin as Address,
                    args: allowanceArg,
                    functionName: td[1].functionName,
                },
            ]
        }
    );

    const getTransactions = React.useCallback(() => {
        // Remove unnecessary transactions from the list
        const txObjects = td.filter(({functionName}) => functionName !== 'getCollateralQuote' && functionName !== 'allowance');
        const refetchArgs = async(funcName: FunctionName) => {
            let args : any[] = [];
            let value : bigint = 0n;
            await refetch().then((result) => {
                const collateralQuote = result?.data?.[0].result as bigint;
                const allowance = result?.data?.[1]?.result as bigint;
                switch (funcName) {
                    case 'approve':
                        console.log("collateralQuote", collateralQuote)
                        args = [flexpoolContract, collateralQuote];
                        break;
                    case 'deposit':
                        args = [flexpoolContract];
                        value = collateralQuote;
                        break;
                    case 'transferFrom':
                        console.log("allowance", allowance)
                        args = [safe, account, allowance];
                        break;
                    default:
                        break;
                }
                
            });
            return {args, value};
        };

        // const approvalArgs = [ca.FlexpoolFactory, collateralQuote];
        const depositArgs = [flexpoolContract];
        const getArgs = (functionName: FunctionName) => {
            let args : any[] = [];
            let cAddress = '';
            let value = 0n;
            switch (functionName) {
                case 'getFinance':
                    args = getFinanceArgs;
                    cAddress = flexpoolContract!;
                    break;
                case 'deposit':
                    args = depositArgs;
                    value = data?.[0]?.result as bigint;
                    cAddress = ca.WrappedNative!;
                    break;
                case 'approve':
                    args = [];
                    cAddress = ca.SimpliToken!;
                    break;
                default:
                    break;
            }
            return {args, cAddress, value};
        }

        let transactions = txObjects.map((txObject) => {
            const { args, cAddress, value} = getArgs(txObject.functionName as FunctionName);
            const transaction : Transaction = {
                abi: txObject.abi,
                args,
                contractAddress: formatAddr(cAddress),
                functionName: txObject.functionName as FunctionName,
                refetchArgs: txObject.requireArgUpdate? refetchArgs : undefined,
                requireArgUpdate: txObject.requireArgUpdate,
                value
            };
            return transaction;
        })
        console.log("transactions", transactions);

        return transactions;
   }, [unit, ca, td]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer}
                buttonContent='GetFinance'
                widthType='fit-content'
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to Getfinance'
                lastStepInList={'transferFrom'}
            />
        </React.Fragment>
    )
}

type GetFinanceProps = {
    unit: bigint;
    collateralAddress: Address;
    safe: Address;
    disabled: boolean;
};