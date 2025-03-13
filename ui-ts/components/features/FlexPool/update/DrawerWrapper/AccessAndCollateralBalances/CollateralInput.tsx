import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { VoidFunc } from "@/interfaces";
import { PopUp } from "../../../Create/forms/modals/PopUp";
import ButtonTemplate from "@/components/OnboardScreen/ButtonTemplate";

export const CollateralInput : 
    React.FC<PreferredDurationInputProp> = 
        ({modalOpen, handleModalClose, handleSubmit, amount, onChange}) => 
{
    return (
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="xs" className="space-y-4">
                <Stack className="w-full p-4 md:p-6 rounded-lg space-y-12 text-md bg-gray1 text-orange-300 shadow shadow-orange-200 text-center ">
                    <Stack className={``}>
                        <button disabled className="p-3 rounded-lg text-sm text-orange-200">
                            {`${amount} XFI`}
                        </button>
                        <input 
                            id="Duration"
                            onChange={onChange}
                            type='number'
                            placeholder='Amount'
                            className="bg-green1 rounded-[26px] p-3 text-xs text-white1/50"
                        />
                    </Stack>
                    <ButtonTemplate
                        buttonAContent={'Cancel'}
                        buttonBContent={'Submit'}
                        disableButtonA={false}
                        disableButtonB={false}
                        overrideClassName="text-orange-200"
                        buttonAFunc={handleModalClose}
                        buttonBFunc={handleSubmit}
                    />
                </Stack>
            </Container>
        </PopUp>
    );
}

interface PreferredDurationInputProp {
    modalOpen: boolean;
    amount: string;
    handleModalClose: VoidFunc;
    handleSubmit: VoidFunc;
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}