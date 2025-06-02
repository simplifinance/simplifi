import React from "react";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { flexStart } from "@/constants";
import Checkbox from "@mui/material/Checkbox";
import { MotionDivWrap } from "./MotionDivWrap";

const Error = () => {
    return (
        <h1>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </h1>
    );
}

export default function Message() {
    const { messages, errorMessage } = useAppStorage();
    const isError = errorMessage.length > 0;
    const display = messages.length > 0 || errorMessage.length > 0;
    const inclusiveNone = (message: string) => message.endsWith('.none');
    return(
        <React.Fragment>
            {
                display && 
                    <MotionDivWrap transitionDelay={0.3} className={`border ${isError? 'border-red-400' : 'border-green1/20 dark:border-white1/10'} rounded-lg p-4 text-xs text-left font-semibold text-green1/90 dark:text-white1`}>
                        {
                            messages.length > 0 && messages.map((message, index) => (
                                <MotionDivWrap key={index} className={`w-full ${flexStart} gap-2`}>
                                    {
                                        inclusiveNone(message)? <Checkbox 
                                                checked
                                                color="info"
                                            /> : <Checkbox 
                                            checked
                                            color="warning"
                                        />
                                    }
                                    <h1 className="max-w-sm overflow-auto">{ inclusiveNone(message)? message.replace('.none', '') : message }</h1>
                                </MotionDivWrap>
                            ))
                        }
                        {
                            isError && <MotionDivWrap className={`w-full ${flexStart} gap-2 text-red-400`}>
                                <Error />
                                <h1 className="max-w-sm overflow-auto">{ errorMessage }</h1>
                            </MotionDivWrap>
                        }
                    </MotionDivWrap>
            }

        </React.Fragment>
    )
}