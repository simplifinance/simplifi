import React from "react";
import { AmountToApproveParam, ButtonObj, FormattedPoolContentProps, TransactionCallback, TrxState, } from "@/interfaces";
import { handleTransact } from "@/utilities";
import BigNumber from "bignumber.js";
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { PreferredDurationInput } from "./PreferredDurationInput";
import { Confirmation } from "./Confirmation";
import { CustomButton } from "@/components/utilities/CustomButton";

export const ActionButton = (props: RenderActionsProps) => {
    const [preferredDuration, setPreferredDuration] = React.useState<string>('0');
    const { 
        buttonObj,
        formattedSafe, 
        otherParam, 
        inputModalOn,
        confirmationDrawerOn,
        setInputModal,
        setDrawerState,
        durationToNumber, } = props;

    const openDrawer = () => setDrawerState(1);
    const maxEpochDuration = durationToNumber.toString()
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
            if(durationToNumber > 1){
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

    const sendTransaction = async() => {
        await handleTransact(
            {
                callback,
                preferredDuration,
                otherParam,
                bank: formattedSafe
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
    loanInBN: BigNumber;
    paybackTimeInSec: number;
    sentQuota: boolean;
    buttonObj: ButtonObj;
    otherParam: AmountToApproveParam;
    inputModalOn: boolean;
    confirmationDrawerOn: number;
    setDrawerState: (arg: number) => void
    setInputModal: (arg: boolean) => void
}

