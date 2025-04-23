import React from "react";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { flexStart } from "@/constants";
import Checkbox from "@mui/material/Checkbox";
import { MotionDivWrap } from "./MotionDivWrap";
import { orange } from "@mui/material/colors";

export default function Message() {
    const { messages, errorMessage } = useAppStorage();
    const isError = errorMessage.length > 0;
    const display = messages.length > 0 || errorMessage.length > 0;
    return(
        <React.Fragment>
            {
                display && 
                    <MotionDivWrap transitionDelay={0.3} className={`border ${isError? 'border-red-400' : 'border-green1/20 dark:border-white1/10'} rounded-lg p-4 text-xs text-left font-semibold text-green1/90 dark:text-white1`}>
                        {
                            messages.length > 0 && messages.map((message, index) => (
                                <MotionDivWrap key={index} className={`w-full ${flexStart} gap-2`}>
                                    <Checkbox 
                                        checked
                                        color="warning"
                                    />
                                    <h1>{ message }</h1>
                                </MotionDivWrap>
                            ))
                        }
                        {
                            errorMessage.length > 0 && <h1 className=' text-red-400'>{ errorMessage }</h1>
                        }
                    </MotionDivWrap>
            }

        </React.Fragment>
    )
}