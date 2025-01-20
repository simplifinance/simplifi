import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { flexSpread } from "@/constants";
import Tooltip from "@mui/material/Tooltip";
import { VoidFunc } from "@/interfaces";
import { PopUp } from "../../Create/forms/modals/PopUp";
import { CustomButton } from "@/components/CustomButton";

export const PreferredDurationInput : 
    React.FC<PreferredDurationInputProp> = 
        ({modalOpen, handleModalClose, maxEpochDuration, preferredDuration, useEpochDuration, onChange}) => 
{
    const title = `The period you wish to use the fund. Max duration is 30 days
        Note: Your choice should be greater than 0 and must not be greater than the
        duration : ${maxEpochDuration} hrs set in your epoch`;

    return (
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="xs" className="space-y-4">
                <Stack className="p-4 md:p-8 rounded-lg space-y-12 text-md bg-gray1 text-orange-300 shadow shadow-orange-200 text-center text-wrap ">
                    <div className={`${flexSpread}`}>
                        <button onClick={() => handleModalClose()} className="w-2/4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <Tooltip title={title}>
                            <h3 className="text-xl font-bold opacity-80">{"How long do you want to use the fund? (In hrs) "}</h3>
                        </Tooltip>
                    </div>
                    <Box className={`${flexSpread}`}>
                        <input 
                            id="Duration"
                            onChange={onChange}
                            type='text'
                            placeholder='Enter preferred duration'
                            className="bg-green1 rounded-[26px] p-3 text-xs w-[70%] text-white1/50"
                        />
                        <button className="w-[30%] p-3 rounded-lg text-sm text-orange-200">
                            {`${preferredDuration} hrs`}
                        </button>
                    </Box>
                    <div className="flex justify-between items-center p-1 bg-green1 rounded-[26px]">
                        <CustomButton
                            handleButtonClick={useEpochDuration}
                            disabled={false}
                            overrideClassName="rounded-l-[26px] hover:shadow-sm hover:shadow-orange-200 p-3"
                        >
                            Use Epoch Duration
                        </CustomButton>
                        <CustomButton
                            handleButtonClick={handleModalClose}
                            disabled={false}
                            overrideClassName="bg-gray1 rounded-r-[26px] hover:shadow-sm hover:shadow-orange-200 p-3"
                        >
                            Submit
                        </CustomButton>
                    </div>
                </Stack>
            </Container>
        </PopUp>
    );
}

interface PreferredDurationInputProp {
    modalOpen: boolean;
    maxEpochDuration: string;
    preferredDuration: string;
    handleModalClose: VoidFunc;
    useEpochDuration: VoidFunc
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}