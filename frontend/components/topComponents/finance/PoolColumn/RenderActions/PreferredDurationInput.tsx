import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { flexCenter, flexSpread } from "@/constants";
import { Input } from "../../Create/Input";
import Tooltip from "@mui/material/Tooltip";
import { VoidFunc } from "@/interfaces";
import { PopUp } from "../../Create/forms/transactionStatus/PopUp";

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
                <Stack className="p-4 md:p-8 rounded-lg space-y-12 text-lg bg-green1 text-white1 border shadow-lg shadow-yellow-100 text-center text-wrap ">
                    <Tooltip title={title}>
                        <h3 className="text-xl font-bold opacity-80">{"Your preferred duration (In hrs) "}</h3>
                    </Tooltip>
                    <Box className={`${flexSpread}`}>
                        <Stack>
                            <Input 
                                {
                                    ...{
                                        id: "Duration",
                                        onChange,
                                        type: 'text',
                                        placeholder: 'Enter preferred duration',
                                        overrideBg: 'bg-transparent'
                                    }
                                }
                            />
                        </Stack>
                        <button className="w-[30%] p-3 rounded-lg text-sm text-yellow-100">
                            {`${preferredDuration} hrs`}
                        </button>
                    </Box>
                    <Stack className={`font-bold gap-2`}>
                        <button 
                            className={`${flexCenter} w-full bg-orangec text-yellow-100" font-extrabold p-3 rounded-lg hover:shadow-md hover:shadow-yellow-100 hover:text-black`}
                            onClick={useEpochDuration}
                        >
                            Use Epoch Duration
                        </button>
                        <button 
                            className={`${flexCenter} w-full bg-yellow-200 text-orangec font-extrabold p-3 rounded-lg hover:shadow-md hover:shadow-yellow-100 hover:text-black`}
                            onClick={handleModalClose}
                        >
                            Submit
                        </button>
                    </Stack>
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