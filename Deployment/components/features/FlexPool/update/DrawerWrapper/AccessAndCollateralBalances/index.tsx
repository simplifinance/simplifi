import ButtonTemplate from "@/components/OnboardScreen/ButtonTemplate";
import { flexSpread,} from "@/constants";
import { formatAddr, toBN } from "@/utilities";
import { Stack } from "@mui/material";
import React from "react";
import { formatEther, parseEther, } from "viem";
import { useAccount, useReadContract, useConfig } from "wagmi";
import getReadFunctions from "../readContractConfig";
import { Address, TrxState, VoidFunc } from "@/interfaces";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { Spinner } from "@/components/Spinner";
import { formatError } from "@/apis/update/formatError";
import Message from "../Message";
import withdrawCollateral from "@/apis/update/bank/withdrawCollateral";
import depositCollateral from "@/apis/update/bank/depositCollateral";
import { CollateralInput } from "./CollateralInput";

export default function AccessAndCollateralBalances({ handleCloseDrawer, formatted_bank, rId} : AccessAndCollateralBalanceProps) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showInput, setShowInput] = React.useState<boolean>(false);
    const [amount, setAmount] = React.useState<string>('0');
    
    const { address, chainId } = useAccount();
    const config = useConfig();
    const currentUser = formatAddr(address);
    const { setmessage, setstorage, } = useAppStorage();
    const handleModalClose = () => setShowInput(false);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setAmount(toBN(e.target.value || '0').div(toBN('1000')).toString());
    }

    const callback_after = (errored: boolean, error?: any) => {
        !errored? setstorage({message: 'Trxn Completed',}) : setstorage({message: formatError({error, }),});
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
    
    const { readUserDataConfig, currency, } = getReadFunctions({chainId});
    const { data, isPending } = useReadContract({
        ...readUserDataConfig({
            user: currentUser, 
            bank: formatted_bank,
            rId
        }),
        query: {refetchInterval: 5000}
    });

    const handleSubmit = async() => {
        if(amount === '0') return null;
        handleModalClose();
        setLoading(true);
        await depositCollateral({
            config,
            account: currentUser,
            bank: formatted_bank,
            rId,
            callback,
            value: parseEther(amount, 'wei')
        }).then(() => callback_after(false))
        .catch((error) => callback_after(true, error))
    }

    const withdraw = async() => {
        setLoading(true);
        await withdrawCollateral({
            account: currentUser,
            bank: formatted_bank,
            rId,
            config,
            callback, 
        }).then(() => callback_after(false))
        .catch((error) => callback_after(true, error));

    }

    return(
        <Stack className="bg-gray1 p-4 space-y-2 rounded-lg text-orange-400 font-normal text-sm">
            <div className={`${flexSpread}`}>
                <h1>Permission</h1>
                {
                    isPending? <Spinner color="#fed7aa" /> : data?.access? <h1 className='text-green-400'>Granted</h1> : <h1 className='text-red-300'>No Access</h1>
                }
            </div>
            <h1>{'Collaterals:'}</h1>
            <div className="p-2 border border-green1 rounded-lg text-orange-200 text-xs space-y-1">
                <div className={`${flexSpread}`}>
                    <h1>In Use</h1>
                    {
                        isPending || !data? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(data?.collateral.balance || 0n)).decimalPlaces(2).toString()} ${currency}`}</h1>
                    }
                </div>
                <div className={`${flexSpread}`}>
                    <h1>Withdrawable</h1>
                    {
                        isPending || !data? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(data?.collateral.withdrawable || 0n)).decimalPlaces(2).toString()} ${currency}`}</h1>
                    }
                </div>
            </div>
            <ButtonTemplate
                buttonAContent={loading? <Spinner color="#fed7aa" /> : 'Deposit'}
                buttonBContent={loading? <Spinner color="#fed7aa" /> : 'Withdraw'}
                disableButtonA={!data?.access}
                disableButtonB={!data?.access || data?.collateral.withdrawable === 0n}
                overrideClassName="text-orange-200"
                buttonAFunc={() => setShowInput(true)}
                buttonBFunc={withdraw}
            />
            <Message />
            <CollateralInput 
                amount={amount}
                handleModalClose={handleModalClose}
                handleSubmit={handleSubmit}
                modalOpen={showInput}
                onChange={onChange}
            />
        </Stack>
    );
}

interface AccessAndCollateralBalanceProps {
    formatted_bank: Address;
    handleCloseDrawer: VoidFunc;
    rId: bigint;
}
