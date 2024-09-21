import React from "react";
import { AmountToApproveParam, ButtonText, FuncTag, TransactionCallback, TransactionCallbackArg } from "@/interfaces";
import { handleTransact } from "@/utilities";
import BigNumber from "bignumber.js";
import { StorageContext } from "@/components/StateContextProvider";
import { PreferredDurationInput } from "./PreferredDurationInput";
import Notification from "@/components/Notification";

export const RenderActions = (props: RenderActionsProps) => {
    const [message, setMessage] = React.useState<string>('');
    const [modalOpen, setModal] = React.useState<boolean>(false);
    const [preferredDuration, setPreferredDuration] = React.useState<string>('0');
    const [buttonObj, setButtonObj] = React.useState<{value: ButtonText, disable: boolean}>({value: 'WAIT', disable: false});
    const { stage_toNumber, otherParam: otp, isPermissionless, maxEpochDuration, isMember, loan_InBN, payDate_InSec } = props;

    const { setstate } = React.useContext(StorageContext);

    const handleModalClose = () => {
        if(preferredDuration === '0') {
            setPreferredDuration(maxEpochDuration);
        }
        setModal(!modalOpen);
    }

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
    }

    // switch (stage_toNumber) {
    //     case FuncTag.JOIN:
    //         if(isPermissionless){
    //             if(isMember) setButtonObj((prev) => { prev.disable = true; return prev;});
    //             else setButtonObj((prev) => { prev.value = 'ADD'; return prev;});
    //         } else {
    //             if(isMember) setButtonObj((prev) => { prev.value = 'ADD'; return prev;});
    //             else setButtonObj((prev) => { prev.disable = true; return prev;});
    //         }
    //         break;

    //     case FuncTag.GET:
    //         if(isMember) setButtonObj((prev) => { prev.value = 'GET'; return prev;});
    //         else setButtonObj({ value: 'DISABLED', disable: true});
    //         break;
        
    //     case FuncTag.PAYBACK:
    //         if(isMember){
    //             if(loan_InBN.gt(0)) setButtonObj((prev) => { prev.value = 'PAY'; return prev;});
    //             else setButtonObj({ value: 'AWAIT PAYMENT', disable: true});
    //         } else {
    //             if((new Date().getTime() / 1000) >  payDate_InSec) setButtonObj((prev) => { prev.value = 'LIQUIDATE'; return prev;});
    //             else setButtonObj({ value: 'AWAIT PAYMENT', disable: true});
    //         }
    //         break;
    //     default:
    //         break;
    // }

    const handleSendTransaction = async() => {
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
                onClick={handleSendTransaction}
                disabled={buttonObj.disable}
                className="w-full p-2 rounded-lg text-orangec bg-yellow-100" 
            >
                {buttonObj.value}
            </button>
            {/* <PreferredDurationInput 
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
            /> */}
            <Notification message={message} />
        </React.Fragment>
    );
}

export interface RenderActionsProps {
    stage_toNumber: number;
    isPermissionless: boolean;
    isMember: boolean;
    loan_InBN: BigNumber;
    payDate_InSec: number;
    otherParam: AmountToApproveParam;
    maxEpochDuration: string;
}
