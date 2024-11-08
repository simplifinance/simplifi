import React from "react";
import { AmountToApproveParam, ButtonText, FuncTag, TransactionCallback, TransactionCallbackArg } from "@/interfaces";
import { handleTransact } from "@/utilities";
import BigNumber from "bignumber.js";
import { StorageContext } from "@/components/StateContextProvider";
import { PreferredDurationInput } from "./PreferredDurationInput";
import Notification from "@/components/Notification";
import { ConfirmationPopUp } from "./ConfirmationPopUp";
import { Address } from "viem";

export const RenderActions = (props: RenderActionsProps) => {
    const [message, setMessage] = React.useState<string>('');
    const [modalOpen, setInputModal] = React.useState<boolean>(false);
    const [confirmationModal, setConfirmationModal] = React.useState<boolean>(false);
    const [preferredDuration, setPreferredDuration] = React.useState<string>('0');

    const { stage_toNumber, isAdmin, strategy, epochId_toNumber, otherParam: otp, isPermissionless, maxEpochDuration, isMember, loan_InBN, payDate_InSec } = props;

    const { setstate } = React.useContext(StorageContext);
    let buttonObj : {value: ButtonText, disable: boolean} = {value: 'WAIT', disable: false};

    const handleModalClose = () => {
        if(preferredDuration === '0') {
            setPreferredDuration(maxEpochDuration);
        }
        setInputModal(!modalOpen);
        setConfirmationModal(!confirmationModal);
    }

    const closeConfirmationPopUp = () => setConfirmationModal(false);

    const useEpochDuration = () => {
        setPreferredDuration(maxEpochDuration);
        setInputModal(false);
        setConfirmationModal(!confirmationModal);
    };

    const handleClick = () => {
        if(buttonObj.value === 'GET') {
            setInputModal(true);
        } else {
            setConfirmationModal(!confirmationModal);
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.currentTarget.value;
        setPreferredDuration(value === ''? '0' : value);
    }

    const callback : TransactionCallback = (arg: TransactionCallbackArg) => {
        if(arg.message) setMessage(arg.message);
        if(arg.txDone && arg.result) {
            setstate(arg.result);
        }
        if(arg.txDone && confirmationModal) {
            closeConfirmationPopUp();
        }
    }

    switch (stage_toNumber) {
        case FuncTag.JOIN:
            if(isPermissionless){
                if(isMember) buttonObj.disable = true;
                else buttonObj.value = 'ADD';
            } else {
                if(isMember && !isAdmin) buttonObj.value = 'ADD';
                else if(isMember && isAdmin) buttonObj = {value: 'WAIT', disable: true};
                else buttonObj.disable = true;;
            }
            break;

        case FuncTag.GET:
            if(isMember) buttonObj.value = 'GET';
            else buttonObj = { value: 'DISABLED', disable: true };
            break;
        
        case FuncTag.PAYBACK:
            if(isMember){
                if(loan_InBN.gt(0)) buttonObj.value = 'PAY';
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
            <button 
                onClick={handleClick}
                disabled={buttonObj.disable}
                className="w-full text-xs font-extrabold border border-orangec p-2 rounded-lg text-orangec bg-yellow-100 hover:bg-orangec hover:text-white1" 
            >
                {buttonObj.value}
            </button>
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
                        handleModalClose: closeConfirmationPopUp,
                        modalOpen: confirmationModal,
                        sendTransaction,
                    }
                }
            />
            <Notification message={message} />
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
