import ButtonTemplate from "@/components/OnboardScreen/ButtonTemplate";
import { flexSpread, } from "@/constants";
import { formatAddr, handleTransact, toBN } from "@/utilities";
import { Stack } from "@mui/material";
import React from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContracts, useConfig } from "wagmi";
import getReadFunctions from "../readContractConfig";
import { Address, AmountToApproveParam, CreatePermissionedPoolParams, CreatePermissionLessPoolParams, TrxState, VoidFunc } from "@/interfaces";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import withdrawLoan from "@/apis/update/testToken/withdrawLoan";
import { Spinner } from "@/components/Spinner";
import Message from "../Message";
import { formatError } from "@/apis/update/formatError";

export default function LiquidityAndBankBalances({stage, isCancelledPool, handleCloseDrawer, formatted_bank, isPermissionless, param } : BalancesProps) {
    const [loading, setLoading] = React.useState<boolean>(false);
    
    const { address, chainId } = useAccount();
    const config = useConfig();
    const currentUser = formatAddr(address);
    const { setmessage, setstorage, symbol } = useAppStorage();
    const { readBalanceConfig, readAllowanceConfig } = getReadFunctions({chainId});
    const callback_after = (errored: boolean, error?: any) => {
        !errored? setmessage('Trxn Completed') : setmessage(formatError({error, }));
        setLoading(false);
        setTimeout(() => {
            setmessage('');
            handleCloseDrawer();
        }, 10000);
        clearTimeout(10000);
    }

    const callback = (arg:TrxState) => {
        setstorage(arg);
        if(arg.status === 'success') handleCloseDrawer();
    }
    
    const { data, isPending } = useReadContracts({
        contracts: [
            { ...readBalanceConfig({account: formatted_bank})},
            { ...readAllowanceConfig({owner: formatted_bank, spender: currentUser})}
        ],
        allowFailure: true,
        query: {refetchInterval: 5000}
    });
    
    const quota = data?.[1].result;
    const balances = data?.[0].result;
    const disableButton = loading || !quota || quota.toString() === '0';

    const cashout = async() => {
        if(!quota) return null;
        setLoading(true);
        await withdrawLoan({
            config,
            account: currentUser,
            bank: formatted_bank,
            callback,
        }).then(() => callback_after(false))
        .catch((error) => callback_after(true, error))
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
            unit: quota!,
        }
        await handleTransact({
            callback,
            otherParam,
            createPermissionedPoolParam,
            createPermissionlessPoolParam,
            router: isPermissionless? 'Permissionless' : 'Permissioned',
        }).then(() => callback_after(false))
        .catch((error) => callback_after(true, error));
    }

    return(
        <Stack className="bg-gray1 p-4 space-y-4 rounded-lg text-orange-400 font-noraml text-sm">
            <div className={`${flexSpread}`}>
                <h1>Bank Balances</h1>
                {
                    isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(balances || 0n)).decimalPlaces(2).toString()} ${symbol || ''}`}</h1>
                }
            </div>
            <div className={`${flexSpread}`}>
                <h1>Withdrawables</h1>
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
    formatted_bank: Address;
    isPermissionless: boolean;
    param: RekeyParam;
    isCancelledPool: boolean;
    handleCloseDrawer: VoidFunc;
    stage: number;
}
