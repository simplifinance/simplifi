import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContract } from 'wagmi';
import { filterTransactionData, formatAddr, TransactionData } from '@/utilities';
import type { Address, FunctionName, ProviderResult } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

const steps : FunctionName[] = ['allowance', 'removeLiquidity', 'transferFrom'];
const formatProvider = (providers: ProviderResult[] | undefined, user: Address) => {
    let disabled = false;
    let filtered : ProviderResult[] = [];
    if(providers) {
        const filtered = providers.filter(({account}) => account.toLowerCase() === user.toLowerCase());
        if(filtered.length > 0) {
            disabled = filtered[0].amount === 0n;
        }

    }
    return { disabled, filtered };
};

export default function RemoveLiquidity() {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const config = useConfig();
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback, providers } = useAppStorage();

    const { contractAddresses: ca, transactionData: td, allowanceArgs, removeLiquidityArgs } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames:steps,
            callback
        });
        const allowanceArgs = [filtered.contractAddresses.Providers, account];
        const removeLiquidityArgs: any[] = [];

        return { ...filtered, allowanceArgs, removeLiquidityArgs };
    }, [chainId, account]);

    const { refetch  } = useReadContract(
        {
            config,
            abi: td[0].abi,
            address: ca.stablecoin as Address,
            args: allowanceArgs,
            functionName: td[0].functionName,
        },
    );

    const { disabled, } = formatProvider(providers, account);
    const getTransactions = React.useCallback(() => {
        const txObjects = td.filter(({functionName}) => functionName !== steps[0]);
        const refetchArgs = async(funcName: FunctionName) => {
            let args : any[] = [];
            await refetch().then((result) => {
                let allowance : bigint | undefined = result?.data as bigint;
                switch (funcName) {
                    case 'transferFrom':
                        args = [ca.Providers, account, allowance];
                        break;
                    default:
                        break;
                }
            });
            return {args, value: 0n};
        };
        
        const getArgs = (txObject: TransactionData) => {
            let result: any[] = [];
            let contractAddress = ca.stablecoin;
            switch (txObject.functionName) {
                case 'removeLiquidity':
                    contractAddress = ca.Providers;
                    result = removeLiquidityArgs;
                    break;
                default:
                    contractAddress = ca.stablecoin;
                    break;
            }
            return {result, contractAddress: formatAddr(contractAddress)};
        };

        let transactions = txObjects.map((txObject) => {
            const { result: args, contractAddress } = getArgs(txObject);
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
    
   }, [ca, td]);

    return(
        <React.Fragment>
            <ActionButton 
                // disabled={disabled || providers.length === 0 || !providers } 
                disabled={false} 
                toggleDrawer={toggleDrawer}
                buttonContent='Remove liquidity'
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to remove liquidity'
                lastStepInList='transferFrom'
            />
        </React.Fragment>
    )
}
