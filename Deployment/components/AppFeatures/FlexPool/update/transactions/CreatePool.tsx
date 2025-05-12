import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { getContractData } from '@/apis/utils/getContractData';
import { useAccount, useConfig, useReadContract } from 'wagmi';
import { filterAbi, formatAddr } from '@/utilities';
import { allowanceAbi, allowanceCUSDAbi, approveAbi, approveCUSDAbi, } from '@/apis/utils/abis';
import { baseContracts } from '@/constants';

export default function CreatePermissionlessPool({ unit, args }: CreatePermissionlessPoolProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);

    const { chainId, address } = useAccount();
    const config = useConfig();
    const account  = formatAddr(address);
    const { factory, token } = getContractData(chainId || 44787);
    const isCelo = (chainId === 44787 || chainId === 42220);
    const { data: allowance } = useReadContract(
        {
            config,
            abi: isCelo? allowanceCUSDAbi : allowanceAbi,
            address: factory.address,
            args: [account, factory.address],
            functionName: 'allowance',
        }
    );

    const getTransactions = React.useCallback(() => {
        let transactions : Transaction[] = [];
        const approvalTransaction : Transaction =
            {
                contractAddress: baseContracts[chainId || 44787],
                abi: isCelo? approveCUSDAbi : approveAbi,
                args: [factory.address, unit],
                functionName: 'approve'
            };
        if(allowance && allowance < unit){
            transactions.push(approvalTransaction);
        }
        
        const createPoolTransaction : Transaction = {
            abi: filterAbi(factory.abi, 'createPool'),
            contractAddress: factory.address,
            functionName: 'createPool',
            args
        };

        transactions.push(createPoolTransaction);
        return transactions;
    
   }, [unit, allowance]);

    return(
        <Confirmation 
            openDrawer={openDrawer}
            toggleDrawer={toggleDrawer}
            getTransactions={getTransactions}
            displayMessage='Request to create a Flexpool'
        />
    )
}

type CreatePermissionlessPoolProps = {
    unit: bigint;
    args: any[];
};