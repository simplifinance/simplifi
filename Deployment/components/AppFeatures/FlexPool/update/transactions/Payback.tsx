import React from 'react';
import { Confirmation, type Transaction } from '../ActionButton/Confirmation';
import { useAccount, useConfig, useReadContracts } from 'wagmi';
import { filterTransactionData, formatAddr } from '@/utilities';
import { Address, FunctionName, TransactionData } from '@/interfaces';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { zeroAddress } from 'viem';
import { ActionButton } from '../ActionButton';

const steps : FunctionName[] = ['getCurrentDebt', 'allowance', 'approve', 'payback', 'transferFrom'];

export default function Payback({ unit, safe, collateralAddress, disabled }: PaybackProps) {
    const [openDrawer, setDrawer] = React.useState<number>(0);
    const toggleDrawer = (arg: number) => setDrawer(arg);
    
    const config = useConfig();
    const { chainId, address } = useAccount();
    const account  = formatAddr(address);
    const { callback } = useAppStorage();

    const { contractAddresses: ca, transactionData: td, flexpoolContract, allowanceArg, paybackArg, allowanceContract, getDebtArg } = React.useMemo(() => {
        const filtered = filterTransactionData({
            chainId,
            filter: true,
            functionNames: steps,
            callback
        });
        const getDebtArg = [unit, account];
        const allowanceArg = [safe, account];
        const paybackArg = [unit];
        const flexpoolContract = filtered.isCelo? filtered.contractAddresses.CeloBased as Address : filtered.contractAddresses.CeloBased as Address;
        const isWrappedAsset = collateralAddress === filtered.contractAddresses.WrappedNative;
        const allowanceContract = isWrappedAsset? filtered.contractAddresses.WrappedNative as Address : filtered.contractAddresses.SimpliToken as Address;

        return { ...filtered, flexpoolContract, allowanceArg, paybackArg, getDebtArg, allowanceContract };
    }, [chainId, unit, account]);

    const { refetch  } = useReadContracts(
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

    const getTransactions = React.useCallback(() => {
        const txObjects = td.filter(({functionName}) => functionName !== steps[0] && functionName !== steps[1]);
        const refetchArgs = async(funcName: FunctionName) => {
            let args : any[] = [];
            await refetch().then((result) => {
                const debt = result?.data?.[1].result as bigint;
                const allowance = result?.data?.[1]?.result as bigint;
                switch (funcName) {
                    case 'approve':
                        args = [flexpoolContract, debt];
                        break;
                    case 'transferFrom':
                        args = [safe, account, allowance];
                        break;
                    default:
                        break;
                }
                
            });
            return {args, value: 0n};
        };

        const getArgs = (txObject: TransactionData) => {
            let args :any[] = [];
            let contractAddress = '';
            switch (txObject.functionName) {
                case 'payback':
                    args = paybackArg;
                    contractAddress = flexpoolContract;
                    break;
                case 'transferFrom':
                    contractAddress = allowanceContract;
                    break;
                default:
                    contractAddress = txObject.contractAddress;
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
                refetchArgs: txObject.requireArgUpdate? refetchArgs : undefined,
                requireArgUpdate: txObject.requireArgUpdate
            };
            return transaction;
        })
        console.log("transactions", transactions);
        return transactions;
   }, [unit, ca]);

    return(
        <React.Fragment>
            <ActionButton 
                disabled={disabled} 
                toggleDrawer={toggleDrawer}
                buttonContent='Payback'
                widthType='fit-content'
            />
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                getTransactions={getTransactions}
                displayMessage='Request to payback loan'
                lastStepInList={'transferFrom'}
            />
        </React.Fragment>
    )
}

type PaybackProps = {
    unit: bigint;
    safe: Address;
    collateralAddress: Address;
    disabled: boolean;
};