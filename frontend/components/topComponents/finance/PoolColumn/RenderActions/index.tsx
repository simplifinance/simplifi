import React from "react";
import { AmountToApproveParam, ButtonText, FuncTag, TransactionCallback, TransactionCallbackArg } from "@/interfaces";
import { handleTransact } from "@/utilities";
import BigNumber from "bignumber.js";
import useAppStorage from '@/components/StateContextProvider/useAppStorage';
import { PreferredDurationInput } from "./PreferredDurationInput";
import { ConfirmationPopUp } from "./ConfirmationPopUp";
import { Address } from "viem";
import { CustomButton } from "@/components/CustomButton";

export const RenderActions = (props: RenderActionsProps) => {
    const [modalOpen, setInputModal] = React.useState<boolean>(false);
    // const [confirmationModal, setConfirmationModal] = React.useState<boolean>(false);
    const [preferredDuration, setPreferredDuration] = React.useState<string>('0');

    const { stage_toNumber, isAdmin, strategy, epochId_toNumber, otherParam: otp, isPermissionless, maxEpochDuration, isMember, loan_InBN, payDate_InSec } = props;

    const { setTrxnStatus, popUpDrawer, handlePopUpDrawer } = useAppStorage();
    let buttonObj : {value: ButtonText, disable: boolean} = {value: 'WAIT', disable: false};

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

    const callback : TransactionCallback = (arg: TransactionCallbackArg) => {
        if(arg.loading && popUpDrawer === 'confirmation') {
            closeConfirmationPopUp();
        }
        setTrxnStatus(arg);
    }

    switch (stage_toNumber) {
        case FuncTag.JOIN:
            if(isPermissionless){
                if(isMember) buttonObj.disable = true;
                else buttonObj.value = 'ADD LIQUIDITY';
            } else {
                if(isMember && !isAdmin) buttonObj.value = 'ADD LIQUIDITY';
                else if(isMember && isAdmin) buttonObj = {value: 'WAIT', disable: true};
                else buttonObj.disable = true;;
            }
            break;

        case FuncTag.GET:
            if(isMember) buttonObj.value = 'GET FINANCE';
            else buttonObj = { value: 'DISABLED', disable: true };
            break;
        
        case FuncTag.PAYBACK:
            if(isMember){
                if(loan_InBN.gt(0)) buttonObj.value = 'PAYBACK';
                else buttonObj = { value: 'DISABLED', disable: true};
            } else {
                if((new Date().getTime() / 1000) >  payDate_InSec) buttonObj = { value: 'LIQUIDATE', disable: true};
                else buttonObj = { value: 'DISABLED', disable: true};
            }
            break;
        default:
            buttonObj = { value: 'ENDED', disable: true};
            break;
    }

    const sendTransaction = async() => {
        const otherParam : AmountToApproveParam = otp;
        otherParam.txnType = buttonObj.value;
        await handleTransact(
            {
                callback,
                preferredDuration,
                otherParam,
                strategy
            }
        );
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
    otherParam: AmountToApproveParam;
    maxEpochDuration: string;
    strategy: Address;
}
