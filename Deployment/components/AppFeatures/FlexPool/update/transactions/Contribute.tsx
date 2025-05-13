import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContract } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { Address, FunctionName, TransactionCallback } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

const steps : FunctionName[] = ['allowance', 'approve', 'contribute'];

export default function Contribute({ unit }: ContributeProps) {
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

    const { contractAddresses: ca, transactionData: td, allowanceArg, contributeArg, approvalArg } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames:steps,
            callback
        });
        const allowanceArg = [account, filtered.contractAddresses.FlexpoolFactory];
        const approvalArg = [filtered.contractAddresses.FlexpoolFactory, unit];
        const contributeArg = [unit];

        return { ...filtered, allowanceArg, approvalArg, contributeArg };
    }, [chainId, unit, account]);

    const { data, refetch  } = useReadContract(
        {
            config,
            abi: td[0].abi,
            address: ca.stablecoin as Address,
            args: allowanceArg,
            functionName: td[0].functionName,
        }
    );
    const allowance : bigint | undefined = data as bigint;

    const getTransactions = React.useCallback(() => {
        const txObjects = td.filter(({functionName}) => functionName !== steps[0]);
        if(!allowance) refetch();
        let transactions = txObjects.map((txObject) => {
            const isApprovalTx = txObject.functionName === steps[1];
            const transaction : Transaction = {
                abi: txObject.abi,
                args: isApprovalTx? approvalArg : contributeArg,
                contractAddress: txObject.contractAddress as Address,
                functionName: txObject.functionName as FunctionName,
            };
            return transaction;
        })
        console.log("transactions", transactions);
        if(allowance && allowance >= unit){
            transactions = transactions.filter((tx) => tx.functionName = steps[1]);
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

type ContributeProps = {
    unit: bigint;
};