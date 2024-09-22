import React from "react";
import { AmountToApproveParam, ButtonText, FuncTag, TransactionCallback, TransactionCallbackArg } from "@/interfaces";
import { handleTransact } from "@/utilities";
import BigNumber from "bignumber.js";
import { StorageContext } from "@/components/StateContextProvider";
import { PreferredDurationInput } from "./PreferredDurationInput";
import Notification from "@/components/Notification";
import { ConfirmationPopUp } from "./ConfirmationPopUp";

export const RenderActions = (props: RenderActionsProps) => {
    const [message, setMessage] = React.useState<string>('');
    const [modalOpen, setModal] = React.useState<boolean>(false);
    const [confirmationModal, setConfirmationModal] = React.useState<boolean>(false);
    const [preferredDuration, setPreferredDuration] = React.useState<string>('0');
    // const [buttonObj, setButtonObj] = React.useState<{value: ButtonText, disable: boolean}>({value: 'WAIT', disable: false});

    const { stage_toNumber, epochId_toNumber, otherParam: otp, isPermissionless, maxEpochDuration, isMember, loan_InBN, payDate_InSec } = props;

    const { setstate } = React.useContext(StorageContext);
    let buttonObj : {value: ButtonText, disable: boolean} = {value: 'WAIT', disable: false};

    const handleModalClose = () => {
        if(preferredDuration === '0') {
            setPreferredDuration(maxEpochDuration);
        }
        setModal(!modalOpen);
    }

    const closeConfirmationPopUp = () => setConfirmationModal(false);

    const useEpochDuration = () => {
        setPreferredDuration(maxEpochDuration);
        setModal(false);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.currentTarget.value;
        setPreferredDuration(value === ''? '0' : value);
    }

    const callback : TransactionCallback = (arg: TransactionCallbackArg) => {
        if(arg?.message) setMessage(arg.message);
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
                if(isMember) buttonObj.value = 'ADD';
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
                else buttonObj = { value: 'AWAIT PAYMENT', disable: true};
            } else {
                if((new Date().getTime() / 1000) >  payDate_InSec) buttonObj.value = 'LIQUIDATE';
                else buttonObj = { value: 'AWAIT PAYMENT', disable: true};
            }
            break;
        default:
            break;
    }

    const sendTransaction = async() => {
        const otherParam : AmountToApproveParam = otp;
        otherParam.txnType = buttonObj.value;
        await handleTransact(
            {
                callback,
                preferredDuration,
                otherParam
            }
        );
    }

    return(
        <React.Fragment>
            <button 
                onClick={() => setConfirmationModal(true)}
                disabled={buttonObj.disable}
                className="w-full text-xs font-semibold border border-orangec p-2 rounded-lg text-orangec bg-yellow-100 hover:shadow-lg hover:shadow-green1" 
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
    epochId_toNumber: number;
    loan_InBN: BigNumber;
    payDate_InSec: number;
    otherParam: AmountToApproveParam;
    maxEpochDuration: string;
}
