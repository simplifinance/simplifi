import React from "react";
import { AmountToApproveParam, ButtonObj, FormattedPoolContentProps, TransactionCallback, TrxState, } from "@/interfaces";
import { handleTransact } from "@/utilities";
import BigNumber from "bignumber.js";
import useAppStorage from '@/components/StateContextProvider/useAppStorage';
import { PreferredDurationInput } from "./PreferredDurationInput";
import { Confirmation } from "./Confirmation";
import { CustomButton } from "@/components/CustomButton";

export const ActionButton = (props: RenderActionsProps) => {
    const [preferredDuration, setPreferredDuration] = React.useState<string>('0');
    const { 
        buttonObj,
        formatted_bank, 
        otherParam, 
        inputModalOn,
        confirmationDrawerOn,
        setInputModal,
        setDrawerState,
        duration_toNumber, } = props;

    const openDrawer = () => setDrawerState(1);
    const maxEpochDuration = duration_toNumber.toString()
    const { setstorage, } = useAppStorage();
    const handleModalClose = () => {
        if(preferredDuration === '0') {
            setPreferredDuration(maxEpochDuration);
        }
        setInputModal(false);
        openDrawer();
    }

    const closeConfirmationPopUp = () => setDrawerState(0);
    const useEpochDuration = () => {
        setPreferredDuration(maxEpochDuration);
        setInputModal(false);
        openDrawer();
    };

    const handleClick = () => {
        if(buttonObj.value === 'GET FINANCE') {
            if(duration_toNumber > 1){
                setInputModal(true);
            } else {
                openDrawer();
            }
        } else {
            openDrawer();
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.currentTarget.value;
        setPreferredDuration(value === ''? '0' : value);
    }

    const callback : TransactionCallback = (arg: TrxState) => {
        if(arg.status === 'success' && confirmationDrawerOn) {
            closeConfirmationPopUp();
        }
        setstorage(arg);
    }

    // const sendTransaction = async({onSuccess, onError}: {onSuccess: () => void, onError: (errorArg: FormatErrorArgs) => void}) => {
    const sendTransaction = async() => {
        // console.log("Other param: ", otherParam);
        // console.log("formatted_bank: ", formatted_bank);
        // const otherParam : AmountToApproveParam = {...otp, txnType: buttonObj.value};
        await handleTransact(
            {
                callback,
                preferredDuration,
                otherParam,
                bank: formatted_bank
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
                        maxEpochDuration: maxEpochDuration,
                        modalOpen: inputModalOn,
                        onChange,
                        useEpochDuration,
                        preferredDuration
                    }
                }
            />
            <Confirmation
                openDrawer={confirmationDrawerOn}
                toggleDrawer={(arg: number) => setDrawerState(arg)}
                displayMessage={buttonObj.displayMessage}
                sendTransaction={sendTransaction}
            
            />
        </React.Fragment>
    );
}

export interface RenderActionsProps extends FormattedPoolContentProps{
    isMember: boolean;
    isAdmin: boolean;
    loan_InBN: BigNumber;
    payDate_InSec: number;
    sentQuota: boolean;
    buttonObj: ButtonObj;
    otherParam: AmountToApproveParam;
    inputModalOn: boolean;
    confirmationDrawerOn: number;
    setDrawerState: (arg: number) => void
    setInputModal: (arg: boolean) => void
}

