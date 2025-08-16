import React from "react";
import { flexSpread, } from "@/constants";
import { formatEther, } from "viem";
import { useConfig, useAccount, useReadContracts,} from "wagmi";
import { Spinner } from "@/components/utilities/Spinner";
import { filterTransactionData, formatAddr, toBN } from "@/utilities";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { Address } from "@/interfaces";
import Payback from "../../transactions/Payback";

export default function BalancesAndCollaterals({unit, safe, collateralAsset} : {unit: bigint, safe: Address, collateralAsset: Address}) {
    const config = useConfig();
    const { isConnected, chainId, address } = useAccount();
    const account = formatAddr(address);
    const { symbol, callback} = useAppStorage();

    const { txObject } = React.useMemo(() => {
        const { contractAddresses: ca, transactionData: td, isCelo } = filterTransactionData({
            chainId,
            filter: true,
            functionNames: ['getCollateralQuote', 'balanceOf', 'getCurrentDebt', 'balanceOf'],
            callback
        });
        const flexpoolContract = formatAddr(isCelo? ca.CeloBased : ca.CeloBased);
        const args = [[unit], [safe], [unit, account], [account]];
        const addresses = [flexpoolContract, ca.stablecoin, flexpoolContract, ca.WrappedNative];
        const txObject = td.map((item, i) => {
            return{
                abi: item.abi,
                functionName: item.functionName,
                address: formatAddr(addresses[i]),
                args: args[i]
            }
        });
        return { txObject, }
    }, [chainId, account, safe, unit, callback]);

    const {data, isPending} = useReadContracts(
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
    const payables = data?.[2]?.result as bigint;
    const collateralInWallet = data?.[3]?.result as bigint;

    return(
        <div className={`bg-white1 text-gray-800 font-semibold dark:bg-transparent text-sm border border-b-4 p-4 space-y-4 rounded-lg dark:text-white1`}>
            <div className={`${flexSpread} items-baseline`}>
                <div className="w-[50%]">
                    <h1>Collateral Quote { isPending? <Spinner color="#fed7aa" /> : <h3>{`${toBN(formatEther(quote || 0n)).decimalPlaces(5).toString()} ${symbol}`}</h3> }</h1>
                </div>
                <div className="w-[50%] flex">
                    <h3>{`Amount of ${symbol} required to get finance in this pool`}</h3>
                </div>
            </div>
            <div className={`&{flexSpread}`}>
                <h1>Total contribution in Safe</h1>
                {
                    isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(safeBaseBalance || 0n)).decimalPlaces(5).toString()} usd`}</h1>
                }
            </div>
            <div className={`&{flexSpread}`}>
                <h1>{`Balances of ${symbol} in my wallet`}</h1>
                {
                    isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(collateralInWallet || 0n)).decimalPlaces(5).toString()} usd`}</h1>
                }
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
                    widthType="w-[50%]"
                />
            </div>
        </div>
    );
}



// <div className={`${flexSpread}`}>
// <div className="w-[50%]">
//     <h1>Withdrawable</h1>
//     {
//         isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(withdrawables || 0n)).decimalPlaces(5).toString()} usd`}</h1>
//     }
// </div>
// <div className="w-[50%]">
//     <ActionButton 
//         buttonContent="Withdraw"
//         disabled={withdrawables === 0n || !data}
//         toggleDrawer={toggleDrawer}
//         widthType='w-full'
//     />
//     <Confirmation 
//         toggleDrawer={toggleDrawer}
//         getTransactions={getTransactions}
//         lastStepInList="transferFrom"
//         openDrawer={openDrawer}
//         actionButtonText="Withdraw"
//         displayMessage="Request to withdraw base asset"
//     />

// </div>
// </div>


{/* <div className={`${flexSpread}`}>
<div className="w-[50%]">
    <h1>My Collateral balances</h1>
    {
        isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(myCollateralBalances || 0n)).decimalPlaces(5).toString()} ${symbol}`}</h1>
    }
</div>
<div className="w-[50%]">
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
</div> */}



// const getTransactions = React.useCallback(() => {
//     let withdrawables : bigint = 0n;
//     const { contractAddresses: ca, transactionData: td } = filterTransactionData({
//         chainId,
//         filter: true,
//         functionNames: ['transferFrom'],
//         callback
//     });

//     const refetchArgs = async(funcName: FunctionName) => {
//         await refetch().then((result) => {
//             withdrawables = result?.data?.[3].result as bigint;
//         });
//         return {
//             args: [safe, account, withdrawables],
//             value: 0n,
//             proceed: 1                
//         };
//     };

//     let transactions = td.map((txObject) => {
//         const transaction : Transaction = {
//             abi: txObject.abi,
//             args: [safe, account, withdrawables],
//             contractAddress: openColDrawer === 1? formatAddr(ca.WrappedNative) : formatAddr(ca.stablecoin),
//             functionName: txObject.functionName as FunctionName,
//             refetchArgs,
//             requireArgUpdate: txObject.requireArgUpdate,
//         };
//         return transaction;
//     })

//     return transactions;
// }, [chainId, account, callback, openColDrawer, refetch, safe]);