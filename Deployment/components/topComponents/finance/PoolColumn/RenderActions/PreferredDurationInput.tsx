import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { PopUp } from "@/components/transactionStatus/PopUp";
import { flexSpread } from "@/constants";
import { Input } from "../../Create/Input";
import Tooltip from "@mui/material/Tooltip";
import { VoidFunc } from "@/interfaces";

export const PreferredDurationInput : 
    React.FC<PreferredDurationInputProp> = 
        ({modalOpen, handleModalClose, maxEpochDuration, preferredDuration, useEpochDuration, onChange}) => 
{
    const title = `The period you wish to use the fund. Max duration is 30 days
        Note: Your choice should be greater than 0 and must not be greater than the
        duration : ${maxEpochDuration} hrs set in your epoch`;

    return (
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="xs" className="space-y-2 bg-green1 ">
                <Stack sx={{bgcolor: 'background.paper'}} className="p-4 md:p-8 my-10 rounded-xl border-2 space-y-6 text-lg text-center text-wrap ">
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
                                        placeholder: 'Enter preferred duration'
                                    }
                                }
                            />
                        </Stack>
                        <button className="w-[30%] bg-white1 p-3 rounded-lg text-sm">
                            {`${preferredDuration} hrs`}
                        </button>
                    </Box>
                    <Stack className={`font-bold gap-2`}>
                        <button 
                            className="w-full bg-orangec p-4 rounded-lg text-yellow-100 hover:bg-opacity-70 "
                            onClick={useEpochDuration}
                        >
                            Use Epoch Duration
                        </button>
                        <button 
                            className="w-full text-orangec border border-orangec p-4 rounded-lg bg-yellow-100 hover:bg-orangec hover:text-yellow-100"
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