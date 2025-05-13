import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterTransactionData, formatAddr, TransactionData } from '@/utilities';
import { Address, FunctionName, TransactionCallback } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

const steps : FunctionName[] = ['getCurrentDebt', 'allowance', 'approve', 'payback', 'transferFrom'];

export default function Contribute({ unit, safe, collateralAddress }: PaybackProps) {
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

    const { contractAddresses: ca, transactionData: td, allowanceArg, paybackArg, allowanceContract, getDebtArg } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames: steps,
            callback
        });
        const allowanceArg = [safe, account];
        const getDebtArg = [unit, account];
        const paybackArg = [unit];
        const isWrappedAsset = collateralAddress === filtered.contractAddresses.WrappedNative;
        const allowanceContract = isWrappedAsset? filtered.contractAddresses.WrappedNative as Address : filtered.contractAddresses.SimpliToken as Address;

        return { ...filtered, allowanceArg, paybackArg, getDebtArg, allowanceContract };
    }, [chainId, unit, account]);

    const { data, refetch  } = useReadContracts(
        {
            config,
            contracts: [
                {
                    abi: td[0].abi,
                    address: td[0].contractAddress as Address,
                    args: getDebtArg,
                    functionName: td[0].functionName,
                },
                {
                    abi: td[1].abi,
                    address: allowanceContract,
                    args: allowanceArg,
                    functionName: td[1].functionName,
                },
            ]
        }
    );
    const debt : bigint | undefined = data?.[0].result as bigint;
    const allowance : bigint | undefined = data?.[1].result as bigint;

    const getTransactions = React.useCallback(() => {
        const txObjects = td.filter(({functionName}) => functionName !== steps[0] && functionName !== steps[1]);
        if(!debt) refetch();
        if(!allowance) refetch();

        const getArgs = (txObject: TransactionData) => {
            let args :any[] = [];
            let contractAddress = txObject.contractAddress 
            switch (txObject.functionName) {
                case steps[2]:
                    args = [ca.FlexpoolFactory, debt];
                    contractAddress = allowanceContract
                    break;
                case steps[3]:
                    args = paybackArg;
                    break;
                case steps[4]:
                    args = [safe, account, allowance];
                    contractAddress = allowanceContract
                    break;
                default:
                    break;
            }
            return {args, contractAddress: formatAddr(contractAddress)};
        };

        let transactions = txObjects.map((txObject) => {
            const { args, contractAddress} = getArgs(txObject);
            const transaction : Transaction = {
                abi: txObject.abi,
                args,
                contractAddress,
                functionName: txObject.functionName as FunctionName,
            };
            return transaction;
        })
        console.log("transactions", transactions);
        if(allowance && allowance >= debt){
            transactions = transactions.filter((tx) => tx.functionName !== steps[2]);
        } 
        console.log("Popped transactions", transactions);
    
        return transactions;
    
   }, [unit, allowance]);

    return(
        <Confirmation 
            openDrawer={openDrawer}
            toggleDrawer={toggleDrawer}
            getTransactions={getTransactions}
            displayMessage='Request to contribute to a Flexpool'
        />
    )
}

type PaybackProps = {
    unit: bigint;
    safe: Address;
    collateralAddress: Address;
};