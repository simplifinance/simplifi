import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { Address, FunctionName } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { zeroAddress } from 'viem';
import assert from 'assert';

export default function CreatePool({ unit, args, toggleDrawer, openDrawer, optionalDisplay }: CreatePoolProps) {
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const config = useConfig();
    const { callback } = useAppStorage();

    const {readTxObject, flexpoolContract, usd, mutate, supportedColAssets } = React.useMemo(() => {
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
        // For now, only the wrapped asset is supported
        const supportedColAssets = [mutate.contractAddresses.WrappedNative] as string[]; 

        const flexpoolContract = formatAddr(isCelo? ca.CeloBased : ca.CeloBased);
        const usd = formatAddr(ca.stablecoin);
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

        return { readTxObject, flexpoolContract, usd, mutate, supportedColAssets};
        }, [chainId, account, callback]);

        const { refetch } = useReadContracts(
        {
            config,
            contracts: readTxObject.map((item) => { return item})
        }
    );

    const getTransactions = React.useCallback(() => {
        const refetchArgs = async(funcName: FunctionName) => {
            let args_ : any[] = [];
            let value : bigint = 0n;
            let proceed = 1;
            await refetch().then((result) => {
                const allowance = result?.data?.[0]?.result as bigint;
                switch (funcName) {
                    case 'approve':
                        if(allowance >= unit) proceed = 0;
                        args_ = [flexpoolContract, unit];
                        break;
                    default:
                        break;
                }
                
            });
            return {args: args_, value, proceed};
        };

    // const approvalArgs = 
    const getArgs = (functionName: FunctionName) => {
        let result : any[] = [];
        let cAddress : Address = zeroAddress;
        let value = 0n;
        switch (functionName) {
            case 'approve':
                cAddress = usd;
                break;
            default:
                const colAsset = args[args.length - 1] as string;
                console.log("colAsset", colAsset);
                assert(supportedColAssets.includes(colAsset), "Selected collateral asset not yet supported");
                result = args;
                cAddress = flexpoolContract;
                break;
        }
        return {args:result, cAddress, value};
    }

        let transactions = mutate.transactionData.map((txObject) => {
            const { args, cAddress,} = getArgs(txObject.functionName as FunctionName);
            const transaction : Transaction = {
                abi: txObject.abi,
                args,
                contractAddress: cAddress,
                functionName: txObject.functionName as FunctionName,
                refetchArgs: txObject.requireArgUpdate? refetchArgs : undefined,
                requireArgUpdate: txObject.requireArgUpdate,
                value: undefined
            };
            return transaction;
        })

        return transactions;
    }, [mutate, unit, usd, args, flexpoolContract, refetch, supportedColAssets]);

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