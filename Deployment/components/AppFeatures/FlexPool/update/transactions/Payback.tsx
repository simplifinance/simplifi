import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { Address, FunctionName, TransactionData } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

export default function Payback({ unit, collateralAddress, widthType, disabled, overrideButtonContent}: PaybackProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const config = useConfig();
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback } = useAppStorage();

    const {readTxObject, flexpoolContract, paybackArgs, mutate } = React.useMemo(() => {
        const isWrappedAsset = collateralAddress.toLowerCase() === filterTransactionData({chainId, filter: false}).contractAddresses.WrappedNative?.toLowerCase();
        const { contractAddresses: ca, transactionData: td, isCelo } = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['getCurrentDebt', 'allowance'],
            callback
        });

        const mutate = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['approve', 'payback'],
            callback
        });

        const flexpoolContract = formatAddr(isCelo? ca.CeloBased : ca.CeloBased);
        const readArgs = [[unit, account], [account, flexpoolContract]];
        const addresses = [flexpoolContract, ca.stablecoin];
        const readTxObject = td.map((item, i) => {
            return{
                abi: item.abi,
                functionName: item.functionName,
                address: formatAddr(addresses[i]),
                args: readArgs[i]
            }
        });

        const paybackArgs = [unit];
        return { readTxObject, flexpoolContract, isWrappedAsset, paybackArgs, mutate};
    }, [chainId, unit, account, collateralAddress, callback]);

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
                const debt_ = result?.data?.[0].result as bigint;
                const allowance_ = result?.data?.[1]?.result as bigint;
                switch (funcName) {
                    case 'approve':
                        if(allowance_ >= debt_) proceed = 0;
                        args = [flexpoolContract, debt_];
                        break;
                    default:
                        args = paybackArgs;
                        break;
                }
                
            });
            return {args, value: 0n, proceed};
        };

        const getArgs = (txObject: TransactionData) => {
            let args :any[] = [];
            let contractAddress = '';
            switch (txObject.functionName) {
                case 'payback':
                    args = paybackArgs;
                    contractAddress = flexpoolContract;
                    break;
                default:
                    contractAddress = mutate.contractAddresses.stablecoin;
                    break;
            }
            return {args, contractAddress: formatAddr(contractAddress)};
        };

        let transactions = mutate.transactionData.map((txObject) => {
            const { args, contractAddress} = getArgs(txObject);
            const transaction : Transaction = {
                abi: txObject.abi,
                args,
                contractAddress,
                functionName: txObject.functionName as FunctionName,
                refetchArgs: txObject.requireArgUpdate? refetchArgs : undefined,
                requireArgUpdate: txObject.requireArgUpdate
            };
            return transaction;
        })
        return transactions;
   }, [mutate, flexpoolContract, refetch, paybackArgs]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer}
                buttonContent={overrideButtonContent || 'Payback'}
                widthType={widthType || 'w-full'}
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to payback loan'
                lastStepInList={'payback'}
            />
        </React.Fragment>
    )
}

type PaybackProps = {
    unit: bigint;
    collateralAddress: Address;
    disabled: boolean;
    overrideButtonContent?: string;
    widthType?: string;
};