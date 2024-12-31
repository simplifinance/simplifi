import React from "react";
import { AmountToApproveParam, ButtonText, FuncTag, TransactionCallback, TrxState, } from "@/interfaces";
import { handleTransact } from "@/utilities";
import BigNumber from "bignumber.js";
import useAppStorage from '@/components/StateContextProvider/useAppStorage';
import { PreferredDurationInput } from "./PreferredDurationInput";
import { ConfirmationPopUp } from "./ConfirmationPopUp";
import { Address, formatEther } from "viem";
import { CustomButton } from "@/components/CustomButton";
import { FormatErrorArgs } from "@/apis/transact/formatError";

export const RenderActions = (props: RenderActionsProps) => {
    const [modalOpen, setInputModal] = React.useState<boolean>(false);
    const [preferredDuration, setPreferredDuration] = React.useState<string>('0');

    const { 
        stage_toNumber, 
        isAdmin, 
        strategy, 
        sentQuota, 
        totalPoolInBN,
        unitInBN,
        userCount, 
        epochId_toNumber, 
        otherParam: otp, 
        isPermissionless, 
        maxEpochDuration,
        isMember, 
        loan_InBN, 
        payDate_InSec } = props;

    const { setTrxnStatus, popUpDrawer, handlePopUpDrawer } = useAppStorage();
    let buttonObj : ButtonObj = {value: 'WAIT', disable: true};

    const handleModalClose = () => {
        if(preferredDuration === '0') {
            setPreferredDuration(maxEpochDuration);
        }
        setInputModal(!modalOpen);
        handlePopUpDrawer('confirmation');
    }

    const closeConfirmationPopUp = () => handlePopUpDrawer('');
    const useEpochDuration = () => {
        setPreferredDuration(maxEpochDuration);
        setInputModal(false);
        handlePopUpDrawer('confirmation');
    };

    const handleClick = () => {
        if(buttonObj.value === 'GET FINANCE') {
            setInputModal(true);
        } else {
            handlePopUpDrawer('confirmation');
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.currentTarget.value;
        setPreferredDuration(value === ''? '0' : value);
    }

    const callback : TransactionCallback = (arg: TrxState) => {
        if(arg.status === 'success' && popUpDrawer === 'confirmation') {
            closeConfirmationPopUp();
        }
        setTrxnStatus(arg);
    }

    switch (stage_toNumber) {
        case FuncTag.JOIN:
            if(isPermissionless){
                if(isAdmin) {
                    if(userCount === 1) {
                        buttonObj = {value: 'REMOVE', disable: false};
                    } else {
                        buttonObj = {value: 'WAIT', disable: true}
                    }
                } else {
                    buttonObj.value = 'ADD LIQUIDITY';
                }
            } else {
                if(isAdmin) {
                    if(totalPoolInBN.eq(unitInBN)){
                        buttonObj = {value: 'REMOVE', disable: false};
                    } else {
                        buttonObj = {value: 'WAIT', disable: true};
                    }
                }
                else if(isMember && !sentQuota) buttonObj = {value: 'ADD LIQUIDITY', disable: false};
                else if(isMember && sentQuota) buttonObj = {value: 'WAIT', disable: true};
                else buttonObj = {value: 'DISABLED', disable: true};
            }
            break;

        case FuncTag.GET:
            if(isMember) buttonObj.value = 'GET FINANCE';
            else buttonObj = { value: 'DISABLED', disable: true };
            break;
        
        case FuncTag.PAYBACK:
            if(isMember){
                if(loan_InBN.gt(0)) buttonObj = {value : 'PAYBACK', disable: false};
                else buttonObj = { value: 'DISABLED', disable: true};
            } else {
                if((new Date().getTime() / 1000) >  payDate_InSec) buttonObj = { value: 'LIQUIDATE', disable: false};
                else buttonObj = { value: 'DISABLED', disable: true};
            }
            break;
        default:
            buttonObj = { value: 'ENDED', disable: true};
            break;
    }

    const sendTransaction = async({onSuccess, onError}: {onSuccess: () => void, onError: (errorArg: FormatErrorArgs) => void}) => {
        const otherParam : AmountToApproveParam = {...otp, txnType: buttonObj.value};
        await handleTransact(
            {
                callback,
                preferredDuration,
                otherParam,
                strategy
            }
        )
            .then(() => onSuccess())
            .catch((error) => onError({
                error,
                amount: formatEther(BigInt(otp.unit.toString())),
                durationInSec: Number(preferredDuration),
                epochId: otp.epochId?.toString(),
                maxEpochDuration: maxEpochDuration || '0'
            }))
    }

    return(
        <React.Fragment>
            <CustomButton
                disabled={buttonObj.disable}
                handleButtonClick={handleClick}
                overrideClassName="bg-gray1 text-orange-300 rounded-full"
            >
                {buttonObj.value}
            </CustomButton>
            <PreferredDurationInput 
                {
                    ...{
                        handleModalClose,
                        maxEpochDuration,
                        modalOpen,
                        onChange,
                        useEpochDuration,
                        preferredDuration
                    }
                }
            />
            <ConfirmationPopUp 
                {
                    ...{
                        buttonText: buttonObj.value,
                        epochId: epochId_toNumber,
                        sendTransaction,
                    }
                }
            />
        </React.Fragment>
    );
}

export interface RenderActionsProps {
    stage_toNumber: number;
    isPermissionless: boolean;
    isMember: boolean;
    isAdmin: boolean;
    epochId_toNumber: number;
    loan_InBN: BigNumber;
    payDate_InSec: number;
    quorum: number;
    otherParam: AmountToApproveParam;
    maxEpochDuration: string;
    strategy: Address;
    userCount: number;
    sentQuota: boolean;
    totalPoolInBN: BigNumber;
    unitInBN: BigNumber; 
}

type ButtonObj = {
    value: ButtonText;
    disable: boolean;
}
