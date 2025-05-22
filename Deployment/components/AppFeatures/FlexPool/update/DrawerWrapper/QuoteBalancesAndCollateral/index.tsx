import React from "react";
import { flexSpread, } from "@/constants";
import { formatEther, } from "viem";
import { useConfig, useAccount, useReadContracts,} from "wagmi";
import { Spinner } from "@/components/utilities/Spinner";
import { filterTransactionData, formatAddr, toBN } from "@/utilities";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { Address, FunctionName } from "@/interfaces";
import { Confirmation, Transaction } from "../../ActionButton/Confirmation";
import { ActionButton } from "../../ActionButton";
import Payback from "../../transactions/Payback";

export default function QuoteBalancesAndCollateral({unit, safe, collateralAsset} : {unit: bigint, safe: Address, collateralAsset: Address}) {
    const [openDrawer, setDrawerState] = React.useState<number>(0);
    const [openColDrawer, setColDrawerState] = React.useState<number>(0);
    const config = useConfig();
    const { isConnected, chainId, address } = useAccount();
    const account = formatAddr(address);
    const { symbol, callback} = useAppStorage();
    const toggleDrawer = (arg: number) => setDrawerState(arg);
    const toggleColDrawer = (arg: number) => setColDrawerState(arg);

    const { txObject } = React.useMemo(() => {
        const { contractAddresses: ca, transactionData: td, isCelo } = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['getCollateralQuote', 'balanceOf', 'allowance', 'allowance', 'getCurrentDebt'],
            callback
        });
        const flexpoolContract = formatAddr(isCelo? ca.CeloBased : ca.CeloBased);
        const args = [[unit], [safe], [safe, account], [safe, account], [unit, account]];
        const addresses = [flexpoolContract, ca.stablecoin, ca.WrappedNative, ca.stablecoin, flexpoolContract];
        const txObject = td.map((item, i) => {
            return{
                abi: item.abi,
                functionName: item.functionName,
                address: formatAddr(addresses[i]),
                args: args[i]
            }
        });
        return { txObject, }
    }, [chainId, account, safe, unit]);

    const {data, isPending, refetch} = useReadContracts(
        {
        allowFailure: true,
        query: {
            enabled: !!isConnected,
            refetchInterval: 5000,
        },
        config,
        contracts: txObject.map((obj) => {
            return {
            abi: obj.abi,
            address: obj.address,
            functionName: obj.functionName,
            args: obj.args
            }
        })
        }
    );

    const quote = data?.[0]?.result as bigint;
    const safeBaseBalance = data?.[1]?.result as bigint;
    const myCollateralBalances = data?.[2]?.result as bigint;
    let withdrawables = data?.[3]?.result as bigint;
    let payables = data?.[4]?.result as bigint;

    const getTransactions = React.useCallback(() => {
        const { contractAddresses: ca, transactionData: td } = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['transferFrom'],
            callback
        });

        const refetchArgs = async(funcName: FunctionName) => {
            await refetch().then((result) => {
                withdrawables = result?.data?.[3].result as bigint;
            });
            return {
                args: [safe, account, withdrawables],
                value: 0n,
                proceed: 1                
            };
        };

        let transactions = td.map((txObject) => {
            const transaction : Transaction = {
                abi: txObject.abi,
                args: [safe, account, withdrawables],
                contractAddress: openColDrawer === 1? formatAddr(ca.WrappedNative) : formatAddr(ca.stablecoin),
                functionName: txObject.functionName as FunctionName,
                refetchArgs,
                requireArgUpdate: txObject.requireArgUpdate,
            };
            return transaction;
        })
        console.log("transactions", transactions);

        return transactions;
    }, [unit, chainId, account, withdrawables]);

    return(
        <div className={`bg-white1 dark:bg-transparent border border-b-4 p-4 space-y-4 rounded-lg dark:text-white1`}>
            <div className={`&{flexSpread}`}>
                <h1>Collateral Quote</h1>
                {
                    isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(quote || 0n)).decimalPlaces(5).toString()} ${symbol}`}</h1>
                }
            </div>
            <div className={`&{flexSpread}`}>
                <h1>Total contribution in Safe</h1>
                {
                    isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(safeBaseBalance || 0n)).decimalPlaces(5).toString()} usd`}</h1>
                }
            </div>
            <div className={`${flexSpread}`}>
                <div>
                    <h1>My Collateral balances</h1>
                    {
                        isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(myCollateralBalances || 0n)).decimalPlaces(5).toString()} ${symbol}`}</h1>
                    }
                </div>
                <div>
                    <ActionButton 
                        buttonContent="Withdraw"
                        disabled={myCollateralBalances === 0n || !data}
                        toggleDrawer={toggleColDrawer}
                        widthType='w-full'
                    />
                    <Confirmation 
                        toggleDrawer={toggleColDrawer}
                        getTransactions={getTransactions}
                        lastStepInList="transferFrom"
                        openDrawer={openColDrawer}
                        actionButtonText="Withdraw"
                        displayMessage="Request to withdraw collateral asset"
                    />

                </div>
            </div>
            <div className={`${flexSpread}`}>
                <div>
                    <h1>Withdrawable</h1>
                    {
                        isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(withdrawables || 0n)).decimalPlaces(5).toString()} usd`}</h1>
                    }
                </div>
                <div>
                    <ActionButton 
                        buttonContent="Withdraw"
                        disabled={withdrawables === 0n || !data}
                        toggleDrawer={toggleDrawer}
                        widthType='w-full'
                    />
                    <Confirmation 
                        toggleDrawer={toggleDrawer}
                        getTransactions={getTransactions}
                        lastStepInList="transferFrom"
                        openDrawer={openDrawer}
                        actionButtonText="Withdraw"
                        displayMessage="Request to withdraw base asset"
                    />

                </div>
            </div>
            <div className={`${flexSpread}`}>
                <div>
                    <h1>Total amount owed</h1>
                    {
                        isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(payables || 0n)).decimalPlaces(5).toString()} usd`}</h1>
                    }
                </div>
                <Payback 
                    collateralAddress={collateralAsset}
                    disabled={payables === 0n || !data}
                    unit={unit}
                />
            </div>
        </div>
    );
}
