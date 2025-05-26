import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import type { Address, FunctionName, ProviderResult, TransactionData } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ActionButton } from '../ActionButton';

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

    const {readTxObject, mutate, providersContract } = React.useMemo(() => {
        const { contractAddresses: ca, transactionData: td, } = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['allowance'],
            callback
        });

        const mutate = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['removeLiquidity', 'transferFrom'],
            callback
        });

        const providersContract = formatAddr(mutate.contractAddresses.Providers);
        const readArgs = [[providersContract, account]];
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

    const { data, refetch } = useReadContracts(
        {
            config,
            contracts: readTxObject.map((item) => { return item})
        }
    );

    const allowance = data?.[0].result as bigint;
    const { disabled, } = formatProvider(providers, account);

    const getTransactions = React.useCallback(() => {
        const refetchArgs = async(funcName: FunctionName) => {
            let args : any[] = [];
            let proceed = 1;
            await refetch().then((result) => {
                const allowance_ : bigint | undefined = result?.data?.[0].result as bigint;
                switch (funcName) {
                    case 'transferFrom':
                        if(allowance_ === 0n) proceed = 0;
                        args = [providersContract, account, allowance_];
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
            switch (txObject.functionName) {
                case 'removeLiquidity':
                    address = providersContract;
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
        return transactions;
    
   }, [mutate, providersContract, account, refetch]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled && allowance === 0n } 
                toggleDrawer={toggleDrawer}
                buttonContent='Remove liquidity'
                widthType='fit-content'
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
