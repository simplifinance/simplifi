import ButtonTemplate from "@/components/OnboardScreen/ButtonTemplate";
import SpinnerWheel from "@/components/SpinnerWheel";
import { flexSpread } from "@/constants";
import { formatAddr, handleTransact, toBN } from "@/utilities";
import { Stack } from "@mui/material";
import React from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContracts, useWriteContract, useConfig } from "wagmi";
import { readAllowanceConfig, readSymbolConfig, readBalanceConfig, tokenAddr, factoryAddr } from "../readContractConfig";
import { Address, AmountToApproveParam, CreatePermissionedPoolParams, CreatePermissionLessPoolParams, FuncTag, TrxState, VoidFunc } from "@/interfaces";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import withdrawLoan from "@/apis/update/testToken/withdrawLoan";
import { Spinner } from "@/components/Spinner";
import Message from "./Message";
import { formatError } from "@/apis/update/formatError";

export default function LiquidityAndStrategyBalances({stage, isCancelledPool, handleCloseDrawer, formatted_strategy, isPermissionless, param } : BalancesProps) {
    const [loading, setLoading] = React.useState<boolean>(false);
    
    const { address, isConnected } = useAccount();
    const config = useConfig();
    const currentUser = formatAddr(address);
    const { setmessage, setstorage } = useAppStorage();

    const callback_after = (errored: boolean, error?: any) => {
        !errored? setmessage('Trxn Completed') : setmessage(formatError({error, }));
        setLoading(false);
        setTimeout(() => handleCloseDrawer(), 10000);
        clearTimeout(10000);
    }

    const callback = (arg:TrxState) => {
        setstorage(arg);
        if(arg.status === 'success') handleCloseDrawer();
    }
    // const onError = (error: WriteContractErrorType) => setmessage(formatError({error:error.message}));
    // const onSuccess = (hash: Address) => setmessage(`Transaction Completed! Hash: ${hash}`);

    // const { writeContractAsync,  isPending: isWriteContractPending, isError: isWriteContractError} = useWriteContract({
    //     mutation: {
    //         onError,
    //         onSuccess,
    //     }
    // });
    
    const { data, isPending } = useReadContracts({
        contracts:    [
            { ...readSymbolConfig() },
            { ...readBalanceConfig({account: formatted_strategy, isConnected})},
            { ...readAllowanceConfig({isConnected, owner: formatted_strategy, spender: currentUser})}
        ],
        allowFailure: true,
    });
    
    const quota = data?.[2].result;
    const symbol = data?.[0].result;
    const balances = data?.[1].result;
    const disableButton = loading || !quota || stage < FuncTag.ENDED || quota.toString() === '0';

    const cashout = async() => {
        if(!quota) return null;
        setLoading(true);
        await withdrawLoan({
            config,
            account: currentUser,
            strategy: formatted_strategy,
            callback,
        }).then(() => callback_after(false))
        .catch((error) => callback_after(true, error))
        // writeContractAsync({
        //     abi: transferFromAbi,
        //     address: tokenAddr,
        //     functionName: 'transferFrom',
        //     args: [formatted_strategy, currentUser, quota]
        // });
    }

    const rekey = async() => {
        const unitLiquidity = toBN(formatEther(quota || 0n)).decimalPlaces(0, 1).toNumber();
        const unitLiquidity_ = parseEther(unitLiquidity.toString());
        const {colCoverage, contributors, allGH, durationInHours, intRate: rate} = param;
        const intRate = rate * 100;

        if(unitLiquidity === 0 || isCancelledPool) {
            alert(`${isCancelledPool? 'This Pool cannot be rekeyed.' : 'Invalid balances.'} Please create a new FlexPool`);
            return null;
        }
        setLoading(true);
        const createPermissionedPoolParam : CreatePermissionedPoolParams = {
            account: currentUser,
            colCoverage,
            config,
            contributors: contributors!,
            durationInHours,
            intRate,
            unitLiquidity: unitLiquidity_,
            callback
        }

        const createPermissionlessPoolParam : CreatePermissionLessPoolParams = {
            account: currentUser,
            colCoverage,
            config,
            durationInHours,
            intRate,
            quorum: allGH,
            unitLiquidity: unitLiquidity_,
            callback
        }

        const otherParam : AmountToApproveParam = {
            account: currentUser,
            config,
            txnType: 'CREATE',
            unit: quota?.toString()!,
        }
        await handleTransact({
            callback,
            otherParam,
            createPermissionedPoolParam,
            createPermissionlessPoolParam,
            router: isPermissionless? 'Permissionless' : 'Permissioned',
        }).then(() => callback_after(false))
        .catch((error) => callback_after(true, error));
        // await writeContractAsync({
        //     abi: approveAbi,
        //     address: tokenAddr,
        //     functionName: 'approve',
        //     args: [factoryAddr, BigInt(allGH)]
        // });
        // isPermissionless? 
        //     await writeContractAsync({
        //         abi: createPermissionlessLiquidityPoolAbi,
        //         address: factoryAddr,
        //         functionName: 'createPermissionlessPool',
        //         args: [intRate * 100, allGH, durationInHours, colCoverage, unitLiquidity_, tokenAddr]
        //     }) : 
        //     await writeContractAsync({
        //         abi: createPermissionedLiquidityPoolAbi,
        //         address: factoryAddr,
        //         functionName: 'createPermissionedPool',
        //         args: [intRate * 100, durationInHours, colCoverage, unitLiquidity_, tokenAddr, contributors!]
        //     });
    }

    return(
        <Stack className="bg-gray1 p-4 space-y-4 rounded-lg text-orange-400 font-bold text-sm">
            <div className={`${flexSpread}`}>
                <h1>Bal In Strategy</h1>
                {
                    isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(balances || 0n)).decimalPlaces(2).toString()} ${symbol || ''}`}</h1>
                }
            </div>
            <div className={`${flexSpread}`}>
                <h1>Liquidity Bal</h1>
                {
                    isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(quota || 0n)).decimalPlaces(2).toString()} ${symbol || ''}`}</h1>
                }
            </div>
            <ButtonTemplate
                buttonAContent={loading? <Spinner color="#fed7aa" /> : 'CashOut'}
                buttonBContent={loading? <Spinner color="#fed7aa" /> : 'Rekey'}
                disableButtonA={disableButton}
                disableButtonB={disableButton}
                overrideClassName="text-orange-200"
                buttonAFunc={cashout}
                buttonBFunc={rekey}
            />
            <Message />
        </Stack>
    );
}

export interface RekeyParam {
    colCoverage: number;
    contributors?: Address[];
    durationInHours: number;
    intRate: number;
    allGH: number;
}

interface BalancesProps {
    formatted_strategy: Address;
    isPermissionless: boolean;
    param: RekeyParam;
    isCancelledPool: boolean;
    handleCloseDrawer: VoidFunc;
    stage: number;
}
