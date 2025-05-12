import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { getContractData } from '@/apis/utils/getContractData';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterAbi, formatAddr } from '@/utilities';
import { FunctionName, Address } from '@/interfaces';
import { allowanceAbi, allowanceCUSDAbi, getCollateralQuoteAbi, transferFromAbi, withdrawCUSDAbi } from '@/apis/utils/abis';
import { baseContracts } from '@/constants';

type PaybackProps = {
    isWrappedAsset: boolean;
    unit: bigint;
    safe: Address;
};

export default function Payback({isWrappedAsset, unit, safe}: PaybackProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);

    const { chainId, address } = useAccount();
    const config = useConfig();
    const account  = formatAddr(address);
    const { factory, wrapped, token } = getContractData(chainId || 44787);
    const approvalName : FunctionName = isWrappedAsset? 'deposit' : 'approve';
    const isCelo = (chainId === 44787 || chainId === 42220);
    const { data } = useReadContracts(
        {
            config,
            contracts: [
                {
                    abi: getCollateralQuoteAbi,
                    address: factory.address,
                    args: [unit],
                    functionName: 'getCollateralQuote',
                },
                {
                    abi: isCelo? allowanceCUSDAbi : allowanceAbi,
                    address: factory.address,
                    args: [safe, account],
                    functionName: 'allowance',
                },
            ]
        }
    );
    const collateral = data?.[0]?.result?.[0];
    const allowance = data?.[1]?.result;

    const getTransactions = React.useCallback(() => {
        let transactions : Transaction[] = [];
        const approvalTransaction : Transaction 
            = 
                isWrappedAsset? 
                    {
                        contractAddress: wrapped.address,
                        abi: filterAbi(wrapped.abi, approvalName),
                        args: [factory.address],
                        functionName: approvalName,
                        value: unit
                    } 
                        : 
                            {
                                contractAddress: token.address,
                                abi: filterAbi(token.abi, approvalName),
                                args: [factory.address, collateral],
                                functionName: approvalName
                            };
        const getFinanceTransaction : Transaction = {
            abi: filterAbi(factory.abi, 'getFinance'),
            contractAddress: factory.address,
            functionName: 'getFinance',
            args: [unit]
        };

        const withdrawTransaction : Transaction = {
            abi: isCelo? withdrawCUSDAbi : transferFromAbi,
            contractAddress: baseContracts[chainId || 44787],
            functionName: 'transferFrom',
            args: [safe, account, allowance]
        };

        transactions = [approvalTransaction, getFinanceTransaction, withdrawTransaction];
        return transactions;
    
   }, [unit, isWrappedAsset]);

    return(
        <Confirmation 
            openDrawer={openDrawer}
            toggleDrawer={toggleDrawer}
            getTransactions={getTransactions}
            displayMessage='Request to get finance'
        />
    )
}